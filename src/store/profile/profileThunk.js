import { createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '../../config/axiosInstance'
import { russianCountries, shoeSizeEnum } from '../../utils/constants/constants'
import { formatDate } from '../../utils/helpers/constants'
import {
   notifyTypes,
   toastWithPromise,
   toastWithoutPromise,
} from '../../utils/helpers/toast'
import { changeUserData } from '../auth/authSlice'

export const getProfileThunk = createAsyncThunk(
   'profile/getProfileThunk',
   async (_, { rejectWithValue }) => {
      try {
         const response = await axiosInstance.get('/user')
         return response.data
      } catch (error) {
         toastWithoutPromise(
            notifyTypes.NOTIFY_TYPE_ERROR_ERROR,
            'Ошибка',
            error.message
         )
         return rejectWithValue(error.message)
      }
   }
)

export const updateProfileThunk = createAsyncThunk(
   'profile/updateProfileThunk',
   async ({ values, reset }, { rejectWithValue, dispatch }) => {
      try {
         const {
            clothingSize,
            country,
            dateofbirth,
            facebookLink,
            hobbies,
            importantToKnow,
            instagramLink,
            name,
            phoneNumber,
            image,
            shoeSize,
            surname,
            telegramLink,
            vkLink,
         } = values

         const updatedProfile = {
            fullName: `${name} ${surname}`,
            phoneNumber,
         }

         if (country) updatedProfile.country = russianCountries[country]
         if (dateofbirth) updatedProfile.dateOfBirth = formatDate(dateofbirth)
         if (image) updatedProfile.image = image
         if (clothingSize) updatedProfile.clothingSize = clothingSize
         if (shoeSize) updatedProfile.shoeSize = shoeSizeEnum[shoeSize]
         if (hobbies) updatedProfile.hobbies = hobbies
         if (importantToKnow) updatedProfile.importantToKnow = importantToKnow
         if (facebookLink) updatedProfile.facebookLink = facebookLink
         if (vkLink) updatedProfile.vkLink = vkLink
         if (instagramLink) updatedProfile.instagramLink = instagramLink
         if (telegramLink) updatedProfile.telegramLink = telegramLink

         const response = await toastWithPromise(
            notifyTypes.NOTIFY_TYPE_ERROR_WARNING,
            notifyTypes.NOTIFY_TYPE_SUCCESS_INFO,
            'Успешно',
            'Профиль успешно обновлен.',
            'Ошибка',
            axiosInstance.put('/user/update', updatedProfile)
         )
         dispatch(getProfileThunk())
         dispatch(changeUserData({ fullName: `${name} ${surname}`, image }))
         reset()
         return response.data
      } catch (error) {
         return rejectWithValue(error)
      }
   }
)

export const changePasswordThunk = createAsyncThunk(
   '/profile/changePasswordThunk',
   async ({ userData, onClose }, { rejectWithValue }) => {
      try {
         await toastWithPromise(
            notifyTypes.NOTIFY_TYPE_ERROR_WARNING,
            notifyTypes.NOTIFY_TYPE_SUCCESS_INFO,
            'Успешно',
            'Пароль обновлен',
            'Ошибка',
            axiosInstance.put('/user/changePassword', userData)
         )
         onClose()
      } catch (error) {
         rejectWithValue(error)
      }
   }
)

export const getProfileByUserId = createAsyncThunk(
   'user/friends/:friendId',
   async (friendId, { rejectWithValue }) => {
      try {
         const response = await axiosInstance.get(`/user/${friendId}`)
         const result = response.data

         return result
      } catch (error) {
         toastWithoutPromise(
            notifyTypes.NOTIFY_TYPE_ERROR_ERROR,
            'Ошибка!',
            error.message
         )
         return rejectWithValue(error)
      }
   }
)
