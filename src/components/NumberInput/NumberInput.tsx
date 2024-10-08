import { useState } from 'react'
import './NumberInput.css'

export default function NumberInput({value, setValue}) {

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
    <div className='flex h-[24px]'>
      <button onClick={decrementQuantity} className='font-[500] flex items-center justify-center w-[40px] text-[1.3rem] text-[#0046BE] bg-[hsl(0,_0%,_92%)] hover:bg-[hsl(218,_100%,_45%)] hover:text-white'>-</button>
      <input value={value} onChange={handleQuantityInput} type='number' className='text-center no-arrows w-[45px] border rounded-[2px] border-[rgb(118,_118,_118)] '/>
      <button onClick={incrementQuantity} className='font-[500] flex items-center justify-center w-[40px] h-[24px] text-[1.3rem] text-[#0046BE] bg-[hsl(0,_0%,_92%)]  hover:bg-[hsl(218,_100%,_45%)] hover:text-white'>+</button>
    </div>
  )
}
