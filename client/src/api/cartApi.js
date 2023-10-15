import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const cartApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:10000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = JSON.parse(localStorage.getItem('data'))?.token
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    }
  }),
  endpoints: (builder) => ({

    addOrders: builder.mutation({
      query: (body) => ({
        url: '/cart/orders',
        method: 'POST',
        body
      })
    }),
    getOrders: builder.mutation({
      query: () => ({
        url: '/cart/orders/get',
        method: 'GET'
      })
    })

  })
})

export const {

  useAddOrdersMutation,
  useGetOrdersMutation
} = cartApi
