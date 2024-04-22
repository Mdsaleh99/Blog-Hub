import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashSidebar from '../components/DashSidebar'
import DashProfile from '../components/DashProfile'
import DashPosts from '../components/DashPosts.jsx'
import DashUsers from '../components/DashUsers.jsx'
import DashComments from '../components/DashComments.jsx'
import DashboardComp from '../components/DashboardComp.jsx'

function Dashboard() {
  const location = useLocation()
  const [tab, setTab] = useState('')

  useEffect( ()=> {   // 'useEffect' hook is use to perform side effects in functional components means it is used to perform some action after rendering the component. 
    const urlParams = new URLSearchParams(location.search)
    const tabFormUrl = urlParams.get('tab')
    // console.log(tabFormUrl);
    if(tabFormUrl){
      setTab(tabFormUrl)
    }
    /**
     * tab: This is the state variable. It represents the current value of the state. In this case, it's initialized with an empty string ('').
setTab: This is the function that allows you to update the state variable tab. When you call setTab(newValue), it updates the value of tab to newValue, and triggers a re-render of the component with the new state value.
     */
  }, [location.search]) // when this 'location.search' changes then this 'useEffect' hook will run
  
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className=''>
      {/* sidebar */}
      <DashSidebar />
    </div>
    {/* profile */}
    {tab === 'profile' && <DashProfile />}

    {/* posts */}
    {tab === 'posts' && <DashPosts />}

    {/* users */}
    {tab === 'users' && <DashUsers />}

    {/* comments */}
    {tab === 'comments' && <DashComments />}

    {/* dashboard comp */}
    {tab === 'dash' && <DashboardComp />}
    </div>
    
  )
}

















/**
 * The URLSearchParams interface in JavaScript is used to work with the query string of a URL. It allows you to easily parse and manipulate query parameters.
 * 
 * URLSearchParams(location.search), location.search refers to the query string portion of the current URL. For example, if the URL is http://example.com/?name=John&age=30, location.search would be "?name=John&age=30".

Here's how URLSearchParams works with location.search:

Parsing the Query String:
URLSearchParams(location.search) takes the query string as input and creates a new URLSearchParams object. This object provides methods to access and manipulate the query parameters.
------------
example:
const queryString = "?name=John&age=30";
const params = new URLSearchParams(queryString);

console.log(params.get('name')); // Output: "John"
console.log(params.get('age'));  // Output: "30"

In this example, params.get('name') returns the value of the name parameter ("John"), and params.get('age') returns the value of the age parameter ("30").
 * 
 */
export default Dashboard