import { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { TextInput, Button, Alert } from 'flowbite-react'
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from 'firebase/storage'
import { app } from '../firebase.js'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function DashProfile() {
  const { currentUser } = useSelector(state => state.user)
  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null)
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
  const [imageFileUploadError, setImageFileUploadError] = useState(null)
  // console.log(imageFileUploadProgress, imageFileUploadError);
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
    setImageFileUploadError(null)
    setImageFile(null)
    setImageFileUrl(null)
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
      (error) => {
        // Handle unsuccessful uploads
        setImageFileUploadError('Failed to upload image (file must be less than 2MB)')
        setImageFileUploadProgress(null)
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL)
        })
      }
    )

  }

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4'>
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
        {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert> }
        
        
        <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.userName} />
        <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} />
        <TextInput type='password' id='password' placeholder='password' />
        <Button type='submit' gradientDuoTone='purpleToBlue' outline>
          Update
        </Button>
      </form>
      <div className='text-red-500 flex justify-between mt-3'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}

export default DashProfile