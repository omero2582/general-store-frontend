import { HTMLInputTypeAttribute } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";

type InputProps = {
  label: string,
  id: string,
  type?: HTMLInputTypeAttribute,
  // inputSx?: React.ComponentProps<'div'>['className'];
  inputSx?: React.HTMLAttributes<HTMLInputElement>['className'];
  inputProps?: React.HTMLProps<HTMLInputElement>,
  errors?: FieldErrors<FieldValues>
}

export default function Input({label, id, type = 'text', inputSx, inputProps, errors}: InputProps){
  return(
    <div className="grid">
      <label htmlFor={id} className="sr-only">
        {label}:
      </label>
      <input 
        type={type}
        placeholder={label}
        id={id}
        className={`border-gray-400 border rounded-md p-[6px] leading-[16px] ${inputSx}`}
        {...inputProps}
      />
      {errors && errors[id] && <p className="text-red-500">{`${errors[id].message}`}</p>}
    </div>
  )
}