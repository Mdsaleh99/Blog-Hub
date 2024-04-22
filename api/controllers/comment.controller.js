import { errorHandler } from "../utils/error.js"
import Comment from "../models/comment.model.js"

export const createComment = async (req, res, next) => {
    
    try {
        const { content, postId, userId } = req.body
        if(userId !== req.user.id){
            return next(errorHandler(403, "You are not allowed to create this comment"))
        }

        const newComment = new Comment({
            content,
            postId,
            userId
        })
        await newComment.save()
        res.status(200).json(newComment)

    } catch (error) {
        next(error)
    }
}


export const getPostComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({postId: req.params.postId}).sort({createdAt: -1})
        res.status(200).json(comments)

    } catch (error) {
        next(error)
    }
    
}

export const likeComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId)
        if(!comment){
            return next(errorHandler(404, "Comment not found"))
        }
        const userIndex = comment.likes.indexOf(req.user.id)
        if(userIndex === -1){
            comment.numberOfLikes += 1
            comment.likes.push(req.user.id)
        }
        else{
            comment.numberOfLikes -= 1
            comment.likes.splice(userIndex, 1)
        }
        await comment.save()
        res.status(200).json(comment)

    } catch (error) {
        next(error)
    }
}


/**
 * This code snippet checks if the req.user.id exists in the likes array of a comment object. If it doesn't exist, it adds the req.user.id to the likes array.

Here's a breakdown of how it works:

comment.likes: This refers to an array (likes) stored within the comment object.
indexOf(req.user.id): This method checks if req.user.id exists in the likes array. It returns the index of the first occurrence of req.user.id in the array. If the element is not found, it returns -1.
userIndex: This variable stores the index of req.user.id in the likes array.
if(userIndex === -1): This condition checks if req.user.id is not found in the likes array.
comment.likes.push(req.user.id): If req.user.id is not found (userIndex === -1), it means the user has not liked the comment yet. So, the req.user.id is added to the likes array using the push() method.
 * 
 * 
 * 
 * comment.likes: This refers to an array (likes) stored within the comment object.
splice(userIndex, 1): This is a call to the splice() method on the likes array.
userIndex: This is the index of the element to remove from the array. userIndex specifies the position of the element to remove.
1: This indicates the number of elements to remove from the array. In this case, only one element is being removed.
So, comment.likes.splice(userIndex, 1) removes one element from the likes array at the specified userIndex position, effectively deleting an item from the list of likes associated with the comment object. After this operation, the likes array will be modified accordingly, with the specified element removed.
 */
















/**
 * The splice() method in JavaScript is used to change the contents of an array by removing or replacing existing elements and/or adding new elements in place. It modifies the original array and returns an array containing the removed elements, if any.

Here's how splice() works:

Syntax: The syntax for the splice() method is as follows:

array.splice(startIndex, deleteCount, item1, item2, ...);

Parameters:
startIndex: The index at which to start changing the array. If negative, it will begin that many elements from the end of the array (with -1 indicating the last element of the array).
deleteCount (optional): The number of elements to remove from the array. If omitted or if greater than the number of elements remaining from startIndex to the end of the array, all elements from startIndex to the end of the array will be deleted.
item1, item2, ... (optional): Elements to add to the array, beginning at the startIndex.
Return Value: The splice() method returns an array containing the removed elements, if any. If no elements are removed, it returns an empty array.
Mutability: The original array is modified by splice().

 */