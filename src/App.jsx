import Home from './pages/Home/Home'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import "./styles.scss"

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from './context/AutchContext.jsx'

import React, { useEffect } from "react"; 
import { db } from "./firebase";
import {
  collection,
  query,
  where,
  doc,
  updateDoc,
  serverTimestamp,
  getDocs
} from "firebase/firestore";

function App() {

  const {currentUser} = useContext(AuthContext);

  // Función para verificar la inactividad de los usuarios en línea
  const checkUserInactivity = async () => {
    if (currentUser) {
      const usersRef = collection(db, "users");
      const usersQuery = query(usersRef, where("isOnline", "==", true));
      
      try {
        const usersSnapshot = await getDocs(usersQuery); 
  
        // 60000 es 1 minuto en milisegundos
        const inactivityLimit = 60000; // 1 minuto en milisegundos
  
        const currentTime = Date.now();
  
        usersSnapshot.forEach(async (userDoc) => {
          const userData = userDoc.data();
          const lastOnlineTime = userData.lastOnline?.toDate().getTime() || 0;
  
          if (currentTime - lastOnlineTime > inactivityLimit) {
            // Actualizar el estado isOnline a false si el usuario está inactivo
            await updateDoc(doc(db, "users", userDoc.id), {
              isOnline: false,
              lastOnline: serverTimestamp(),
            });
          }
        });
      } catch (error) {
        console.error("Error al obtener la lista de usuarios en línea:", error);
      }
    }
  };

  useEffect(() => {
    // Establecer un temporizador para verificar la inactividad cada X segundos
    // const interval = setInterval(checkUserInactivity, 10000); // Verificar cada 10 segundos
    const interval = setInterval(checkUserInactivity, 60000); // Verificar cada 1 minuto

    // Agregar un manejador de eventos para detectar interacciones del usuario (movimiento del mouse)
    const handleUserInteraction = () => {
      if (currentUser) {
        // Actualizar el estado isOnline a true cuando se detecta una interacción
        updateOnlineStatus(currentUser.uid, true);
      }
    };

    // Agregar el evento para detectar interacciones
    window.addEventListener("mousemove", handleUserInteraction);

    return () => {
      clearInterval(interval); // Limpieza del temporizador cuando se desmonta el componente
      window.removeEventListener("mousemove", handleUserInteraction); // Eliminar el manejador de eventos al desmontar
    };
  }, [currentUser]);

  const updateOnlineStatus = async (userId, isOnline) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        isOnline: isOnline,
        lastOnline: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error al actualizar el estado en línea:", error);
    }
  };

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
