import { errorHandler } from "../utils/error.js"
import Post from "../models/post.model.js"

export const create = async (req, res, next) => {
    if(!req.user.isAdmin){ // here req.user.isAdmin is comming from cookie token which is set in verifyUser.js file
        return next(errorHandler(403, "You are not allowed to create a post"))
    }
    if(!req.body.title || !req.body.content){
        return next(errorHandler(400, "Please provide all required fields"))
    }
    const slug = req.body.title.split(" ").join("-").toLowerCase().replace(/[^\w-]+/g, '');
    const newPost = new Post({
        ...req.body, slug, userId: req.user.id   // here ...req.body means all the fields of req.body means title, content, category, image and slug is added to newPost  and userId is added to newPost from req.user.id here req.user.id is the id of the user who is creating the post id comming from the token.... check the verifyUser.js file and auth.controller.js file
    })
    try {
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    } catch (error) {
        next(error)
    }
}