import { createSlice } from '@reduxjs/toolkit'
import { USER_KEY, routes } from '../../utils/constants'

const initialState = {
   id: null,
   isAuth: null,
   email: null,
   token: null,
   role: null,
   fullName: null,
   image: '',
}

export const authSlice = createSlice({
   name: 'authLogin',
   initialState,
   reducers: {
      login: (state, { payload: { data, navigate } }) => {
         const newState = state
         newState.email = data.email
         newState.role = data.role
         newState.token = data.token
         newState.id = data.id
         newState.fullName = data.fullName
         newState.isAuth = true
         newState.image = data.image
         navigate(routes[data.role].path)
         return newState
      },
      logout: () => {
         const newState = initialState
         localStorage.removeItem(USER_KEY)
         sessionStorage.removeItem(USER_KEY)
         return newState
      },
      changeUserData: (state, { payload }) => {
         const newUserData = {
            email: state.email,
            fullName: payload.fullName,
            id: state.id,
            image: payload.image,
            role: state.role,
            token: state.token,
         }
         if (localStorage.getItem(USER_KEY)) localStorage.setItem(newUserData)
         if (sessionStorage.getItem(USER_KEY))
            sessionStorage.setItem(newUserData)
         return {
            ...state,
            image: payload.image,
            fullName: payload.fullName,
         }
      },
   },
})

export const { login, logout, changeUserData } = authSlice.actions
