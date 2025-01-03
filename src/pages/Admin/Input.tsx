import { HTMLInputTypeAttribute } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";

type InputProps = {
  label: string,
  id: string,
  type?: HTMLInputTypeAttribute,
  // inputSx?: React.ComponentProps<'div'>['className'];
  inputSx?: React.HTMLAttributes<HTMLInputElement>['className'];
  inputProps?: React.HTMLProps<HTMLInputElement>,
  errors?: FieldErrors<FieldValues>,
  lengthInfo?: {max: number | null, value, onChange: () => void, lengthError}
}

export default function Input({lengthInfo, label, id, type = 'text', inputSx, inputProps, errors}: InputProps){

  // const lengthError = lengthInfo?.value?.length > lengthInfo?.max;
  const lengthError = lengthInfo?.lengthError;
  
  return(
    <div className="grid">
      <div className="grid relative">
        <label htmlFor={id} className="sr-only">
          {label}:
        </label>
        <input 
          type={type}
          placeholder={label}
          id={id}
          className={`peer border-gray-400 border rounded-md p-[8px] ${lengthInfo && 'pb-[26px]'} leading-[16px] ${inputSx}`}
          {...inputProps}
        />
        {lengthInfo && <span className={`${lengthError ? 'opacity-100' : 'opacity-0' } peer-focus:opacity-100  absolute pointer-events-none  right-2 bottom-[4px] text-[0.75rem] ${lengthError ? 'text-red-600' : 'text-gray-600'}`}>{`${lengthInfo?.value?.length}/${lengthInfo?.max}`}</span>}
      </div>
      {errors && errors[id] && <p className="text-red-600">{`${errors[id].message}`}</p>}
    </div>
  )
}