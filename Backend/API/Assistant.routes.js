import express from 'express'
import assistantCtrl from './Assistant.controllers.js'
import authenticator from '../Middlewares/Assistant.middleware.js'

const router = express.Router()

//rest of the routes.

router.post('/login',authenticator.loginAuthenticator, assistantCtrl.login)

router.post('/test',authenticator.refreshTokenAuthenticator, assistantCtrl.test)

router.post('/signup', assistantCtrl.signup)

router.post('/refresh-token',authenticator.refreshTokenAuthenticator,assistantCtrl.refreshToken)
export default router