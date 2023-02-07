import { loadTossPayments } from '@tosspayments/payment-sdk';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

function Billing({ token }) {
  const clientKey = 'test_ck_kZLKGPx4M3M666k5w1eVBaWypv1o';
  const [searchParams] = useSearchParams();

  //dummy backend에서 jwt를 받아온다
  const getJWT = async () => {
    const res = await axios.get('http://localhost:4000/jwt');
    console.log(res);
    localStorage.setItem('jwt', res.data.token);
  };

  //자동 결제를 위한 결제창을 연다
  const handlePay = async () => {
    const userUid = parseJWT().uid;
    console.log(userUid);

    const tossPayments = await loadTossPayments(clientKey);
    tossPayments.requestBillingAuth('카드', {
      customerKey: userUid,
      successUrl: 'http://localhost:3000/billing/success',
      failUrl: 'http://localhost:3000/billing/fail',
    });
  };

  //local storage의 jwt를 가져와 parsing한다
  const parseJWT = () => {
    const token = localStorage.getItem('jwt');
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    console.log(JSON.parse(jsonPayload));

    return JSON.parse(jsonPayload);
  };

  //toss redirect -> requset to BE
  useEffect(() => {
    const payParams = {
      customerKey: searchParams.get('customerKey'),
      authKey: searchParams.get('authKey'),
    };
    console.log(payParams);

    const token = localStorage.getItem('jwt');

    async function tossPaymentApproval() {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await axios.post(`${process.env.REACT_APP_API_PATH}/payment/billing`, {
        ...payParams,
        tier: 'Basic',
      });
      console.log('res', res);
    }

    //todo: customerKey 보낸거랑 받은거 일치하는지 확인
    payParams.authKey && token && tossPaymentApproval();
  }, [searchParams, token]);

  return (
    <div>
      <button onClick={handlePay}>결제하기</button>
      <hr />
      <button onClick={getJWT}>get jwt</button>
      <button onClick={parseJWT}>parse jwt</button>
    </div>
  );
}

export default Billing;
