import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// TODO add option to each query so they can individually opt into
// using mock fetch, apart from our .env variable
// for ex 'query: (body, isUseMock) =>
const cloudname = import.meta.env.VITE_CLOUDINARY_NAME;
export const productsApiSlice = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({baseUrl: '/api'}),
  tagTypes: ['AdminProducts', 'Products'],
  endpoints: (builder) => ({

    // public
    getProducts: builder.query({
      query: () => '/products',
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ id }) => ({ type: 'Products', id })),
              { type: 'Products', id: 'LIST' },
            ]
          : [{ type: 'Products', id: 'LIST' }],
    }),
    // admin
    getAdminProducts: builder.query({
      query: () => '/admin/products',
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ id }) => ({ type: 'AdminProducts', id })),
              { type: 'AdminProducts', id: 'LIST' },
            ]
          : [{ type: 'AdminProducts', id: 'LIST' }],
      // keepUnusedDataFor <- defaults to 60s = time the data will remain in the cache, 
      // after last component referencing it umounts. Also available per endpoint
    }),
    addProductPresignedUrl: builder.mutation({
      query: (body) => ({
        url: `/admin/products/upload-presigned`,
        method: 'POST',
        body
      }),
    }),
    addProductUploadImage: builder.mutation({
      query: (body) => ({
        url: `https://api.cloudinary.com/v1_1/${cloudname}/auto/upload`,
        method: 'POST',
        body
      }),
    }),
    addProductSaveToDB: builder.mutation({
      query: (body) => ({
        url: `/admin/products`,
        method: 'POST',
        body
      }),
      invalidatesTags: [
        { type: 'AdminProducts', id: 'LIST' },
        { type: 'Products', id: 'LIST' }
      ],
    })
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
  useAddProductSaveToDBMutation,
  useAddProductUploadImageMutation,
  useAddProductPresignedUrlMutation,
} = productsApiSlice;

export default productsApiSlice.reducer;