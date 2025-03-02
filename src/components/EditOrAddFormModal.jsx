import { Box, Typography, styled } from '@mui/material'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { isValidDateFormat } from '../utils/helpers/constants'
import { DatePicker } from './DatePicker'
import { Modal } from './Modal'
import { Button } from './UI/Button'
import { Input } from './UI/input/Input'
import { UploadImage } from './UploadImage'

export const EditOrAddFormModal = ({
   preview,
   onSubmit,
   setPreview,
   addNewHolidayModalState,
   closeHandler,
   variant = '',
}) => {
   const { register, handleSubmit, control, getValues } = useForm({
      defaultValues: {
         ...addNewHolidayModalState.defaultValues,
         holidayDate: addNewHolidayModalState.defaultValues?.holidayDate
            ? dayjs(addNewHolidayModalState.defaultValues.holidayDate)
            : null,
      },
   })

   const handleClose = () => {
      closeHandler()
      setPreview('')
   }

   const initialDatePickerValues = {
      emptyErrorMessage: '',
      invalidErrorMessage: '',
   }

   const [datePickerError, setDatePickerError] = useState(
      initialDatePickerValues
   )
   const onError = (error) => {
      let errorMessage = null
      if (error === 'invalidDate') {
         errorMessage = 'Неправильная дата'
      }
      setDatePickerError((prev) => ({
         ...prev,
         invalidErrorMessage: errorMessage,
      }))
   }

   const datePickerHandleChange = (value) => {
      const newHolidayDate = dayjs(value)
      const todayDate = new Date()

      const formattedDate = newHolidayDate.format('DD-MM-YYYY')
      if (isValidDateFormat(formattedDate)) {
         setDatePickerError(initialDatePickerValues)
      }
      if (newHolidayDate.year() < todayDate.getFullYear()) {
         setDatePickerError((prev) => ({
            ...prev,
            invalidErrorMessage: 'Этот год уже не наступит',
         }))
      } else if (
         newHolidayDate.year() === todayDate.getFullYear() &&
         newHolidayDate.date() < todayDate.getDate()
      ) {
         setDatePickerError((prev) => ({
            ...prev,
            invalidErrorMessage: 'Этот день уже прошел',
         }))
      } else if (
         newHolidayDate.year() === todayDate.getFullYear() &&
         newHolidayDate.month() + 1 < todayDate.getMonth() + 1
      ) {
         setDatePickerError((prev) => ({
            ...prev,
            invalidErrorMessage: ' Этот месяц уже прошел',
         }))
      }
   }
   let type
   if (variant) {
      type = 'mailing'
   } else {
      type = addNewHolidayModalState.holidayId ? 'edit' : 'save'
   }
   return (
      <Modal
         handleClose={handleClose}
         isOpen={addNewHolidayModalState.isOpen}
         padding="20px"
      >
         <ModalContainer>
            <StyledForm
               component="form"
               onSubmit={handleSubmit((values) =>
                  onSubmit(values, type, addNewHolidayModalState.holidayId)
               )}
            >
               <StyledAddHolidayTitle variant="h1">
                  {variant ? 'Создание рассылки' : 'Добавление праздника'}
               </StyledAddHolidayTitle>
               <StyledUploadImageWrapper>
                  <UploadImage setPreview={setPreview} preview={preview} />
               </StyledUploadImageWrapper>
               <Input
                  type="text"
                  {...register(variant ? 'nameMailing' : 'holidayName')}
                  labelText={variant ? 'Тема' : 'Название праздника'}
                  placeholder={
                     variant
                        ? 'Введите тему рассылки'
                        : 'Введите название праздника'
                  }
               />
               {variant ? (
                  <Input
                     type="text"
                     {...register('text')}
                     labelText="Текст рассылки"
                     placeholder="Введите текст рассылки"
                  />
               ) : (
                  <DatePicker
                     name="holidayDate"
                     label="Дата праздника"
                     placeholder="Укажите дату праздника"
                     control={control}
                     onError={onError}
                     errorMessage={
                        datePickerError.invalidErrorMessage ||
                        datePickerError.emptyErrorMessage
                     }
                     datePickerHandleChange={datePickerHandleChange}
                  />
               )}
               <AddAndCancelButtonsContainer>
                  <StyledHolidayButton variant="outlined" onClick={handleClose}>
                     Отмена
                  </StyledHolidayButton>
                  <StyledHolidayButton
                     onClick={() => {
                        const { holidayDate } = getValues()
                        let errorMessage = null
                        if (!holidayDate) {
                           errorMessage = 'Укажите дату праздника!'
                        }
                        setDatePickerError((prev) => ({
                           ...prev,
                           emptyErrorMessage: errorMessage,
                        }))
                     }}
                     variant="primary"
                     type="submit"
                  >
                     {variant ? 'Отправить' : 'Добавить'}
                  </StyledHolidayButton>
               </AddAndCancelButtonsContainer>
            </StyledForm>
         </ModalContainer>
      </Modal>
   )
}

const StyledAddHolidayTitle = styled(Typography)({
   fontSize: '1.5rem',
   fontWeight: '500',
   textAlign: 'center',
})

const ModalContainer = styled(Box)({
   width: '30rem',
   display: 'flex',
   flexDirection: 'column',
   gap: '40px',
})

const StyledForm = styled(Box)({
   display: 'flex',
   flexDirection: 'column',
   gap: '30px',
})

const AddAndCancelButtonsContainer = styled(Box)({
   display: 'flex',
   justifyContent: 'space-between',
})

const StyledHolidayButton = styled(Button)({
   width: '48%',
   textAlign: 'center',
})

const StyledUploadImageWrapper = styled('div')({
   alignSelf: 'center',
   height: '13.563rem',
   width: '13.563rem',
   '& .css-1vlo6bj': {
      height: '100%',
   },
})
