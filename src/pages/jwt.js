import { useState } from 'react';
import axios from 'axios';

function Jwt() {
  const getJWT = async () => {
    const res = await axios.get('http://localhost:4000/jwt');
    console.log(res);
  };

  return (
    <div>
      <div>jwt test</div>
      <button onClick={getJWT}>get jwt</button>
    </div>
  );
}

export default Jwt;
