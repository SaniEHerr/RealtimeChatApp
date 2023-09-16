import { useContext, useRef, useEffect, useState } from "react"
import { AuthContext } from "../../context/AutchContext"
import { ChatContext } from "../../context/ChatContext"

const Message = ({message}) => {

  const { currentUser } = useContext(AuthContext)
  const { data } = useContext(ChatContext)

  const ref = useRef()

  useEffect(() => {
    ref.current?.scrollIntoView({behavior: "smooth"})
  }, [message])

  // Función para formatear la fecha y hora del mensaje
  const formatMessageDate = (timestamp) => {
    const messageDate = new Date(timestamp * 1000); // Multiplicar por 1000 para convertir a milisegundos
    const hours = messageDate.getHours();
    const minutes = messageDate.getMinutes();
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
  };

  return (
    <div ref={ref} className={`message ${message.senderId === currentUser.uid && 'owner'}`}>
      <div className="messageInfo">
        <img 
          className="chatUserImage"
          src={
            message.senderId === currentUser.uid 
              ? currentUser.photoURL 
              : data.user.photoURL} 
          alt="user-image" 
        />
      </div>
      <div className="messageContent">
        <div>
          <p>{message.text}</p>
          {message.image && <img src={message.image} alt="" />}
          <span>{formatMessageDate(message.date.seconds)}</span> {/* Formatear la fecha y hora */}
        </div>
      </div>
    </div>
  )
} 

export default Message