import { useState } from "react";

export default function Admin() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    const getPresigned =  async () => {
      const url = '/api/admin/products/upload-presigned';
      const response = await fetch(url);
      const out = await response.json();
      return out;
    }

    
    const upload = async ({cloudname, options}) => {
      const url = `https://api.cloudinary.com/v1_1/${cloudname}/auto/upload`;
      const formData = new FormData();
      if (!file) {
        alert("Please select a file first!");
        return;
      }
      formData.append('file', file);
      
      Object.entries(options).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const out = await fetch(url, {
        method: "POST",
        body: formData
      });
      
      const out2 = await out.json();
      console.log('out', out)
      console.log('out2', out2)
    }
    
    const response = await getPresigned();
    const response2 = await upload(response);

   
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
