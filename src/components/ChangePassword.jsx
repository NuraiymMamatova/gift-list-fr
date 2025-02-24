import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Typography, styled } from '@mui/material'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { CloseModalIcon, EyeClose, EyeOpen } from '../assets'
import { changePasswordQuery } from '../store/auth/authThunk'
import {
   changePasswordValidationSchema,
   resetPasswordValidationSchema,
} from '../utils/helpers/reset-password-validation'
import { Modal } from './Modal'
import { Button } from './UI/Button'
import { Input } from './UI/input/Input'

export const ChangePassword = ({ variant, handleClose }) => {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm({
      resolver: yupResolver(
         variant
            ? changePasswordValidationSchema
            : resetPasswordValidationSchema
      ),
   })

   const { email } = useParams()

   const dispatch = useDispatch()

   const navigate = useNavigate()

   const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
      useState(true)

   const closeModalHandler = () => {
      if (!variant) {
         navigate('/main-page')
      }
      setIsResetPasswordModalOpen(false)
      if (handleClose) handleClose()
   }

   const emailFromStorage = useSelector((state) => state.authLogin.email)

   const onSubmit = (value) => {
      if (!variant) {
         dispatch(
            changePasswordQuery({
               userData: {
                  newPassword: value.newPassword,
                  email: email || emailFromStorage,
                  hasPassword: !email,
               },
               navigate,
               handleClose,
            })
         )
      } else {
         dispatch(
            changePasswordQuery({
               userData: {
                  oldPassword: value.oldPassword,
                  newPassword: value.newPassword,
                  email: emailFromStorage,
                  hasPassword: variant,
               },
               onClose: closeModalHandler,
            })
         )
      }
   }

   // password state

   const [
      visibleAndInvisiblePasswordsState,
      setVisibleAndInvisiblePasswordsState,
   ] = useState({
      oldPassword: false,
      confirmPassword: false,
      newPassword: false,
   })

   const changePasswordVisibleInvisibleStateHandler = (type) => {
      setVisibleAndInvisiblePasswordsState((prevState) => {
         const newState = {
            ...prevState,
            [type]: !prevState[type],
         }
         return newState
      })
   }

   return (
      <Modal handleClose={closeModalHandler} isOpen={isResetPasswordModalOpen}>
         <MainContainer component="div">
            <ResetPasswordForm
               component="form"
               onSubmit={handleSubmit(onSubmit)}
            >
               <FormTitleAndCloseIcon>
                  <FormTitle variant="h4">Сыр сөздү өзгөртүү</FormTitle>
                  <StyledCloseModalIcon onClick={closeModalHandler} />
               </FormTitleAndCloseIcon>
               {variant && (
                  <Input
                     type={
                        visibleAndInvisiblePasswordsState.oldPassword
                           ? 'text'
                           : 'password'
                     }
                     placeholder="Эски сыр сөзүңүздү киргизиңиз                                                                                                            "
                     {...register('oldPassword')}
                     helperText={errors.oldPassword?.message}
                     error={Boolean(errors.oldPassword)}
                     InputProps={{
                        endAdornment:
                           visibleAndInvisiblePasswordsState.oldPassword ? (
                              <StyledOpenedEye
                                 onClick={() =>
                                    changePasswordVisibleInvisibleStateHandler(
                                       'oldPassword'
                                    )
                                 }
                              />
                           ) : (
                              <StyledClosedEye
                                 onClick={() =>
                                    changePasswordVisibleInvisibleStateHandler(
                                       'oldPassword'
                                    )
                                 }
                              />
                           ),
                     }}
                  />
               )}
               <Input
                  type={
                     visibleAndInvisiblePasswordsState.newPassword
                        ? 'text'
                        : 'password'
                  }
                  placeholder="Жаңы сыр сөзүңүздү киргизиңиз"
                  {...register('newPassword')}
                  helperText={errors.newPassword?.message}
                  error={Boolean(errors.newPassword)}
                  InputProps={{
                     endAdornment:
                        visibleAndInvisiblePasswordsState.newPassword ? (
                           <StyledOpenedEye
                              onClick={() =>
                                 changePasswordVisibleInvisibleStateHandler(
                                    'newPassword'
                                 )
                              }
                           />
                        ) : (
                           <StyledClosedEye
                              onClick={() =>
                                 changePasswordVisibleInvisibleStateHandler(
                                    'newPassword'
                                 )
                              }
                           />
                        ),
                  }}
               />
               <Input
                  type={
                     visibleAndInvisiblePasswordsState.confirmPassword
                        ? 'text'
                        : 'password'
                  }
                  placeholder="Жаңы сыр сөзүңүздү кайталап киргизиңиз"
                  {...register('confirmPassword')}
                  helperText={errors.confirmPassword?.message}
                  error={Boolean(errors.confirmPassword)}
                  InputProps={{
                     endAdornment:
                        visibleAndInvisiblePasswordsState.confirmPassword ? (
                           <StyledOpenedEye
                              onClick={() =>
                                 changePasswordVisibleInvisibleStateHandler(
                                    'confirmPassword'
                                 )
                              }
                           />
                        ) : (
                           <StyledClosedEye
                              onClick={() =>
                                 changePasswordVisibleInvisibleStateHandler(
                                    'confirmPassword'
                                 )
                              }
                           />
                        ),
                  }}
               />
               <StyledConfirmButton variant="primary" type="submit">
                  Тастыктоо
               </StyledConfirmButton>
            </ResetPasswordForm>
         </MainContainer>
      </Modal>
   )
}

const MainContainer = styled(Box)({
   display: 'flex',
   justifyContent: 'center',
})

const StyledConfirmButton = styled(Button)({
   marginTop: '0.5rem',
})

const ResetPasswordForm = styled(Box)({
   display: 'flex',
   flexDirection: 'column',
   gap: '1rem',
   width: '30.125rem',
})

const StyledOpenedEye = styled(EyeOpen)({
   cursor: 'pointer',
})

const StyledClosedEye = styled(EyeClose)({
   cursor: 'pointer',
})

const StyledCloseModalIcon = styled(CloseModalIcon)({
   cursor: 'pointer',
})

const FormTitleAndCloseIcon = styled(Box)({
   display: 'flex',
   justifyContent: 'space-between',
   alignItems: 'center',
   marginBottom: '1rem',
})

const FormTitle = styled(Typography)({
   fontWeight: '500',
   fontSize: '1.5rem',
})
