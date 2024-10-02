import { useDispatch } from "react-redux";
import { setUser } from "./slices/userSlice";

export const fetchMiddleware = (storeAPI) => (next) => (action) => {
  // // Check if the action has opted out of middleware using a custom flag
  // if (action.meta?.skipMiddleware) {
  //   console.log('SKIP');
  //   return next(action); // Skip any processing in middleware
  // }

  if(action.meta?.arg?.endpointName === 'addProductUploadImage'){
    console.log('SKIP');
    return next(action); // Skip any processing in middleware
  }

  console.log("ACTIONN", action)

  const {dispatch} = storeAPI;
  // Normal processing for other actions
  if (action.type.endsWith('/pending')) {
    console.log('Fetch started');
  } else if (action.type.endsWith('/fulfilled')) {
    console.log('Fetch successful');
    dispatch(setUser(action.payload.user))
  } else if (action.type.endsWith('/rejected')) {
    console.log('Fetch failed');
    dispatch(setUser(action.payload.data?.user))
  }

  return next(action);
};