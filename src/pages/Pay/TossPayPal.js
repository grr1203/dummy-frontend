import { loadPaymentWidget } from '@tosspayments/payment-widget-sdk';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { nanoid } from 'nanoid';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

function TossPayPal() {
  const clientKey = 'test_ck_kZLKGPx4M3M666k5w1eVBaWypv1o';
  const customerKey = '2TWHqi4qRXTGm9CwhzQVC';
  const [searchParams] = useSearchParams();

  // 허브형
  const handlePay = async () => {
    const tossPayments = await loadTossPayments(clientKey);
    tossPayments.requestPayment('해외간편결제', {
      // 결제 정보 파라미터
      amount: 51.98,
      orderId: nanoid(),
      orderName: 'Bean',
      customerName: 'logan',
      successUrl: 'http://localhost:3000/tossPaypal/success',
      failUrl: 'http://localhost:3000/tossPaypal/fail',
      provider: 'PAYPAL',
      currency: 'USD',
      country: 'US',
      // 판매자 보호 및 위험 관리 파라미터 사용 예시
      //   paymentMethodOptions: {
      //     // PayPal에서 요구하는 추가 파라미터
      //     paypal: {
      //       setTransactionContext: {
      //         // PayPal STC 파라미터 예시 (구매자의 로그인 정보)
      //         sender_account_id: 'kimToss01',
      //         sender_first_name: 'Toss',
      //         sender_last_name: 'Kim',
      //         sender_email: 'toss@sample.com',
      //         sender_phone: '(1) 123 456 7890',
      //         sender_country_code: 'US',
      //         sender_create_date: '2021-01-01T19:14:55.277-0:00',
      //       },
      //     },
      //   },
    });
  };

  // 결제 위젯
  const handlePayWidget = async () => {
    const paymentWidget = await loadPaymentWidget(clientKey, customerKey); // 회원 결제

    paymentWidget.renderPaymentMethods('#payment-method', {
      value: 664.98,
      currency: 'USD',
      country: 'US',
    });

    paymentWidget.renderAgreement('#agreement');

    paymentWidget.requestPayment({
      // 결제 정보 파라미터
      orderId: '3O4fLibMPoEDpHvx8CxGH',
      orderName: '토스 티셔츠 외 2건',
      successUrl: 'http://localhost:8080/success',
      failUrl: 'http://localhost:8080/fail',
      customerEmail: 'toss@sample.com',
      customerName: '김토스',
    });
  };

  useEffect(() => {
    const payParams = {
      paymentKey: searchParams.get('paymentKey'),
      orderId: searchParams.get('orderId'),
      amount: searchParams.get('amount'),
    };
    console.log(payParams);

    async function tossPaymentApproval() {
      const res = await axios.post(`https://7w8ldczfb7.execute-api.ap-northeast-2.amazonaws.com/dev/payment`, { ...payParams });
      console.log('res', res);
    }

    payParams.paymentKey && tossPaymentApproval();
  }, [searchParams]);

  return (
    <>
      <div>paypal</div>
      <div id="payment-method" className="payment-method"></div>
      <div id="agreement" className="agreement"></div>
      <button onClick={handlePay}>허브형 결제</button>
      <button onClick={handlePayWidget}>결제 위젯</button>
    </>
  );
}

export default TossPayPal;
