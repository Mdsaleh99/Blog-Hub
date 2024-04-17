import React from 'react'
import { useSelector } from 'react-redux' // useSelector is a hook that allows you to extract data from the Redux store state, using a selector function. here using this 'useSelector' we checking person authenticated or not
import { Outlet, Navigate } from 'react-router-dom'

function PrivateRoute() {
    const {currentUser} = useSelector((state) => state.user) // here we are checking user is authenticated or not
  return currentUser ? <Outlet /> : <Navigate to='/sign-in' /> // if user is authenticated then we are rendering Outlet component otherwise we are redirecting to sign-in page. Outlet component is used to render child routes 
}

export default PrivateRoute