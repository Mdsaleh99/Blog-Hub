import React, { useEffect, useState } from 'react'
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate} from 'react-router-dom';
import {AiOutlineSearch} from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux';
import {toggleTheme} from '../redux/theme/themeSlice.js'
import { signOutSuccess } from '../redux/user/userSlice.js'

function Header() {
  const path = useLocation().pathname
  const location = useLocation()
  const { currentUser } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const { theme } = useSelector(state => state.theme)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  // console.log(searchTerm);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFormUrl = urlParams.get('searchTerm')
    if(searchTermFormUrl){
      setSearchTerm(searchTermFormUrl)
    }
  }, [location.search])

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST'
      })
      const data = await res.json()
      if(!res.ok){
        console.log(data.message); // message is a property of data object that is coming from the server in json format
      }
      else{
        dispatch(signOutSuccess())
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams(location.search)
    urlParams.set('searchTerm', searchTerm)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }

  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 rounded-lg via-purple-500 to-pink-500 text-white">
          Blog
        </span>
        Hub
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="avatar" img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.userName}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
            </Link>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header