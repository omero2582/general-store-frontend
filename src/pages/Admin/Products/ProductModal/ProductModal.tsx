import { useCallback, useMemo, useRef, useState } from "react";
import {  useAddProductPresignedUrlMutation, useAddProductUploadImageMutation, useAddProductSaveToDBMutation, useDeleteProductMutation, useGetCategoriesQuery } from "@/store/api/apiSlice";
import { TProductSchemaNoImage } from '@shared/dist/schemas'
import Input from "../../Input";
import {useDropzone} from 'react-dropzone'
import { AspectRatio } from "@/components/AspectRatio";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import CloseSvg from '@/assets/close2.svg?react';
import { useController, UseFormReturn } from "react-hook-form";

type ProductModalProps = {
  formHookReturn: UseFormReturn<any>
  product?: object,
  name: string,
  onSubmit: (body:any) => void,
  fileData: any,
  setFileData: any
}

export function ProductModal({formHookReturn, product, name, onSubmit, fileData, setFileData} : ProductModalProps) {
  
  // Form setup
  const { 
    register, getValues, handleSubmit, formState: {errors, isSubmitting}, reset, setError, watch, control, setValue
  } = formHookReturn;
  // Moved useForm() call outside of this component, and now it comes as props,
  // Otherwise the state of the form would be cleared on as soon as modal closes.

  const categoriesToAdd = watch('categories')
  console.log('FORM', getValues());

  const handleAddCategory = (category) => {
    const updatedCategories = [...categoriesToAdd, category.id];
    setValue('categories', updatedCategories);
  }

  const handleRemoveCategory = (c) => {
    const updatedCategories = categoriesToAdd.filter(cat => cat !== c.id);
    setValue('categories', updatedCategories);
  }

  

  console.log('fileData', fileData);
  // OK, I just figured out strategy:
  // - Run useState with a starter function, that when loading edit Products,
  // it maps through product.images to create its corresponding fileData starting state,
  // and it leaves the 'fileData[id].field' as null
  // Then when we submit the edit, it will do step 1 at the start, then it will map
  // through our fileData and take ONLY the files that HAVE A '.file' and do step 2 for those
  // (direct upload to cloudinary), then it will do step 3 for those resulting files + the
  // rest of the fileData. Make sure to use fileData and not the initial products.images for step 3
  // here bc if we move around image order, then that would be reflected in fileData ONLY

  
 

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}
      className="grid justify-center"
    >
      <h2 className="text-[18px] font-[500]">{name}</h2>
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
          <CategorySelect
            categoriesToAdd={categoriesToAdd}
            handleAddCategory={handleAddCategory}
            handleRemoveCategory={handleRemoveCategory}
          />
           {errors && errors['categories'] && <p className="text-red-500">{`${errors['categories'].message}`}</p>}
          
          {/* <p>Available {categoriesNotSelected.map(c => c.name).join(', ') || '-'}</p> */}
          <button disabled={isSubmitting} type="submit" className="mt-auto text-white font-[500] bg-blue-600 px-4 py-[6px] rounded ">
            Submit
          </button>
        </div>
        <ImageSelect fileData={fileData} setFileData={setFileData}/>
        
      </div>
      
      
    </form>
  )
}

export function ImageSelect ({fileData, setFileData}) {
  // const onDrop = useCallback((acceptedFiles: Array<File>) => {
  //   // preview image
  //   const fileReader = new FileReader;
  //   fileReader.onload = function() {
  //     setPreview(fileReader.result);
  //   }
  //   fileReader.readAsDataURL(acceptedFiles[0]);

  //   // change out stateFiles
  //   setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  // }, [])

  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    console.log('ACCEPTED',acceptedFiles)
    acceptedFiles.forEach((file, index) => {
      console.log('INDEX', index)
      const fileReader = new FileReader();
      fileReader.onload = function () {
        setFileData((prevFileData) => [
          ...prevFileData,
          {
            file,
            preview: fileReader.result,
            order: prevFileData.length + 1, // Ensure correct order across multiple drops
          },
        ]);
      };
      fileReader.readAsDataURL(file);
    });
  }, [])
  

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.jpg', '.png', '.webp', '.jfif']
    },
    // maxSize: would also need this in cloudinary/backend
    maxFiles: 4,  // TODO this is ONLY max files dropped AT A SINGLE TIME, AKA considerd as 'accepted' by dropzone
    // Dropzone 'acceptedFiles' reset every time the file input is opened.
    // This is not MAX TOTAL files to be added in our state, that needs to be limited another way
  });

  return (
    <div {...getRootProps()} className="grid cursor-pointer"  >
      <div className={`relative bg-stone-100 grid w-[250px] h-[250px] ${isDragActive? 'border-[3px] border-blue-700 border-dashed' : ''}`}>
        <div className="absolute left-[42%] top-[25%] text-stone-300 font-bold text-[5rem]">+</div>
        {fileData[0]?.preview &&
        <AspectRatio ratio={1} className="flex place-content-center">
          <img src={fileData[0]?.preview as string} alt="Upload preview" className="object-contain"/>
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
  )
}

export function CategorySelect ({categoriesToAdd, handleAddCategory, handleRemoveCategory}) {
  const [open, setOpen]= useState(false);
  const [search, setSearch] = useState('');
  const commandRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  //
  const {data, isFetching, error, isSuccess} = useGetCategoriesQuery();
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
  //

  const handleCommandBlur = (event:any) => {
    if (!event.relatedTarget || (commandRef.current && !commandRef.current.contains(event.relatedTarget))) {
      setOpen(false);
    }    
  };

  const handleSelect = (category: any) => {
    // setSearch(category.name);
    handleAddCategory(category);
    setOpen(false);
    if(inputRef){
      inputRef.current?.blur();
    }
  }
  

  return (
    <>
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
              {categoriesNotSelected &&
                categoriesNotSelected.map(c => (
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
      <div className= "space-x-2 space-y-[3px] grid justify-items-start">
        {categoriesSelected.map(c => (
          <button key={c.id} className="relative flex items-center rounded-md space-x-[3px] bg-neutral-800 text-neutral-100 pl-[9px] pr-[5px] py-[3px]">
            <span>{c.name}</span>
            <CloseSvg 
              className='cursor-pointer text-white w-[14px] h-auto'
              onClick={() => handleRemoveCategory(c)}
            />
          </button>
        ))}
      </div>
    </>
  )
}