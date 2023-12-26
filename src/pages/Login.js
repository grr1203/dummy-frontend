import { useState } from 'react';
import forge from 'node-forge';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const salt = 'xKZt+6HkGZG88wcI3pjuBA==';
  const serverPublicKeyPEM = `-----BEGIN PUBLIC KEY-----
      MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA+KyuXPZIND2M5A1BFuik
      KE2g0tSALhiHqsC7YosdKXxof41Eb6uxXcmrnxRwSR3VHyivgh2m+K3wPMfryNgM
      zC3EeQIEacylDJhise+bWAD82T4uT/c+RyI21L+Q+jdJJ+UoFWl3ZI9jMdPtPeu/
      XFb4XsX3SJg0dO2l814JjV/00OJpHBLiWW/s+1hnZMQYC6njIiF31fTbAjx6ladp
      heHHQOBUcsF5A4nmE4ESVr9SBcQSaFBn/7fR3m5/NgHPxHxvZerPhXlMmjRrmpRR
      3muMjXvqGHQRuOMfgH7/tWBtfVH4rN54nRfYn8k4J5veBAh0JIfBCIglr7ZE3z1e
      5wIDAQAB
      -----END PUBLIC KEY-----`;

  const encryptPassword = (password) => {
    // PEM 형식의 공개 키를 Forge Key 객체로 변환
    const serverPublicKey = forge.pki.publicKeyFromPem(serverPublicKeyPEM);
    console.log('serverPublicKey:', serverPublicKey);

    // 비밀번호를 UTF-8 형식의 바이트 배열로 변환
    const passwordBytes = forge.util.encodeUtf8(salt + password);
    console.log('passwordBytes:', passwordBytes);

    // 비밀번호를 서버의 공개 키로 암호화
    const encryptedPasswordBytes = serverPublicKey.encrypt(passwordBytes, 'RSA-OAEP', { md: forge.md.sha256.create() });
    console.log('encryptedPasswordBytes:', encryptedPasswordBytes);

    // 암호화된 비밀번호를 Base64로 인코딩
    const encryptedPasswordBase64 = forge.util.encode64(encryptedPasswordBytes);

    console.log('Encrypted Password:', encryptedPasswordBase64);
    return encryptedPasswordBase64;
  };

  const test = (password) => {
    // 0. key pair 생성
    // const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
    // const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
    // const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
    // console.log('Private Key:\n', privateKeyPem);
    // console.log('\nPublic Key:\n', publicKeyPem);

    // 1. 회원가입 시, 클라이언트에서 비밀번호를 입력하면, 클라이언트에서는 비밀번호 + salt를 서버의 공개 키로 암호화해서 전송
    // PEM 형식의 공개 키를 Forge Key 객체로 변환
    const serverPublicKey = forge.pki.publicKeyFromPem(serverPublicKeyPEM);

    // 비밀번호를 UTF-8 형식의 바이트 배열로 변환
    const passwordBytes = forge.util.encodeUtf8(salt + password);

    // 비밀번호를 서버의 공개 키로 암호화
    const encryptedPasswordBytes = serverPublicKey.encrypt(passwordBytes, 'RSA-OAEP', { md: forge.md.sha256.create() });

    // 암호화된 비밀번호를 Base64로 인코딩
    const encryptedPasswordBase64 = forge.util.encode64(encryptedPasswordBytes);

    console.log('Encrypted Password:', encryptedPasswordBase64);
    //

    // 2. 서버에서는 비밀번호를 개인 키로 복호화
    // 클라이언트에서 전송한 암호화된 비밀번호(Base64 형식)를 서버에서 받음

    // 서버에서 사용할 개인 키를 PEM 형식으로 제공
    const serverPrivateKeyPEM =
      '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQD4rK5c9kg0PYzk\nDUEW6KQoTaDS1IAuGIeqwLtiix0pfGh/jURvq7FdyaufFHBJHdUfKK+CHab4rfA8\nx+vI2AzMLcR5AgRpzKUMmGKx75tYAPzZPi5P9z5HIjbUv5D6N0kn5SgVaXdkj2Mx\n0+09679cVvhexfdImDR07aXzXgmNX/TQ4mkcEuJZb+z7WGdkxBgLqeMiIXfV9NsC\nPHqVp2mF4cdA4FRywXkDieYTgRJWv1IFxBJoUGf/t9Hebn82Ac/EfG9l6s+FeUya\nNGualFHea4yNe+oYdBG44x+Afv+1YG19Ufis3nidF9ifyTgnm94ECHQkh8EIiCWv\ntkTfPV7nAgMBAAECggEATKS0TPSfRnKeBP/MyunDBqT+Z1yVcR+gWNF0L6gewdWV\nQ5Lfv+dUEEsC+VHMVcy7DhJ1HY5UExtRCvq3QjzMnPWSM5WalJ09VYd2C8+Eunf7\ndl2C2qSibjwuWB3+6g+2HXS0iPzrjnPfJ9FgspABd81aWaN8VsSKjmtclYirOwX3\nn37lf9AEu5fJWim3jo45MfsAQD1jI1pTSbQfuh7gjD/qgn32e6SAD0qK2Kd4hRpT\nO/5DDM7bicRHo+lEs4KxDhFNR5RO2FVfiVjY9azJyKLIglvi69LNAySt/ZbVkWOI\nx8vpH4TtnGSdRYE5Vrt0cfWwC6LP4nOHLW1hNpd0+QKBgQD9Qq+hqe5tihSx3w63\nOGlFd4iCeQxrSNjeu1MgJx4VJaTnOQMbY7XiM/kaxo0eGJR7/95fIUA4Et8Lph3J\nL5/4dwBfmnWEGhVDbJ51KGG8/+tgJmRNgab7/gV8E7UdG3ixB8W2ln1+JS6TpoTg\nGa6hWanqROAHVslelebm/pyqVQKBgQD7XUu/KSwXe/5bd7QqRSXPkoSv8f/t9bA8\njwITFltDodG+6J30gruYYo/+cy+iG9XxJ2AartnWUBXu8FQmi+wK7S8QOig+n5d+\nVs8hd6NMHZjIyLoWY40o6z71oxk1hg59pKXiwvilLoOKUuC3adCntDcY63gT3aEz\nmkP72GGYSwKBgD0vVDERVcne9xr10Z9QIJaoxzEGP4rXwZUl2nJFIQ5o1ssJygde\n8n0go0jluQgRViYS7c07wkEJxhsRWdbWC6bCUTPHpCZzCroMTsftJpe7mEjVXZwf\n+5CbkQWl2TacAW97ejefadgE8Zi4PRfK/JZ8jAFN/HWpcOLKAkvCLWU1AoGBAJtn\ntNr803u5dyqJuWOg2J2aklpNHdO64DiwmbG/UrFfrFOBcZan9N9joG7KPBrXZs/v\nbiVREPDFFqpg/0XNoCOpPD2mFxeQh5LejLS+SMFYUwtfvlz1M2Km/ofTTFShCvh3\nAPBPZnaJaV3tm20KCKyGaMIJYnW1wmIq7/kWcFA9AoGBAPDtSQPB1Ubc+84gxlub\nwHum0pXv2BzQiTvoO+DR+KJMa/nwCTXjbOAGKMcY28zdkK8am8xUKFyTWI5rLYIg\n/dB8D04HioabYVcHxGA47UcfiNjknYkLooghgQG8lOLQUQEYF0XoeBpmMmNmlctN\n3RosJZoDnmgejXdTIYioffEf\n-----END PRIVATE KEY-----'; // 서버의 개인 키 PEM 형식

    // PEM 형식의 개인 키를 Forge Key 객체로 변환
    const serverPrivateKey = forge.pki.privateKeyFromPem(serverPrivateKeyPEM);

    // Base64로 인코딩된 암호화된 비밀번호를 디코딩하여 바이트 배열로 변환
    const encryptedPasswordBytesByServer = forge.util.decode64(encryptedPasswordBase64);

    // 서버의 개인 키로 암호를 복호화
    const decryptedPasswordBytes = serverPrivateKey.decrypt(encryptedPasswordBytesByServer, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
    });

    // 바이트 배열을 UTF-8 형식의 문자열로 디코딩
    const decryptedPassword = forge.util.decodeUtf8(decryptedPasswordBytes);

    console.log('Decrypted Password:', decryptedPassword);
    //

    // 3. 서버에서는 비밀번호 + pepper를 해시 함수로 해시하여 DB에 저장
    // DB 저장
    const pepper = forge.random.getBytesSync(32);

    // PBKDF2로 password encryption
    const iterations = 10000;
    const keyLength = 128;
    const derivedKey = forge.pkcs5.pbkdf2(decryptedPassword, pepper, iterations, keyLength, forge.md.sha256.create());
    const derivedKeyBase64 = forge.util.encode64(derivedKey);
    console.log('pepper:', forge.util.encode64(pepper));
    console.log('derivedKey:', forge.util.encode64(derivedKey));
    //

    // 4. 로그인 시, 클라이언트에서 비밀번호 + salt를 서버의 공개 키로 암호화하여 전송 (= 1)
    console.log('Encrypted Password:', encryptedPasswordBase64);
    //

    // 5. 서버에서는 저장했던 해시와 클라이언트에서 보낸 암호화된 비밀번호를 복호화한 후 저장했던 pepper를 더해서 해시 함수로 해시하여 비교
    const inputDerivedKey = forge.pkcs5.pbkdf2(
      decryptedPassword,
      pepper,
      iterations,
      keyLength,
      forge.md.sha256.create()
    );
    const storedDerivedKey = forge.util.decode64(derivedKeyBase64);

    // 비밀번호 일치 여부 확인
    const success = forge.util.bytesToHex(inputDerivedKey) === forge.util.bytesToHex(storedDerivedKey);
    console.log('success:', success);
    //

    return encryptedPasswordBase64;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const res = await axios.post(`https://eulwdp4xl8.execute-api.ap-northeast-2.amazonaws.com/dev/signup`, {
      email,
      name: 'logan',
      password: encryptPassword(password),
    });
    console.log('[res]', res);
  };

  const handlerSignin = async (e) => {
    e.preventDefault();
    const res = await axios.post(`https://eulwdp4xl8.execute-api.ap-northeast-2.amazonaws.com/dev/signin`, {
      email,
      password: encryptPassword(password),
    });
    console.log('[res]', res);
  };

  return (
    <div>
      <div>signup/signin test</div>
      <form onSubmit={handleSignup}>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} style={{ color: 'black' }} />
        <br />
        <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} style={{ color: 'black' }} />
        <br />
        <button type="submit">SignUp</button>
      </form>
      <br />
      <button onClick={handlerSignin}>Sign In</button>
      <br />
      <br />
      <button onClick={test}>local client-server test</button>
    </div>
  );
}

export default Login;
