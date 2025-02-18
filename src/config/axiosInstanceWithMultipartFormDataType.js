import axios from 'axios'
import { store } from '../store'
import { logout } from '../store/auth/authSlice'

const headers = {
   'Content-type': 'multipart/form-data',
}

export const axiosInstanceMultiPartFormData = axios.create({
   baseURL: process.env.REACT_APP_BASE_SERVER_URL,
   headers,
})

axiosInstanceMultiPartFormData.interceptors.request.use((config) => {
   const updateConfig = { ...config }
   const { token } = store.getState().authLogin
   if (token) {
      updateConfig.headers.Authorization = `Bearer ${token}`
   }
   return updateConfig
})

axiosInstanceMultiPartFormData.interceptors.response.use(
   (response) => {
      return Promise.resolve(response)
   },
   (error) => {
      if (error.response.status === 401) {
         store.dispatch(logout())
      }
      return Promise.reject(error.response.data.message || error.message)
   }
)
