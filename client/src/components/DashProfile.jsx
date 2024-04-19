import { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { TextInput, Button, Alert, Modal } from 'flowbite-react'
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from 'firebase/storage'
import { app } from '../firebase.js'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutSuccess } from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { Link } from 'react-router-dom'


function DashProfile() {
  const { currentUser, error, loading } = useSelector(state => state.user)
  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null)
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
  const [imageFileUploadError, setImageFileUploadError] = useState(null)
  const [imageFileUploading, setImageFileUploading] = useState(false)
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
  const [updateUserError, setUpdateUserError] = useState(null)
  const [showModal, setShowModal] = useState(false) // this is for modal to show delete account confirmation from front end and this is using for flowbite Modal component to show the modal when user click on delete account button
  const [formData, setFormData] = useState({}) // we will fill this form data by the information that is changing
  // console.log(imageFileUploadProgress, imageFileUploadError);
  const dispatch = useDispatch()
  

  const filePickerRef = useRef()
  // https://react.dev/reference/react/useRef
  // useRef() hook: We use useRef() to create a reference to a DOM element. This allows us to access and interact with the DOM element imperatively (i.e., without re-rendering the component).
// onClick={() => filePickerRef.current.click()}: We use this setup to trigger a click event on a file input element (<input type="file" />) when some other element (e.g., a button) is clicked. This is a common pattern used when you want to open the file picker dialog programmatically without showing the default file input element to the user.
// () => filePickerRef.current.click(): This is an arrow function defined as the event handler. When the element is clicked, this function will be called.
// filePickerRef.current: Accesses the .current property of the filePickerRef object. This property holds the reference to a DOM element.
// .click(): Invokes the click method on the referenced DOM element. This programmatically triggers a click event on that element.

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if(file){
      setImageFile(file)
      setImageFileUrl(URL.createObjectURL(file))
    }
  }
  // console.log(imageFile, imageFileUrl);
  useEffect(() => {
    if(imageFile){
      uploadImage()
    }
  }, [imageFile])

  const uploadImage = async () => {
    setImageFileUploading(true)
    setImageFileUploadError(null)
    
    // console.log('uploading image');
    // firebase storage configuration if want to see that go to firebase console -> under build -> storage -> (get started if new user) -> rules

    // https://firebase.google.com/docs/storage/web/start?hl=en&authuser=0
    const storage = getStorage(app)
    const fileName = new Date().getTime() + imageFile.name

    
    // https://firebase.google.com/docs/storage/web/create-reference?hl=en&authuser=0
    // In order to upload or download files, delete files, or get or update metadata, you must create a reference to the file you want to operate on.
    const storageRef = ref(storage, fileName)

    // Upload from a Blob or File....   https://firebase.google.com/docs/storage/web/upload-files?hl=en&authuser=0
    // Once you've created an appropriate reference, you then call the uploadBytes() method. uploadBytes() takes files via the JavaScript File and Blob APIs and uploads them to Cloud Storage.
    // 'file' comes from the Blob or File API
    const uploadTask = uploadBytesResumable(storageRef, imageFile)


    // check this in Upload from a Blob or File....   https://firebase.google.com/docs/storage/web/upload-files?hl=en&authuser=0  under 'Monitor upload progress'
    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on( 
      'state_changed',
      (snapShot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapShot.bytesTransferred / snapShot.totalBytes) * 100
        setImageFileUploadProgress(progress.toFixed(0))

      },
      () => { // error observer
        // Handle unsuccessful uploads
        setImageFileUploadError('Failed to upload image (file must be less than 2MB)')
        setImageFileUploadProgress(null)
        setImageFile(null)
        setImageFileUrl(null)
        setImageFileUploading(false)
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL)
          setFormData({ ...formData, profilePicture: downloadURL}) // here ...formData is used to keep the previous data and add new data to it which is user updated, previous data like username, email, password
          setImageFileUploading(false)
          
        })
      }
    )

  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value})  // ...formData is used to keep the previous information...  e.target.id here id can be username, email, password and e.target.value is the value of that id
  };
  // console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUpdateUserError(null)
    setUpdateUserSuccess(null)
    if(Object.keys(formData).length === 0){
      setUpdateUserError("No changes made")
      return
    }
    if(imageFileUploading){
      setUpdateUserError("Please wait for image to upload")
      return
    }
    try {
      // dispatch(updateStart())
      // const res = await fetch(`/api/user/update/${currentUser._id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData)
      // })
      // const data = await res.json()
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if(!res.ok){
        dispatch(updateFailure(data.message))
        setUpdateUserError(data.message)
      }
      else {
        dispatch(updateSuccess(data))
        setUpdateUserSuccess("User profile updated successfully")
      }
    } catch (error) {
      dispatch(updateFailure(error.message))
      setUpdateUserError(error.message)
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false)
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE'
      })
      const data = res.json()
      if(!res.ok){
        dispatch(deleteUserFailure(data.message))
      }
      else{
        dispatch(deleteUserSuccess(data))
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

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
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />
        <div className='relative  w-32 h-32 self-center shadow-md overflow-hidden rounded-full cursor-pointer' onClick={()=> filePickerRef.current.click()}>

          {/* https://www.npmjs.com/package/react-circular-progressbar */}
          {imageFileUploadProgress && (
              <CircularProgressbar value={imageFileUploadProgress || 0} 
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  height: '100%',
                  width: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`,
                },
              }}
              />
            )
          } 
          <img src={imageFileUrl || currentUser.profilePicture} alt="user" className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`} />
        </div>
        {imageFileUploadError && (<Alert color='failure'>{imageFileUploadError}</Alert>) }
        
        
        <TextInput type='text' id='userName' placeholder='username' defaultValue={currentUser.userName} onChange={handleChange} />
        <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange} />
        <TextInput type='password' id='password' placeholder='password' onChange={handleChange} />
        <Button type='submit' gradientDuoTone='purpleToBlue' outline disabled={loading || imageFileUploading}>
            {loading ? 'Loading...' : 'Update'}
        </Button>
        {
          currentUser.isAdmin && (
            <Link to='/create-post'>
              <Button type='button' gradientDuoTone='purpleToPink' className='w-full'>
                Create a Post
              </Button>
            </Link>
            
          )
        }
      </form>
      <div className='text-red-500 flex justify-between mt-3'>
        <span onClick={() => setShowModal(true)} className='cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='cursor-pointer'>Sign Out</span>
      </div>
      {updateUserSuccess && (
          <Alert color='success' className='mt-5'>
            {updateUserSuccess}
          </Alert>
        )
      }
      {updateUserError && (
          <Alert color='failure' className='mt-5'>
            {updateUserError}
          </Alert>
        )
      }

      {error && (
          <Alert color='failure' className='mt-5'>
            {error}
          </Alert>
        )
      }

      {/* In Flowbite, a modal is a UI component that displays content on top of the current page, typically in a centered overlay. It's commonly used for displaying additional information, forms, messages, or any other content that requires user attention without navigating away from the current page.
      https://flowbite-react.com/docs/components/modal */}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account?</h3>
          </div>
          <div className='flex justify-center gap-4'>
            <Button color='failure' onClick={handleDeleteUser}>
              Yes, I'm sure
            </Button>
            <Button onClick={() => setShowModal(false)} color='gray'>
              No
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* The onClose prop in React is typically used to provide a callback function that will be called when a component or modal is closed. It's commonly used in scenarios where you want to perform certain actions or state updates when the component or modal is closed by the user. */}


    </div>
  )
}

export default DashProfile