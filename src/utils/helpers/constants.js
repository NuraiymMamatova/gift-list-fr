import axios from 'axios'
import dayjs from 'dayjs'
import {
   Aida,
   Askar,
   DeleteOptionsIcon,
   EditOptionsIcon,
   Ellipse,
   SamatOkenov,
} from '../../assets'
import { notifyTypes, toastWithoutPromise } from './toast'

export const notifications = [
   {
      name: 'Самат Окенов',
      id: '1',
      image: SamatOkenov,
      description: ' добавил желаемый подарок',
      date: '25.05.2022',
   },
   {
      name: 'Название подарка ',
      id: '2',
      image: Ellipse,
      description: ' было забронировано анонимным пользователем',
      date: '25.05.2022',
   },
   {
      name: 'Название подарка',
      id: '3',
      image: Aida,
      description: ' было забронировано Аида Мамытбек',
      date: '25.05.2022',
   },
   {
      name: 'Аскар Оморов ',
      id: '4',
      image: Askar,
      description: 'отправил запрос в друзья',
      date: '25.05.2022',
   },
   {
      name: 'Аскар Оморов ',
      id: '5',
      image: Askar,
      description: 'отправил запрос в друзья',
      date: '25.05.2022',
   },
   {
      name: 'Аскар Оморов ',
      id: '6',
      image: Askar,
      description: 'отправил запрос в друзья',
      date: '25.05.2022',
   },
]

export const wishOptions = [
   {
      title: 'Редактировать',
      icon: <EditOptionsIcon />,
   },
   {
      title: 'Удалить',
      icon: <DeleteOptionsIcon />,
   },
]

export const isValidDateFormat = (formattedDate) => {
   const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/
   return dateRegex.test(formattedDate)
}

export const formatDate = (date) => {
   return dayjs(date).format('YYYY-MM-DD')
}

export const uploadFile = async (file) => {
   try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append(
         'upload_preset',
         process.env.REACT_APP_CLOUDINARY_PRESET_NAME
      )
      formData.append('api_key', process.env.REACT_APP_CLOUDINARY_API_KEY)
      const result = await axios.post(
         `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`,
         formData
      )
      return result.data?.url
   } catch (error) {
      toastWithoutPromise(
         notifyTypes.NOTIFY_TYPE_ERROR_ERROR,
         'Ошибка при загрузке файла',
         error
      )
      return error
   }
}

export function convertDateFormat(inputDate) {
   const dateParts = inputDate.split('-')

   const originalDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2])

   const day = originalDate.getDate()
   const month = originalDate.getMonth() + 1
   const year = originalDate.getFullYear()

   const formattedDate = `${day < 10 ? '0' : ''}${day}.${
      month < 10 ? '0' : ''
   }${month}.${year}`

   return formattedDate
}

export function changeText(txt, maxlength) {
   if (txt.length > maxlength) return `${txt.slice(0, maxlength - 3)}...`
   return txt
}

export function serializeObjectToQueryParams(obj) {
   const queryParams = []
   Object.entries(obj).forEach(([key, value]) => {
      if (value) {
         const value = obj[key]
         if (value !== undefined) {
            queryParams.push(
               `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
            )
         }
      }
   })
   return queryParams.join('&')
}

export function extractNumberFromMessage(message) {
   const match = message.match(/\d+/)
   return match ? parseInt(match[0], 10) : null
}
