import React from 'react'
import {Sidebar} from 'flowbite-react'
import {HiArrowSmRight, HiUser} from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { signOutSuccess } from '../redux/user/userSlice.js'
import { useDispatch } from 'react-redux'

function DashSidebar() {
  const location = useLocation()
  const [tab, setTab] = useState('')
  const dispatch = useDispatch()

  useEffect( ()=> {    
    const urlParams = new URLSearchParams(location.search)
    const tabFormUrl = urlParams.get('tab')
    // console.log(tabFormUrl);
    if(tabFormUrl){
      setTab(tabFormUrl)
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

  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup>

          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={'User'} labelColor='dark' as='div'>
              Profile
            </Sidebar.Item>
          </Link>

          <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignOut} >
            Sign out
          </Sidebar.Item>

        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar