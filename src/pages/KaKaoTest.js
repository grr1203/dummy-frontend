import axios from 'axios';

import { useEffect, useState } from 'react';

function KakaoTest() {
  const [accessToken, setAccessToken] = useState(null);
  const [friendUUID, setFriendUUID] = useState(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');

    if (code) {
      console.log('code', code);
      (async () => {
        const res = await axios.post(
          'https://kauth.kakao.com/oauth/token',
          {
            grant_type: 'authorization_code',
            client_id: '8d5f9b68b32488e75e9be8f7a1af015e',
            redirect_uri: 'http://localhost:3000/kakaotest',
            code,
          },
          {
            headers: {
              'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
          }
        );
        console.log('res', res);
        const access_token = res.data.access_token;
        setAccessToken(access_token);

        try {
          const res2 = await axios.get('https://kapi.kakao.com/v1/api/talk/friends', {
            headers: { Authorization: `Bearer ${access_token}` },
          });
          console.log('res2', res2);
          setFriendUUID(res2.data.elements[0].uuid);
        } catch (err) {
          console.log('err', err);
        }
      })();
    }
  }, []);

  const handlePicker = async () => {
    const client_id = '8d5f9b68b32488e75e9be8f7a1af015e';
    const redirect_uri = 'http://localhost:3000/kakaotest';
    const response_type = 'code';

    const url = `https://kauth.kakao.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}`;
    // 친구목록 추가동의
    // const url = `https://kauth.kakao.com/oauth/authorize?client_id=8d5f9b68b32488e75e9be8f7a1af015e&redirect_uri=http://localhost:3000/kakaotest&response_type=code&scope=friends`

    window.location.href = url;
  };

  const handleMessage = async () => {
    try {
      console.log('accessToken', accessToken);
      console.log('friendUUID', friendUUID);
      // 나
      //   const res = await axios.post(
      //     'https://kapi.kakao.com/v2/api/talk/memo/send',
      //     { template_id: 108483 },
      //     {
      //       headers: {
      //         'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      //         Authorization: `Bearer ${accessToken}`,
      //       },
      //     }
      //   );

      // 친구
      const res = await axios.post(
        'https://kapi.kakao.com/v1/api/talk/friends/message/send',
        { receiver_uuids: JSON.stringify([friendUUID]), template_id: 108483 },
        {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log('res', res);
    } catch (err) {
      console.log('err', err);
    }
  };

  return (
    <div>
      <div>KakaoTest</div>
      <button onClick={handlePicker}>picker</button>
      <button onClick={handleMessage}>message from friend</button>
      <button onClick={handleMessage}>message from channel</button>
    </div>
  );
}

export default KakaoTest;
