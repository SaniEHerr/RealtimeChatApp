import Sidebar from '../../components/Sidebar/Sidebar'
import Chat from '../../components/Chat/Chat'
import { useState } from 'react';

const Home = () => {

  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className='app'>
      <div className='initial'>
        <div className='home'>
          <div className="container">
            <Sidebar onSelectChat={setSelectedChat} />
            <Chat />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home