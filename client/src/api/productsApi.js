import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:10000/api' }),
  endpoints: (builder) => ({
      //GET method by default
    getProducts: builder.query({
      query: () => '/products'
    }),
    addProducts: builder.mutation({
      //specifying "GET"
      query: (body) => ({
        url: '/products/add',
        method: 'POST',
        body
      })
    }),
    deleteProduct: builder.mutation({
      query: (body) => ({
        url: `/products/delete/`,
        method: 'POST',
        body
      })
    })
  })
})

export const {
  useGetProductsQuery,
  useAddProductsMutation,
  useDeleteProductMutation
} = productsApi
