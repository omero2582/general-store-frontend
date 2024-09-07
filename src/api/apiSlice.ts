import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// TODO add option to each query so they can individually opt into
// using mock fetch, apart from our .env variable
// for ex 'query: (body, isUseMock) =>
const cloudname = import.meta.env.VITE_CLOUDINARY_NAME;
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({baseUrl: '/api'}),
  endpoints: (builder) => ({

    // admin
    getAdminProducts: builder.query({
      query: () => '/admin/products'
    }),
    // postAdminProducts: builder.query({
    //   query: (body) => ({
    //     url: '/admin/products',
    //     method: 'POST',
    //     body
    //   }),
    // }),
    
    // public
    getProducts: builder.query({
      query: () => '/products'
    }),
    uploadGetPresignedUrl: builder.mutation({
      query: (body) => ({
        url: `/admin/products/upload-presigned`,
        method: 'POST',
        body
      }),
    }),
    uploadFile: builder.mutation({
      query: (body) => ({
        url: `https://api.cloudinary.com/v1_1/${cloudname}/auto/upload`,
        method: 'POST',
        body
      }),
    }),
    //

    // typescript template return
    // getAdminProducts: builder.query<any, void>({
    //   query: () => '/admin/products'
    // }),

  })
})
// TODO change these <any, void>
// to for example <Attraction[], void>
// then define Attraction type/interface on this file
// same with the other apiSlice

export const { 
  // ChatGPT
  useGetAdminProductsQuery,
  useGetProductsQuery,
  useUploadGetPresignedUrlMutation,
  useUploadFileMutation
} = apiSlice;

export default apiSlice.reducer;