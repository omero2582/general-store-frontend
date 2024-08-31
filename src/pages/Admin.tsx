import { useState } from "react";

export default function Admin() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    const getPresigned =  async () => {
      console.log('PRESIGN');
      // const url = 'http://localhost:3000/generate-presigned-url';
      const url = '/api/generate-presigned-url';
      const response = await fetch(url);
      const out = await response.json();
      return out;
    }

    
    const upload = async ({cloudname, apikey, signature, timestamp, asset_folder, tags, allowed_formats, use_filename}) => {
      console.log('UPLOAD');
      const url = "https://api.cloudinary.com/v1_1/" + cloudname + "/auto/upload";
      const formData = new FormData();
      if (!file) {
        alert("Please select a file first!");
        return;
      }
      formData.append('file', file);
      formData.append("api_key", apikey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      // formData.append("folder", folder);
      formData.append("asset_folder", asset_folder);

      formData.append("tags", tags);
      // formData.append("eager", "c_pad,h_300,w_400|c_crop,h_200,w_260");

      formData.append('allowed_formats', allowed_formats);
      formData.append('use_filename', use_filename);
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
