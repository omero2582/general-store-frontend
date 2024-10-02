import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApiSlice = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({baseUrl: '/api/users'}),
  endpoints: (builder) => ({
    changeUserLevel: builder.mutation({
      query: (body) => ({
        url: `/level`,
        method: 'POST',
        body
      }),
    }),
  })
})
// TODO change these <any, void>
// to for example <Attraction[], void>
// then define Attraction type/interface on this file
// same with the other apiSlice

export const { 
  useChangeUserLevelMutation
} = userApiSlice;

export default userApiSlice.reducer;