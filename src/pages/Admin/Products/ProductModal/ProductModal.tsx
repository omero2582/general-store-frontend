import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {  useGetCategoriesQuery } from "@/store/api/apiSlice";
import Input from "../../Input";
import {useDropzone} from 'react-dropzone'
import { AspectRatio } from "@/components/AspectRatio";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import CloseSvg from '@/assets/close2.svg?react';
import { UseFormReturn } from "react-hook-form";
import { Spinner } from "@/components/Spinner";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Description } from "@radix-ui/react-dialog";
import { productSchemaNoImage } from "@shared/dist/schemas";

type ProductModalProps = {
  formHookReturn: UseFormReturn<any>
  name: string,
  onSubmit: (body:any) => void,
  fnResetOnClose?: () => void
}

export function ProductModal({formHookReturn, name, onSubmit} : ProductModalProps) {
  

  // Form setup
  const { 
    register, getValues, handleSubmit, formState: {errors, isSubmitting, isDirty},setFocus, reset, setError, watch, control, setValue, trigger
  } = formHookReturn;
  // Moved useForm() call outside of this component, and now it comes as props,
  // Otherwise the state of the form would be cleared on as soon as modal closes.

  const categoriesToAdd = watch('categories')
  console.log('FORM', getValues());

  const handleAddCategory = (category) => {
    const updatedCategories = [...categoriesToAdd, category.id];
    setValue('categories', updatedCategories, {shouldDirty: true});
  }

  const handleRemoveCategory = (c) => {
    const updatedCategories = categoriesToAdd.filter(cat => cat !== c.id);
    setValue('categories', updatedCategories, {shouldDirty: true});
  }


  // OK, I just figured out strategy:
  // - Run useState with a starter function, that when loading edit Products,
  // it maps through product.images to create its corresponding fileData starting state,
  // and it leaves the 'fileData[id].field' as null
  // Then when we submit the edit, it will do step 1 at the start, then it will map
  // through our fileData and take ONLY the files that HAVE A '.file' and do step 2 for those
  // (direct upload to cloudinary), then it will do step 3 for those resulting files + the
  // rest of the fileData. Make sure to use fileData and not the initial products.images for step 3
  // here bc if we move around image order, then that would be reflected in fileData ONLY

  //
 // DEC 10
 //

 const fileData = watch('fileData');
console.log('fileData', fileData);
const fileLimit = 6;
const onDrop = useCallback((acceptedFiles: Array<File>) => {
  console.log('ACCEPTED',acceptedFiles)
  acceptedFiles.forEach((file, index) => {
    const fileReader = new FileReader();
    fileReader.onload = function () {
      // setFileData((prevFileData) => {
      const prevFileData = getValues('fileData');
      console.log(fileData)
        const nextOrderNum = prevFileData.length + 1; // Ensure correct order across multiple drops
        if(nextOrderNum > fileLimit){
          console.log(`Adding this file ${nextOrderNum} would exceed the limit, so dont add it`)
          return prevFileData
        }
        // return [
        setValue('fileData', [
          ...prevFileData,
          {
            file,
            preview: fileReader.result,
            order: nextOrderNum, 
          },
        ], {shouldDirty: true})
      // });
    };
    fileReader.readAsDataURL(file);
  });
}, [fileData])

 const dropzoneReturn = useDropzone({
  onDrop,
  accept: {
    'image/png': ['.jpg', '.png', '.webp', '.jfif']
  },
  // maxSize: would also need this in cloudinary/backend
  maxFiles: fileLimit,  // TODO this is ONLY max files dropped AT A SINGLE TIME, AKA considerd as 'accepted' by dropzone
  // Dropzone 'acceptedFiles' reset every time the file input is opened.
  // This is not MAX TOTAL files to be added in our state, that needs to be limited another way
});

const {getRootProps} = dropzoneReturn;


// Extracting max lengths constraints on schema, to display in UI
const nameShape = productSchemaNoImage.shape.name;
const nameMax = nameShape.maxLength;

const descShape = productSchemaNoImage.shape.description;
const descMax = descShape._def.innerType.maxLength;

const categoriesShapeArr = productSchemaNoImage.shape.categories;
// const {defaultValue, typeName, innerType, description, errorMap} = categoriesShapeArr._def
const categoriesShape = categoriesShapeArr._def.innerType._def
const categoriesMax = categoriesShape.maxLength?.value

const lengthInfo = {
  name: { max: nameMax, value: watch('name'), onChange: async () => await trigger('name'), get lengthError() {return this?.value?.length > this?.max}},
  description: {max: descMax, value: watch('description'), onChange: async () => await trigger('description'), get lengthError() {return this?.value?.length > this?.max}},
  categories: {max: categoriesMax, value: watch('categories'), onChange: async () => await trigger('categories'), get lengthError() {return this?.value?.length > this?.max}},
}

const descWrapperOnClick =  () => {
  setFocus('description');
}

return (
  <DialogContent {...getRootProps()}  onClick={e => e.stopPropagation()} className="max-w-[780px]" >
    <DialogTitle className="sr-only">{name}</DialogTitle>
    <Description className="sr-only">{name}</Description>  
    <form noValidate onSubmit={handleSubmit(onSubmit)}
      className="grid justify-center"
    >
      <h2 className="text-[18px] font-[500]">{name}</h2>
      <div className="grid grid-flow-col gap-x-5">
        <div className="mt-2 flex flex-col gap-y-2">
          <Input lengthInfo={lengthInfo.name} errors={errors} id='name' label="Name" inputProps={{...register("name")}}/>
          {/*Description TextArea*/}
          <div className="grid">
            <div onClick={() => descWrapperOnClick()} className="overflow-hidden focus-within:outline outline-[2px] outline-offset-[-2px] outline-black grid border-gray-400 border rounded-md ">
              <label htmlFor={'description'} className="sr-only">{'Description'}:</label>
              <textarea  className={`outline-none resize-none peer p-[6px] `} cols={50} rows={4} spellCheck={false} placeholder="Description" {...register("description")}/>    
              <span className={`${lengthInfo.description.lengthError ? 'opacity-100' : 'opacity-0' } peer-focus:opacity-100 pointer-events-none justify-self-end mr-[8px] text-[0.75rem] ${lengthInfo.description.lengthError ? 'text-red-600' : 'text-gray-600'}`}>{`${lengthInfo?.description?.value?.length}/${lengthInfo?.description?.max}`}</span>
            </div>  
            {errors && errors['description'] && <p className="text-red-500">{`${errors['description'].message}`}</p>}
          </div>
          <Input errors={errors} type="number" id='price' label="Price" inputSx="max-w-[100px]" inputProps={{...register("price"), step: 0.01}}/>
          <CategorySelect
            categoriesToAdd={categoriesToAdd}
            handleAddCategory={handleAddCategory}
            handleRemoveCategory={handleRemoveCategory}
            lengthInfo={lengthInfo.categories}
          />
          <div className="flex gap-x-3">
            <label htmlFor="visibility">Visibility:</label>
            <select className="border-gray-400 border rounded-md" id="visibility" defaultValue="public" {...register("visibility")}>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
           {errors && errors['categories'] && <p className="text-red-500">{`${errors['categories'].message}`}</p>}
          
          {/* w-[83px]*/}
          <button disabled={!isDirty || isSubmitting} type="submit"
            className="mt-auto self-stretch px-4 py-[6px] text-white font-[500] bg-blue-600 disabled:bg-blue-500  rounded "
          >
            {isSubmitting ? 
            <Spinner className='text-white w-auto h-auto'/> 
            : 'Submit'}
          </button>
        </div>
        <ImageSelect fileLimit={fileLimit} dropzoneReturn={dropzoneReturn} setValue={setValue} watch={watch} getValues={getValues}/>
        
      </div>
      
      
    </form>
    </DialogContent>
  )
}

export function ImageSelect ({fileLimit, watch, setValue, getValues, dropzoneReturn}) {
  const fileData = watch('fileData');
  console.log('fileData', fileData);
  

  const { acceptedFiles, getRootProps, getInputProps, isDragActive, open } = dropzoneReturn;

  const [selectedImageId, setSelectedImageId] = useState(1);
  const selectedImage = fileData.find(i => i.order === selectedImageId) || fileData[0];

  const removeFile = (orderNum: number) => {
    const prevFileData = getValues('fileData');
    // setFileData(prevFileData => {
      const removed = prevFileData.filter(f => f.order !== orderNum);
      const sorted = [...removed].sort((a, b) => a.order - b.order);
      const ordered = sorted.map((img, index) => ({...img, order: index + 1}))
      // reason I do above, is to make sure everything is ordered/numbered 1 thourgh X, in consecutinve numbers
    //   return ordered;
    // })
    setValue('fileData', ordered, {shouldDirty: ordered.length > 0});
    
    // moves the selection order number, accounting for the img removed'd order num
    if(orderNum === selectedImageId){
      setSelectedImageId(1);
    }else if (orderNum < selectedImageId){
      setSelectedImageId(i => i-1);
    }
  }

  

  return (
    <div className="grid cursor-pointer"  >
      <div onClick={open} className={`relative bg-stone-100 grid w-[250px] h-[250px] ${isDragActive? 'border-[3px] border-blue-700 border-dashed' : ''}`}>
        <div className="absolute left-[42%] top-[25%] text-stone-300 font-bold text-[5rem]">+</div>
        {selectedImage?.preview &&
        <AspectRatio ratio={1} className="flex place-content-center">
          <img src={selectedImage?.preview as string} alt="Upload preview" className="object-contain"/>
          <CloseSvg
            className="absolute p-1 bg-stone-950 hover:bg-red-500 text-white w-8 h-auto right-1 top-2 rounded-full"
            onClick={(e) => {
              e.stopPropagation(); 
              removeFile(1)
            }}
          />
        </AspectRatio >
        }
      </div>
      {/* <input type="file" accept=".jpg, .png, .webp, .jfif" onChange={handleFileChange} /> */}
      <div onClick={open}>
        <input {...getInputProps()}/>
        <div className={`h-[50px] rounded bg-[rgb(255,_51,_51)] grid place-content-center`}>
          <p className="text-white ">Choose Files</p>
        </div>
      </div>
      {/* ALL IMAGES SMALL PREVIEW */}
      {/** border-[#007185] border-2 | outline outline-[#007185] outline-2 | ring-[#007185] ring-2 */}
      <div className="py-1 grid grid-cols-[repeat(3,_auto)] justify-center gap-[10px]">
        {fileData?.map(f => (
        <div
          className={`${selectedImageId === f.order ? 'ring-[#007185] ring-[3px]' : ''} bg-stone-100 grid w-[70px] h-[70px] rounded-md overflow-hidden`}
          onClick={() => setSelectedImageId(f.order)}
        >
          {f?.preview &&
          <AspectRatio ratio={1} className="flex place-content-center">
            <img src={f?.preview as string} alt={`image ${f.order} preview`} className="object-cover"/>
            <CloseSvg
              className="absolute p-1 bg-stone-950 hover:bg-red-500 text-white w-5 h-auto right-0 top-0 rounded-full"
              onClick={(e) => {
                e.stopPropagation(); 
                removeFile(f.order)
              }}
            />
          </AspectRatio >
          }
        </div> 
        ))}
      </div>
      <p className="justify-self-end pt-[2px]">Photos · {fileData.length} / {fileLimit}</p>
      
      
    </div>
  )
}

export function CategorySelect ({categoriesToAdd, handleAddCategory, handleRemoveCategory, lengthInfo}) {
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
    handleAddCategory(category);
    setOpen(false);
    if(inputRef){
      inputRef.current?.blur();
    }
  }
  

  return (
    <>
      <div className="max-w-[536px] self-start ">
        <Command className="border-gray-400 border rounded-md relative z-50 overflow-visible" ref={commandRef}
          onBlur={(e) => handleCommandBlur(e)}
          // if we dont do this, and only leave onBlur on CommandInput, then 
          // if we target CommandInput -> then target scrollbar on CommandList
          // -> then target outside, then the last target wont trigger the
          // onBlur of CommandInput, because it was unfocused 2 steps ago
          // so we need this onBlur here too (we need both here an in CommmnadInput)
          >
          <div className="grid grid-flow-col items-center">
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder="Add Category"
              onFocus={() => setOpen(true)}
              ref={inputRef}
              // onBlur={() => setOpen(false)}  // doesnt work because it doenst let onSelect run on CommandItem
              onBlur={(e) => handleCommandBlur(e)}
              className="text-[16px] py-0 h-8 relative"
              />
              <span className={`ml-[-8px] ${lengthInfo?.lengthError ? 'opacity-100' : 'opacity-0' } ${open && 'opacity-100'} pointer-events-none justify-self-end mr-[8px] text-[0.75rem] ${lengthInfo?.lengthError ? 'text-red-600' : 'text-gray-600'}`}>{`${lengthInfo?.value?.length}/${lengthInfo?.max}`}</span>
          </div>
          <CommandList className="min-w-[250px] absolute bg-white top-[35px] shadow-2xl" hidden={!open}>
            <CommandEmpty  className="text-[16px] px-[8px] py-[6px]">
              No results found.
            </CommandEmpty>
            <CommandGroup heading={<p className="text-[14px]">Suggestions</p>} >
              {categoriesNotSelected &&
                categoriesNotSelected.map(c => (
                  <CommandItem
                    onSelect={()=> handleSelect(c)}
                    key={c.id}
                    className="text-[16px]  cursor-pointer"

                  >
                    {c.name}
                  </CommandItem>
                ))}
            </CommandGroup>
            <CommandSeparator />
          </CommandList>
        </Command>
        
      </div>
      {categoriesSelected.length > 0 && 
        <div className= "gap-x-2 gap-y-[3px] flex flex-wrap justify-start">
          {categoriesSelected.map(c => (
            <button type="button" key={c.id} className="relative flex items-center rounded-md space-x-[3px] bg-neutral-800 text-neutral-100 pl-[9px] pr-[5px] py-[3px]">
              <span>{c.name}</span>
              <CloseSvg 
                className='cursor-pointer text-white w-[14px] h-auto'
                onClick={() => handleRemoveCategory(c)}
              />
            </button>
          ))}
        </div>
      }
    </>
  )
}