import React from 'react'
import getCurrentUser from "../../utils/GetCurrentUser";
import axios from 'axios';
import '../css/ProfilePicButton.css';

export default function ProfilePicUpload(){
    const [file, setFile] = React.useState(null)
    const [preview, setPreview] = React.useState(null)
    const [error, setError] = React.useState(null)
    const [success, setSuccess] = React.useState(null)
    const [showForm, setShowForm] = React.useState(false)

    const user = getCurrentUser()

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

    async function handleSubmit(e) {
        e.preventDefault();

        if (!file) {
            setError("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('access_token');
            const userId = user._id;
            const response = await axios.post(`https://mealpreppers.onrender.com/profilePicture/${userId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            if (response.status === 200) {
                setSuccess('Profile picture updated successfully.');
                setError(null);
                setShowForm(false);
            }
        } catch (error) {
            console.log(error);
            setError('Failed to upload profile picture.');
        }
    }

    return (
        <div className="profile-picture-upload">
            {!showForm ? (
                <button className="upload-button" onClick={() => setShowForm(true)}>Change Profile Picture</button>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="file-upload" className="custom-file-upload">
                        Choose a file
                    </label>
                    <input id="file-upload" type="file" name="file" onChange={handleFileChange} />
                    {preview && <img src={preview} alt="Image Preview" className="image-preview" />}
                    <button type="submit">Upload</button>
                    <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                </form>
            )}
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
        </div>
    );
}