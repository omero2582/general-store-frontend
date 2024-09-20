import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetProductsQuery, useAddProductPresignedUrlMutation, useAddProductUploadImageMutation, useAddProductSaveToDBMutation, useDeleteProductMutation } from "../../api/productsApiSlice";
import { productSchema, productSchemaNoImage, productSchemaOptional, TProductSchema, TProductSchemaNoImage } from '@shared/schemas/schemas'
import  {useForm, type FieldValues, FieldErrors} from 'react-hook-form';
import Products from "./Products";
import Input from "./Input";
import { z } from "zod";

export default function Admin() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  //
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    reset,
    setError,
    getValues
  } = useForm<TProductSchemaNoImage>({
    // resolver: zodResolver(productSchemaNoImage)
    resolver: zodResolver(z.preprocess((data) => {
      // removes empty input fields, which default to '' (emppty string) on html
      const out = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== "" && value !== undefined)
      );
      console.log('Values', out);
      return out;
    }, productSchemaNoImage))
  });

  //



  // const {data, isError, isLoading, isSuccess, error, status} = request
  const [addProductPresignedUrl, resAddProductPresignedUrl] = useAddProductPresignedUrlMutation();
  const [addProductUploadImage, resAddProductUploadImage] = useAddProductUploadImageMutation();
  const [addProductSaveToDB, resAddProductSaveToDB] = useAddProductSaveToDBMutation();

  const {data, refetch} = useGetProductsQuery();

  const onSubmit = async (body: TProductSchemaNoImage) => {
    console.log('SUBMIT', body);
    
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    // 1- presignedUrl
    const resultPresignedUrl = await addProductPresignedUrl(body);
    if(resultPresignedUrl.error){
      console.error(resultPresignedUrl.error);
      return
    }

    // 2- Add file to 2nd request to upload
    const {cloudname, options} = resultPresignedUrl.data;
    const formData = new FormData();
    formData.append('file', file);
    // Add to this req, the same options we used in the backend to presign the url
    Object.entries(options).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const resultUploadFile = await addProductUploadImage(formData);
    if(resultUploadFile.error){
      console.error(resultUploadFile.error);
      return
    }

    // 3- save document to DB
    const {public_id} = resultUploadFile.data;
    const resultUploadDocument = await addProductSaveToDB({...body, imageId: public_id});
    if(resultUploadDocument.error){
      console.error(resultUploadDocument.error);
      return
    }
    
    reset(); // clear inputs
    setFile(null);  // clear file input
    refetch(); // refetch all products
  }
  // console.log(errors)
  // console.log('ValuesL', getValues())
  
  return (
    <div>
      <div>
        <h1 className="text-[30px] font-[500] text-center">Admin Panel</h1>
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid justify-center">
          <h2 className="text-[18px] font-[500]">New Product</h2>
          <div className="grid justify-start justify-items-start gap-y-2">
            {/* <input id='name' placeholder="name" {...register("name")}/> */}
            <Input errors={errors} id='name' label="Name" inputProps={{...register("name")}}/>
            {/* <Input errors={errors} id='description' label="description" inputProps={{...register("description")}}/> */}
            <textarea className="p-[6px] resize-none border-gray-400 border rounded-md" cols={50} rows={4} spellCheck={false} placeholder="Description" {...register("description")}/>
            <Input errors={errors} type="number" id='price' label="Price" inputProps={{...register("price"), step: 0.01}}/>
            {/* <Input errors={errors} id='visibility' label="visibility" inputProps={{...register("visibility")}}/>
             */}
            <div className="flex gap-x-3">
              <label htmlFor="visibility">Visibility:</label>
              <select className="border-gray-400 border rounded-md" id="visibility" defaultValue="public" {...register("visibility")}>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            <input type="file" accept=".jpg, .png, .webp, .jfif" onChange={handleFileChange} />
            <button disabled={isSubmitting} type="submit" className="text-white text-[1rem] font-[500] bg-blue-600 px-4 py-[6px] rounded">Submit</button>
          </div>
        </form>
      </div>
      <Products data={data}/>
    </div>
  )
}
