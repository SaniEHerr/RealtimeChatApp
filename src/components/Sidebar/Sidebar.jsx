import Navbar from '../Navbar/NavBar'
import Search from '../Search/Search'
import Chats from '../Chats/Chats'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <Navbar />
      <Search />
      <Chats />
    </div>
  )
}

export default Sidebar