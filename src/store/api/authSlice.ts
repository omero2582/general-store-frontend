import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {productsApiSlice} from "./productsApiSlice";

export const authApiSlice = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({baseUrl: '/api/auth'}),
  endpoints: (builder) => ({
    logoutGoogle: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          // Wait for the query to finish
          await queryFulfilled;

          // Invalidate the product cache after successful user role change
          dispatch(productsApiSlice.util.invalidateTags(['Users']));
        } catch (err) {
          // Handle error
        }
      },
    }),
    me: builder.query({
      query: () => '/me'
    }),
  })
})
// TODO change these <any, void>
// to for example <Attraction[], void>
// then define Attraction type/interface on this file
// same with the other apiSlice

export const { 
  useLogoutGoogleMutation,
  useMeQuery,
} = authApiSlice;

export default authApiSlice.reducer;