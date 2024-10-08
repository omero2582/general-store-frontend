import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUser } from "../slices/userSlice";

// TODO prob combine all api slices into one api slice

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
  tagTypes: ['Products', 'LIST', 'Users'],
  endpoints: (builder) => ({

    // public
    getProduct: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Products', id }],
    }),
    getProducts: builder.query({
      query: () => '/products',
      async onQueryStarted(arg, api){
        // api.queryFulfilled promise
        //https://redux.js.org/tutorials/essentials/part-8-rtk-query-advanced#the-onquerystarted-lifecycle
      },
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
    getProductsAdmin: builder.query({
      query: () => '/products/admin',
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ id }) => ({ type: 'Products', id })),
              { type: 'Products', id: 'LIST' }, 'Users'
            ]
          : [{ type: 'Products', id: 'LIST' }, 'Users'],
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
  useGetProductQuery,
  useGetProductsQuery,
  useGetProductsAdminQuery,
  useAddProductSaveToDBMutation,
  useAddProductUploadImageMutation,
  useAddProductPresignedUrlMutation,
  useDeleteProductMutation,
} = productsApiSlice;

export default productsApiSlice.reducer;

// For TypeScript usage, the builder.query() and builder.mutation() endpoint definition functions accept two generic arguments: <ReturnType, ArgumentType>. For example, an endpoint to fetch a Pokemon by name might look like getPokemonByName: builder.query<Pokemon, string>(). If a given endpoint takes no arguments, use the void type, like getAllPokemon: builder.query<Pokemon[], void>().