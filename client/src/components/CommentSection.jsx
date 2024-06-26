import { Alert, Button, Modal, Textarea } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Comment from './Comment.jsx'
import { HiOutlineExclamationCircle } from "react-icons/hi";


export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();
//   console.log(comments);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment("");
        setCommentError(null);
        setComments([data, ...comments]); // add the new comment to the top of the comments array
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getpostcomments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/likecomment/${commentId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (comment, editedComment) => {
    setComments(
      comments.map((comm) =>
        comm._id === comment._id ? { ...comm, content: editedComment } : comm
      )
    );
  };
  /**
     * This function handleEdit is used to update a comment's content in the comments state array when editing a comment. Here's how it works:

    It takes two parameters:
    omment: The original comment object that needs to be edited.
    ditedComment: The new content for the comment.
    It updates the comments state array using setComments.
    Inside setComments, it uses the map function to iterate over each comment in the comments array.
    For each comment (comm), it checks if the _id of the comment matches the _id of the comment passed as a parameter.
    If they match, it creates a new object using spread syntax ({...comm}) to copy all properties of the original comment, and then overrides the content property with the editedComment. This ensures that only the content of the edited comment is updated, leaving other properties unchanged.
    If they don't match, it returns the original comment object unchanged.
    Finally, setComments updates the state with the new array of comments where the edited comment's content has been updated.
     */

    const handleDelete = async (commentId) => {
        setShowModal(false);
        try {
          if (!currentUser) {
            navigate("/sign-in");
            return;
          }
          const res = await fetch(`/api/comment/deletecomment/${commentId}`, {
            method: "DELETE",
          });
          // after getting the req from api route
          if (res.ok) {
            const data = await res.json()
            // filter out the comments   keep the previous comments except the one which is deleted and add that one to the comments array
            setComments(comments.filter((comment) => comment._id !== commentId))   
          }
          
        } catch (error) {
            console.log(error.message);
        }
    }

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as: </p>
          <img
            className="h-7 w-7 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt=""
          />
          <Link
            to="/dashboard?tab=profile"
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.userName}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-2">
          You must be signed in to comment.
          <Link to={"/sign-in"} className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </div>
      )}

      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Write a comment..."
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between mt-5 items-center">
            <p className="text-gray-500 text-sm">
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert className="mt-5" color="failure">
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
          </div>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={() => handleDelete(commentToDelete)}>
              Yes, I'm sure
            </Button>
            <Button onClick={() => setShowModal(false)} color="gray">
              No
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
// In React, value={comment} is used to bind the value of an input element (such as an input field or textarea) to a variable in the component's state. This creates a controlled input component, where React controls the value of the input field.