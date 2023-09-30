import { useContext, useRef, useEffect, useState } from "react"
import { AuthContext } from "../../context/AutchContext"
import { ChatContext } from "../../context/ChatContext"
import { Icon } from '@iconify/react';




// const Message = ({message}) => {

//   const { currentUser } = useContext(AuthContext)
//   const { data } = useContext(ChatContext)

//   const ref = useRef()

//   useEffect(() => {
//     ref.current?.scrollIntoView({behavior: "smooth"})
//   }, [message])

//   // Función para formatear la fecha y hora del mensaje
//   const formatMessageDate = (timestamp) => {
//     const messageDate = new Date(timestamp * 1000); // Multiplicar por 1000 para convertir a milisegundos
//     const hours = messageDate.getHours();
//     const minutes = messageDate.getMinutes();
//     return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
//   };


//   const audioRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);

//   const togglePlayPause = () => {
//     if (isPlaying) {
//       audioRef.current.pause();
//     } else {
//       audioRef.current.play();
//     }
//     setIsPlaying(!isPlaying);
//   };

//   const handleAudioEnded = () => {
//     // Cuando el audio termine, restablece el tiempo de reproducción y el estado isPlaying
//     audioRef.current.currentTime = 0;
//     setIsPlaying(false);
//   };

//   const handleAudioLoaded = () => {
//     if (audioRef.current.readyState >= 2) {
//       // Verifica que el audio esté cargado (readyState >= 2)
//       setDuration(audioRef.current.duration);
//     }
//   };

//   useEffect(() => {
//     const audioElement = audioRef.current;
  
//     const updateTime = () => {
//       setCurrentTime(audioElement.currentTime);
//     };
  
//     if (audioElement) {
//       audioElement.addEventListener("timeupdate", updateTime);
//       audioElement.addEventListener("ended", handleAudioEnded);
//       audioElement.addEventListener("canplaythrough", handleAudioLoaded); // Escucha el evento canplaythrough
//     }
  
//     return () => {
//       if (audioElement) {
//         audioElement.removeEventListener("timeupdate", updateTime);
//         audioElement.removeEventListener("ended", handleAudioEnded);
//         audioElement.removeEventListener("canplaythrough", handleAudioLoaded); // Deja de escuchar el evento canplaythrough al desmontar el componente
//       }
//     };
//   }, []);


//   const progressBarWidth = (currentTime / duration) * 100 + "%";
//   console.log(progressBarWidth);



//   return (
//     <div ref={ref} className={`message ${message.senderId === currentUser.uid && 'owner'}`}>
//       <div className="messageInfo">
//         <img 
//           className="chatUserImage"
//           src={
//             message.senderId === currentUser.uid 
//               ? currentUser.photoURL 
//               : data.user.photoURL} 
//           alt="user-image" 
//         />
//       </div>
//       <div className="messageContent">
//         <div>
//           <p className="messageText">{message.text}</p>

//           {message.image && <img src={message.image} alt="" />}

//           {message.document && (
//             <div className="documentContainer">
//               <div>
//                 {/* <p className="messageText">Documento adjunto</p> */}
//                 <p className="messageText">{message.documentName}</p>
//               </div>
//               <a 
//                 className={`messageDocument ${message.senderId === currentUser.uid ? 'ownerDocument' : 'otherDocument'}`}
//                 href={message.document} 
//                 target="_blank" 
//                 rel="noopener noreferrer"
//               >
//                 Open Document
//               </a>
//             </div>
//           )}

//           {message.audio && (
//             <div className="custom-audio-player">
//               <audio ref={audioRef} src={message.audio}></audio>
//               <div
//                 className={`play-pause-button ${isPlaying ? "playing" : ""}`}
//                 onClick={togglePlayPause}
//               >
//                 {isPlaying ? <Icon icon="ic:sharp-pause" width={34} /> : <Icon icon="bi:play-fill" width={34} />}
//               </div>
//               <div className="timeline">
//                 <div className="progress-bar" style={{ width: progressBarWidth }}></div>
//               </div>
//             </div>
//           )}


//           <span>{formatMessageDate(message.date.seconds)}</span> 
//         </div>
        
//       </div>
//     </div>
//   )
// } 

// export default Message











  // const Message = ({message}) => {

  //   const { currentUser } = useContext(AuthContext)
  //   const { data } = useContext(ChatContext)

  //   const ref = useRef()

  //   useEffect(() => {
  //     ref.current?.scrollIntoView({behavior: "smooth"})
  //   }, [message])

  //   // Función para formatear la fecha y hora del mensaje
  //   const formatMessageDate = (timestamp) => {
  //     const messageDate = new Date(timestamp * 1000); // Multiplicar por 1000 para convertir a milisegundos
  //     const hours = messageDate.getHours();
  //     const minutes = messageDate.getMinutes();
  //     return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
  //   };


  //   const audioRef = useRef(null);
  //   const [isPlaying, setIsPlaying] = useState(false);
  //   const [audioDuration, setAudioDuration] = useState(0);
  //   const [currentTime, setCurrentTime] = useState(0);

  //   const togglePlayPause = () => {
  //     if (isPlaying) {
  //       audioRef.current.pause();
  //     } else {
  //       audioRef.current.play();
  //     }
  //     setIsPlaying(!isPlaying);
  //   };

  //   useEffect(() => {
  //     if (audioRef.current) {
  //       audioRef.current.addEventListener('loadedmetadata', () => {
  //         setAudioDuration(audioRef.current.duration);
  //       });
    
  //       audioRef.current.addEventListener('timeupdate', () => {
  //         setCurrentTime(audioRef.current.currentTime);
  //       });
    
  //       audioRef.current.addEventListener('ended', () => {
  //         // Cuando el audio termine, reiniciar la reproducción
  //         audioRef.current.currentTime = 0;
  //         audioRef.current.pause();
  //         setIsPlaying(false);
  //       });
    
  //       return () => {
  //         audioRef.current.removeEventListener('loadedmetadata', () => {});
  //         audioRef.current.removeEventListener('timeupdate', () => {});
  //         audioRef.current.removeEventListener('ended', () => {});
  //       };
  //     }
  //   }, []);

  //   const formatTime = (time) => {
  //     const minutes = Math.floor(time / 60);
  //     const seconds = Math.floor(time % 60);
  //     return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  //   };

  //   return (
  //     <div ref={ref} className={`message ${message.senderId === currentUser.uid && 'owner'}`}>
  //       <div className="messageInfo">
  //         <img 
  //           className="chatUserImage"
  //           src={
  //             message.senderId === currentUser.uid 
  //               ? currentUser.photoURL 
  //               : data.user.photoURL} 
  //           alt="user-image" 
  //         />
  //       </div>
  //       <div className="messageContent">
  //         <div>
  //           <p className="messageText">{message.text}</p>

  //           {message.image && <img src={message.image} alt="" />}

  //           {message.document && (
  //             <div className="documentContainer">
  //               <div>
  //                 {/* <p className="messageText">Documento adjunto</p> */}
  //                 <p className="messageText">{message.documentName}</p>
  //               </div>
  //               <a 
  //                 className={`messageDocument ${message.senderId === currentUser.uid ? 'ownerDocument' : 'otherDocument'}`}
  //                 href={message.document} 
  //                 target="_blank" 
  //                 rel="noopener noreferrer"
  //               >
  //                 Open Document
  //               </a>
  //             </div>
  //           )}

  //           {message.audio && (
  //             <div className="custom-audio-player">
  //               <audio ref={audioRef} src={message.audio}></audio>
  //               <div
  //                 className={`play-pause-button ${isPlaying ? "playing" : ""}`}
  //                 onClick={togglePlayPause}
  //               >
  //                 {isPlaying ? <Icon icon="ic:sharp-pause" width={34} /> : <Icon icon="bi:play-fill" width={34} />}
  //               </div>
  //               <div className="audio-duration">
  //                 {formatTime(currentTime)} / {formatTime(audioDuration)}
  //               </div>
  //             </div>
  //           )}


  //           <span>{formatMessageDate(message.date.seconds)}</span> 
  //         </div>
          
  //       </div>
  //     </div>
  //   )
  // } 

  // export default Message








  // const Message = ({message}) => {

  //   const { currentUser } = useContext(AuthContext)
  //   const { data } = useContext(ChatContext)

  //   const ref = useRef()

  //   useEffect(() => {
  //     ref.current?.scrollIntoView({behavior: "smooth"})
  //   }, [message])

  //   // Función para formatear la fecha y hora del mensaje
  //   const formatMessageDate = (timestamp) => {
  //     const messageDate = new Date(timestamp * 1000); // Multiplicar por 1000 para convertir a milisegundos
  //     const hours = messageDate.getHours();
  //     const minutes = messageDate.getMinutes();
  //     return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
  //   };


  //   const audioRef = useRef(null);
  //   const [isPlaying, setIsPlaying] = useState(false);
  //   const [audioDuration, setAudioDuration] = useState(null);
  //   const [currentTime, setCurrentTime] = useState(0);
  //   const [hasPlayed, setHasPlayed] = useState(false);

  //   const togglePlayPause = () => {
  //     if (isPlaying) {
  //       audioRef.current.pause();
  //     } else {
  //       audioRef.current.play();
  //       if (!hasPlayed) {
  //         audioRef.current.addEventListener('loadeddata', () => {
  //           setAudioDuration(audioRef.current.duration);
  //         });
  //         setHasPlayed(true);
  //       }
  //     }
  //     setIsPlaying(!isPlaying);
  //   };

  //   useEffect(() => {
  //     if (audioRef.current) {
  //       audioRef.current.addEventListener('timeupdate', () => {
  //         setCurrentTime(audioRef.current.currentTime);
  //       });
  
  //       audioRef.current.addEventListener('ended', () => {
  //         setIsPlaying(false);
  //       });
  
  //       return () => {
  //         audioRef.current.removeEventListener('timeupdate', () => {});
  //         audioRef.current.removeEventListener('ended', () => {});
  //       };
  //     }
  //   }, []);

  //   const formatTime = (time) => {
  //     const minutes = Math.floor(time / 60);
  //     const seconds = Math.floor(time % 60);
  //     return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  //   };

  //   return (
  //     <div ref={ref} className={`message ${message.senderId === currentUser.uid && 'owner'}`}>
  //       <div className="messageInfo">
  //         <img 
  //           className="chatUserImage"
  //           src={
  //             message.senderId === currentUser.uid 
  //               ? currentUser.photoURL 
  //               : data.user.photoURL} 
  //           alt="user-image" 
  //         />
  //       </div>
  //       <div className="messageContent">
  //         <div>
  //           <p className="messageText">{message.text}</p>

  //           {message.image && <img src={message.image} alt="" />}

  //           {message.document && (
  //             <div className="documentContainer">
  //               <div>
  //                 {/* <p className="messageText">Documento adjunto</p> */}
  //                 <p className="messageText">{message.documentName}</p>
  //               </div>
  //               <a 
  //                 className={`messageDocument ${message.senderId === currentUser.uid ? 'ownerDocument' : 'otherDocument'}`}
  //                 href={message.document} 
  //                 target="_blank" 
  //                 rel="noopener noreferrer"
  //               >
  //                 Open Document
  //               </a>
  //             </div>
  //           )}

  //           {message.audio && (
  //             <div className="custom-audio-player">
  //               <audio ref={audioRef} src={message.audio} preload="metadata"></audio>
  //               <div
  //                 className={`play-pause-button ${isPlaying ? "playing" : ""}`}
  //                 onClick={togglePlayPause}
  //               >
  //                 {isPlaying ? <Icon icon="ic:sharp-pause" width={34} /> : <Icon icon="bi:play-fill" width={34} />}
  //               </div>
        
  //                 <div className="audio-duration">
  //                   {formatTime(currentTime)}
  //                 </div>

  //             </div>
  //           )}


  //           <span>{formatMessageDate(message.date.seconds)}</span> 
  //         </div>
          
  //       </div>
  //     </div>
  //   )
  // } 

  // export default Message






  const Message = ({message}) => {

    const { currentUser } = useContext(AuthContext)
    const { data } = useContext(ChatContext)

    const ref = useRef()

    useEffect(() => {
      ref.current?.scrollIntoView({behavior: "smooth"})
    }, [message])

    // Función para formatear la fecha y hora del mensaje
    const formatMessageDate = (timestamp) => {
      const messageDate = new Date(timestamp * 1000); // Multiplicar por 1000 para convertir a milisegundos
      const hours = messageDate.getHours();
      const minutes = messageDate.getMinutes();
      return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
    };


    const audioRef = useRef(null);
    
    const [isPlaying, setIsPlaying] = useState(false);

    const [audioDuration, setAudioDuration] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [showAudioDuration, setShowAudioDuration] = useState(false);
    
    const [playbackRate, setPlaybackRate] = useState(1.0); // Valor inicial de velocidad de reproducción 1.0x
    const [currentPlaybackRateIndex, setCurrentPlaybackRateIndex] = useState(0);
    const playbackRates = [1.0, 1.5, 2.0]; // Velocidades predefinidas
    

    const togglePlayPause = () => {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.playbackRate = playbackRate; // Aplicar la velocidad de reproducción
        audioRef.current.play();
        audioRef.current.addEventListener('loadedmetadata', () => {
          setAudioDuration(audioRef.current.duration);
        });
      }
      setIsPlaying(!isPlaying);
    };

    const togglePlaybackRate = () => {
      const nextIndex = (currentPlaybackRateIndex + 1) % playbackRates.length;
      setCurrentPlaybackRateIndex(nextIndex);
      const newPlaybackRate = playbackRates[nextIndex];
      audioRef.current.playbackRate = newPlaybackRate;
      setPlaybackRate(newPlaybackRate);
    };

    useEffect(() => {
      if (audioRef.current) {
        const audioElement = audioRef.current;
    
        const handleLoadedMetadata = () => {
          if (!isNaN(audioElement.duration)) {
            setAudioDuration(audioElement.duration);
          }
        };
    
        const handleDurationChange = handleLoadedMetadata;
        const handleTimeUpdate = () => {
          setCurrentTime(audioElement.currentTime);
        };
    
        const handleCanPlay = handleLoadedMetadata;
    
        const handleEnded = () => {
          // Cuando el audio termina de reproducirse, mostramos la duración
          setShowAudioDuration(true);
          setIsPlaying(false);
          setCurrentTime(0);
    
          // Restablecer la velocidad de reproducción a su valor predeterminado
          audioElement.playbackRate = 1.0;
          setPlaybackRate(1.0);
          setCurrentPlaybackRateIndex(0);
        };
    
        audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
        audioElement.addEventListener('durationchange', handleDurationChange);
        audioElement.addEventListener('timeupdate', handleTimeUpdate);
        audioElement.addEventListener('canplay', handleCanPlay);
        audioElement.addEventListener('ended', handleEnded);
    
        return () => {
          // Eliminar event listeners cuando el componente se desmonta
          audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
          audioElement.removeEventListener('durationchange', handleDurationChange);
          audioElement.removeEventListener('timeupdate', handleTimeUpdate);
          audioElement.removeEventListener('canplay', handleCanPlay);
          audioElement.removeEventListener('ended', handleEnded);
        };
      }
    }, []);

    const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    return (
      <div ref={ref} className={`message ${message.senderId === currentUser.uid && 'owner'}`}>
        <div className="messageInfo">
          <img 
            className="chatUserImage"
            src={
              message.senderId === currentUser.uid 
                ? currentUser.photoURL 
                : data.user.photoURL} 
            alt="user-image" 
          />
        </div>
        <div className="messageContent">
          <div>

            {message.image && <img src={message.image} alt="" />}

            {message.document && (
              <div className="documentContainer">
                <div>
                  {/* <p className="messageText">Documento adjunto</p> */}
                  <p className="messageText">{message.documentName}</p>
                </div>
                <a 
                  className={`messageDocument ${message.senderId === currentUser.uid ? 'ownerDocument' : 'otherDocument'}`}
                  href={message.document} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Open Document
                </a>
              </div>
            )}

            {message.audio && (
              <div className="customAudioPlayer">
                <audio ref={audioRef} src={message.audio} preload="metadata"></audio>

                <div className="audioSpeedControl">
                  <button onClick={togglePlaybackRate}>
                    {playbackRates[currentPlaybackRateIndex]}
                  </button>
                </div>
                
                <div className="reformContainer">
                  
                  <div
                    className="playPauseButtonContainer"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? <Icon icon="ic:sharp-pause" width={34} /> : <Icon icon="bi:play-fill" width={34} />}
                  </div>

                  <div className="audio-duration">
                  {showAudioDuration ? (
                    <p>
                      {formatTime(currentTime)} / {formatTime(audioDuration)}
                    </p>
                  ) : (
                    <p>{formatTime(currentTime)}</p>
                  )}
                  </div>

                </div>

              </div>
            )}

            <div className="messageTextContainer">
              <p className="messageText">{message.text}</p>
            </div>

            <span>{formatMessageDate(message.date.seconds)}</span> 
          </div>
          
        </div>
      </div>
    )
  } 

  export default Message












// const audioRef = useRef(null);
// const [isPlaying, setIsPlaying] = useState(false);

// const playAudio = () => {
//   if (audioRef.current) {
//     audioRef.current.play();
//     setIsPlaying(true);
//   }
// };

// const stopAudio = () => {
//   if (audioRef.current) {
//     audioRef.current.pause();
//     audioRef.current.currentTime = 0;
//     setIsPlaying(false);
//   }
// };



// {message.audio && (
//   <div className="audioContainer">
//     <audio ref={audioRef}>
//       <source src={message.audio} type="audio/mpeg" />
//       Tu navegador no admite la reproducción de audio.
//     </audio>
//     <div className="audioControls">
//       {isPlaying ? (
//         <button onClick={stopAudio}>Detener</button>
//       ) : (
//         <button onClick={playAudio}>Reproducir</button>
//       )}
//     </div>
//   </div>
// )}

          {/* {message.audio && (
            <audio controls className="custom-audio-player">
              <source src={message.audio} type="audio/mpeg" />
              Tu navegador no admite la reproducción de audio.
            </audio>
          )} */}