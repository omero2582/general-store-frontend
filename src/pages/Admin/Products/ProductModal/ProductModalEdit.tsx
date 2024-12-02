import React, { useEffect, useState } from 'react'
import { ProductModal } from './ProductModal'
import { productSchemaNoImage, TProductSchemaNoImage } from '@shared/dist/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod"
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Description, DialogTitle } from '@radix-ui/react-dialog';
import { useAddProductPresignedUrlMutation, useAddProductSaveToDBMutation, useAddProductUploadImageMutation, useEditProductMutation } from '@/store/api/apiSlice';

export default function ProductModalEdit({product, children}) {
  const [open, setOpen] = useState(false);
  const formHookReturn = useForm<TProductSchemaNoImage>({
    // resolver: zodResolver(productSchemaNoImage)
    resolver: zodResolver(z.preprocess((data) => {
      // removes empty input fields, which default to '' (empty string) on html
      const out = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== "" && value !== undefined)
      );
      console.log('Values', out);
      return out;
    }, productSchemaNoImage)),
    defaultValues: {
      ...product,
      categories: product?.categories?.map(c => c.id) || [], 
    }
  });

  
  
  //TODO TODO - maybe everythingbelow  should be redux state instead
  // Files State  
  type FileData = {
    file: File;
    preview: string | ArrayBuffer | null;
    order: number;
    publicId?: string;
  }
  const getStartingProductImages = () => {
    if(product){
      console.log('Loading product images')
      return product.images.map(i => {
       const {url, publicId, order} = i;
       return {file: undefined, preview: i.url, order, publicId, url} 
      })
    }    
    return [];
  }
  const [fileData, setFileData] = useState<FileData[]>(getStartingProductImages);
  
  
  const {reset} = formHookReturn;
  // Submit Form
  const [addProductPresignedUrl] = useAddProductPresignedUrlMutation();
  const [addProductUploadImage] = useAddProductUploadImageMutation();
  const [editProduct] = useEditProductMutation();
 
  const onSubmit = async (body: TProductSchemaNoImage) => {
    console.log('SUBMIT', body);

    //  if (!fileData[0]?.file) { 
    if (fileData.length < 1) { 
      alert("Please add an image file");
      return;
    }

    // Note, in RTK Query calls, using uwrap() makes them throw err on failure.
    // Otherwise they dont throw and instead return a .data and .error properties
    try {
      // 1- presignedUrl
      const resultPresignedUrl = await addProductPresignedUrl({body}).unwrap();

      // 2- Add file to 2nd request direct image upload
      const {cloudname, options} = resultPresignedUrl;

      //
      const filesToUploadToCloudinary : FileData[] = [];
      const filesAlreadyUploadedBefore : FileData[] = [];
      fileData.forEach(f => {
        if('publicId' in f){
          filesAlreadyUploadedBefore.push(f)
        }else{
          filesToUploadToCloudinary.push(f)
        }
      })

      console.log('FILES TO UPOAD TO CLOUDINARY', filesToUploadToCloudinary);
        

      const filesUploaded = await Promise.all(filesToUploadToCloudinary.map(async (f) => {
        const formData = new FormData();
        formData.append('file', f.file);
        // Add to this req, the same options we used in the backend to presign the url
        Object.entries(options).forEach(([key, value]) => {
          formData.append(key, value);
        });

        const resultUploadFile = await addProductUploadImage({body: formData}).unwrap();
        // 3- save document to DB including the files we uploaded in step 2
        const {public_id} = resultUploadFile;
        return {
          // ...f, dont need this (file and preview)
          order: f.order,
          publicId: public_id,
        }
      }))
        
      const combinedImages = [...filesUploaded, ...filesAlreadyUploadedBefore ]
      console.log('COMBINED IMAGES', combinedImages);

      await editProduct({
        body: {
          ...body, images: combinedImages
        },
        id: product.id,
      }).unwrap();
      
      // reset();
      // setFileData(getStartingProductImages)
      // dont need above anymore, since we are just using the useEffect that triggers anytime product changes
      // The only time our new approach would be 'worse' is if we submit a product, and for some reason
      // the products array returned from our db are the same. but in that case we woudltn need reset anyways -_-
      setOpen(false);
      // refetch(); // dont need this, we simply invalidate the products call on that enpoint def
    }catch(err){
      console.log('err catch in new product submit', err);
    }
  }

  const resetToClearInputs = () => {
    reset();
    setFileData([])
  }

  const resetToStartingInputs = () => {
    reset();
    setFileData(getStartingProductImages)
  }

  // resets to new data based on products state change. Not sure why react-hook-form
  // doesnt automatically do this out of the box
  useEffect(() => {
    reset({
      ...product,
      categories: product?.categories?.map(c => c.id) || []
    });
    setFileData(getStartingProductImages)
  }, [product]);

  // TODO, maybe change all above to be a useEffect based on isSubmitSuccessful ??
  // not sure if that would work since we would still need to wait for the api response..
  // We should at least change this ^^^^ on the NewProductModal then, not Edit
  // https://youtu.be/qmCLBjyPwVk?si=r0y8V9-yFJm2GauV&t=404

  /// jk, using 'isSubmitSuccessful' doesnt work since our new vals depend on product, so just keep above
  // useEffect which resets when the product prop changes 👍


  return (
    <Dialog onOpenChange={setOpen} open={open}>
      {children}
      <DialogContent className="max-w-[780px]">
        <DialogTitle className="sr-only">Edit Product</DialogTitle>
        <Description className="sr-only">{`Edit Product`}</Description>
        <ProductModal
          formHookReturn={formHookReturn}
          onSubmit={onSubmit}
          name={'Edit Product'}
          fileData={fileData}
          setFileData={setFileData}
          fnResetOnClose={resetToStartingInputs}
        />
      </DialogContent>
    </Dialog>
  )
}
