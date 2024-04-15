import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice.js'
import OAuth from '../components/OAuth.jsx'


function SignIn() {
  const [formData, setFormData] = useState({})
  // const [errrMessage, setErrorMessage] = useState(null)
  // const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // react-redux-toolkit
  const dispatch = useDispatch()
  const { loading, error: errrMessage } = useSelector(state => state.user)



  const handleChange = (e) => {
    // console.log(e.target.value)
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
    // console.log("id: ", e.target.id)
    // console.log("value: ", e.target.value)
  }
  // console.log("form: ", formData);


  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!formData.email || !formData.password) {
      // return setErrorMessage('Please fill all the fields')
      return dispatch(signInFailure('Please fill all the fields'))
      
    }
    try {
      // setLoading(true)
      // setErrorMessage(null)
      dispatch(signInStart())
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if(data.success === false){
        // return setErrorMessage(data.message)
        dispatch(signInFailure(data.message))
      }
     
      if(res.ok){
        dispatch(signInSuccess(data))
        navigate('/')
      }
    } catch (error) {
      // setLoading(false)
      // setErrorMessage(error.message)
      dispatch(signInFailure(error.message))
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
        This is a demo project. You can sign in with your email and password or with Google.
      </p>
        </div>
        {/* right */}

        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            
            <div className=''>
              <Label value='Your email' />
              <TextInput placeholder='Email' type='email' id='email' onChange={handleChange} />
            </div>
            <div className=''>
              <Label value='Your password' />
              <TextInput placeholder='********' type='password' id='password' onChange={handleChange} />
            </div>
            <Button gradientDuoTone="purpleToPink" type='submit' disabled={loading}>
              {
                loading ? (
                  <>
                    <Spinner size='sm'/>
                    <span className='pl-3'>loading...</span>
                  </>
                ) : 'Sign In'
              }
            </Button>
            <OAuth />
          </form>
          <div className='flex gap-2 text-sm mt-3'>
          <span>Don't Have an account</span>
          <Link to='/sign-up' className='text-blue-500'>Sign Up</Link>
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

export default SignIn
