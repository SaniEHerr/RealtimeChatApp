import { useState } from 'react';
import AddAvatar from '../../img/addAvatar.png'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../../firebase"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {

  const [error, setError] = useState(false)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
  
    try {
      // Create the user account
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const storageRef = ref(storage, displayName);
  
      // Upload the file
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on(
        "state_changed",
        null,
        (uploadError) => {
          console.error("Upload error:", uploadError);
          setError(true);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(storageRef);
  
            // Update user profile and set user data
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName, 
              email,
              photoURL: downloadURL,
            });
  
            // Create empty user chats on Firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
  
            // Navigation should only happen after all operations are complete
            navigate("/");

          } catch (firestoreError) {
            console.error("Firestore error:", firestoreError);
            setError(true);
          }
        }
      );
    } catch (authError) {
      console.error("Authentication error:", authError);
      setError(true);
    }
  };

  return (
    <div className='formContainer'>
      <div className='formWrapper'>
        <span className='logo'>Sani Chat</span>
        <span className='title'>Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder='Display name' />
          <input type="email" placeholder='Email' />
          <input type="password" placeholder='Password' />
          <input style={{ display: 'none' }} type="file" id='file' />
          <label htmlFor="file">
            <img src={AddAvatar} alt="" />
            <span>Add a avatar</span>
          </label>
          <button>Sign up</button>
          { error && <span>Something went wrong</span> }
        </form>
        <p>You do have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  )
}

export default Register