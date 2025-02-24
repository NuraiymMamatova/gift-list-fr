import { createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '../../config/axiosInstance'
import { USER_KEY, USER_TOKEN_KEY } from '../../utils/constants'
import {
   notifyTypes,
   toastWithPromise,
   toastWithoutPromise,
} from '../../utils/helpers/toast'
import { login } from './authSlice'

export const loginQuery = createAsyncThunk(
   'authorization/login',
   async (
      { userData, navigate, login, isRememberMeChecked },
      { rejectWithValue, dispatch }
   ) => {
      try {
         const response = await toastWithPromise(
            notifyTypes.NOTIFY_TYPE_ERROR_ERROR,
            notifyTypes.NOTIFY_TYPE_SUCCESS_SUCCESS,
            'Информация',
            'Вы вошли в аккаунт',
            'Ошибка',
            axiosInstance.post('/auth/login', userData)
         )

         if (isRememberMeChecked) {
            localStorage.setItem(USER_KEY, JSON.stringify(response.data))
         } else {
            sessionStorage.setItem(USER_KEY, JSON.stringify(response.data))
         }
         return dispatch(login({ data: response.data, navigate }))
      } catch (error) {
         return rejectWithValue(error)
      }
   }
)

export const registerQuery = createAsyncThunk(
   'authorization/registration',
   async ({ userData, navigate }, { rejectWithValue, dispatch }) => {
      try {
         const response = await toastWithPromise(
            notifyTypes.NOTIFY_TYPE_ERROR_ERROR,
            notifyTypes.NOTIFY_TYPE_SUCCESS_SUCCESS,
            'Информация',
            'Вы зарегистрированы',
            'Ошибка',
            axiosInstance.post('/auth/registration', userData)
         )
         localStorage.setItem(USER_KEY, JSON.stringify(response.data))
         return dispatch(login({ data: response.data, navigate }))
      } catch (error) {
         return rejectWithValue(error)
      }
   }
)

export const forgotPasswordQuery = createAsyncThunk(
   'authorization/forgot-password',
   async (email, { rejectWithValue }) => {
      try {
         const response = await toastWithPromise(
            notifyTypes.NOTIFY_TYPE_ERROR_ERROR,
            notifyTypes.NOTIFY_TYPE_SUCCESS_SUCCESS,
            'Информация',
            'На вашу почту в скорое время придет ссылка для сброса пароля',
            'Ошибка',
            axiosInstance.post(
               `/auth/forgotPasswordSendURLtoEmail?email=${email}&linkToChangePassword=http://localhost:3000/main-page/reset-password`
            )
         )
         localStorage.setItem(USER_TOKEN_KEY, response.data.message)
      } catch (error) {
         rejectWithValue(error)
      }
   }
)

export const changePasswordQuery = createAsyncThunk(
   'authorization/change-password',
   async (
      { userData, navigate, hasPassword, handleClose },
      { rejectWithValue }
   ) => {
      try {
         await toastWithPromise(
            notifyTypes.NOTIFY_TYPE_ERROR_ERROR,
            notifyTypes.NOTIFY_TYPE_SUCCESS_SUCCESS,
            'Информация',
            'Пароль успешно изменен',
            'Ошибка',
            axiosInstance.put('/auth/changePassword', userData)
         )
         if (hasPassword) handleClose()
         return navigate('/main-page/login')
      } catch (error) {
         return rejectWithValue(error)
      }
   }
)

export const authWithGoogle = createAsyncThunk(
   'sign-in-with-google',
   async (
      { navigate, isRememberMeChecked, userData },
      { rejectWithValue, dispatch }
   ) => {
      try {
         const response = await axiosInstance.post(`/auth/viaGoogle`, userData)
         toastWithoutPromise(
            notifyTypes.NOTIFY_TYPE_SUCCESS_SUCCESS,
            'Информация',
            'Вы авторизовались'
         )
         if (isRememberMeChecked) {
            localStorage.setItem(USER_KEY, JSON.stringify(response.data))
         } else {
            sessionStorage.setItem(USER_KEY, JSON.stringify(response.data))
         }
         return dispatch(
            login({
               data: response.data,
               navigate,
            })
         )
      } catch (error) {
         toastWithoutPromise(
            notifyTypes.NOTIFY_TYPE_ERROR_ERROR,
            'Ошибка',
            error.message
         )
         return rejectWithValue(error)
      }
   }
)
