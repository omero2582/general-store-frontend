import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";

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


// RTK Query note:
// Invalidating queries can only solve the problem of: 'If I performed an action,
// then refetch this other thing.' However, invalidating queries has nothing to do with
// 'When should any user refetch this query, considering other users might change the backend data.'
// That problem can only be solved by things like 'refetchOnMountOrArgChange', or 'keepUnusedDataFor'
// refetchOnMountOrArgChange = staleTime in Tanstack Query
// keepUnusedDataFor = after this unmounts, start counting X seconds. If we remount before X seconds,
// then use the prev cached data, otherwise re-fetch. We almost never want this.

// TODO add option to each query so they can individually opt into
// using mock fetch, apart from our .env variable
// for ex 'query: (body, isUseMock) =>
const cloudname = import.meta.env.VITE_CLOUDINARY_NAME;
export const apiSlice = createApi({
  refetchOnMountOrArgChange: 20, //similar to Tanstack Query staleTime
  // I can either enable it here, or speicifcally on every
  // hook call. Its nice here but there are times when I would want to opt out of it
  // SO not sure, I am just deciding the default herre
  // keepUnusedDataFor <- defaults to 60s = time the data will remain in the cache, 
  // after last component referencing it umounts. Also available per endpoint
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({baseUrl: '/api'}),
  // baseQuery: customBaseQuery('/api'),
  tagTypes: ['Products', 'LIST', 'Users', 'Cart', 'Categories'],
  endpoints: (builder) => ({

    // products
    getProduct: builder.query({
      query: ({id}) => `/products/${id}`,
      providesTags: (result, error, {id}) => [{ type: 'Products', id }],
    }),
    getProducts: builder.query({
      query: (params) => params?.query ? `/products${params?.query}`: '/products',
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
    }),
    getProductsAdmin: builder.query({
      // query: () => '/products/admin',
      query: (params) => params?.query ? `/products/admin${params?.query}`: '/products/admin',
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ id }) => ({ type: 'Products', id })),
              { type: 'Products', id: 'LIST' }, 'Users'
            ]
          : [{ type: 'Products', id: 'LIST' }, 'Users'],
    }),
    addProductPresignedUrl: builder.mutation({
      query: ({ body }) => ({
        url: `/products/upload-presigned`,
        method: 'POST',
        body
      }),
    }),
    addProductUploadImage: builder.mutation({
      query: ({ body }) => ({
        url: `https://api.cloudinary.com/v1_1/${cloudname}/auto/upload`,
        method: 'POST',
        body,
      }),
    }),
    addProductSaveToDB: builder.mutation({
      query: ({ body }) => ({
        url: `/products`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Products', id: 'LIST' }
      ],
    }),
    deleteProduct: builder.mutation({
      query: ({ id }) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Products', id: 'LIST' },
        { type: 'Products', id }
      ],
    }),
    editProduct: builder.mutation({
      query: ({body, id}) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, {body, id}) => [
        { type: 'Products', id: 'LIST' },
        { type: 'Products', id }
      ],
    }),

    //  ratings
    addOrEditProductRating: builder.mutation({
      query: ({body, id}) => ({
        url: `/products/${id}/my-rating`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Products', id: 'LIST' },
        { type: 'Products', id }
      ],
    }),
    deleteProductRating: builder.mutation({
      query: ({id}) => ({
        url: `/products/${id}/my-rating`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Products', id: 'LIST' },
        { type: 'Products', id }
      ],
    }),

    //cart
    getCart: builder.query({
      query: () => `/cart`,
      providesTags: (result) =>
        result
          ? [
              ...result.cart.items.map(({ product }) => ({ type: 'Products', id: product.id })),
              { type: 'Products', id: 'LIST' }, { type: 'Cart', id: 'LIST' }
            ]
          : [{ type: 'Products', id: 'LIST' }, { type: 'Cart', id: 'LIST' }],
    }),

    addCartProduct: builder.mutation({
      query: ({ body }) => ({
        url: `/cart`,
        method: 'POST',
        body
      }),
      invalidatesTags: [
        { type: 'Cart', id: 'LIST' }
      ],
    }),

    editCartProduct: builder.mutation({
      query: ({body}) => ({
        url: `/cart`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: [
        { type: 'Cart', id: 'LIST' }
      ],
    }),

    deleteCartProduct: builder.mutation({
      query: ({ id }) => ({
        url: `/cart/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Cart', id: 'LIST' }
      ],
    }),

    //
    // categories
    getCategories: builder.query({
      query: () => `/categories`,
      providesTags: (result) =>
       [{ type: 'Categories', id: 'LIST' }],
    }),

    getCategoriesAdmin: builder.query({
      query: () => `/categories/admin`,
      providesTags: (result) =>
       [{ type: 'Categories', id: 'LIST' }, 'Users'],
    }),

    addCategory: builder.mutation({
      query: ({body}) => ({
        url: `/categories`,
        method: 'POST',
        body
      }),
      invalidatesTags: [
        { type: 'Categories', id: 'LIST' }
      ],
    }),

    editCategory: builder.mutation({
      query: ({body, id}) => ({
        url: `/categories/${id}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: [
        { type: 'Categories', id: 'LIST' }
      ],
    }),

    deleteCategory: builder.mutation({
      query: ({id}) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Categories', id: 'LIST' }
      ],
    }),

    // users
    changeUserLevel: builder.mutation({
      query: ({body}) => ({
        url: `/users/level`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['Users'],
    }),

    //auth
    logoutGoogle: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Users'],
    }),
    // me: builder.query({
    //   query: () => '/auth/me',
    //   providesTags: ['Users']
    // }),
    me: builder.query({
      queryFn: async ( args, { dispatch, getState }, extraOptions) => {

        try {
          const {data} = await axios.get('/api/auth/me')
          return { data }
        } catch (error) {
          return { error }
        }
      },
      providesTags: ['Users'],
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
  //products
  useGetProductQuery,
  useGetProductsQuery,
  useGetProductsAdminQuery,
  useAddProductSaveToDBMutation,
  useAddProductUploadImageMutation,
  useAddProductPresignedUrlMutation,
  useDeleteProductMutation,
  useEditProductMutation,
  // ratings
  useAddOrEditProductRatingMutation,
  useDeleteProductRatingMutation,
  // cart
  useGetCartQuery,
  useAddCartProductMutation,
  useEditCartProductMutation,
  useDeleteCartProductMutation,
  //categories
  useGetCategoriesQuery,
  useGetCategoriesAdminQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useEditCategoryMutation,

  //users
  useChangeUserLevelMutation,
  useLogoutGoogleMutation,
} = apiSlice;

// user
// doing it like this, beccause RTK Query doesnt let you define query options in the endpoint
// definitions above.... It only lets you define it globaly, or when you call the hook..
const {useMeQuery: useOriginalMeQuery} = apiSlice;
export const useMeQuery = () => useOriginalMeQuery(undefined, {refetchOnMountOrArgChange: 60})

export default apiSlice.reducer;

// For TypeScript usage, the builder.query() and builder.mutation() endpoint definition functions accept two generic arguments: <ReturnType, ArgumentType>. For example, an endpoint to fetch a Pokemon by name might look like getPokemonByName: builder.query<Pokemon, string>(). If a given endpoint takes no arguments, use the void type, like getAllPokemon: builder.query<Pokemon[], void>().