import { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetProductsQuery, useAddProductPresignedUrlMutation, useAddProductUploadImageMutation, useAddProductSaveToDBMutation, useDeleteProductMutation } from "../../api/productsApiSlice";
import { productSchema, productSchemaNoImage, productSchemaOptional, TProductSchema, TProductSchemaNoImage } from '@shared/schemas/schemas'
import  {useForm, type FieldValues, FieldErrors} from 'react-hook-form';
import Input from "./Input";
import { z } from "zod";
import {useDropzone} from 'react-dropzone'
import { AspectRatio } from "@/components/AspectRatio";

export function NewProductModal({formHook}) {
  
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
  } = formHook;

  //
  // TODO, moved useForm() call outside of this component, and now it comes as props,
  // Otherwise the state of the form would be cleared on as soon as modal closes.
  // Have to think about this thought bc I am not sure of the exact behavior that I want.
  // Also, we would have to also move the file and preview state outside of this container


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
    const resultUploadDocument = await addProductSaveToDB({...body, images: [{order: 1, imageId: public_id}]});
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
      className="grid justify-center"
    >
      <h2 className="text-[18px] font-[500]">New Product</h2>
      <div className="grid grid-flow-col gap-x-5">
        <div className="flex flex-col items-start gap-y-2">
          <Input errors={errors} id='name' label="Name" inputProps={{...register("name")}}/>
          <div className="grid">  {/*Description TextArea*/}
            <label htmlFor={'description'} className="sr-only">{'Description'}:</label>
            <textarea className="p-[6px] resize-none border-gray-400 border rounded-md" cols={50} rows={4} spellCheck={false} placeholder="Description" {...register("description")}/>
            {errors && errors['description'] && <p className="text-red-500">{`${errors['description'].message}`}</p>}
          </div>
          <Input errors={errors} type="number" id='price' label="Price" inputSx="max-w-[100px]" inputProps={{...register("price"), step: 0.01}}/>
          <div className="flex gap-x-3">
            <label htmlFor="visibility">Visibility:</label>
            <select className="border-gray-400 border rounded-md" id="visibility" defaultValue="public" {...register("visibility")}>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          <button disabled={isSubmitting} type="submit" className="mt-auto text-white font-[500] bg-blue-600 px-4 py-[6px] rounded ">
            Submit
          </button>
        </div>
        <div {...getRootProps()} className="grid cursor-pointer"  >
          <div className={`relative bg-stone-100 grid w-[250px] h-[250px] ${isDragActive? 'border-[3px] border-blue-700 border-dashed' : ''}`}>
            <div className="absolute left-[42%] top-[25%] text-stone-300 font-bold text-[5rem]">+</div>
            {preview &&
            <AspectRatio ratio={1} className="flex place-content-center">
              <img src={preview as string} alt="Upload preview" className="object-contain"/>
            </AspectRatio >
            }
          </div>
          {/* <input type="file" accept=".jpg, .png, .webp, .jfif" onChange={handleFileChange} /> */}
          <div {...getRootProps()} className="">
            <input {...getInputProps()}/>
            <div className={`h-[50px] rounded bg-[rgb(255,_51,_51)] grid place-content-center`}>
              <p className="text-white ">Choose File</p>
            </div>
          </div>
        </div>
      </div>
      
      
    </form>
  )
}