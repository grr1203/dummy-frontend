import { useState } from 'react';
import axios from 'axios';

function Jwt() {
  const [modelUid] = useState(0);
  const [token, setToken] = useState();

  const getJWT = async () => {
    const res = await axios.get('http://localhost:4000/jwt');
    console.log(res);
    setToken(res.data.token);
  };

  const sendJWT = async () => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const res = await axios.get(`${process.env.REACT_APP_API_PATH}/model`, { params: { model_uid: modelUid } });
    console.log(res);
  };

  return (
    <div>
      <div>jwt test</div>
      <button onClick={getJWT}>get jwt</button>
      <button onClick={sendJWT}>send jwt</button>
    </div>
  );
}

export default Jwt;
