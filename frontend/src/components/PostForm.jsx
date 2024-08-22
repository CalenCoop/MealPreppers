import React from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import '../css/PostForm.css';

export default function PostForm(){
const [title, setTitle] = React.useState('') 
const [comment, setComment] = React.useState('')
const [estimatedTime, setEstimatedTime] = React.useState('') 
const [estimatedCost, setEstimatedCost] = React.useState('') 
const [file, setFile] = React.useState(null)
const [preview, setPreview] = React.useState(null)
const [error, setError] = React.useState(null)
const [showForm, setShowForm]= React.useState(false)

async function handleSubmit(e){
    e.preventDefault()

    const formData = new FormData()
    formData.append('title', title)
    formData.append('comment', comment)
    formData.append('estimatedTime', estimatedTime)
    formData.append('estimatedCost', estimatedCost)
    formData.append('file', file)

    const token = localStorage.getItem('access_token')

    const response = await fetch("http://localhost:2501/post/createPost/", {
        method: "POST",
        body: formData,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
    });
    const data = await response.json()

    if(response.ok){
      setTitle('');
      setComment('');
      setEstimatedTime('');
      setEstimatedCost('');
      setFile(null);
      setPreview(null);
      setError(null);
      setShowForm(false)
      console.log('new post added', data);
    }else{
        setError(data.error)
        console.log(error)
    }
}

function handleFileChange(e){
    const selectedFile = e.target.files[0]
    setFile(selectedFile)

    if(selectedFile){
        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)
    }else{
        setPreview(null)
    }
}
    return (
        <>
        {!showForm ?  <div className="show-form-button">
            <h3>Add a New Meal</h3>
            <button onClick={()=> setShowForm(!showForm)}>Add meal</button>
            </div> 
            : 
            <div className="post-form-container">
                <form onSubmit={handleSubmit}>
                    <h3>Add a New Meal</h3>
                    <input
                    name="title" 
                    id="title" 
                    placeholder='Meal Name' 
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    />


                    <ReactQuill 
                    theme='snow'
                    value={comment}
                    onChange={setComment}
                    placeholder='Tell us about your meal (ingredients, directions, etc.)'
                    className="rich-text-editor"
                    /> 
                    <div className="file-input-container">
                        <input type= "file"
                        name="file" 
                        id="file" 
                        onChange={handleFileChange}
                        />
                        {preview && <img src={preview} alt="Image Preview" className="image-preview" />}
                    </div>

                    <input
                    type= "number"
                    name="estimatedTime" 
                    id="estimatedTime" 
                    placeholder='Estimated Meal Cooking Time' 
                    onChange={(e) => setEstimatedTime(e.target.value)}
                    value={estimatedTime}
                    />
                    <input
                    type= "number"
                    name="estimatedCost" 
                    id="estimatedCost" 
                    placeholder='Estimated Meal Cost' 
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    value={estimatedCost}
                    /> 
                    <button>Add Meal</button>
                </form>
                
            </div>
            }
        </>
    )
}