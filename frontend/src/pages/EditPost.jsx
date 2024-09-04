import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom';


export default function EditPost() {
    const { state } = useLocation()
    const post = state?.post
    const [title, setTitle] = React.useState(post.title || '');
    const [comment, setComment] = React.useState(post.comment || '');
    const [estimatedTime, setEstimatedTime] = React.useState(post.estimatedTime || '');
    const [estimatedCost, setEstimatedCost] = React.useState(post.estimatedCost || '');
    const [file, setFile] = React.useState(null);
    const [preview, setPreview] = React.useState(post.image || '');
    const [error, setError] = React.useState(null);
    const navigate = useNavigate()


    async function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('comment', comment);
        formData.append('estimatedTime', estimatedTime);
        formData.append('estimatedCost', estimatedCost);
        if (file) {
            formData.append('file', file);
        }
    
        const token = localStorage.getItem('access_token');

        const response = await fetch(`http://localhost:2501/post/editPost/${post._id}`, {
            method: "PUT",
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });
        const data = await response.json();

        if (response.ok) {

            navigate(`/post/${post._id}`)
        } else {
            setError(data.error);
            console.log(error);
        }
    }

    function handleFileChange(e) {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreview(objectUrl);
        } else {
            setPreview(null);
        }
    }


    return (
        <div className="post-form-container">
            <form onSubmit={handleSubmit}>
                <h3>Edit Your Post</h3>
                <input
                    name="title"
                    id="title"
                    placeholder='Meal Name'
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                />
                <textarea
                    name="comment"
                    id="comment"
                    placeholder='Tell us about your meal (ingredients, directions, etc.)'
                    onChange={(e) => setComment(e.target.value)}
                    value={comment}
                />
                <input type="file"
                    name="file"
                    id="file"
                    onChange={handleFileChange}
                />
                {preview && <img src={preview} alt="Image Preview" className="image-preview" />}

                <input
                    type="number"
                    name="estimatedTime"
                    id="estimatedTime"
                    placeholder='Estimated Meal Cooking Time'
                    onChange={(e) => setEstimatedTime(e.target.value)}
                    value={estimatedTime}
                />
                <input
                    type="number"
                    name="estimatedCost"
                    id="estimatedCost"
                    placeholder='Estimated Meal Cost'
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    value={estimatedCost}
                />

                <button>Edit Meal</button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}