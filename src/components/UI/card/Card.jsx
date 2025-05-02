import {
   Avatar,
   CardActions,
   CardContent,
   CardHeader,
   CardMedia,
   Card as MUICard,
   Typography,
   styled,
} from '@mui/material'
import React from 'react'
import { globalTheme } from '../../../theme/globalTheme'
import { convertDateFormat } from '../../../utils/constants/formatedDate'
import { MeatBalls } from '../MeatBalls'
import { CardDescription } from './CardDescription'

// variants:
// primary, secondary, tertiary, quaternary,
// withStatusBottom, withStatusTop,

export const Card = ({
   variant = 'primary',
   list,
   meatballsOptions = [],
   handleChange,
   onGetThingById,
   ownerName,
   ownerImage,
   holiday,
   cardName,
   cardImage,
   bookerImage,
   date,
   newOrOld,
   status,
   showBottomBooker,
   showTopOwner,
   isBlock = '',
   onGetOwnerById,
   onGetBookerById,
   onClick,
   showHoliday = true,
   showBookerImage,
}) => {
   const listClassName = list && 'list'
   let bookedStatus
   if (bookerImage || status?.includes('RESERVED')) {
      bookedStatus = 'Забронирован'
   } else if (status === 'PENDING') {
      bookedStatus = 'В ожидании'
   }
   if (showBookerImage) {
      bookedStatus = status
   }

   const showOwnerOnTheTop = variant === 'tertiary' && showTopOwner

   const inputDate = date
   const formattedDate = convertDateFormat(inputDate)

   return (
      <StyledCard
         className={listClassName}
         onClick={onGetThingById}
         isblock={isBlock}
      >
         {listClassName && (
            <CardMedia component="img" image={cardImage} alt={cardName} />
         )}
         <ContentContainer
            className={`${listClassName} ${
               list && variant === 'secondary' && 'listWithoutHeader'
            }`}
         >
            {(variant === 'primary' ||
               variant === 'withStatusTop' ||
               showOwnerOnTheTop) && (
               <CardHeader
                  onClick={onClick}
                  avatar={
                     ownerImage ? (
                        <StyledAvatarIcon
                           showcursorpointer={onGetOwnerById}
                           onClick={(event) => {
                              if (onGetOwnerById) onGetOwnerById()
                              event.stopPropagation()
                           }}
                           alt={ownerName}
                           src={ownerImage}
                        />
                     ) : (
                        <StyledAvatarIcon
                           showcursorpointer={onGetOwnerById}
                           onClick={(event) => {
                              if (onGetOwnerById) onGetOwnerById()
                              event.stopPropagation()
                           }}
                           aria-label="recipe"
                        >
                           {ownerName?.charAt(0)}
                        </StyledAvatarIcon>
                     )
                  }
                  title={
                     <StyledOwnerWrapper
                        showcursorpointer={onGetOwnerById}
                        onClick={(event) => {
                           if (onGetOwnerById) onGetOwnerById()
                           event.stopPropagation()
                        }}
                        type="button"
                     >
                        {ownerName}
                     </StyledOwnerWrapper>
                  }
                  subheader={
                     (variant !== 'withStatusTop' && showHoliday && holiday) ||
                     (variant === 'withStatusTop' && list && (
                        <StyledNewOrOld
                           className={newOrOld === 'Б/У' ? 'orange' : ''}
                        >
                           {newOrOld}
                        </StyledNewOrOld>
                     ))
                  }
               />
            )}

            {variant === 'withStatusTop' && (
               <CardDescription
                  onClick={onClick}
                  text1={
                     variant === 'secondary' || variant === 'withStatusTop'
                        ? cardName
                        : holiday
                  }
                  text2={variant === 'secondary' ? holiday : !list && newOrOld}
                  newOrOld={newOrOld}
                  variant={variant}
               />
            )}

            <StyledCardContent
               isblock={isBlock}
               // onClick={() => {
               //    console.log('iofewjoefweio')
               //    if (onClick) onClick()
               //    if (onGetThingById) onGetThingById()
               // }}
            >
               {variant === 'primary' && (
                  <StyledTypography variant="h6">{cardName}</StyledTypography>
               )}
               {!listClassName && (
                  <CardMedia component="img" image={cardImage} alt={cardName} />
               )}
            </StyledCardContent>
            {variant !== 'primary' && variant !== 'withStatusTop' && (
               <CardDescription
                  onClick={onClick}
                  text1={variant === 'secondary' ? cardName : holiday}
                  text2={variant === 'secondary' ? holiday : newOrOld}
                  newOrOld={newOrOld}
                  variant={variant}
               />
            )}
            <StyledCardActions>
               <ActionsWrapper
                  className={`${
                     list && variant === 'secondary' && 'listWithoutHeader'
                  }`}
               >
                  <Date>{formattedDate}</Date>
                  {showBottomBooker && (
                     <StyledCardActionsPar1>
                        {(status === 'RESERVED' || showBookerImage) && (
                           <StyledAvatarIcon
                              alt="Фотография человека который забронировал это"
                              src={bookerImage}
                              onClick={onGetBookerById}
                           />
                        )}
                        <StyledStatus>{bookedStatus}</StyledStatus>
                     </StyledCardActionsPar1>
                  )}
               </ActionsWrapper>
               {variant !== 'quaternary' && meatballsOptions.length !== 0 && (
                  <StyledMeatBallsContainer>
                     <MeatBalls
                        handleChange={handleChange}
                        options={meatballsOptions}
                     />
                  </StyledMeatBallsContainer>
               )}
            </StyledCardActions>
         </ContentContainer>
         {isBlock && (
            <StyledBlockedCard>Это заблокированный контент!</StyledBlockedCard>
         )}
      </StyledCard>
   )
}

const StyledCardActions = styled(CardActions)({ padding: '0' })

const StyledMeatBallsContainer = styled('div')({
   position: 'relative',
   zIndex: '2',
})

const StyledStatus = styled('span')({
   fontSize: '1rem',
   fontWeight: '400',
   height: '1.5rem',
   width: '8vw',
   overflow: 'hidden',
   whiteSpace: 'nowrap',
   textOverflow: 'ellipsis',
   textAlign: 'end',
   color: '#636C84',
})

const StyledBlockedCard = styled('div')({
   color: '#ffff',
   position: 'absolute',
   background: 'rgba(10, 10, 10, 0.2)',
   height: '18.8125rem',
   width: '21.8125rem',
   display: 'flex',
   justifyContent: 'center',
   alignItems: 'center',
   top: '0',
   left: '0',
})

const StyledOwnerWrapper = styled('button')((props) => ({
   backgroundColor: 'transparent',
   border: 'none',
   cursor: props.showcursorpointer && 'pointer',
}))

const ActionsWrapper = styled('div')({
   display: 'flex',
   justifyContent: 'space-between',
   width: '-webkit-fill-available',
   '&.listWithoutHeader': {
      flexDirection: 'row-reverse',
      gap: '127px',
   },
})

const ContentContainer = styled('div')({
   display: 'grid',
   '&.listWithoutHeader': {
      display: 'flex',
   },
   flexDirection: 'column',
   gap: '12px',
   width: '100%',
   maxHeight: '18.8125rem',
})

const Date = styled('span')({
   fontSize: '0.875rem',
})

const StyledTypography = styled(Typography)({
   fontSize: '0.875rem',
   overflow: 'hidden',
   maxHeight: '3rem',
   '&.grey': {
      color: 'grey',
   },
})
const StyledCardContent = styled(CardContent)(({ isblock }) => ({
   padding: '0',
   img: {
      height: '9.5625rem',
      maxHeight: '9.5625rem',
      borderRadius: '7px',
      filter: isblock ? 'blur(1px)' : 'blur(0px)',
   },
   width: '19.8125rem',
}))
const StyledCard = styled(MUICard)(({ isblock }) => {
   return {
      cursor: 'pointer',
      width: '21.8125rem',
      padding: '15px',
      position: 'relative',
      borderRadius: '9px',
      ':hover': {
         boxShadow: '0px 0px 43px -10px rgba(209, 209, 209, 1)',
         transitionDuration: '0.6s',
         cursor: 'pointer',
      },
      maxHeight: '20rem',
      '&.list': {
         width: '33.3125rem',
         display: 'flex',
         gap: '7px',
         height: '10rem',
         img: {
            filter: isblock ? 'blur(1px)' : 'blur(0px)',
            minWidth: '30%',
            borderRadius: '7px',
         },
         padding: '15px',
      },
      '.css-185gdzj-MuiCardHeader-root': {
         padding: '0',
      },
      '.css-1d8ay1-MuiTypography-root': {
         fontSize: '0.8125rem',
         color: globalTheme.palette.secondary.green,
      },
      '.css-1qbkelo-MuiCardHeader-content': {
         display: 'flex',
         justifyContent: 'space-between',
      },
      '.css-1xpibb5-MuiTypography-root': {
         fontSize: '1rem',
         fontWeight: '500',
      },
      '.css-1t6e9jv-MuiCardActions-root': {
         display: 'flex',
         justifyContent: 'space-between',
         padding: '0',
         color: globalTheme.palette.secondary.waikawaGrey,
         '&.listWithoutHeader': {
            flexDirection: 'column',
            alignItems: 'end',
         },
      },
      '.css-1ssile9-MuiCardHeader-avatar': {
         marginRight: '10px',
      },
   }
})

const StyledAvatarIcon = styled(Avatar)((props) => {
   return {
      width: '1.25rem',
      height: '1.25rem',
      padding: props?.children && '13px',
      cursor: props.showcursorpointer && 'pointer',
   }
})

const StyledCardActionsPar1 = styled('div')({
   display: 'flex',
   alignItems: 'center',
   path: {
      color: '#595656',
   },
   fontSize: '0.875rem',
   justifyContent: 'flex-end',
   gap: '10px',
   paddingRight: '5px',
})

const StyledNewOrOld = styled('div')({
   color: globalTheme.palette.secondary.green,
   '&.orange': {
      color: globalTheme.palette.secondary.orange,
   },
})
