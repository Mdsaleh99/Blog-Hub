import User from "../models/user.model.js"
import bcryptjs from 'bcryptjs'
import {errorHandler} from "../utils/error.js"
import jwt from 'jsonwebtoken'


export const signUp = async (req, res, next) => {
    const {userName, email, password} = req.body

    if (!userName || !email || !password || userName === '' || email === '' || password === '') {
        next(errorHandler(400, "All fields are required!"))
    }

    const hashPassword = bcryptjs.hashSync(password, 10)

    const newUser = new User({
        userName, 
        email, 
        password: hashPassword
    })

    try {
        await newUser.save()
        res.json("signup successfull!")
    } catch (error) {
        next(error)
    }
}


export const signIn = async (req, res, next) => {
    const {email, password} = req.body

    if (!email || !password || email === '' || password === '') {
        next(errorHandler(400, "All fields are required!"))
    }

    try {
        const validUser = await User.findOne({email})
        if (!validUser) {
            return next(errorHandler(404, "User not found!"))
        }
        const vaildPassword = bcryptjs.compareSync(password, validUser.password)
        if(!vaildPassword) {
            return next(errorHandler(400, "Invalid password!"))
        }

        const token = jwt.sign(
            {id: validUser._id, isAdmin: validUser.isAdmin}, // isAdmin is added to the cookie to check if the user is admin or not this is for give priroty to the admin
            process.env.JWT_SECRET
        )

        const {password: pass, ...rest} = validUser._doc

        res.status(200).cookie('access_token', token, {httpOnly: true}).json(rest)
    } catch (error) {
        next(error)
    }
}

export const google = async (req, res, next) => {
    const {name, email, googlePhotoUrl} = req.body
    try {
        const user = await User.findOne({email})
        if(user){
            const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT_SECRET)
            const {password, ...rest} = user._doc
            res.status(200).cookie('access_token', token, {httpOnly: true}).json(rest)
            // This line uses destructuring assignment to extract the password field from the user._doc object and assign it to a variable named password. The ...rest syntax is used to collect the remaining fields (excluding password) into a new object called rest.
            // After this line executes, the password variable contains the value of the password field, and the rest variable contains an object containing all the fields from user._doc except for password.

            // This line sends a response with status code 200 (OK).
            // It sets a cookie named access_token with the JWT token value (token). The { httpOnly: true } option ensures that the cookie is accessible only via HTTP requests and not via client-side JavaScript, enhancing security.
            // Finally, it sends a JSON response containing the rest object, which includes all fields from user._doc except for password. This response typically includes user details without the sensitive password information.
        }
        else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)
            const newUser = new User({
                userName: name.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl
            })
            await newUser.save()
            const token = jwt.sign({id: newUser._id, isAdmin: newUser.isAdmin}, process.env.JWT_SECRET)
            // Generating a Token:
            // The jwt.sign() function generates a JWT using the provided payload and secret key. In this case, the payload is an object containing the id property, which typically represents a unique identifier for a user or entity. The JWT_SECRET environment variable is used as the secret key for signing the token.

            // The Generated Token:
            // The token variable now holds the generated JWT. This token is a string that consists of three parts separated by periods: the header, payload, and signature. It looks something like this:
            // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ik9BQzE5QUFBQUFBRFhUWFFoeEJ0Q1U4akEiLCJpYXQiOjE2MzI5MDYwNjR9.pZXhsI6FgW92JZpRq1hG-erCkCR_2ZGG-pQsU7pExl0

            const {password, ...rest} = newUser._doc
            res.status(200).cookie('access_token', token, {httpOnly: true}).json(rest)
        }
    } catch (error) {
        next(error)
    }
}


// sometimes you may want to access only the raw document data without the additional Mongoose-specific properties and methods. In such cases, you can use the _doc property to access the raw JavaScript object containing just the document data.

// The jwt.sign() method is a function provided by the jsonwebtoken library in Node.js. It is used to generate a JSON Web Token (JWT) based on the payload and a secret key. JSON Web Tokens are used for securely transmitting information between parties as a compact URL-safe string.