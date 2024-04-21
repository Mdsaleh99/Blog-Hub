import { Table, Modal, Button } from 'flowbite-react';
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi'



export default function DashPosts() {
  const { currentUser } = useSelector(state => state.user)
  const [userPosts, setUserPosts] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [postIdToDelete, setPostIdToDelete] = useState('')
  // console.log(userPosts);
  useEffect(() => {
    const fetchPosts = async ()=>{
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`)
        const data = await res.json()

        if(res.ok){
          setUserPosts(data.posts)
          if(data.posts.length < 9){
            setShowMore(false)
          }
        }

      } catch (error) {
        console.log(error.message);
      }
    }
    if(currentUser.isAdmin){
      fetchPosts()
    }
  }, [currentUser._id])

  const handleShowMore = async () => {
    const startIndex = userPosts.length

    try {
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`)
      const data = await res.json()

      if(res.ok){
        setUserPosts((prev) => [...prev, ...data.posts]) // here ...prev means all the previous posts and ...data.posts means all the new posts and we are adding all the new posts to the previous posts
        if(data.posts.length < 9){
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
   * The code setUserPosts((prev) => [...prev, ...data.posts]) is using the setUserPosts function, likely a state updater function from React's useState hook. It's adding new posts to an existing array of posts stored in the state.

    Let's break it down:

    setUserPosts: This function is used to update the state variable userPosts (assuming userPosts is a state variable declared with useState).
    (...prev, ...data.posts): This syntax uses the spread operator (...) to concatenate two arrays: prev (the previous state value of userPosts) and data.posts (an array of new posts). This ensures that the new  posts are added to the existing list of posts without mutating the original array.
    (prev) => [...prev, ...data.posts]: This is a functional update pattern used with useState. It receives the previous state value (prev) and returns a new state value by spreading the previous posts (...prev) and appending the new posts (...data.posts).
  */


  const handleDeletePost = async () => {
    setShowModal(false)
    try {
      const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if(!res.ok){
        console.log(data.message);
      }
      else{
        setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete))
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
   * In JavaScript, the filter method is used to create a new array containing elements from the original array that pass a certain condition specified by a callback function. It doesn't modify the original array; instead, it returns a new array containing only the elements that meet the specified condition which is true.
   * 
   * setUserPosts: This likely refers to a state setter function in a React component. It's used to update    the state variable userPosts with a new value.
    (prev) => ...: This is a functional update pattern used with state setters in React. It receives the previous state value prev and returns a new state value.
    prev.filter((post) => post._id !== postIdToDelete):
    prev: The previous state value of userPosts.
    .filter((post) => post._id !== postIdToDelete): This is a call to the filter method on the previous state value. It creates a new array containing only the elements that meet the specified condition.
    (post) => post._id !== postIdToDelete: This is a callback function passed to filter. It receives each post from the previous array and checks if its _id property is not equal (!==) to postIdToDelete. If the condition is true, the post is included in the new array; if false, it's filtered out.
   */
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => (
              <Table.Body className='divide-y' >
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img src={post.image} alt={post.title} className='w-20 h-10 object-cover' />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`} className='font-medium text-gray-900 dark:text-white'>{post.title}</Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span className='font-medium text-red-500 hover:underline cursor-pointer'
                      onClick={() => {setShowModal(true)
                        setPostIdToDelete(post._id);
                      }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/update-post/${post._id}`} className='text-teal-500 hover:underline'>
                      <span>Edit</span>
                    </Link>
                    
                  </Table.Cell>

                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {
            showMore && (
              <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>
                Show More
              </button>
            )
          }
        </>
      ) : (
        <p>You have no Posts yet!</p>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this post?</h3>
          </div>
          <div className='flex justify-center gap-4'>
            <Button color='failure' onClick={handleDeletePost}>
              Yes, I'm sure
            </Button>
            <Button onClick={() => setShowModal(false)} color='gray'>
              No
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
