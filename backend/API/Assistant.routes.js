import express from 'express'
import assistantCtrl from './Assistant.controllers.js'
import authenticator from '../Middlewares/Assistant.middleware.js'
import multer from 'multer'
const upload = multer({ storage: multer.memoryStorage()})
const router = express.Router()

router.post('/are-user-details-filled',authenticator.TokenAuthenticator, assistantCtrl.areUserDetailsFilled)

router.post('/add-new-user',authenticator.TokenAuthenticator, assistantCtrl.addNewUser)

router.post('/update-user-details',authenticator.TokenAuthenticator, assistantCtrl.updateUserDetails)

router.post('/get-user-appointment',authenticator.TokenAuthenticator, assistantCtrl.get_user_Appointment)

router.post('/set-appointment',authenticator.TokenAuthenticator, assistantCtrl.setAppointment)

router.post('/change-status',authenticator.TokenAuthenticator, assistantCtrl.changeStatus)

router.post('/delete-appointment',authenticator.TokenAuthenticator, assistantCtrl.deleteAppointment)

router.get('/get-users',authenticator.TokenAuthenticator, assistantCtrl.getUsers)

router.get('/get-profile',authenticator.TokenAuthenticator, assistantCtrl.getProfileByUserId)

router.post('/update-user-profile',authenticator.TokenAuthenticator, assistantCtrl.updateUserProfile)

router.post('/get-pending-cancelled-appointments',authenticator.TokenAuthenticator, assistantCtrl.getPendingCancelledAppointments)

router.post('/update-profile-photo',authenticator.TokenAuthenticator, upload.single('image'),assistantCtrl.updateProfilePhoto)


export default router