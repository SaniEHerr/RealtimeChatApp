import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Login = () => {
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Cuando el usuario inicia sesión, actualiza el campo isOnline a true
      const userId = userCredential.user.uid;
      await updateUserIsOnline(userId, true);

      await updateUserIsOnline(userId, true);
      navigate("/"); // Navega al usuario a la página principal después de iniciar sesión
    } catch (authError) {
      console.error("Authentication error:", authError);
      setError(true);
    }
  };

  // Función para actualizar el campo isOnline
  const updateUserIsOnline = async (userId, isOnline) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        isOnline: true,
        lastOnline: serverTimestamp()
      })
    } catch (error) {
      console.error("Error al actualizar el estado en línea:", error);
    }
  };

  // const loginGoogle = async () => {
  //   const provider = new GoogleAuthProvider();

  //   signInWithPopup(auth, provider)
  //     .then((result) => {
  //       // This gives you a Google Access Token. You can use it to access the Google API.
  //       const credential = GoogleAuthProvider.credentialFromResult(result);

  //       const token = credential.accessToken;

  //       // The signed-in user info.
  //       const user = result.user;
  //       // IdP data available using getAdditionalUserInfo(result)
  //       // ...
  //       navigate("/"); // Navega al usuario a la página principal después de iniciar sesión
  //   }).catch((error) => {
  //     // Handle Errors here.
  //     const errorCode = error.code;
  //     const errorMessage = error.message;
  //     // The email of the user's account used.
  //     const email = error.customData.email;
  //     // The AuthCredential type that was used.
  //     const credential = GoogleAuthProvider.credentialFromError(error);
  //     // ...
  //   });
  // }

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Sani Chat</span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button>Sign in</button>
          {/* <button onClick={loginGoogle}>Sing in with Google</button> */}
          {error && <span>Something went wrong</span>}
        </form>
        <p>
          You don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

// const Login = () => {

//   const [error, setError] = useState (false)
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const email = e.target[0].value;
//     const password = e.target[1].value;
  
//     try {
//       await signInWithEmailAndPassword(auth, email, password)
//       navigate("/")
//     } catch (authError) {
//       console.error("Authentication error:", authError);
//       setError(true);
//     }
//   };

//   return (
//     <div className="formContainer">
//       <div className="formWrapper">
//         <span className="logo">Lama Chat</span>
//         <span className="title">Login</span>
//         <form onSubmit={handleSubmit}>
//           <input type="email" placeholder="Email" />
//           <input type="password" placeholder="Password" />
//           <button>Sign in</button>
//           { error && <span>Something went wrong</span> }
//         </form>
//         <p>You don't have an account? <Link to="/register">Register</Link></p>
//       </div>
//     </div>
//   );
// };

// export default Login;

