import { useState } from "react";
import { useUploadFileMutation, useUploadGetPresignedUrlMutation } from "../api/apiSlice";

export default function Admin() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const [
    getPresignedUrl,
    // {data, isError, isLoading, isSuccess, error, status}
    presignedUrlRequest,
  ] = useUploadGetPresignedUrlMutation();

  const [
    uploadFile,
    uploadFileRequest,
  ] = useUploadFileMutation();
  
  const handleSubmit = async (e) => {
    const getPresigned =  async () => {
      const url = '/api/admin/products/upload-presigned';
      const response = await fetch(url);
      const out = await response.json();
      return out;
    }

    
    const upload = async ({presignedResponse: {cloudname, options}, file}) => {
      // const url = `https://api.cloudinary.com/v1_1/${cloudname}/auto/upload`;
      //
      if (!file) {
        alert("Please select a file first!");
        return;
      }
      const formData = new FormData();
      formData.append('file', file);
      
      Object.entries(options).forEach(([key, value]) => {
        formData.append(key, value);
      });
      //
      const response = await uploadFile(formData);
      const {data, error} = response;
      // const response = await fetch(url, {
      //   method: "POST",
      //   body: formData
      // });
      // const out = await response.json();
      console.log('out', data)
    }
    
    const body = {
      name: 'test',
    }
    const {data, error} = await getPresignedUrl(body);
    const response2 = await upload({presignedResponse: data, file});

   
  } 

  return (
    <div>
      <h2 className="text-[22px] font-[500]">Admin Panel</h2>
      <div className="grid justify-start justify-items-start gap-y-2">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleSubmit} type="button" className="bg-lime-500 px-2 py-1 rounded">Submit</button>
      </div>
    </div>
  )
}
