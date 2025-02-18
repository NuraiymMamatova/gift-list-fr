import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Typography, styled } from '@mui/material'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
   CloseModalIcon,
   ContinueWithGoogle,
   EyeClose,
   EyeOpen,
} from '../assets'
import { login } from '../store/auth/authSlice'
import { authWithGoogle, loginQuery } from '../store/auth/authThunk'
import { USER_KEY, routes } from '../utils/constants'
import { signInValidationSchema } from '../utils/helpers/auth-validations'
import { Modal } from './Modal'
import { Button } from './UI/Button'
import { Checkbox } from './UI/Checkbox'
import { Input } from './UI/input/Input'

export const SignIn = () => {
   const navigate = useNavigate()
   const [isSignInModalOpen, setIsSignInModalOpen] = useState(true)
   const closeModalHandler = () => {
      navigate('/main-page')
      setIsSignInModalOpen(false)
   }

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm({
      resolver: yupResolver(signInValidationSchema),
   })
   const [isRememberMeChecked, setIsRememberMeChecked] = useState(false)
   const params = useParams()

   const rememberMeCheckedHandler = () => {
      setIsRememberMeChecked((prevState) => !prevState)
   }

   const dispatch = useDispatch()

   const onSubmit = (values) => {
      dispatch(
         loginQuery({
            userData: values,
            navigate,
            login,
            isRememberMeChecked,
         })
      )
   }

   useEffect(() => {
      const user =
         JSON.parse(localStorage.getItem(USER_KEY)) ||
         JSON.parse(sessionStorage.getItem(USER_KEY))
      if (user !== null) {
         navigate(routes.USER[params['*']])
      }
   }, [dispatch])

   // password state

   const [
      visibleAndInvisiblePasswordState,
      setVisibleAndInvisiblePasswordState,
   ] = useState(false)

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
               isRememberMeChecked,
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

   const changePasswordVisibleInvisibleStateHandler = () => {
      setVisibleAndInvisiblePasswordState((prevState) => !prevState)
   }

   return (
      <Modal
         isOpen={isSignInModalOpen}
         handleClose={closeModalHandler}
         padding="30px"
      >
         <MainContainer component="div">
            <SignInForm onSubmit={handleSubmit(onSubmit)}>
               <FormTitleAndCloseIcon>
                  <FormTitle variant="h4">Вход</FormTitle>
                  <StyledCloseModalIcon onClick={closeModalHandler} />
               </FormTitleAndCloseIcon>
               <SignInInput
                  placeholder="Email"
                  {...register('email')}
                  helperText={errors.email?.message}
                  error={Boolean(errors.email)}
               />
               <SignInInput
                  type={visibleAndInvisiblePasswordState ? 'text' : 'password'}
                  placeholder="Пароль"
                  {...register('password')}
                  InputProps={{
                     endAdornment: visibleAndInvisiblePasswordState ? (
                        <StyledOpenedEye
                           onClick={changePasswordVisibleInvisibleStateHandler}
                        />
                     ) : (
                        <StyledClosedEye
                           onClick={changePasswordVisibleInvisibleStateHandler}
                        />
                     ),
                  }}
                  helperText={errors.password?.message}
                  error={Boolean(errors.password)}
               />
               <StyledCheckbox
                  onChange={rememberMeCheckedHandler}
                  labelTitle="Запомнить меня"
               />
               <SignInButton variant="primary" type="submit">
                  Войти
               </SignInButton>
               <ForgotPasswordLink to={`/main-page/${routes.FORGOTPASSWORD}`}>
                  Забыли пароль?
               </ForgotPasswordLink>
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
                  Нет аккаунта?
                  <Link to={`/main-page/${routes.REGISTRATION}`}>
                     Зарегистрироваться
                  </Link>
               </SignUpLink>
            </SignInForm>
         </MainContainer>
      </Modal>
   )
}

const MainContainer = styled(Box)({
   display: 'flex',
   justifyContent: 'center',
})

const SignInForm = styled('form')({
   display: 'flex',
   flexDirection: 'column',
   gap: '1rem',
   width: '30.125rem',
})

const SignInButton = styled(Button)({
   display: 'block',
   width: '100%',
   border: 'none',
   ':hover': {
      border: 'none',
   },
})

const StyledCheckbox = styled(Checkbox)({
   width: '10.5rem',
})

const SignInInput = styled(Input)({
   padding: '0',
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

const ForgotPasswordLink = styled(Link)({
   color: '#3772FF',
   textDecoration: 'none',
   textAlign: 'center',
   display: 'block',
})

const SignUpLink = styled(Typography)({
   textAlign: 'center',
   a: {
      textDecoration: 'none',
      color: '#3772FF',
   },
})

const FormTitle = styled(Typography)({
   fontWeight: '500',
   fontSize: '1.5rem',
})

const FormTitleAndCloseIcon = styled(Box)({
   display: 'flex',
   justifyContent: 'space-between',
   alignItems: 'center',
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
