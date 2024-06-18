import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import Jwt from './pages/Jwt';
import MultipartUpload from './pages/MultipartUpload';
import Pay from './pages/Pay/Pay';
import Billing from './pages/Pay/Billing';
import TossPayPal from './pages/Pay/TossPayPal';
import PayPal from './pages/Pay/PayPal';
import Chart from './pages/Chart';
import Login from './pages/Login';
import Test from './pages/Test';
import KakaoTest from './pages/KaKaoTest';
import WebPush from './pages/WebPush';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}></Route>
      <Route path="jwt" element={<Jwt />} />
      <Route path="/multipartupload" element={<MultipartUpload />} />
      <Route path="/pay/*" element={<Pay />} />
      <Route path="/billing/*" element={<Billing />} />
      <Route path="/tossPaypal/*" element={<TossPayPal />} />
      <Route path="/paypal/*" element={<PayPal />} />
      <Route path="/chart" element={<Chart />} />
      <Route path="login" element={<Login />} />
      <Route path="/openapitest" element={<Test />} />
      <Route path="/kakaotest" element={<KakaoTest />} />
      <Route path="/webpush" element={<WebPush />} />
    </Routes>
  </BrowserRouter>
);
