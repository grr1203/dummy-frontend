import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import axios from 'axios';

const PayPal = () => {
  const paymentBaseUrl = `https://7w8ldczfb7.execute-api.ap-northeast-2.amazonaws.com/dev/payment`;

  return (
    <PayPalScriptProvider
      options={{ clientId: 'AfRA5rQePHf9aCBBQVnLUKejmgnR8ZOJ44a-zHHCOyeKhKMFEliRPvEGF9suOpFP9bq_uk5c_f6H7Iwz' }}
    >
      <PayPalButtons
        style={{ layout: 'horizontal' }}
        createOrder={async (data, actions) => {
          const res = await axios.get(`${paymentBaseUrl}/paypal`, { params: { amount: 12 } });
          console.log('[createOrder res]', res);
          return res.data.orderId;
        }}
        onApprove={async (data, actions) => {
          const res = await axios.post(`${paymentBaseUrl}/paypal`, {
            orderId: data.orderID,
          });
          console.log('[onApprove res]', res);
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPal;
