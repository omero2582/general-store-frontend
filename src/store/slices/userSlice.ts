import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  cart: [],
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    setCart: (state, action) => {
      state.cart = action.payload
    },
  }
})

export const { setUser, setCart } = userSlice.actions;
export default userSlice.reducer;