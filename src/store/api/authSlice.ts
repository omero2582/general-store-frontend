import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApiSlice = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({baseUrl: '/api/auth'}),
  endpoints: (builder) => ({
    signInGoogle: builder.query({
      // TODO change this to post, also not usre if i can use this anymore, get cors errors form gogole redirect
      query: () => '/google',
    }),
    logoutGoogle: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
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
  useSignInGoogleQuery,
  useMeQuery,
} = authApiSlice;

export default authApiSlice.reducer;