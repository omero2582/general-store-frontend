import { useState } from 'react'
import './NumberInput.css'
import { cn } from '@/lib/utils';

export default function NumberInput({value, setValue, isDisabled = false, className}) {

  const handleQuantityInput = (e) => {
    const number = (Number(e.target.value));
    setValue(Math.max(1, number));
  }

  const incrementQuantity = () => setValue(value + 1);
  const decrementQuantity = () => {
    if(value > 1) {
      setValue(value-1)
    }
  }

  return (
    <div className={cn('flex h-[24px]', className)}>
      <button disabled={isDisabled} onClick={decrementQuantity} className={`bg-[hsl(0,_0%,_92%)] disabled:bg-[hsl(0,_0%,_92%)] disabled:text-stone-400  font-[500] flex items-center justify-center w-[40px] text-[1.3rem] text-[#0046BE]  hover:bg-[hsl(218,_100%,_45%)] hover:text-white`}>-</button>
      <input disabled={isDisabled} value={value} onChange={handleQuantityInput} type='number' className='text-center no-arrows w-[45px] border rounded-[2px] border-[rgb(118,_118,_118)] '/>
      <button disabled={isDisabled} onClick={incrementQuantity} className='bg-[hsl(0,_0%,_92%)] disabled:bg-[hsl(0,_0%,_92%)] disabled:text-stone-400 font-[500] flex items-center justify-center w-[40px] h-[24px] text-[1.3rem] text-[#0046BE]   hover:bg-[hsl(218,_100%,_45%)] hover:text-white'>+</button>
    </div>
  )
}
