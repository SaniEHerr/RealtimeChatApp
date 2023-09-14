import React from 'react'
import AddAvatar from '../../img/addAvatar.png'

const Register = () => {
  return (
    <div className='formContainer'>
      <div className='formWrapper'>
        <span className='logo'>Sani Chat</span>
        <span className='title'>Register</span>
        <form>
          <input type="text" placeholder='Display name' />
          <input type="email" placeholder='Email' />
          <input type="password" placeholder='Password' />
          <input style={{ display: 'none' }} type="file" id='file' />
          <label htmlFor="file">
            <img src={AddAvatar} alt="" />
            <span>Add a avatar</span>
          </label>
          <button>Sign up</button>
        </form>
        <p>You do have an account? Login</p>
        {/* <p>You do have an account? <Link to="/login">Login</Link></p> */}
      </div>
    </div>
  )
}

export default Register