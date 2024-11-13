import { useCallback, useMemo, useRef, useState } from "react";
import {  useAddProductPresignedUrlMutation, useAddProductUploadImageMutation, useAddProductSaveToDBMutation, useDeleteProductMutation, useGetCategoriesQuery } from "../../../store/api/apiSlice";
import { TProductSchemaNoImage } from '@shared/dist/schemas'
import Input from "../Input";
import {useDropzone} from 'react-dropzone'
import { AspectRatio } from "@/components/AspectRatio";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import CloseSvg from '@/assets/close2.svg?react';

export function NewProductModal({formHook}) {
  
  //
  const {data, isFetching, error, isSuccess} = useGetCategoriesQuery();
  const [categoriesToAdd, setCategoriesToAdd]= useState([]);
  const categoriesSorted = useMemo(() => {
    console.log('SORT categories');
    if(data){
      return [...data.categories].sort((a, b) => a.name.localeCompare(b.name))
    }
    return []
    
  }, [data]);
  const categoriesNotSelected = []
  const categoriesSelected = []
  categoriesSorted.map(c => {
    if(categoriesToAdd.includes(c.id)){
      categoriesSelected.push(c);
    }else{
      categoriesNotSelected.push(c);
    }
  })

  const handleAddCategory = (category) => {
    setCategoriesToAdd(c => ([...c, category.id]));
  }

  const handleRemoveCategory = (c) => {
    setCategoriesToAdd(prev => prev.filter(cat => cat !== c.id))
  }

  // const categoriesNotSelected = categoriesSorted.filter(c => !categoriesToAdd.includes(c.id))
  // const categoriesSelected = categoriesSorted.filter(c => categoriesToAdd.includes(c.id))
  //
  
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
    watch
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

    // Note, in RTK Query calls, using uwrap() makes them throw err on failure.
    // Otherwise they dont throw and instead return a .data and .error properties
    try {
      // 1- presignedUrl
      const resultPresignedUrl = await addProductPresignedUrl(body).unwrap();

      // 2- Add file to 2nd request direct image upload
      const {cloudname, options} = resultPresignedUrl;
      const formData = new FormData();
      formData.append('file', files[0]);
      // Add to this req, the same options we used in the backend to presign the url
      Object.entries(options).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const resultUploadFile = await addProductUploadImage(formData).unwrap();
      
      // 3- save document to DB including the files we uploaded in step 2
      const {public_id} = resultUploadFile;
      await addProductSaveToDB({
        ...body, images: [{order: 1, imageId: public_id}]
      }).unwrap();
      
      reset(); // clear inputs
      setFiles([]);  // clear file input
      setPreview(null);
      // refetch(); // dont need this, we simply invalidate the products call on that enpoint def
    }catch(err){
      console.log('err catch in new product submit', err);
    }
  }

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
          <CategorySelect categories={categoriesNotSelected} handleAddCategory={handleAddCategory}/>
          <div className= "space-x-2 space-y-[3px] grid justify-items-start">
            {categoriesSelected.map(c => (
              <button key={c.id} className="relative flex items-center rounded-md space-x-[3px] bg-neutral-800 text-neutral-100 pl-[9px] pr-[5px] py-[3px]">
                <span>{c.name}</span>
                {/* <span 
                  className="cursor-pointer absolute bg-black text-white w-2 h-2" 
                  onClick={() => setCategoriesToAdd(prev => prev.filter(cat => cat !== c.id))}
                >
                  x
                </span> */}
                {/* <CloseSvg 
                  className='absolute cursor-pointer rounded-md border-black border bg-white text-black w-[13px] h-auto top-[-3px] right-[-5px]'
                  onClick={() => setCategoriesToAdd(prev => prev.filter(cat => cat !== c.id))}
                /> */}
                <CloseSvg 
                  className='cursor-pointer text-white w-[14px] h-auto'
                  onClick={() => handleRemoveCategory(c)}
                />
              </button>
            ))}
          </div>
          {/* <p>Available {categoriesNotSelected.map(c => c.name).join(', ') || '-'}</p> */}
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

export function CategorySelect ({categories, handleAddCategory}) {
  const [open, setOpen]= useState(false);
  const [search, setSearch] = useState('');
  const commandRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCommandBlur = (event:any) => {
    if (!event.relatedTarget || (commandRef.current && !commandRef.current.contains(event.relatedTarget))) {
      setOpen(false);
    }    
  };

  const handleSelect = (category: any) => {
    // trigger this onClick and on pressing enter / submitting form ??
    // console.log('SELECT', e)
    // setSearch(category.name);
    handleAddCategory(category);
    setOpen(false);
    if(inputRef){
      inputRef.current?.blur();
    }
  }
  
  

  return (
    <div className="max-w-[536px] ">
      <Command className="border-2 border-neutral-400 relative z-50 overflow-visible" ref={commandRef}
        onBlur={(e) => handleCommandBlur(e)}
        // if we dont do this, and only leave onBlur on CommandInput, then 
        // if we target CommandInput -> then target scrollbar on CommandList
        // -> then target outside, then the last target wont trigger the
        // onBlur of CommandInput, because it was unfocused 2 steps ago
        // so we need this onBlur here too (we need both here an in CommmnadInput)
      >
        <div className="">
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder="Add Category"
            onFocus={() => setOpen(true)}
            ref={inputRef}
            // onBlur={() => setOpen(false)}  // doesnt work because it doenst let onSelect run on CommandItem
            onBlur={(e) => handleCommandBlur(e)}
            className="text-[16px] py-0 h-8"
          />

        </div>
        <CommandList className="absolute bg-white top-[40px]" hidden={!open}>
          <CommandEmpty  className="text-[16px] px-[8px] py-[6px]">
            No results found.
          </CommandEmpty>
          <CommandGroup heading={<p className="text-[14px]">Suggestions</p>} >
            {categories &&
              categories.map(c => (
                <CommandItem
                  onSelect={()=> handleSelect(c)}
                  key={c.id}
                  className="text-[16px] min-w-[250px]"
                >
                  {c.name}
                </CommandItem>
              ))}
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </Command>
      
    </div>
  )
}