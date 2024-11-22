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
export const apiSlice = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({baseUrl: '/api'}),
  // baseQuery: customBaseQuery('/api'),
  tagTypes: ['Products', 'LIST', 'Users', 'Cart', 'Categories'],
  endpoints: (builder) => ({

    // products
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

    // cart
    // ?? think about current approach
    // Remmeber RTK Query's cache tags are not used for cache storage, they are
    // just used to decide which queries will be invalidated by a mutation
    // In scenario below, I want to invalidate the cart whenever the cart is changed,
    // or whenevera product is changed by an admin in the frontend???
    // HMMMMMMM
    // wait now that I think about it...
    // if admin changes a product, and regular user has cart opened, then 
    // they will never see this change....................
    // I think scratch my code below and instead refetch the whole cart everytime???

    // but what about PRODUCTS endpoints above ????
    // doenst it also run into the same exact problem??
    // if an admin changes a product, and user has window opened, the will
    // never see this change because their query will never be invalidated
    // HMMMMMMMMMMMMMMMMMMMMMMMMM have to re-read some of the RKT Query stuff.... 
    
    // TODO new. Now that I think about it, invalidating queries can only
    // solve the problem of: 'If I performed an action, then refetch this other thing.'
    // However, invalidating queries has nothing to do with 'When should any user
    // refetch this query, considering other users might change the backend data.'
    // That problem can only be solved by things like 'refetchOnMount', or 'keepUnusedDataFor'
    // I think ideally, we just refetch on mount and probably remove the product tags
    // We can keep the Cart tags though because these will always only be changed by the same user
    // Although they could change them from different clients, but thats ok at least they know they data is out of sync
    // if they kept the other window opened. refetchOnMount would maybe solve that
    // But ofc I would much prefer to have Tanstack Query's staleTime here.
    // For now maybe just keep these tags, so that managing the cart in the cart page
    // will trigger more cart fetches, but consider adding refetchOnMount and taking out productTags
    // TODO new, also adding to above: it seems like refetchOnMount can take a
    // number argument, which makes it behave similar to tanstack Query staleTime
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
      query: (body) => ({
        url: `/cart`,
        method: 'POST',
        body
      }),
      invalidatesTags: [
        { type: 'Cart', id: 'LIST' }
      ],
    }),

    editCartProduct: builder.mutation({
      query: (body) => ({
        url: `/cart`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: [
        { type: 'Cart', id: 'LIST' }
      ],
    }),

    deleteCartProduct: builder.mutation({
      query: (id) => ({
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

    addCategory: builder.mutation({
      query: (body) => ({
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
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Categories', id: 'LIST' }
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
  //products
  useGetProductQuery,
  useGetProductsQuery,
  useGetProductsAdminQuery,
  useAddProductSaveToDBMutation,
  useAddProductUploadImageMutation,
  useAddProductPresignedUrlMutation,
  useDeleteProductMutation,
  useEditProductMutation,
  // cart
  useGetCartQuery,
  useAddCartProductMutation,
  useEditCartProductMutation,
  useDeleteCartProductMutation,
  //categories
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useEditCategoryMutation,
} = apiSlice;

export default apiSlice.reducer;

// For TypeScript usage, the builder.query() and builder.mutation() endpoint definition functions accept two generic arguments: <ReturnType, ArgumentType>. For example, an endpoint to fetch a Pokemon by name might look like getPokemonByName: builder.query<Pokemon, string>(). If a given endpoint takes no arguments, use the void type, like getAllPokemon: builder.query<Pokemon[], void>().