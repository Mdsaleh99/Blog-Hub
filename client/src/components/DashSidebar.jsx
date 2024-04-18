import React from 'react'
import {Sidebar} from 'flowbite-react'
import {HiArrowSmRight, HiUser} from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

function DashSidebar() {
  const location = useLocation()
  const [tab, setTab] = useState('')

  useEffect( ()=> {    
    const urlParams = new URLSearchParams(location.search)
    const tabFormUrl = urlParams.get('tab')
    // console.log(tabFormUrl);
    if(tabFormUrl){
      setTab(tabFormUrl)
    }
  }, [location.search])

  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup>

          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={'User'} labelColor='dark' as='div'>
              Profile
            </Sidebar.Item>
          </Link>

          <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer'>
            Sign out
          </Sidebar.Item>

        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar