import React, {useState, useEffect} from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import {changeProfile, logout} from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import app from "../../firebase";

//passing in the setOpen function
const EditProfile = ({ setOpen }) => {
    const {currentUser} = useSelector((state) => state.user);

    // upload image state
    const [img, setImg] = useState(null);
    // going to use Firebase's bubilt in progress bar for this state
    const [imgUploadProgress, setImgUploadProgress] = useState(0);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    //this function handles the uploading of the image to firebase
    // for further reading, firebase docs has an excellent example on storage
    const uploadImg = (file) => {
        const storage = getStorage(app);
        // this creates a unique filename for every uploaded image
        const fileName = new Date().getTime() + file.name;
        // this uploades the image
        const storageRef = ref(storage, fileName);
        // uploadBytesResumable is a firebase configuration
        const uploadTask = uploadBytesResumable(storageRef, file);
        // uploadTask is abuilt in firebase function, this instance we're using it to give a snapshot of the total number of bytes uploaded so far, this is copied from the firebase docs. 
        // only difference is instead of console logs, the progressbar state is updated
        uploadTask.on('state_changed',
        (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImgUploadProgress(Math.round(progress));
                switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
                default:
                    break;
                }
        }, 
        (error) => {}, 
        () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                try {
                    console.log(downloadURL);
                    //wait to fetch the currentuser's id, then pass in the downloadURL into the profilePicture 
                    await axios.put(`/users/${currentUser._id}`, {
                        profilePicture: downloadURL,
                    });
                } catch (error) {
                    console.log(error);
                }

                dispatch(changeProfile(downloadURL));
            });
        });
    };

    //async'd in order to reach the server at the same time
    const handleDelete = async () => {
        await axios.delete(`/users/${currentUser._id}`);
        dispatch(logout());
        navigate("/signin");
  };


    // if the image exists we upload the image that has been changed in the img state, we then fire off the useEffect to upload that img 
    useEffect(() => {
         // eslint-disable-next-line react-hooks/exhaustive-deps
        img && uploadImg(img);
    }, [img]);

    return (
        <div className="absolute w-full h-full top-0 left-0 bg-transparent flex items-center justify-center">
            <div className="w-[600px] h-[600px] bg-slate-200 rounded-lg p-8 flex flex-col gap-4 relative">
                
                {/* when the X is clicked, setOpen is false, closing the modal */}
                <button className="absolute top-3 right-3 cursor-pointer" 
                onClick={() => setOpen(false)}>X</button>
                
                <h2 className="font-bold text-xl">Edit Profile</h2>
                <p>Choose a new profile picture</p>

                {imgUploadProgress > 0 ? (
                    "Uploading " + imgUploadProgress + "%"
                ) : (
                    //this is the input where image files can be uploaded, it accepts any image format and on change updates the img state
                    <input type="file" className="bg-transparent border border-slate-500 rounded p-2" accept="image/*" onChange={(e) => setImg(e.target.files[0])}
                    />
                )}

                
                <p>Delete Account</p>
                <button className="bg-red-500 text-white py-2 rounded-full" onClick={handleDelete}>Delete account</button>
            </div>
        </div>
    );

};

export default EditProfile;