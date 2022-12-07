import { loadTossPayments } from '@tosspayments/payment-sdk';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { nanoid } from 'nanoid';

function Pay() {
  const clientKey = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';
  const [searchParams] = useSearchParams();
  const [amount, setAmount] = useState();

  const handlePay = async () => {
    const tossPayments = await loadTossPayments(clientKey);
    tossPayments.requestPayment('카드', {
      amount,
      orderId: nanoid(),
      orderName: '1레벨',
      customerName: 'logan',
      successUrl: 'http://localhost:3000/pay/success',
      failUrl: 'http://localhost:3000/pay/fail',
    });
  };

  //set amount
  const onChangeAmount = (e) => {
    setAmount(e.target.value);
  };

  //toss redirect -> requset to BE
  useEffect(() => {
    const payParams = {
      paymentKey: searchParams.get('paymentKey'),
      orderId: searchParams.get('orderId'),
      amount: searchParams.get('amount'),
    };
    console.log(payParams);

    async function tossPaymentApproval() {
      const res = await axios.post(`http://localhost:4000/pay/toss`, { params: payParams });
      console.log('res', res);
    }

    // if (amount === payParams.amount)
    payParams.paymentKey && tossPaymentApproval();
  }, [searchParams]);

  return (
    <div>
      <div>Pay</div>
      <input placeholder="결제 금액" onChange={onChangeAmount}></input>
      <button onClick={handlePay}>결제하기</button>
    </div>
  );
}

export default Pay;
