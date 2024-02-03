import express from 'express'
import assistantCtrl from 'Assistant.controller.js'
import authenticator from '../Middlewares/Assistant.middleware.js'

const router = express.Router()

//rest of the routes.

router.post('/login',authenticator.loginAuthenticator, assistantCtrl.login)

route.post('/signup', assistantCtrl.signup)

route.post('/refresh-token',authenticator.refreshTokenAuthenticator,assistantCtrl.refreshToken)
export default router