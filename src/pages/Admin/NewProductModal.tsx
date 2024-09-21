import { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetProductsQuery, useAddProductPresignedUrlMutation, useAddProductUploadImageMutation, useAddProductSaveToDBMutation, useDeleteProductMutation } from "../../api/productsApiSlice";
import { productSchema, productSchemaNoImage, productSchemaOptional, TProductSchema, TProductSchemaNoImage } from '@shared/schemas/schemas'
import  {useForm, type FieldValues, FieldErrors} from 'react-hook-form';
import Input from "./Input";
import { z } from "zod";
import {useDropzone} from 'react-dropzone'
import { AspectRatio } from "@/components/AspectRatio";

export function NewProductModal() {
  
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  //
  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    // preview image
    const file = new FileReader;
    file.onload = function() {
      setPreview(file.result);
    }
    file.readAsDataURL(acceptedFiles[0]);

    // change out stateFiles
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, [])

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.jpg', '.png', '.webp', '.jfif']
    }
  });



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

  const onSubmit = async (body: TProductSchemaNoImage) => {
    console.log('SUBMIT', body);

      if (!files[0]) {
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
    formData.append('file', files[0]);
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
    setFiles([]);  // clear file input
    // refetch(); // refetch all products
    setPreview(null);
  }

  // console.log(errors)
  // console.log('ValuesL', getValues())

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}
      className="grid justify-center content-start"
    >
      <h2 className="text-[18px] font-[500]">New Product</h2>
      <div className="grid justify-start justify-items-start gap-y-2">
        <Input errors={errors} id='name' label="Name" inputProps={{...register("name")}}/>
        <textarea className="p-[6px] resize-none border-gray-400 border rounded-md" cols={50} rows={4} spellCheck={false} placeholder="Description" {...register("description")}/>
        <Input errors={errors} type="number" id='price' label="Price" inputSx="max-w-[100px]" inputProps={{...register("price"), step: 0.01}}/>
        <div className="flex gap-x-3">
          <label htmlFor="visibility">Visibility:</label>
          <select className="border-gray-400 border rounded-md" id="visibility" defaultValue="public" {...register("visibility")}>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>
      {/* <input type="file" accept=".jpg, .png, .webp, .jfif" onChange={handleFileChange} /> */}
      <div {...getRootProps()} className="justify-self-stretch cursor-pointer">
        <input {...getInputProps()}/>
        <div className={`h-[50px] rounded bg-[rgb(255,_51,_51)] grid place-content-center`}>
          <p className="text-white ">{isDragActive ? '+' : 'Choose File'}</p>
        </div>
      </div>
      {preview &&
      <div className="justify-self-center grid grid-cols-[repeat(auto-fit,_minmax(0,_250px))]">
        <div className="bg-stone-100 grid">
          <AspectRatio ratio={1} className="place-self-center">
            <img src={preview as string} alt="Upload preview" className="max-h-[250px] "/>
          </AspectRatio >
        </div>
      </div>
      }
      <button disabled={isSubmitting} type="submit" className="text-white font-[500] bg-blue-600 px-4 py-[6px] rounded justify-self-end">
        Submit
      </button>
    </form>
  )
}