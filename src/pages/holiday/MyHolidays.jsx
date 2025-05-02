import { Box, styled } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { EditOrAddFormModal } from '../../components/EditOrAddFormModal'
import { Card } from '../../components/UI/card/Card'
import { providerEvent } from '../../events/customEvents'
import {
   addHolidayQuery,
   deleteHolidayById,
   getAllHolidaysByUserId,
   updateHolidayQuery,
} from '../../store/holiday/holidayThunk'
import { sendMailing } from '../../store/mailing/mailingsThunk'
import { convertDateFormat } from '../../utils/constants/formatedDate'
import { meatballsDeleteAndEditOptions } from '../../utils/constants/meatballs-options'
import { formatDate, uploadFile } from '../../utils/helpers/constants'
import { EmptyComponent } from '../LandingPage/EmptyComponent'

export const MyHolidays = () => {
   const [preview, setPreview] = useState({ file: '', url: '' })
   const navigate = useNavigate()

   const [addNewHolidayModalState, setAddNewHolidayModalState] = useState({
      isOpen: false,
      defaultValues: {},
      holidayId: 0,
   })
   const dispatch = useDispatch()
   const { holidays } = useSelector((state) => state.holiday)
   const { id } = useSelector((state) => state.authLogin)

   useEffect(() => {
      const handleModalChange = (event) => {
         if (event.detail?.action === 'my-holidaysModalOpen') {
            setAddNewHolidayModalState((prev) => ({
               ...prev,
               isOpen: event.detail?.payload,
            }))
         }
      }
      window.addEventListener('providerEvent', handleModalChange)
      dispatch(getAllHolidaysByUserId(id))
      return () =>
         window.removeEventListener('providerEvent', handleModalChange)
   }, [])

   useEffect(() => {
      providerEvent({
         action: 'showActionsButton',
         payload: Boolean(holidays.length),
      })
   }, [holidays])

   const openAndCloseHolidayModalHandler = (defaultValues, holidayId) => {
      setAddNewHolidayModalState((prevState) => ({
         isOpen: !prevState.isOpen,
         defaultValues,
         holidayId,
      }))
   }
   const onSubmit = async (values, type, holidayId) => {
      let image = preview.url
      if (preview.file) {
         const response = await uploadFile(preview.file)
         image = response
      }
      if (type === 'save') {
         dispatch(
            addHolidayQuery({
               userData: {
                  holidayName: values.holidayName,
                  holidayDate: formatDate(values.holidayDate),
                  holidayImageUrl: image,
               },
               userId: id,
            })
         )
      } else if (type === 'edit') {
         dispatch(
            updateHolidayQuery({
               holidayId,
               userData: {
                  holidayName: values.holidayName,
                  holidayDate: formatDate(values.holidayDate),
                  holidayImageUrl: image,
               },
               userId: id,
            })
         )
      } else if (type === 'mailing') {
         const mailing = {
            text: values.text,
            nameMailing: values.nameMailing,
            image,
         }
         dispatch(sendMailing(mailing))
      }

      openAndCloseHolidayModalHandler()
      setPreview('')
   }
   const onGetHolidayById = (holidayId, holidayName) => {
      providerEvent({ action: 'name', payload: holidayName })
      navigate(`${holidayId}`)
   }
   return (
      <StyledMyHolidays component="div">
         <MyHolidaysContainer component="div">
            {holidays.map((holiday) => (
               <Card
                  key={holiday.holidayId}
                  variant="tertiary"
                  holiday={holiday.holidayName}
                  date={convertDateFormat(holiday.holidayDate)}
                  cardImage={holiday.holidayImageUrl}
                  meatballsOptions={meatballsDeleteAndEditOptions}
                  onGetThingById={() =>
                     onGetHolidayById(holiday.holidayId, holiday.holidayName)
                  }
                  handleChange={(event) => {
                     switch (event.target.innerText) {
                        case 'Редактировать':
                           setPreview({
                              file: null,
                              url: holiday.holidayImageUrl,
                           })
                           openAndCloseHolidayModalHandler(
                              {
                                 holidayName: holiday.holidayName,
                                 holidayDate: holiday.holidayDate,
                              },
                              holiday.holidayId
                           )
                           break
                        default:
                           dispatch(
                              deleteHolidayById({
                                 holidayId: holiday.holidayId,
                                 userId: id,
                              })
                           )
                           break
                     }
                  }}
               />
            ))}
         </MyHolidaysContainer>
         {!holidays.length && (
            <EmptyComponent
               buttonText="Добавить праздник"
               text="Вы еще не добавили праздника"
               buttonOnClick={openAndCloseHolidayModalHandler}
            />
         )}
         {addNewHolidayModalState.isOpen && (
            <EditOrAddFormModal
               preview={preview}
               setPreview={setPreview}
               onSubmit={onSubmit}
               addNewHolidayModalState={addNewHolidayModalState}
               closeHandler={openAndCloseHolidayModalHandler}
            />
         )}
      </StyledMyHolidays>
   )
}

const StyledMyHolidays = styled(Box)({
   backgroundColor: '#F7F8FA',
})

const MyHolidaysContainer = styled(Box)({
   display: 'flex',
   flexWrap: 'wrap',
   gap: '20px',
})
