import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Typography, styled } from '@mui/material'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {
   CloseModalIcon,
   ContinueWithGoogle,
   EyeClose,
   EyeOpen,
} from '../assets'
import { authWithGoogle, registerQuery } from '../store/auth/authThunk'
import { routes } from '../utils/constants'
import { signUpValidationSchema } from '../utils/helpers/auth-validations'
import { Modal } from './Modal'
import { Button } from './UI/Button'
import { Checkbox } from './UI/Checkbox'
import { Input } from './UI/input/Input'

export const SignUp = () => {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm({
      resolver: yupResolver(signUpValidationSchema),
   })

   const navigate = useNavigate()

   const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(true)

   const closeModalHandler = () => {
      navigate('/main-page')
      setIsSignUpModalOpen(false)
   }

   const [isAgreeState, setIsAgreeState] = useState(false)

   const isAgreeChangeStateHandler = () => {
      setIsAgreeState((prevState) => !prevState)
   }

   const dispatch = useDispatch()

   const onSubmit = (values) => {
      dispatch(
         registerQuery({
            userData: {
               fullName: `${values.firstName} ${values.lastName}`,
               email: values.email,
               password: values.password,
               isAgree: isAgreeState,
            },
            navigate,
         })
      )
   }
   // passwords state

   const [
      visibleAndInvisiblePasswordsState,
      setVisibleAndInvisiblePassworsdState,
   ] = useState({ password: false, confirmPassword: false })

   const changePasswordVisibleInvisibleStateHandler = (type) => {
      setVisibleAndInvisiblePassworsdState((prevState) => {
         const newState = {
            ...prevState,
            [type]: !prevState[type],
         }
         return newState
      })
   }
   const onSignInWithGoogleHandler = useGoogleLogin({
      onSuccess: async (tokenResponse) => {
         const userInfo = await axios.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            {
               headers: {
                  Authorization: `Bearer ${tokenResponse.access_token}`,
               },
            }
         )
         const result = userInfo.data
         dispatch(
            authWithGoogle({
               navigate,
               userData: {
                  email: result.email,
                  fullName: result.name,
                  picture: result.picture,
               },
            })
         )
         // contains name, email & googleId(sub)
      },
   })
   return (
      <Modal isOpen={isSignUpModalOpen} handleClose={closeModalHandler}>
         <MainContainer component="div">
            <SignUpForm component="form" onSubmit={handleSubmit(onSubmit)}>
               <FormTitleAndCloseIcon>
                  <FormTitle variant="h4">Регистрация</FormTitle>
                  <StyledCloseModalIcon onClick={closeModalHandler} />
               </FormTitleAndCloseIcon>
               <StyledInput
                  placeholder="Имя"
                  {...register('firstName')}
                  helperText={errors.firstName?.message}
                  error={Boolean(errors.firstName)}
               />
               <StyledInput
                  placeholder="Фамилия"
                  {...register('lastName')}
                  helperText={errors.lastName?.message}
                  error={Boolean(errors.lastName)}
               />
               <StyledInput
                  placeholder="Email"
                  {...register('email')}
                  helperText={errors.email?.message}
                  error={Boolean(errors.email)}
               />
               <StyledInput
                  placeholder="password"
                  type={
                     visibleAndInvisiblePasswordsState.password
                        ? 'text'
                        : 'password'
                  }
                  {...register('password')}
                  helperText={errors.password?.message}
                  error={Boolean(errors.password)}
                  InputProps={{
                     endAdornment:
                        visibleAndInvisiblePasswordsState.password ? (
                           <StyledOpenedEye
                              onClick={() =>
                                 changePasswordVisibleInvisibleStateHandler(
                                    'password'
                                 )
                              }
                           />
                        ) : (
                           <StyledClosedEye
                              onClick={() =>
                                 changePasswordVisibleInvisibleStateHandler(
                                    'password'
                                 )
                              }
                           />
                        ),
                  }}
               />
               <StyledInput
                  placeholder="Потдвердите пароль"
                  type={
                     visibleAndInvisiblePasswordsState.confirmPassword
                        ? 'text'
                        : 'password'
                  }
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
               <Checkbox
                  onChange={isAgreeChangeStateHandler}
                  labelTitle="Подписаться на рассылку"
               />
               <SignInButton onClick={handleSubmit(onSubmit)} variant="primary">
                  Создать аккаунт
               </SignInButton>
               <OrContainer component="div">
                  <Line component="div" />
                  <p>или</p>
                  <Line component="div" />
               </OrContainer>
               <ContinueWithGoogleButton onClick={onSignInWithGoogleHandler}>
                  <ContinueWithGoogle />
                  Продолжить с Google
               </ContinueWithGoogleButton>
               <SignUpLink>
                  Уже имеете существующий аккаунт?
                  <Link to={`/main-page/${routes.LOGIN}`}> Войти</Link>
               </SignUpLink>
            </SignUpForm>
         </MainContainer>
      </Modal>
   )
}

const MainContainer = styled(Box)({
   display: 'flex',
   justifyContent: 'center',
})

const SignUpForm = styled(Box)({
   display: 'flex',
   flexDirection: 'column',
   gap: '1rem',
   width: '30.125rem',
})

const StyledInput = styled(Input)({
   padding: '3px',
})

const FormTitleAndCloseIcon = styled(Box)({
   display: 'flex',
   justifyContent: 'space-between',
   alignItems: 'center',
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

const FormTitle = styled(Typography)({
   fontWeight: '500',
   fontSize: '1.5rem',
})

const SignUpLink = styled(Typography)({
   textAlign: 'center',
   a: {
      textDecoration: 'none',
      color: '#3772FF',
   },
})

const SignInButton = styled(Button)({
   display: 'block',
   width: '100%',
   border: 'none',
   ':hover': {
      border: 'none',
   },
})
const ContinueWithGoogleButton = styled(Button)({
   display: 'flex',
   width: '100%',
   color: 'black',
   background: '#F1F1F1',
   border: 'none',
   gap: '1.313rem',
   ':hover': {
      border: 'none',
   },
})
const OrContainer = styled(Box)({
   display: 'flex',
   justifyContent: 'center',
   alignItems: 'center',
   gap: '1.313rem',
})
const Line = styled(Box)({
   border: '1px solid #F1F1F1',
   height: '0px',
   width: '10.875rem',
})
