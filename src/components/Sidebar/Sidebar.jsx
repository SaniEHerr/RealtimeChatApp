import Navbar from '../Navbar/NavBar'
import Search from '../Search/Search'
import Chats from '../Chats/Chats'

const Sidebar = ({ onSelectChat }) => {
  return (
    <div className='sidebar'>
      <Navbar />
      <Search />
      <Chats onSelectChat={onSelectChat} />
    </div>
  )
}

export default Sidebar