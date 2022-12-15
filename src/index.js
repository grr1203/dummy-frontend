import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import Jwt from './pages/Jwt';
import MultipartUpload from './pages/MultipartUpload';
import Pay from './pages/Pay/Pay';
import Billing from './pages/Pay/Billing';
import Chart from './pages/Chart';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}></Route>
        <Route path="jwt" element={<Jwt />} />
        <Route path="/multipartupload" element={<MultipartUpload />} />
        <Route path="/pay/*" element={<Pay />} />
        <Route path="/billing/*" element={<Billing />} />
        <Route path="/chart" element={<Chart />} />
      </Routes>
    </BrowserRouter>
);
