import { Footer } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { BsFacebook, BsGithub, BsInstagram, BsTwitter } from 'react-icons/bs'

function FooterComp() {
  return (
    <Footer container className='border border-t-8 border-teal-500'>
        <div className='w-full max-w-7xl mx-auto'>
            <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
                <div className='mt-5'>
                    <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
                    <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 rounded-lg via-purple-500 to-pink-500 text-white' >Blog</span>
                    Hub
                </Link>
                </div>
            </div>
            <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
                <div>
                    <Footer.Title title='About' />
                    <Footer.LinkGroup col>
                    <Footer.Link 
                        href='/about'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        Blog Hub
                    </Footer.Link>
                    </Footer.LinkGroup>
                </div>
                <div>
                    <Footer.Title title='Follow us' />
                    <Footer.LinkGroup col>
                    <Footer.Link 
                        href='https://github.com/Mdsaleh99'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        Github
                    </Footer.Link>
                    <Footer.Link 
                        href='#'
                        // target='_blank'
                        // rel='noopener noreferrer'
                    >
                        Discord
                    </Footer.Link>
                    </Footer.LinkGroup>
                </div>
                <div>
                    <Footer.Title title='Legal' />
                    <Footer.LinkGroup col>
                    <Footer.Link 
                        href='#'
                        // target='_blank'
                        // rel='noopener noreferrer'
                    >
                        Privacy Policy
                    </Footer.Link>
                    <Footer.Link 
                        href='#'
                        // target='_blank'
                        // rel='noopener noreferrer'
                    >
                        Terms &amp; conditions
                    </Footer.Link>
                    </Footer.LinkGroup>
                </div>
            </div>
            <Footer.Divider />
            <div className='w-full sm:flex sm:items-center sm:justify-between'>
                <Footer.Copyright href='#' by='Blog Hub' year={new Date().getFullYear()} />
                <div className='flex gap-6 sm:mt-0 mt-4 sm:justify-center'>
                    <Footer.Icon href='https://github.com/Mdsaleh99' icon={BsGithub} />
                    <Footer.Icon href='#' icon={BsFacebook} />
                    <Footer.Icon href='#' icon={BsInstagram} />
                    <Footer.Icon href='#' icon={BsTwitter} />
                </div>        
                
            </div>
        </div> 
    </Footer>
  )
}

export default FooterComp