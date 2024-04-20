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


export const getPosts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0 // here parseInt is used to convert the string to integer 
        const limit = parseInt(req.query.limit) || 9
        const sortDirection = req.query.order === "asc" ? 1 : -1
        const posts = await Post.find({
            ...(req.query.userId  && { userId: req.query.userId }), // here this is using for filtering the posts by userId
            ...(req.query.category && { category: req.query.category }), // here this is using for filtering the posts by category
            ...(req.query.slug && { slug: req.query.slug }), // here this is using for filtering the posts by slug
            ...(req.query.postId && { _id: req.query.postId }), // here this is using for filtering the posts by postId

            ...(req.query.searchTerm && { // here this is using for searching the posts by searchTerm with both title and content
                $or: [ // https://www.mongodb.com/docs/manual/reference/operator/query/or/
                    {
                        title: {
                            $regex: req.query.searchTerm,  // Provides regular expression capabilities for pattern matching strings in queries.  https://www.mongodb.com/docs/manual/reference/operator/query/regex/#mongodb-query-op.-regex

                            $options: "i"   // case-insensitive
                        }
                    },
                    {
                        content: {
                            $regex: req.query.searchTerm, 
                            $options: "i"   // case-insensitive
                        }
                    }
                ]
            }) 
    }).sort({ updatedAt: sortDirection}).skip(startIndex).limit(limit)

    const totalPost = await Post.countDocuments() // here this is used to count the total number of posts
    
    const now = new Date()
    const oneMonthAgo = new Date( // here this is used to get the date of one month ago from the current date
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
    )

    const lastMonthPosts = await Post.countDocuments({
        createdAt: { $gte: oneMonthAgo } // here this is used to get the posts which are updated in last month
    })

    res.status(200).json({
        posts,
        totalPost,
        lastMonthPosts
    })

    } catch (error) {
        next(error)
    }
}