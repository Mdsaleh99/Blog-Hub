import jwt from 'jsonwebtoken'
import { errorHandler} from './error.js'


export const verifyUser = (req, res, next) => {
    const token = req.cookies.access_token //  get the token cookie of broweser.. in auth.controller.js we set the cookie name as access_token

    if(!token){
        return next(errorHandler(401, 'Unauthorized'))
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err){
            return next(errorHandler(401, 'Unauthorized'))
        }
        req.user = user  // here user added to req object so that we can access it in the next middleware
        next()
    })

}
