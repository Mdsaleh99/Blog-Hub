import { Table } from 'flowbite-react';
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';



export default function DashPosts() {
  const { currentUser } = useSelector(state => state.user)
  const [userPosts, setUserPosts] = useState([])
  const [showMore, setShowMore] = useState(true)
  console.log(userPosts);
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
              <Table.Body className='divide-y'>
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
                    <span className='font-medium text-red-500 hover:underline cursor-pointer'>Delete</span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/upadte-post/${post._id}`} className='text-teal-500 hover:underline'>
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
    </div>
  )
}
