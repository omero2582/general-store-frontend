import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUser } from "../slices/userSlice";

// // Custom baseQuery to handle user state
// const customBaseQuery = (baseUrl) => {
//   const baseQuery = fetchBaseQuery({ baseUrl });
//   return async (args, api, extraOptions) => {
//     const result = await baseQuery(args, api, extraOptions);
    
//     if(result.data && args.url !== '/products/upload-presigned'){
//       if (result.data) {
//         console.log('Setting user TO', result.data.user)
//         api.dispatch(setUser(result.data.user));
//       }
//     }

//     // return result; // Return the original result
//     return {...result, meta:{...result.meta, test:'hi'}};
//   };
// };

// TODO add option to each query so they can individually opt into
// using mock fetch, apart from our .env variable
// for ex 'query: (body, isUseMock) =>
const cloudname = import.meta.env.VITE_CLOUDINARY_NAME;
export const productsApiSlice = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({baseUrl: '/api'}),
  // baseQuery: customBaseQuery('/api'),
  tagTypes: ['Products'],
  endpoints: (builder) => ({

    // public
    getProducts: builder.query({
      // query: () => '/products',
      query: () => ({
        url: '/products',
      }),
      async onCacheEntryAdded(arg, api) {
        await api.cacheDataLoaded;  // so that cacheEntry will be resolved and have a.data property
        console.log('getCacheEntry',  api.getCacheEntry())
      },
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ id }) => ({ type: 'Products', id })),
              { type: 'Products', id: 'LIST' },
            ]
          : [{ type: 'Products', id: 'LIST' }],
          // keepUnusedDataFor <- defaults to 60s = time the data will remain in the cache, 
        // after last component referencing it umounts. Also available per endpoint
    }),
    addProductPresignedUrl: builder.mutation({
      query: (body) => ({
        url: `/products/upload-presigned`,
        method: 'POST',
        body
      }),
    }),
    addProductUploadImage: builder.mutation({
      query: (body) => ({
        url: `https://api.cloudinary.com/v1_1/${cloudname}/auto/upload`,
        method: 'POST',
        body,
      }),
    }),
    addProductSaveToDB: builder.mutation({
      query: (body) => ({
        url: `/products`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Products', id: 'LIST' }
      ],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Products', id: 'LIST' }
      ],
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
  useGetProductsQuery,
  useAddProductSaveToDBMutation,
  useAddProductUploadImageMutation,
  useAddProductPresignedUrlMutation,
  useDeleteProductMutation,
} = productsApiSlice;

export default productsApiSlice.reducer;