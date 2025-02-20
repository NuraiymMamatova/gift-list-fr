import { providerEvent } from '../../events/customEvents'

export const USER_KEY = 'GIFT-LIST_USER_KEY'
export const USER_TOKEN_KEY = 'GIFT_LIST_USER_TOKEN_KEY'

export const routes = {
   LOGIN: 'login',
   REGISTRATION: 'registration',
   FORGOTPASSWORD: 'forgot-password',
   RESETPASSWORD: 'reset-password/:email',
   ADMIN: {
      path: '/admin',
      users: {
         path: 'users',
         breadcrumb: 'Пользователи',
      },
      charity: {
         path: 'charity',
         breadcrumb: 'Благотворительность',
         headerSelectType: 'select',
      },
      charityById: {
         path: 'charity/:charityId',
         headerSelectType: 'select',
      },
      complaints: {
         path: 'complaints',
         breadcrumb: 'Жалобы',
      },
      innerComplaint: {
         path: 'complaints/:wishId',
      },
      mailing: {
         path: 'mailing',
         breadcrumb: 'Рассылка',
         buttonContent: 'Отправить рассылку',
         showActionsButton: true,
         onClick: () => {
            providerEvent({ action: 'mailingsModalOpen', payload: true })
         },
      },
      innerMailing: {
         path: 'mailing/:mailingId',
      },
      getUserById: { path: 'users/:userId' },
      getUserWishes: {
         path: 'users/:userId/wishes',
         breadcrumb: 'Список желаний',
      },
      getUserWishById: { path: 'users/:userId/wishes/:wishId' },
      getUserWish: { path: 'wish:wishId' },
      getUserHolidays: { path: 'users/:userId/holidays' },
      getUserCharities: { path: 'users/:userId/charities' },
      getCharityById: { path: 'users/:userId/charities/:charityId' },
   },
   USER: {
      path: '/user',
      feed: {
         path: 'feed',
         breadcrumb: 'Лента',
         showListActions: true,
      },
      charity: {
         path: 'charity',
         breadcrumb: 'Благотворительность',
         headerSelectType: 'select',
         buttonContent: 'Добавить подарок',
         onClick: (navigate) => navigate('charity/addCharity'),
      },
      charityById: {
         path: 'charity/:charityId',
         headerSelectType: 'select',
      },
      editCharity: {
         path: 'charity/editCharity',
         breadcrumb: 'Обновить подарок',
         headerSelectType: 'select',
         showListActions: true,
      },
      addCharity: {
         path: 'charity/addCharity',
         breadcrumb: 'Добавить подарок',
         headerSelectType: 'select',
         showListActions: true,
      },
      thingFromFeedById: {
         path: 'feed/:thingId/:thingType',
         breadcrumb: '',
      },
      bookings: {
         path: 'bookings',
         breadcrumb: 'Забронированные',
      },
      bookedWish: {
         path: 'bookedWish',
      },
      bookedWishById: {
         path: 'bookedWish/:wishId',
      },
      bookedCharity: {
         path: 'bookedCharity',
      },
      bookedCharityById: {
         path: 'bookedCharity/:charityId',
      },
      friends: {
         path: 'friends',
         breadcrumb: 'Друзья',
      },
      request: {
         path: 'requests',
      },
      getFriendById: {
         path: 'friends/:friendId',
      },
      getRequestsById: {
         path: 'friends/requests/:friendId',
      },
      userProfileById: {
         path: 'addToMyFriends/:friendId',
      },
      wishes: {
         path: 'wishes',
         showListActions: true,
      },
      wishesById: {
         path: 'friends/:ownerId/wishes/:wishId',
      },
      holidays: {
         path: 'holidays',
         showListActions: true,
      },
      charities: {
         path: 'charities',
         showListActions: true,
      },
      charitiesById: {
         path: 'charities/:charityId',
      },
      profile: {
         path: 'profile',
         breadcrumb: 'Профиль',
      },
      edit: {
         path: 'edit',
         breadcrumb: 'Рассказать о себе',
      },
      wish: {
         path: 'wish',
         showListActions: 'true',
         buttonContent: 'Добавить желание',
         breadcrumb: 'Список желаний',
         onClick: (navigate) => navigate('wish/addWish'),
      },
      addWish: {
         path: 'wish/addWish',
         breadcrumb: 'Добавление желания',
      },
      putWish: {
         path: 'wish/putWish',
         breadcrumb: 'Редактировать Желание',
      },
      getWishById: {
         path: 'wish/:wishId',
      },
      mailing: {
         path: 'mailing',
         breadcrumb: 'Рассылка',
         buttonContent: 'Отправить рассылку',
         showActionsButton: true,
         onClick: () => {
            providerEvent({ action: 'mailingsModalOpen', payload: true })
         },
      },
      innerMailing: {
         path: 'mailing/:mailingId',
      },
      'my-holidays': {
         path: 'my-holidays',
         breadcrumb: 'Mои праздники',
         buttonContent: 'Добавить праздник',
         showActionsButton: true,
         onClick: () => {
            providerEvent({ action: 'my-holidaysModalOpen', payload: true })
         },
      },
      holidayInnerPage: { path: 'my-holidays/:holidayId' },
   },
}
