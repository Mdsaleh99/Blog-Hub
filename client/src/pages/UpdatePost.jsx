import { FileInput, Select, TextInput, Button, Alert } from 'flowbite-react'
import { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase.js'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'


export default function UpdatePost() {
    const [file, setFile] = useState(null)
    const [imageUploadProgress, setImageUploadProgress] = useState(null)
    const [imageUploadError, setImageUploadError] = useState(null)
    const [publishError, setPublishError] = useState(null)
    const [formData, setFormData] = useState({})
    //  console.log(formData);
    //  console.log(file);
    // https://reactrouter.com/en/main/hooks/use-params           The useParams hook is a React Router hook that allows you to access the parameters (or URL segments) of the current route in a functional component. It's commonly used when you need to access dynamic parts of the URL, such as route parameters.
    const { postId } = useParams()

    // https://reactrouter.com/en/main/hooks/use-navigate
    const navigate = useNavigate()
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        try {
            const fetchPost = async () => {
                const res = await fetch(`/api/post/getposts?postId=${postId}`);
                const data = await res.json()
                if(!res.ok){
                    console.log(data.message);
                    setPublishError(data.message)
                    return
                }
                if(res.ok){
                    setPublishError(null)
                    setFormData(data.posts[0])
                }
            }
            fetchPost()
        } catch (error) {
            console.log(error.message);
        }
    }, [postId])

    
    const handleUploadImage = async () => {
        try {
            if(!file){
                setImageUploadError('Please select an image to upload')
                return
            }
            setImageUploadError(null) // Clear the error message if there was one
            const storage = getStorage(app)
            const fileName = new Date().getTime() + '-' + file.name
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    setImageUploadProgress(progress.toFixed(0)) // toFixed(0) removes the decimal points 
                },
                (error) => {
                    setImageUploadError('Failed to upload the image')
                    setImageUploadProgress(null)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadProgress(null)
                        setImageUploadError(null)
                        setFormData({...formData, image: downloadURL})
                    })
                }

            )
        } catch (error) {
            setImageUploadError('Failed to upload the image')
            setImageUploadProgress(null)
            console.log(error);
        }
    }

    // const handleSubmit = async (e) => {
    //     e.preventDefault()
    //     try {
    //         const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(formData)
    //         })
    //         const data = await res.json()
            
    //         if(!res.ok){
    //             setPublishError(data.message)
    //             return
    //         }

    //         if(res.ok){
    //             setPublishError(null)
    //             navigate(`/post/${data.slug}`) 
    //         }
    //     } catch (error) {
    //         setPublishError('Something went wrong')
    //     }
    // }

     const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>Update Post</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                <TextInput type='text' placeholder='Title' required id='title' className='flex-1' onChange={(e) => setFormData({...formData, title: e.target.value})} value={formData.title} /> 
                {/* e.target.value -> Returns the value of the data at the cursor's current position. */}
                <Select onChange={(e) => setFormData({...formData, category: e.target.value})} value={formData.category}>
                    <option value="uncategorized">Select a category</option>
                    <option value="javascript">JavaScript</option>
                    <option value="React">React</option>
                    <option value="MongoDB">MongoDB</option>
                    <option value="Java">Java</option>
                    <option value="Python">Python</option>
                </Select> 
            </div>

            <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
                <FileInput type='file' accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
                <Button type='button' gradientDuoTone='purpleToBlue' size='sm' outline onClick={handleUploadImage} disabled={imageUploadProgress} >
                    {
                        imageUploadProgress ? (
                            <div className='w-16 h-16'>
                                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} 
                                />
                            </div>
                            
                        ) : (
                            'Upload Image'
                        )
                    }
                </Button>
            </div>

            {imageUploadError && (
                <Alert color='failure'>
                    {imageUploadError}
                </Alert>)
            }
            
            {formData.image && (
                <img src={formData.image} alt="upload" className='w-full h-72 object-cover' />
            )}

            <ReactQuill theme='snow' value={formData.content} placeholder='Write something....' className='h-72 mb-12' required onChange={(value) => setFormData({...formData, content: value})}  /> 
            {/* here reactQuill automatically adding content in to <p> tag  */}
            <Button type='submit' gradientDuoTone='purpleToBlue' >
                Update post
            </Button>

            {publishError && (
                <Alert color='failure' className='mt-5'>
                    {publishError}
                </Alert>
            )}
        </form>
    </div>
  )
}

