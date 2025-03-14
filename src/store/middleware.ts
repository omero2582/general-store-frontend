import { setUser } from "./slices/userSlice";
import { Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import { isRejectedWithValue, isFulfilled, isPending } from '@reduxjs/toolkit'
import { toast } from '@/hooks/use-toast';

const formatErrorName = (name) => {
  return name.replace(/([a-z])([A-Z])/g, '$1 $2');
}

export const fetchMiddleware: Middleware = 
  (storeAPI: MiddlewareAPI) => (next) => (action) => {
  // // Check if the action has opted out of middleware using a custom flag
  // if (action.meta?.skipMiddleware) {
  //   console.log('SKIP');
  //   return next(action); // Skip any processing in middleware
  // }

  if(action.meta?.arg?.endpointName === 'addProductUploadImage'){
    console.log('SKIP');
    return next(action); // Skip any processing in middleware
  }

  // console.log("ACTIONN", action)

  const {dispatch} = storeAPI;
  // Normal processing for other actions
  if (isPending(action)) {
    console.log('Fetch started');
  } else if (isFulfilled(action)) {
    console.log('Fetch successful');
    // dispatch(setUser(action.payload.user))
  } else if (isRejectedWithValue(action)) {
    console.log('Fetch failed', action);
    // dispatch(setUser(action.payload.data?.user))
    toast({
      title: formatErrorName(action.payload.data?.name|| 'Error') ,
      description: action.payload.data?.message,
      variant: "destructive",
    });
  }

  return next(action);
};