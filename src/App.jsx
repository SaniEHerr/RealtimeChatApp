import Home from './pages/Home/Home'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import "./styles.scss"

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useContext, useMemo, useRef, useState } from 'react'
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

  // Rastreeo si el user esta en línea.
  const [isOnline, setIsOnline] = useState(false);
  // Rastreeo la ultima vez que se detecto una actividad del user.
  const [lastActivityTime, setLastActivityTime] = useState(null);

  // Representan 2 cosas:
  // El intervalo de verificacion de inactividad en ms.
  const inactivityCheckInterval = 1 * 60 * 1000; // 1 minuto en ms.
  // El umbral de inactividad en ms.
  const inactivityThreshold = 2 * 60 * 1000; // 2 minuto en ms.

  // Establezco un temporizador que verifica la inactividad del user.
  useEffect(() => {
    // Almaceno una ref al temporizador de inactividad.
    let inactivityTimeout;

    // Fn que se ejecuta cada vez que se detecte una interaccion del user, como el movimiento del mouse.
    const handleUserInteraction = () => {
      if (currentUser && !isOnline) {
        setIsOnline(true);
        updateOnlineStatus(currentUser.uid, true); // Llamo a la fn para actualizar el estado online del user en firebase.
      }

      // Reinicio el temporizador de inactividad utilizando clearTimeout(inactivityTimeout). Esto me sirve para evitar que el temporizador anterior  continue ejecutandose y garantiza que el nuevo temporizador se inicie desde cero cada vez que se detecte una interaccion del user.
      clearTimeout(inactivityTimeout);
      // Establezco un nuevo temporizador de inactividad utilizando setTimeout. Basicamente esta configurado para ejecutar una fn después de 1 minuto de inactividad.
      inactivityTimeout = setTimeout(() => {
        setIsOnline(false);
        updateOnlineStatus(currentUser.uid, false);
      }, 60000); // 1 minuto en ms.
    };

    // Si hay un currenUser, agrego handleUserInteraction como un manejador de eventos para el movimiento del mouse en la ventana. O sea que cada vez que el user mueva el mouse, se llamara a handleUserInteraction, lo que actualizara el estado en linea y reiniciara el temporizador de inactividad.contrario.
    if (currentUser) {
      window.addEventListener("mousemove", handleUserInteraction);
    }

    // Defino una fn de limpieza que se ejecuta cuando el componente se desmonte. 
    return () => {
      if (currentUser) {
        // Elimino el manejador de eventos "mousemove" para evitar fugas de memoria.
        window.removeEventListener("mousemove", handleUserInteraction);
      }
      // Limpio el temporizador de inactividad para evitar cualquier ejecucion futura de la fn que cambia el estado en linea.
      clearTimeout(inactivityTimeout);
    };
  }, [currentUser, isOnline]);

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

  // Aca utilizo useMemo; se utiliza para memorizar el resultado de una fn y volver a calcularlo solo cuando alguna de las dependencias especificadas cambie. En este caso, la dependencia es currentUser, lo que significa que este componente se recalcula solo cuando currentUser cambia.
  const ProtectedRoute = useMemo(() => ({ children }) => {
    // Si no hay un currentUser o sea un user authetificado, se vuelve al login
    if (!currentUser) {
      return <Navigate to="login" />;
    }

    // Si no se cumple, significa que hay un usuario autenticado y, en ese caso, se devuelve children. O sea que el contenido anidado que se pasa como hijo del componente ProtectedRoute se renderizara normalmente. Mas facil, si el user esta authenticado, el contenido dentro de <ProtectedRoute>...</ProtectedRoute> se va a mostrar sin cambios.
    return children;
  }, [currentUser]);

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



  // const [isOnline, setIsOnline] = useState(false);
  // const [lastActivityTime, setLastActivityTime] = useState(null);

  // const inactivityCheckInterval = 1 * 60 * 1000; // 10 minutos en milisegundos
  // const inactivityThreshold = 1 * 60 * 1000; // 1 minuto en milisegundos

  // useEffect(() => {
  //   const checkUserInactivity = async () => {
  //     if (currentUser && isOnline) {
  //       const currentTime = Date.now();

  //       if (
  //         lastActivityTime &&
  //         currentTime - lastActivityTime > inactivityThreshold
  //       ) {
  //         // El usuario ha estado inactivo durante más de 1 minuto
  //         setIsOnline(false);
  //         // Actualizar el estado isOnline a false en la base de datos
  //         updateOnlineStatus(currentUser.uid, false);
  //       }
  //     }
  //   };

  //   const intervalId = setInterval(checkUserInactivity, inactivityCheckInterval);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [currentUser, isOnline, lastActivityTime]);

  // // Agregar un manejador de eventos para detectar interacciones del usuario (movimiento del mouse)
  // useEffect(() => {
  //   const handleUserInteraction = () => {
  //     if (currentUser && !isOnline) {
  //       setLastActivityTime(Date.now());
  //       // Actualizar el estado local a true cuando se detecta una interacción
  //       setIsOnline(true);
  //       // Actualizar el estado isOnline a true en la base de datos
  //       updateOnlineStatus(currentUser.uid, true);
  //     }
  //   };

  //   window.addEventListener("mousemove", handleUserInteraction);

  //   return () => {
  //     window.removeEventListener("mousemove", handleUserInteraction);
  //   };
  // }, [currentUser, isOnline]);

  // // Agregar un manejador de eventos para detectar interacciones del usuario (movimiento del mouse)
  // useEffect(() => {
  //   const handleUserInteraction = () => {
  //     if (currentUser && !isOnline) {
  //       setLastActivityTime(Date.now());
  //       // Actualizar el estado local a true cuando se detecta una interacción
  //       setIsOnline(true);
  //       // Actualizar el estado isOnline a true en la base de datos
  //       updateOnlineStatus(currentUser.uid, true);
  //     }
  //   };

  //   window.addEventListener("mousemove", handleUserInteraction);

  //   return () => {
  //     window.removeEventListener("mousemove", handleUserInteraction);
  //   };
  // }, [currentUser, isOnline]);

  // const updateOnlineStatus = async (userId, isOnline) => {
  //   try {
  //     const userRef = doc(db, "users", userId);
  //     await updateDoc(userRef, {
  //       isOnline: isOnline,
  //       lastOnline: serverTimestamp(),
  //     });
  //   } catch (error) {
  //     console.error("Error al actualizar el estado en línea:", error);
  //   }
  // };

  // const ProtectedRoute = ({children}) => {
  //   if (!currentUser) {
  //     return <Navigate to="login" />
  //   }

  //   return children
  // }

  // const ProtectedRoute = ({children}) => {
  //   if (!currentUser) {
  //     return <Navigate to="login" />
  //   }

  //   return children
  // }




  // const lastInteractionTimeRef = useRef(null);
  // const inactivityCheckInterval = 1 * 60 * 1000; // 5 minutos en milisegundos

  // useEffect(() => {
  //   const checkUserInactivity = async () => {
  //     if (currentUser) {
  //       const usersRef = collection(db, "users");
  //       const usersQuery = query(usersRef, where("isOnline", "==", true));

  //       try {
  //         const usersSnapshot = await getDocs(usersQuery);
  //         const currentTime = Date.now();
  //         const inactivityLimit = 1 * 60 * 1000; // 10 minutos en milisegundos

  //         const batch = [];

  //         usersSnapshot.forEach((userDoc) => {
  //           const userData = userDoc.data();
  //           const lastOnlineTime = userData.lastOnline?.toDate().getTime() || 0;

  //           if (currentTime - lastOnlineTime > inactivityLimit) {
  //             // Agregar actualización en lote para cambiar el estado en línea
  //             batch.push(
  //               updateDoc(doc(db, "users", userDoc.id), {
  //                 isOnline: false,
  //                 lastOnline: serverTimestamp(),
  //               })
  //             );
  //           }
  //         });

  //         // Realizar una escritura en lote para actualizar múltiples usuarios a la vez
  //         if (batch.length > 0) {
  //           await Promise.all(batch);
  //         }
  //       } catch (error) {
  //         console.error(
  //           "Error al obtener la lista de usuarios en línea:",
  //           error
  //         );
  //       }
  //     }
  //   };

  //   const intervalId = setInterval(checkUserInactivity, inactivityCheckInterval);

  //   // Agregar un manejador de eventos para detectar interacciones del usuario (movimiento del mouse)
  //   const handleUserInteraction = () => {
  //     if (currentUser) {
  //       // Actualizar el estado isOnline a true cuando se detecta una interacción
  //       updateOnlineStatus(currentUser.uid, true);
  //       // Actualizar la marca de tiempo de la última interacción
  //       lastInteractionTimeRef.current = Date.now();
  //     }
  //   };

  //   window.addEventListener("mousemove", handleUserInteraction);

  //   return () => {
  //     clearInterval(intervalId);
  //     window.removeEventListener("mousemove", handleUserInteraction);
  //   };
  // }, [currentUser]);

  // const updateOnlineStatus = async (userId, isOnline) => {
  //   try {
  //     const userRef = doc(db, "users", userId);
  //     await updateDoc(userRef, {
  //       isOnline: isOnline,
  //       lastOnline: serverTimestamp(),
  //     });
  //   } catch (error) {
  //     console.error("Error al actualizar el estado en línea:", error);
  //   }
  // };