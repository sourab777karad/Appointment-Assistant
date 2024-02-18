import express from 'express'
import assistantCtrl from './Assistant.controllers.js'
import authenticator from '../Middlewares/Assistant.middleware.js'

const router = express.Router()

//rest of the routes.
router.post('/test',authenticator.TokenAuthenticator, assistantCtrl.test)

router.post('/login',assistantCtrl.login)

router.post('/signup', assistantCtrl.signup)

router.post('/get-appointment',authenticator.TokenAuthenticator, assistantCtrl.getAppointment)

router.post('/set-appointment',authenticator.TokenAuthenticator, assistantCtrl.setAppointment)

// router.post('/change-status',authenticator.TokenAuthenticator, assistantCtrl.changeStatus)

// router.post('/get-appointments',authenticator.TokenAuthenticator, assistantCtrl.getAppointments)

// router.get('/get-users',authenticator.TokenAuthenticator, assistantCtrl.getUsers)

// router.get('/get-profile',authenticator.TokenAuthenticator, assistantCtrl.getProfile)

export default router