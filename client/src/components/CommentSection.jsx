import { Alert, Button, TextInput, Textarea } from 'flowbite-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'


export default function CommentSection({ postId }) {
    const { currentUser } = useSelector(state => state.user)
    const [comment, setComment] = useState('')
    const [commentError, setCommentError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(comment.length > 200) {
            return
        }
        try {
            const res = await fetch('/api/comment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({content: comment, postId, userId: currentUser._id})
            })
            const data = await res.json()
            if(res.ok){
                setComment('')
                setCommentError(null)
            }
        } catch (error) {
            setCommentError(error.message)
        }
    }

    return (
        <div className='max-w-2xl mx-auto w-full p-3'>
            {
                currentUser ? (
                    <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
                        <p>Signed in as: </p>
                        <img className='h-7 w-7 object-cover rounded-full' src={currentUser.profilePicture} alt="" />
                        <Link to='/dashboard?tab=profile' className='text-xs text-cyan-600 hover:underline'>
                            @{currentUser.userName}
                        </Link>
                    </div>
                ) : (
                    <div className='text-sm text-teal-500 my-5 flex gap-2'>
                        You must be signed in to comment.
                        <Link to={'/sign-in'} className='text-blue-500 hover:underline'>
                            Sign in
                        </Link>
                    </div>
                )
            }
            
            {currentUser && (
                <form onSubmit={handleSubmit} className='border border-teal-500 rounded-md p-3'>
                    <Textarea 
                        placeholder='Write a comment...'
                        rows='3'
                        maxLength='200'
                        onChange={(e) => setComment(e.target.value)}
                        value={comment} 
                    />
                    <div className='flex justify-between mt-5 items-center'>
                        <p className='text-gray-500 text-sm'>{200 - comment.length} characters remaining</p>
                        <Button outline gradientDuoTone='purpleToBlue' type='submit'>
                            Submit
                        </Button>
                    </div>
                    {commentError && (
                        <Alert className='mt-5' color='failure'>
                            {commentError}
                        </Alert>
                    )}
                    
                </form>
                
            )}
        </div>
    )
}
// In React, value={comment} is used to bind the value of an input element (such as an input field or textarea) to a variable in the component's state. This creates a controlled input component, where React controls the value of the input field.