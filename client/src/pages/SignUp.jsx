import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth.jsx'


function SignUp() {
  const [formData, setFormData] = useState({})
  const [errrMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

// https://www.geeksforgeeks.org/redux-toolkit/?ref=ml_lbp
// https://www.geeksforgeeks.org/react-redux-hooks-useselector-and-usedispatch/?ref=header_search
// https://redux-toolkit.js.org/tutorials/quick-start


//   https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist ....   redux-persist is a library for persisting Redux state to storage and rehydrating it upon application startup. It allows you to maintain the application state even after a page refresh or when the user navigates away and returns to the application. This is particularly useful for preserving user authentication status, settings, or any other data that needs to persist across sessions.

// persistConfig: This is an object containing configuration options for redux-persist.
// key: This is a required property that specifies the key to use when storing the persisted state in storage. It's typically a string that represents the top-level key under which all persisted state will be saved. In this case, it's set to 'root'.
// version: This property is optional and represents the version of the persisted state. It's used to detect if the structure of the persisted state has changed between app versions. If the structure changes, you may want to handle migrations of the persisted state. Here, it's set to 1.
// storage: This property specifies the storage engine to use for persisting the state. It can be localStorage, sessionStorage, or any other storage engine compatible with the Web Storage API. It's typically imported from redux-persist/lib/storage or redux-persist/lib/storage/session.


// In Redux, the combineReducers function is used to combine multiple reducers into a single reducer function. This is necessary because Redux only accepts a single reducer function to create the store, but in larger applications, it's common to have multiple reducers managing different parts of the state.


  const handleChange = (e) => {
    // console.log(e.target.value)
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
    // console.log("id: ", e.target.id)
    // console.log("value: ", e.target.value)
  }
  // console.log("form: ", formData);


  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!formData.userName || !formData.email || !formData.password) {
      return setErrorMessage('Please fill all the fields')
      
    }
    try {
      setLoading(true)
      setErrorMessage(null)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if(data.success === false){
        
        return setErrorMessage(data.message)
      }
      setLoading(false)
      if(res.ok){
        navigate('/sign-in')
      }
    } catch (error) {
      setErrorMessage(error.message)
      setLoading(false)
    }
  }


  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-8'>
        {/* left */}
        <div className='flex-1'>
          <Link to='/' className=' font-semibold dark:text-white text-4xl'>

          <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 rounded-lg via-purple-500 to-pink-500 text-white' >Blog</span>
          Hub
      </Link>
      <p className='text-sm mt-4'>
        This is a demo project. You can sign up with your email and password or with Google.
      </p>
        </div>
        {/* right */}

        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className=''>
              <Label value='Your username' />
              <TextInput placeholder='Username' type='text' id='userName' onChange={handleChange} />
            </div>
            <div className=''>
              <Label value='Your email' />
              <TextInput placeholder='Email' type='email' id='email' onChange={handleChange} />
            </div>
            <div className=''>
              <Label value='Your password' />
              <TextInput placeholder='Password' type='password' id='password' onChange={handleChange} />
            </div>
            <Button gradientDuoTone="purpleToPink" type='submit' disabled={loading}>
              {
                loading ? (
                  <>
                    <Spinner size='sm'/>
                    <span className='pl-3'>loading...</span>
                  </>
                ) : 'Sign Up'
              }
            </Button>
            <OAuth />
          </form>
          <div className='flex gap-2 text-sm mt-3'>
          <span>Have an account</span>
          <Link to='/sign-in' className='text-blue-500'>Sign In</Link>
        </div>
        {
          errrMessage && 
          <Alert className='mt-4' color='failure'>
            {errrMessage}
          </Alert>
        }
        </div>
        
      </div>
    </div>
  )
}

export default SignUp