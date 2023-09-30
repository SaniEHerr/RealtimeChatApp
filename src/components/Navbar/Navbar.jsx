import { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { AuthContext } from "../../context/AutchContext";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore"; // Importa updateDoc

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  const handleLogout = async () => {
    // Actualiza el estado en línea a "false" antes de cerrar sesión
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        isOnline: false,
        lastOnline: serverTimestamp()
      });

      // Realiza el cierre de sesión
      await signOut(auth);
    } catch (error) {
      console.error("Error updating online status:", error);
    }
  };

  return (
    <div className="navbar">
      <div className="user">
        <img src={currentUser.photoURL} alt="" />
        <span> {currentUser.displayName} </span>
      </div>
      <button className="logout" onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
};

export default Navbar;