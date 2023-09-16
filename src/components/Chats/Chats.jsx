import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AutchContext";
import { ChatContext } from "../../context/ChatContext";
import { db } from "../../firebase";


const Chats = () => {

  const [chats, setChats] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Nuevo estado para el usuario seleccionado

  const { currentUser } = useContext(AuthContext)
  const { dispatch } = useContext(ChatContext)


  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    }
    
    currentUser.uid && getChats();
  }, [currentUser.uid])

  const handleSelect = (user) => {
    dispatch({ type: "CHANGE_USER", payload: user })
    setSelectedUser(user); // Establece el usuario seleccionado cuando se hace clic en un userChat
  }

  return (
    <div className='chats'>
      {
        Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
          <div 
            className={`userChat ${selectedUser === chat[1].userInfo ? 'selected' : ''}`}
            key={chat[0]} 
            onClick={() => handleSelect(chat[1].userInfo)}
          >
            <img src={chat[1].userInfo.photoURL} alt="user image" />
            <div className="userChatInfo">
              <span>{chat[1].userInfo.displayName}</span>
              <p>{chat[1].lastMessage?.text}</p>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default Chats