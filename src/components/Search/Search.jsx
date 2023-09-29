import { collection, doc, getDocs, getDoc, query, serverTimestamp, setDoc, updateDoc, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase"
import { useContext, useState, useEffect } from "react";
import { AuthContext } from '../../context/AutchContext'
import { Icon } from '@iconify/react';

const Search = () => {
  const [username, setUsername] = useState("");
  const [userList, setUserList] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    // Verifica si el campo de búsqueda no está vacío antes de iniciar la consulta Firestore
    if (username.trim() === "") {
      setUserList([]); // Si está vacío, borra la lista de usuarios
      return;
    }

    const unsubscribe = onSnapshot(
      query(collection(db, "users"), where("displayName", ">=", username.trim())),
      (snapshot) => {
        const users = [];
        snapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.displayName.toLowerCase().includes(username.trim().toLowerCase())) {
            users.push(userData);
          }
        });
        setUserList(users);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [username]);

  const handleKey = (e) => {
    if (e.code === "Enter") {
      // Realiza acciones al presionar Enter, si es necesario
    }
  }

  const handleSelect = async (selectedUser) => {
    try {
      // Verifica si ya existe una conversación entre los usuarios
      const combineId =
        currentUser.uid > selectedUser.uid
          ? currentUser.uid + selectedUser.uid
          : selectedUser.uid + currentUser.uid;

      const chatDocRef = doc(db, "chats", combineId);
      const chatDocSnap = await getDoc(chatDocRef);

      if (!chatDocSnap.exists()) {
        // Si la conversación no existe, créala en la colección de chats
        await setDoc(chatDocRef, { messages: [] });

        // Agrega la información del usuario a tus chats
        const yourChatDocRef = doc(db, "userChats", currentUser.uid);
        const theirChatDocRef = doc(db, "userChats", selectedUser.uid);

        await updateDoc(yourChatDocRef, {
          [combineId]: {
            userInfo: {
              uid: selectedUser.uid,
              displayName: selectedUser.displayName,
              photoURL: selectedUser.photoURL,
            },
            date: serverTimestamp(),
          },
        });

        await updateDoc(theirChatDocRef, {
          [combineId]: {
            userInfo: {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
            },
            date: serverTimestamp(),
          },
        });
      }
    } catch (error) {
      console.error("Error al agregar a la persona a la lista de chats", error);
    }

    // setUser(null);
    setUsername(""); 
  };

  return (
    <div className='search'>
      <div className="searchForm">
        <div className="searchContainer">
          <Icon className="searchIcon" icon="material-symbols:search" />
          <input
            type="text"
            placeholder='Find a user...'
            onKeyDown={handleKey}
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </div>
      </div>
      {userList.length > 0 && (
        <div className="userList">
          {userList.map((user) => (
            <div
              className="userChat"
              key={user.uid}
              onClick={() => handleSelect(user)}
            >
              <img src={user.photoURL} alt="" />
              <div className="userChatInfo">
                <span>{user.displayName}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;


// const Search = () => {

//   const [username, setUsername] = useState("")
//   const [user, setUser] = useState(null)
//   const [error, setError] = useState(false)

//   const {currentUser} = useContext(AuthContext)

//   const handleSearch = async () => {
//     const q = query(
//       collection(db, "users"), 
//       where("displayName", "==", username));
    
//     try {
//       const querySnapshot = await getDocs(q);
//       querySnapshot.forEach((doc) => {
//         setUser(doc.data())
//       });
      
//     } catch (error) {
//       setError(true);
//     }
//   }

//   const handleKey = (e) => {
//     e.code === "Enter" && handleSearch();
//   }

//   const handleSelect = async () => {
//     // Check wether the group (chats in firestore) exists, if not create
//     const combineId = 
//       currentUser.uid > user.uid
//         ? currentUser.uid + user.uid
//         : user.uid + currentUser.uid;

//     try {
//       const res = await getDoc(doc(db, "chats", combineId));

//       if (!res.exists()) {
//         // Create chat in chats collection
//         await setDoc(doc(db, "chats", combineId), {messages: []});
        
//         // Create user chats
//         await updateDoc(doc(db, "userChats", currentUser.uid), {
//           [combineId + ".userInfo"]: {
//             uid: user.uid,
//             displayName: user.displayName, 
//             photoURL: user.photoURL
//           },
//           [combineId + ".date"]: serverTimestamp()
//         });
//         await updateDoc(doc(db, "userChats", user.uid), {
//           [combineId + ".userInfo"]: {
//             uid: currentUser.uid,
//             displayName: currentUser.displayName, 
//             photoURL: currentUser.photoURL
//           },
//           [combineId + ".date"]: serverTimestamp()
//         });
//       } 
//     } catch (error) { }

//     setUser(null);
//     setUsername(""); 
//   };

//   return (
//     <div className='search'>
//       <div className="searchForm">
//         <input 
//           type="text" 
//           placeholder='Find a user...' 
//           onKeyDown={handleKey} 
//           onChange={(e) => setUsername(e.target.value)} 
//           value={username}
//         />
//       </div>
//       {error && <span>User not found</span>}
//       {user && 
//         <div className="userChat" onClick={handleSelect}>
//           <img src={user.photoURL} alt="" />
//           <div className="userChatInfo">
//             <span>{user.displayName}</span>
//           </div>
//         </div>
//       }
//     </div>
//   )
// }

// export default Search