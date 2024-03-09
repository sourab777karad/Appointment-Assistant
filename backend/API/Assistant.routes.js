import express from 'express'
import assistantCtrl from './Assistant.controllers.js'
import authenticator from '../Middlewares/Assistant.middleware.js'
import multer from 'multer'
const upload = multer({ storage: multer.memoryStorage()})
const router = express.Router()

//rest of the routes.

router.post('/are-user-details-filled',authenticator.TokenAuthenticator, assistantCtrl.areUserDetailsFilled)

router.post('/add-new-user',authenticator.TokenAuthenticator, assistantCtrl.addNewUser)

router.post('/update-user-details',authenticator.TokenAuthenticator, assistantCtrl.updateUserDetails)

router.post('/get-appointment',authenticator.TokenAuthenticator, assistantCtrl.getAppointment)

router.post('/set-appointment',authenticator.TokenAuthenticator, assistantCtrl.setAppointment)

router.post('/change-status',authenticator.TokenAuthenticator, assistantCtrl.changeStatus)

router.post('/delete-appointment',authenticator.TokenAuthenticator, assistantCtrl.deleteAppointment)

router.get('/get-users',authenticator.TokenAuthenticator, assistantCtrl.getUsers)

router.get('/get-profile',authenticator.TokenAuthenticator, assistantCtrl.getProfile)

router.post('/uploadProfilePhoto',authenticator.TokenAuthenticator,upload.single('image'), assistantCtrl.uploadProfilePhoto)
export default router