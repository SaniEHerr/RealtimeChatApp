const Navbar = () => {
  return (
    <div className='navbar'>
      <span className="logo">
        Sani Chat
      </span>
      <div className="user">
        <img src="https://media.licdn.com/dms/image/D4D35AQF-l7Of1Zz7yw/profile-framedphoto-shrink_400_400/0/1694045617429?e=1695304800&v=beta&t=WBaQX0gQFaSoelXPXvRQfogWwtsCyqcO6HplypJJsm8" alt="" />
        <span>Sani</span>
        <button>Log out</button>
      </div>
    </div>
  )
}

export default Navbar