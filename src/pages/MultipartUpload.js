import { useEffect, useState } from 'react';
import axios from 'axios';

function MultipartUpload() {
  const [token, setToken] = useState();
  const [file, setFile] = useState();
  let modelUid;

  const getJWT = async () => {
    const res = await axios.get('http://localhost:4000/jwt');
    setToken(res.data.token);
    console.log(res);
  };

  const handleFileInput = (event) => {
    console.log(event);
    setFile(event.target.files[0]);
  };

  const getCustomAxios = async () => {
    return axios.create({
      baseURL: process.env.REACT_APP_API_PATH,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const multipartUpload = async () => {
    //get signedUrls
    const customAxios = await getCustomAxios();
    let res = await customAxios.get(`/model/upload/signedurl`, {
      params: {
        file_name: file.name,
        tags: JSON.stringify(['tag1', 'tag2']),
        category: 'reconlabs/temp/test',
        file_size: file.size,
      },
    });
    console.log(res);
    const urls = res.data.urls;
    modelUid = res.data.model_uid;
    console.log(modelUid);

    //send multipart data
    const maxPartNum = res.data.urls.length;
    const partSize = 10 * 1000 * 1000;
    const promiseArray = [];
    for (let i = 0; i < maxPartNum; i++) {
      let fileChunk = i < maxPartNum - 1 ? file.slice(i * partSize, (i + 1) * partSize - 1) : file.slice(i * partSize);
      console.log(urls[i]);
      console.log(fileChunk);
      const data = axios.put(urls[i], fileChunk);
      promiseArray.push(data);
    }

    console.log(promiseArray);
    const resolvedArray = await Promise.all(promiseArray);
    console.log(resolvedArray);

    //send complete signal
    res = await customAxios.post(`/model/upload/complete`, {
      model_uid: modelUid,
    });
    console.log(res);
  };

  const abortMultipartUpload = async () => {
    const customAxios = await getCustomAxios();
    const res = await customAxios.post(`/model/upload/abort`, {
      model_uid: modelUid,
    });
    console.log(res);
  };

  useEffect(() => {
    console.log(typeof file, file);
  }, [file]);

  return (
    <div>
      <div>multipartUpload test</div>
      <button onClick={getJWT}>get jwt</button>
      <input type="file" onChange={handleFileInput} />
      <button onClick={multipartUpload}>multipartUpload</button>
      <button onClick={abortMultipartUpload}>abort multipartUpload</button>
    </div>
  );
}

export default MultipartUpload;
