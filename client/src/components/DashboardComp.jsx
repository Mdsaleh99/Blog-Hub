import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup } from "react-icons/hi";
import {Button, Table} from 'flowbite-react'
import { Link } from "react-router-dom";

export default function DashboardComp() {
    const [users, setUsers] = useState([])
    const [comments, setComments] = useState([])
    const [posts, setPosts] = useState([])
    const [totalUsers, setTotalUsers] = useState(0)
    const [totalComments, setTotalComments] = useState(0)
    const [totalPosts, setTotalPosts] = useState(0)
    const [lastMonthUsers, setLastMonthUsers] = useState(0)
    const [lastMonthComments, setLastMonthComments] = useState(0)
    const [lastMonthPosts, setLastMonthPosts] = useState(0)
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/user/getusers?limit=5') // here we are fetching the users from the route in the backend
                const data = await res.json()
                // Note: we are written data.user, data.posts, data.comments like this in all the fetches function below and after the 'data.' which is written that is not part of state means useState hook e.g. data.users, data.posts, data.comments here 'users', 'posts', 'comments' are not part of state means useState hook.. data.users, data.posts, data.comments are part of the json object which is returned from the backend when response is ok
                if(res.ok){
                    setUsers(data.users)
                    setTotalUsers(data.totalUsers)
                    setLastMonthUsers(data.lastMonthUsers)
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/post/getposts?limit=5')
                const data = await res.json()
                if(res.ok){
                    setPosts(data.posts)
                    setTotalPosts(data.totalPost)
                    setLastMonthPosts(data.lastMonthPosts)
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        const fetchComments = async () => {
            try {
                const res = await fetch('/api/comment/getcomments?limit=5')
                const data = await res.json()
                if(res.ok){
                    setComments(data.comments)
                    setTotalComments(data.totalComments)
                    setLastMonthComments(data.lastMonthComments)
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        if(currentUser.isAdmin){
            fetchUsers()
            fetchPosts()
            fetchComments()
        }
    }, [currentUser])
  

    return (
      <div className="p-3 mx-auto">
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div className="">
                <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
                <p className="text-2xl">{totalUsers}</p>
              </div>
              <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex gap-2 text-sm">
              <span className="text-green-500 flex items-center">
                <HiArrowNarrowUp />
                <p>{lastMonthUsers}</p>
              </span>
              <div className="text-gray-500">Last month</div>
            </div>
          </div>

          <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div className="">
                <h3 className="text-gray-500 text-md uppercase">
                  Total Comments
                </h3>
                <p className="text-2xl">{totalComments}</p>
              </div>
              <HiAnnotation className="bg-blue-600 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex gap-2 text-sm">
              <span className="text-green-500 flex items-center">
                <HiArrowNarrowUp />
                <p>{lastMonthComments}</p>
              </span>
              <div className="text-gray-500">Last month</div>
            </div>
          </div>

          <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div className="">
                <h3 className="text-gray-500 text-md uppercase">Total Posts</h3>
                <p className="text-2xl">{totalPosts}</p>
              </div>
              <HiDocumentText className="bg-gray-500 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex gap-2 text-sm">
              <span className="text-green-500 flex items-center">
                <HiArrowNarrowUp />
                <p>{lastMonthPosts}</p>
              </span>
              <div className="text-gray-500">Last month</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mx-auto justify-center">
          <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
            <div className="flex justify-between p-3 font-semibold text-sm">
              <h1 className="text-center p-2">Recent users</h1>
              <Button gradientDuoTone="purpleToPink" outline>
                <Link to="/dashboard?tab=users">See all</Link>
              </Button>
            </div>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>User image</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
              </Table.Head>
              {users &&
                users.map((user) => (
                  <Table.Body key={user._id} className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell>
                        <img
                          src={user.profilePicture}
                          alt="user"
                          className="w-10 h-10 rounded-full bg-gray-500"
                        />
                      </Table.Cell>
                      <Table.Cell>{user.userName}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))}
            </Table>
          </div>

          <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
            <div className="flex justify-between p-3 font-semibold text-sm">
              <h1 className="text-center p-2">Recent comments</h1>
              <Button gradientDuoTone="purpleToPink" outline>
                <Link to="/dashboard?tab=comments">See all</Link>
              </Button>
            </div>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Comment content</Table.HeadCell>
                <Table.HeadCell>Likes</Table.HeadCell>
              </Table.Head>
              {comments &&
                comments.map((comment) => (
                  <Table.Body key={comment._id} className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className="w-96">
                        <p className="line-clamp-2">{comment.content}</p>
                      </Table.Cell>
                      <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))}
            </Table>
          </div>

          <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
            <div className="flex justify-between p-3 font-semibold text-sm">
              <h1 className="text-center p-2">Recent posts</h1>
              <Button gradientDuoTone="purpleToPink" outline>
                <Link to="/dashboard?tab=users">See all</Link>
              </Button>
            </div>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Post image</Table.HeadCell>
                <Table.HeadCell>Post title</Table.HeadCell>
                <Table.HeadCell>category</Table.HeadCell>
              </Table.Head>
              {posts &&
                posts.map((post) => (
                  <Table.Body key={post._id} className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell>
                        <img
                          src={post.image}
                          alt="user"
                          className="w-14 h-10 rounded-md bg-gray-500"
                        />
                      </Table.Cell>
                      <Table.Cell className="line-clamp-2 w-96">{post.title}</Table.Cell>
                      <Table.Cell className="w-5">{post.category}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))}
            </Table>
          </div>
        </div>
      </div>
    );
}
