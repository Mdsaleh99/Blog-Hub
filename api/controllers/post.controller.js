import { errorHandler } from "../utils/error.js";
import Post from "../models/post.model.js";

export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    // here req.user.isAdmin is comming from cookie token which is set in verifyUser.js file
    return next(errorHandler(403, "You are not allowed to create a post"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all required fields"));
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^\w-]+/g, "");
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id, // here ...req.body means all the fields of req.body means title, content, category, image and slug is added to newPost  and userId is added to newPost from req.user.id here req.user.id is the id of the user who is creating the post id comming from the token.... check the verifyUser.js file and auth.controller.js file
  });
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0; // here parseInt is used to convert the string to integer
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }), // here this is using for filtering the posts by userId
      ...(req.query.category && { category: req.query.category }), // here this is using for filtering the posts by category
      ...(req.query.slug && { slug: req.query.slug }), // here this is using for filtering the posts by slug
      ...(req.query.postId && { _id: req.query.postId }), // here this is using for filtering the posts by postId

      ...(req.query.searchTerm && {
        // here this is using for searching the posts by searchTerm with both title and content
        $or: [
          // https://www.mongodb.com/docs/manual/reference/operator/query/or/
          {
            title: {
              $regex: req.query.searchTerm, // Provides regular expression capabilities for pattern matching strings in queries.  https://www.mongodb.com/docs/manual/reference/operator/query/regex/#mongodb-query-op.-regex

              $options: "i", // case-insensitive
            },
          },
          {
            content: {
              $regex: req.query.searchTerm,
              $options: "i", // case-insensitive
            },
          },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPost = await Post.countDocuments(); // here this is used to count the total number of posts

    const now = new Date();
    const oneMonthAgo = new Date( // here this is used to get the date of one month ago from the current date
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo }, // here this is used to get the posts which are updated in last month
    });

    res.status(200).json({
      posts,
      totalPost,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * req.query.userId: This typically refers to the value of the userId parameter from the query string of a URL. For example, if the URL is /?userId=123, req.query.userId would be '123'.
{ userId: req.query.userId }: This creates an object with a property userId whose value is req.query.userId. However, this object is only created if req.query.userId is truthy (i.e., not null, undefined, false, 0, '', or NaN).
&&: The logical AND operator (&&) is used here to conditionally check if req.query.userId exists and has a truthy value.
...(expression): This is the object spread syntax, which allows you to spread the properties of an object into another object.
Putting it all together:

If req.query.userId exists and has a truthy value, { userId: req.query.userId } will be evaluated and an object with a userId property will be created.
If req.query.userId does not exist or is falsy, the expression inside the braces will evaluate to null.
The object spread syntax ... then spreads the properties of the object (either { userId: req.query.userId } or null) into another object.
 */

export const deletePost = async (req, res, next) => {
  //In Express.js, req.params is an object containing properties mapped to the named route parameters. When you define a route with parameters in your Express application, such as /users/:userId, Express extracts the parameter values from the URL and makes them accessible through req.params. here :userId is the parameter in the route
  // example-   ':userId' is a route parameter. When a request is made to a URL like /users/123, Express extracts the value 123 from the URL and stores it in req.params.userId. You can then access this value within your route handler using req.params.userId.
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this post"));
  }

  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json("The post has been deleted");
    // findByIdAndDelete(): This is a method provided by Mongoose, which is an Object Data Modeling (ODM) library for MongoDB and Node.js. It is used to perform a deletion operation based on the document's unique identifier.
    // req.params.postId: In an Express.js route handler, req.params is an object containing parameters that are part of the URL's path. For example, if you have a route defined as /posts/:postId, accessing req.params.postId would give you the value of postId extracted from the URL.
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this post"));
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};








// https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable
// https://www.geeksforgeeks.org/react-redux-hooks-useselector-and-usedispatch/?ref=header_search