import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { UpdateProfile } from '../../layout/UpdateProfile'
import { updateProfileThunk } from '../../store/profile/profileThunk'
import { routes } from '../../utils/constants'
import {
   englishCountries,
   shoeSizeObject,
} from '../../utils/constants/constants'

export const UpdateUserProfilePage = () => {
   const {
      fullName,
      country,
      dateOfBirth,
      phoneNumber,
      image,
      clothingSize,
      shoeSize,
      hobbies,
      importantToKnow,
      facebookLink,
      vkLink,
      instagramLink,
      telegramLink,
      email,
   } = useSelector((state) => state.profile.profile)
   const dispatch = useDispatch()

   const firstName = fullName?.match(/[A-Z][a-z]*/)[0]
   const lastName = fullName?.replace(firstName, '')

   const defaultValues = {
      name: firstName,
      surname: lastName,
      email,
      country: englishCountries[country],
      dateOfBirth,
      phoneNumber,
      image,
      clothingSize,
      shoeSize: shoeSizeObject[shoeSize],
      hobbies,
      importantToKnow,
      facebookLink,
      vkLink,
      instagramLink,
      telegramLink,
   }
   const navigate = useNavigate()

   const onSubmit = (values, reset) => {
      dispatch(updateProfileThunk({ values, reset }))
      navigate(`/user/${routes.USER.profile.path}`)
   }

   return (
      <div>
         <UpdateProfile
            defaultValues={defaultValues}
            functionForGetValues={onSubmit}
         />
      </div>
   )
}
