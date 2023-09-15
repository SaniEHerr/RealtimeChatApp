import { signOut } from "firebase/auth"
import { auth } from "../../firebase"
import { useContext } from "react"
import { AuthContext } from "../../context/AutchContext"

const Navbar = () => {

  const {currentUser} = useContext(AuthContext)

  return (
    <div className='navbar'>
      <span className="logo">
        Sani Chat
      </span>
      <div className="user">
        <img src={currentUser.photoURL} alt="" />
        <span> {currentUser.displayName} </span>
        <button onClick={() => signOut(auth)}>Log out</button>
      </div>
    </div>
  )
}

export default Navbar