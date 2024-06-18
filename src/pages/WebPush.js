import axios from 'axios';

function WebPush() {
  const test = async () => {
    try {
      await axios.get(
        'https://testapi.openbanking.or.kr/oauth/2.0/authorize?response_type=code&client_id=779c17b6-65f6-4f29-af55-fbd15c9ab2c2&redirect_uri=http://localhost:3000/openapitest&scope=login inquiry transfer&state=12345678901234567890123456789012&auth_type=0'
      );
    } catch (err) {
      console.log('error', err);
      if (err.config.url) {
        const res = await axios.get(err.config.url);
        console.log('Redirected Response:', res);
      }
    }
  };

  return (
    <div>
      <div>web push test</div>
      <button onClick={test}>test</button>
    </div>
  );
}

export default WebPush;
