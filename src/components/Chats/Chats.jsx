import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../context/AutchContext";
import { ChatContext } from "../../context/ChatContext";
import { db } from "../../firebase";
import { Icon } from "@iconify/react";

const Chats = ({ onSelectChat  }) => {
  const [chats, setChats] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [onlineStatus, setOnlineStatus] = useState({}); // Estado en línea de los usuarios

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  // Función para escuchar el estado en línea del usuario
  const listenUserOnlineStatus = (userId) => {
    const userStatusRef = doc(db, "users", userId);

    return onSnapshot(userStatusRef, (doc) => {
      const isUserOnline = doc.exists && doc.data().isOnline;
      setOnlineStatus((prevStatus) => ({
        ...prevStatus,
        [userId]: isUserOnline,
      }));
    });
  };

  useEffect(() => {
    // Escucha el estado en línea para todos los usuarios en los chats
    Object.values(chats).forEach((chat) => {
      if (chat?.userInfo?.uid) {
        const userId = chat.userInfo.uid;
        listenUserOnlineStatus(userId);
      }
    });
  }, [chats]);

  const handleSelect = (user) => {
    dispatch({ type: "CHANGE_USER", payload: user });
    setSelectedUser(user);
    onSelectChat(user); // Llamar a la función onSelectChat con el usuario seleccionado
  };

  function formatDate(timestamp) {
    const currentDate = new Date();
    const messageDate = timestamp.toDate();
  
    const currentDateWithoutTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const messageDateWithoutTime = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
  
    const timeDifference = currentDateWithoutTime - messageDateWithoutTime;
    const oneDay = 24 * 60 * 60 * 1000;
  
    if (timeDifference < oneDay) {
      return messageDate.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      });
    } else if (timeDifference === oneDay) {
      // timeDifference < 2 * oneDay
      return 'Ayer';
    } else if (timeDifference < 7 * oneDay) {
      const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      return daysOfWeek[messageDate.getDay()];
    } else {
      const day = messageDate.getDate().toString().padStart(2, '0');
      const month = (messageDate.getMonth() + 1).toString().padStart(2, '0');
      const year = messageDate.getFullYear();
      return `${day}/${month}/${year}`;
    }
  }
  
  return (
    <div className="chats">
      {Object.entries(chats)
        .sort((a, b) => b[1].date - a[1].date)
        .map((chat, index) => (
          <div
            className={`userChat ${
              selectedUser === chat[1].userInfo ? "selected" : ""
            } ${index === 0 ? "first" : ""}`}
            key={chat[0]}
            onClick={() => handleSelect(chat[1].userInfo)}
          >
            {chat[1].userInfo && (
              <>
                <div className="userImageContainer">
                  <img src={chat[1].userInfo.photoURL} alt="user image" />
                  {onlineStatus[chat[1].userInfo.uid] ? (
                    // <Icon icon="ic:baseline-check-circle" className="online-icon" />
                    <span className="online-icon" />
                    ) : (
                    // <Icon icon="ic:baseline-highlight-off" className="offline-icon" />
                    <span className="offline-icon" />
                  )}
                </div>

                <div className="userChatInfo">
                  <div className="firstRow">
                    <span>{chat[1].userInfo.displayName}</span>
                    {chat[1].lastMessage?.timestamp && (
                      <p className="lastMessageTime">
                        {formatDate(chat[1].lastMessage.timestamp)}
                      </p>
                    )}
                  </div>
                  <p>{chat[1].lastMessage?.text}</p>
                </div>
              </>
            )}
          </div>
        ))}
        
    </div>
  );
};

export default Chats;





      {/* {
        Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat, index) => (
          <div 
            className={`userChat ${selectedUser === chat[1].userInfo ? 'selected' : ''} ${index === 0 ? 'first' : ''}`}
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
      } */}