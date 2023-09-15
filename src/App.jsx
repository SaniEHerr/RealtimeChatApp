import Home from './pages/Home/Home'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import "./styles.scss"

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from './context/AutchContext.jsx'

function App() {

  const {currentUser} = useContext(AuthContext);

  const ProtectedRoute = ({children}) => {
    if (!currentUser) {
      return <Navigate to="login" />
    }

    return children
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/'>
            <Route 
              index 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register /> } />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
