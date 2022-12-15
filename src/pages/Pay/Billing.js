import { loadTossPayments } from '@tosspayments/payment-sdk';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { nanoid } from 'nanoid';

function Billing({ token }) {
  const clientKey = 'test_ck_D4yKeq5bgrpwRv5OglAVGX0lzW6Y';
  const [searchParams] = useSearchParams();

  const getJWT = async () => {
    const res = await axios.get('http://localhost:4000/jwt');
    console.log(res);
    localStorage.setItem('jwt', res.data.token);
  };

  const handlePay = async () => {
    const tossPayments = await loadTossPayments(clientKey);
    tossPayments.requestBillingAuth('카드', {
      customerKey: nanoid(),
      successUrl: 'http://localhost:3000/billing/success',
      failUrl: 'http://localhost:3000/billing/fail',
    });
  };

  //toss redirect -> requset to BE
  useEffect(() => {
    const payParams = {
      customerKey: searchParams.get('customerKey'),
      authKey: searchParams.get('authKey'),
      amount: 200,
    };
    console.log(payParams);

    const token = localStorage.getItem('jwt');

    async function tossPaymentApproval() {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await axios.post(`${process.env.REACT_APP_API_PATH}/payment/billing`, payParams);
      console.log('res', res);
    }

    //customerKey 보낸거랑 받은거 일치하는지 확인
    payParams.authKey && token && tossPaymentApproval();
  }, [searchParams, token]);

  return (
    <div>
      <button onClick={handlePay}>결제하기</button>
      <hr />
      <button onClick={getJWT}>get jwt</button>
    </div>
  );
}

export default Billing;
