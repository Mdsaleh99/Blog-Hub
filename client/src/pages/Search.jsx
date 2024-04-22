import { Button, Select, TextInput } from 'flowbite-react'
import { set } from 'mongoose';
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import PostCard from '../components/PostCard';

export default function Search() {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'uncategorized'
    })
    console.log(sidebarData);
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [showMore, setShowMore] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search) // location.search is the query string in the url
        const searchTermFormUrl = urlParams.get('searchTerm')
        const sortFormUrl = urlParams.get('sort')
        const categoryFormUrl = urlParams.get('category')

        if(searchTermFormUrl || sortFormUrl || categoryFormUrl){
            setSidebarData({
                ...sidebarData, 
                searchTerm: searchTermFormUrl,
                sort: sortFormUrl,
                category: categoryFormUrl
            })
        }

        const fetchPosts = async () => {
            setLoading(true)
            const searchQuery = urlParams.toString() 
            const res = await fetch(`/api/post/getposts?${searchQuery}`)
            if(!res.ok){
                setLoading(false)
                return
            }
            if(res.ok){
                const data = await res.json()
                setPosts(data.posts)
                setLoading(false)

                if(data.posts.length === 9){
                    setShowMore(true)
                }else{
                    setShowMore(false)
                }
            }

        }
        fetchPosts()
    }, [location.search])

    const handleChange = (e) => {
        if(e.target.id === 'searchTerm'){
            setSidebarData({...sidebarData, searchTerm: e.target.value})
        }

        if(e.target.id === 'sort'){
            const order = e.target.value || 'desc'
            setSidebarData({...sidebarData, sort: order})
        }

        if(e.target.id === 'category'){
            const category = e.target.value || 'uncategorized'
            setSidebarData({...sidebarData, category})
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams(location.search)
        urlParams.set('searchTerm', sidebarData.searchTerm)
        urlParams.set('sort', sidebarData.sort)
        urlParams.set('category', sidebarData.category)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }

    const handleShowMore = async () => {
        const numberOfPosts = posts.length
        const startIndex = numberOfPosts
        const urlParams = new URLSearchParams(location.search)
        urlParams.set('startIndex', startIndex)
        const searchQuery = urlParams.toString()
        const res = await fetch(`/api/post/getposts?${searchQuery}`)

        if(!res.ok){
            return
        }
        if(res.ok){
            const data = await res.json()
            setPosts([...posts, ...data.posts])
            if(data.posts.length === 9){
                setShowMore(true)
            }else{
                setShowMore(false)
            }
        }
    
    }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:{" "}
            </label>
            <TextInput
              placeholder="search...."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Category: </label>
            <Select onChange={handleChange} value={sidebarData.sort} id="sort">
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort: </label>
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id="category"
            >
              <option value="uncategorized">Uncategorized</option>
              <option value="javascript">JavaScript</option>
              <option value="nodejs">Nodejs</option>
              <option value="react">React</option>
              <option value="mongoDB">MongoDB</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
              <option value="api">Api</option>
              <option value="git">Git & Github</option>
            </Select>
          </div>
          <Button type="submit" gradientDuoTone="purpleToBlue" outline>
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
        <h1>Post Results: </h1>
      <div className="p-7 flex flex-wrap gap-4">
        {!loading && posts.length === 0 && (
          <p className="text-xl text-gray-500">No posts found.</p>
        )}
        {
            loading && (
                <p className='text-xl text-gray-500'>loading....</p>
            )
        }
        {
            !loading && posts && posts.map((post) => (
                <PostCard key={post._id} post={post} />
            ))
        }
        {
            showMore && <button className='text-teal-500 text-lg hover:underline p-7 w-full' onClick={handleShowMore}>Show More</button>
        }
      </div>
      </div>
    </div>
  );
}
