import Messages from '../Messages/Messages'
import InputMessage from '../InputMessage/InputMessage'

const Chat = () => {
  return (
    <div className='chat'>
      <div className="chatInfo">
        <span>Rndomizer</span>
      </div>
      <Messages />
      <InputMessage />
    </div>
  )
}

export default Chat