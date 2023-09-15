import { useContext, useState } from 'react'
import Img from '../../img/img.png'
import Attach from '../../img/attach.png'
import { AuthContext } from '../../context/AutchContext'
import { ChatContext } from '../../context/ChatContext'
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db, storage } from '../../firebase'
import { v4 as uuid } from 'uuid' 
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

const InputMessage = () => {

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (image) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        null,
        (uploadError) => {
          console.error("Upload error:", uploadError);
          setError(true);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(storageRef);
            
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                image: downloadURL
              })
            })

          } catch (firestoreError) {
            console.error("Firestore error:", firestoreError);
            setError(true);
          }
        }
      );

    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        })
      })
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImage(null);
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log('Enter key pressed');
      handleSend();

      setText("");
      setImage(null);
    }
  }

  return (
    <div className='input'>
      <input 
        type="text" 
        placeholder='Type something...' 
        onChange={e => setText(e.target.value)}
        value={text}
        onKeyDown={handleKeyDown}
      />
      <div className="send">
        <div className='functionsContainer'>
          <img src={Attach} alt="" />
          <input 
            type="file" 
            style={{ display: "none" }} 
            id='file' 
            onChange={(e) => setImage(e.target.files[0])}
          />
          <label htmlFor="file">
            <img src={Img} alt="" />
          </label>
        </div>
        <button onClick={handleSend} >
          Send
        </button>
      </div>
    </div>
  )
}

export default InputMessage