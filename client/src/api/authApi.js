import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

//login & register
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:10000/api/' }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: 'login',
        method: 'POST',
        body
      })
    }),
    registerUser: builder.mutation({
      query: (body) => ({
        url: 'registration',
        method: 'POST',
        body
      })
    })

  })
})

//function for requiest of registration and login-in (mutations on server)
export const {
  useLoginMutation,
  useRegisterUserMutation
} = authApi
