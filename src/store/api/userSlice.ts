// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import {apiSlice} from "./apiSlice.ts";

// export const userApiSlice = createApi({
//   reducerPath: 'userApi',
//   baseQuery: fetchBaseQuery({baseUrl: '/api/users'}),
//   tagTypes: ['Products', 'LIST'],
//   endpoints: (builder) => ({
//     changeUserLevel: builder.mutation({
//       query: (body) => ({
//         url: `/level`,
//         method: 'POST',
//         body
//       }),
//       onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
//         try {
//           // Wait for the query to finish
//           await queryFulfilled;

//           // Invalidate the product cache after successful user role change
//           dispatch(apiSlice.util.invalidateTags(['Users']));
//         } catch (err) {
//           // Handle error
//         }
//       },
//     }),
//   })
// })
// // TODO change these <any, void>
// // to for example <Attraction[], void>
// // then define Attraction type/interface on this file
// // same with the other apiSlice

// export const { 
//   useChangeUserLevelMutation
// } = userApiSlice;

// export default userApiSlice.reducer;