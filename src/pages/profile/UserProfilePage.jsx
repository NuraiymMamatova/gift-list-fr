import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ChangePassword } from '../../components/ChangePassword'
import { LoadingPage } from '../../components/loading/LoadingPage'
import { getProfileThunk } from '../../store/profile/profileThunk'
import { routes } from '../../utils/constants'
import {
   englishCountries,
   shoeSizeObject,
} from '../../utils/constants/constants'
import { convertDateFormat } from '../../utils/helpers/constants'
import { Profile } from '../LandingPage/Profile'

export const UserProfilePage = () => {
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const { profile, error, pending } = useSelector((state) => state.profile)
   const [isEditPasswordModalOpen, setIsEditPasswordModalOpen] = useState(false)

   useEffect(() => {
      dispatch(getProfileThunk())
   }, [])

   const onEditProfile = () => {
      navigate(routes.USER.edit.path)
   }

   const toggleEditPasswordModalOpen = () =>
      setIsEditPasswordModalOpen((prev) => !prev)
   if (error) {
      if (error.includes('403')) {
         return 'Ошибка 403. Доступ запрещен.'
      }
      return error
   }
   if (pending) {
      return <LoadingPage />
   }
   return (
      <div>
         <Profile
            variant={(profile.phoneNumber && 'myProfile') || 'emptyProfile'}
            birthdate={
               profile.dateOfBirth && convertDateFormat(profile.dateOfBirth)
            }
            hasPassword={profile.hasPassword}
            clothSize={profile.clothingSize}
            email={profile.email}
            city={englishCountries[profile.country]}
            fullName={profile.fullName}
            facebook={profile.facebookLink}
            phoneNumber={profile.phoneNumber}
            importantToKnow={profile.importantToKnow}
            shoesSize={shoeSizeObject[profile.shoeSize]}
            telegram={profile.telegramLink}
            vk={profile.vkLink}
            interesAndHobbies={profile.hobbies}
            image={profile.image}
            instagram={profile.instagramLink}
            onClickFirstButton={onEditProfile}
            onClickSecondButton={toggleEditPasswordModalOpen}
         />
         {isEditPasswordModalOpen && (
            <ChangePassword
               hasPassword={profile.hasPassword}
               variant="createOrUpdate"
               handleClose={toggleEditPasswordModalOpen}
            />
         )}
      </div>
   )
}
