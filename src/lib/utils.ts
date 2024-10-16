import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPrice(price) {
  if(price === 0){
    return 'FREE'
  } else if (!price){
    return '-'
  } else{
    return new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' }).format(price)
  }
}
