import { useState } from 'react';
import AddAvatar from '../../img/addAvatar.png'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../../firebase"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, serverTimestamp, setDoc } from "firebase/firestore"; 
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
    // Crear la cuenta de usuario
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const storageRef = ref(storage, displayName);

    // Subir el archivo
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      null,
      (uploadError) => {
        console.error("Error de carga:", uploadError);
        setError("Error al subir la imagen");
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(storageRef);

          // Actualizar el perfil del usuario y establecer los datos del usuario
          await updateProfile(res.user, {
            displayName,
            photoURL: downloadURL,
          });

          await setDoc(doc(db, "users", res.user.uid), {
            uid: res.user.uid,
            displayName,
            email,
            photoURL: downloadURL,
            isOnline: true,
            lastOnline: serverTimestamp(),
          });

          // Crear chats de usuario vacíos en Firestore
          await setDoc(doc(db, "userChats", res.user.uid), {});

          // La navegación solo debe ocurrir después de que se completen todas las operaciones
          navigate("/");
        } catch (firestoreError) {
          console.error("Error de Firestore:", firestoreError);
          setError("Error al actualizar los datos del usuario");
        }
      }
    );
  } catch (authError) {
    if (authError instanceof AuthError) {
      // Manejar errores de autenticación específicos aquí
      const errorCode = authError.code;
      switch (errorCode) {
        case "auth/email-already-in-use":
          setError("El correo electrónico ya está en uso.");
          break;
        case "auth/weak-password":
          setError("La contraseña es demasiado débil.");
          break;
        default:
          setError("Ha ocurrido un error de autenticación.");
          break;
      }
    } else {
      console.error("Error de autenticación:", authError);
      setError("Ha ocurrido un error de autenticación.");
    }
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