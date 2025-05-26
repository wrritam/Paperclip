import express from 'express'
const authRouter = express.Router()

import { rateLimiterforAuth } from '../middleware/rate-limiter'
import { register } from '../controllers/auth/register'
import { verifyRegistration } from '../controllers/auth/verify-registration'
import { login } from '../controllers/auth/login'
import { forgotPassword } from '../controllers/auth/forgot-password'
import { resetPassword } from '../controllers/auth/reset-password'
import { verifyUpdation } from '../controllers/auth/verify-update'

authRouter.use(rateLimiterforAuth)
authRouter.post('/register', register)
authRouter.post('/verify-registration', verifyRegistration)
authRouter.post('/login', login)
authRouter.post('/forgot-password', forgotPassword)
authRouter.post('/verify-updation', verifyUpdation)
authRouter.post('/reset-password', resetPassword)

export default authRouter
