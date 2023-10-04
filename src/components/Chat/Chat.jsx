import { useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { ChatContext } from '../../context/ChatContext';
import Messages from '../Messages/Messages'
import InputMessage from '../InputMessage/InputMessage'

const Chat = () => {
  const { data } = useContext(ChatContext);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (data.user?.uid) {
      const userRef = doc(db, 'users', data.user.uid);
  
      const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          const userIsOnline = userData.isOnline || false;
  
          if (userIsOnline) {
            setStatus('En línea');
          } else if (userData.lastOnline) {
            const lastOnline = userData.lastOnline.toDate();
            const currentTime = new Date();
  
            // Obtener las fechas sin horas para comparar días
            const lastOnlineDate = new Date(
              lastOnline.getFullYear(),
              lastOnline.getMonth(),
              lastOnline.getDate()
            );

            const currentDate = new Date(
              currentTime.getFullYear(),
              currentTime.getMonth(),
              currentTime.getDate()
            );
  
            // Calcular la diferencia en días
            const timeDifference = Math.floor((currentDate - lastOnlineDate) / (1000 * 3600 * 24));
  
            if (timeDifference === 0) {
              // Formatear el mensaje como "últ. vez hoy a la(s) HH:mm"
              const hours = lastOnline.getHours().toString().padStart(2, '0');
              const minutes = lastOnline.getMinutes().toString().padStart(2, '0');
              setStatus(`últ. vez hoy a las ${hours}:${minutes}`);

            } else if (timeDifference === 1) {
              // Formatear el mensaje como "últ. vez ayer a la(s) HH:mm"
              const hours = lastOnline.getHours().toString().padStart(2, '0');
              const minutes = lastOnline.getMinutes().toString().padStart(2, '0');
              setStatus(`últ. vez ayer a las ${hours}:${minutes}`);

            } else {
              // Si la última vez en línea no fue hoy ni ayer, mostrar la fecha completa
              const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              };
              setStatus(`últ. vez ${lastOnline.toLocaleDateString(undefined, options)}`);
            }
          }
        }
      });
  
      return () => {
        unsubscribe();
      };
    }
  }, [data.user]);

  return (
    <div className='chat'>
      <div className="chatInfo">
        {data.user?.photoURL && (
          <img src={data.user.photoURL} alt="user image" />
        )}
        <div>
          <span>{data.user?.displayName}</span>
          <p>{status}</p>
        </div>
      </div>
      <Messages />
      <InputMessage />
    </div>
  );
};

export default Chat;