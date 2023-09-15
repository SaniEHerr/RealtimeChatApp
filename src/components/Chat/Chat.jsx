import Messages from '../Messages/Messages'
import InputMessage from '../InputMessage/InputMessage'
import { useContext } from 'react'
import { ChatContext } from '../../context/ChatContext'

const Chat = () => {

  const { data } = useContext(ChatContext);
  // console.log(data);

  return (
    <div className='chat'>
      <div className="chatInfo">
        <img src={data.user?.photoURL} alt="user image" />
        <span>{data.user?.displayName}</span>
      </div>
      <Messages />
      <InputMessage />
    </div>
  )
}

export default Chat