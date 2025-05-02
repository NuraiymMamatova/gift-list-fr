import { styled } from '@mui/material'
import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { CancelIcon, UploadImageIcon } from '../assets'

export const UploadImage = ({
   error,
   preview = { file: '', url: '' },
   setPreview,
   setImageError,
}) => {
   const onDrop = useCallback((acceptedFiles) => {
      const file = new FileReader()
      file.onload = () => {
         setPreview({ file: acceptedFiles[0], url: file.result })
         if (setImageError) {
            setImageError(false)
         }
      }
      file.readAsDataURL(acceptedFiles[0])
   }, [])
   const { getRootProps, getInputProps } = useDropzone({
      onDrop,
   })

   return (
      <StyledContainer {...getRootProps()} className={error && 'error'}>
         <input {...getInputProps()} />
         {!preview?.url && (
            <>
               <UploadImageIcon />
               <StyledTextContent className={error && 'error'}>
                  {error
                     ? 'Выберите изображение!'
                     : 'Нажмите для добавления фотографии'}
               </StyledTextContent>
            </>
         )}
         {preview?.url && (
            <>
               <img src={preview.url} alt="test" />
               <StyledCancelIcon
                  onClick={(e) => {
                     e.stopPropagation()
                     setPreview(null)
                  }}
               />
            </>
         )}
      </StyledContainer>
   )
}

const StyledTextContent = styled('p')({
   '&.error': { color: 'red' },
})

const StyledCancelIcon = styled(CancelIcon)({
   position: 'absolute',
   top: '0',
   right: '0',
})

const StyledContainer = styled('div')({
   display: 'flex',
   flexDirection: 'column',
   alignItems: 'center',
   justifyContent: 'center',
   backgroundColor: '#F6F6F9',
   border: '1px solid #DCDCE4',
   '&.error': {
      borderColor: 'red',
      path: {
         fill: 'red',
      },
   },
   textAlign: 'center',
   gap: '20px',
   height: '27vh',
   borderRadius: '9px',
   position: 'relative',
   img: {
      objectFit: 'contain',
      width: '100%',
      height: '100%',
   },
   svg: {
      fill: '#8E8EA9',
   },
})
