import { useState } from "react";
import { useGetProductsQuery, useAddProductPresignedUrlMutation, useAddProductUploadImageMutation, useAddProductSaveToDBMutation, useDeleteProductMutation } from "../api/productsApiSlice";

export default function Admin() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // const {data, isError, isLoading, isSuccess, error, status} = request
  const [getPresignedUrl, presignedUrlRequest] = useAddProductPresignedUrlMutation();
  const [uploadImage, uploadImageRequest] = useAddProductUploadImageMutation();
  const [uploadDocument, uploadDocumentRequest] = useAddProductSaveToDBMutation();
  const [deleteDocument, deleteDocumentRequest] = useDeleteProductMutation();

  const {data, refetch} = useGetProductsQuery();

  const handleSubmit = async (e) => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const body = {
      name: 'test',
    }
    const resultPresignedUrl = await getPresignedUrl(body);
    if(resultPresignedUrl.error){
      console.error(resultPresignedUrl.error);
      return
    }

    // adding file to next request
    const {cloudname, options} = resultPresignedUrl.data;
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(options).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const resultUploadFile = await uploadImage(formData);
    if(resultUploadFile.error){
      console.error(resultUploadFile.error);
      return
    }

    const {public_id} = resultUploadFile.data;
    const resultUploadDocument = await uploadDocument({...body, imageId: public_id});
    if(resultUploadDocument.error){
      console.error(resultUploadDocument.error);
      return
    }
    
    refetch()
  }

  return (
    <div>
      <div>
        <h2 className="text-[22px] font-[500]">Admin Panel</h2>
        <div className="grid justify-start justify-items-start gap-y-2">
          <input type="file" accept=".jpg, .png, .webp, .jfif" onChange={handleFileChange} />
          <button onClick={handleSubmit} type="button" className="bg-lime-500 px-2 py-1 rounded">Submit</button>
        </div>
      </div>
      <div>
        <h2 className="text-[22px] font-[500]">Products</h2>
        <div className="grid justify-center gap-6 grid-cols-[repeat(5,_minmax(0,_160px))]">
          {data && data.products.map(p => (
            <div key={p.id}>
              <img src={p.image.url} className=""/>
              <h3 className="font-[500] text-[1.3rem]">{p.name}</h3>
              {p.description && <p>{p.description}</p>}
              <p>{p.visibility}</p>
              <p>avgRating: {p.averageRating}</p>
              <p>numRatings: {p.numRatings}</p>
              <button
                className="px-3 py-1 bg-red-500 rounded-md text-white"
                onClick={() => deleteDocument(p.id)}
                // TODO, how to display success/error when successfully deleted?
                // would probably end up using an errorSlice redux state, and on every
                // mutation, if error it would set the error
              >
                Delete
              </button>
              {/* <pre>{JSON.stringify(p, null, 2)}</pre> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
