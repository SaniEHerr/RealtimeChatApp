import { useContext, useRef, useState } from 'react'
import { AuthContext } from '../../context/AutchContext'
import { ChatContext } from '../../context/ChatContext'
import { Timestamp, arrayUnion, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db, storage } from '../../firebase'
import { v4 as uuid } from 'uuid' 
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { Icon } from '@iconify/react';
import MessageLoader from '../MessagesLoader/MessageLoader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faTrash, faPlay, faCircleStop } from '@fortawesome/free-solid-svg-icons';


// const InputMessage = () => {

//   const [text, setText] = useState("");
//   const [image, setImage] = useState(null);
//   const [document, setDocument] = useState(null);
//   const [error, setError] = useState(false);

//   const { currentUser } = useContext(AuthContext);
//   const { data } = useContext(ChatContext);

//   const [showImagePreview, setShowImagePreview] = useState(false);
//   const [imagePreviewURL, setImagePreviewURL] = useState("");
//   const [isSendingImage, setIsSendingImage] = useState(false);
//   const [isCancelling, setIsCancelling] = useState(false);

//   const [showDocumentPreview, setShowDocumentPreview] = useState(false);
//   const [documentPreviewURL, setDocumentPreviewURL] = useState(""); 
//   const [isSendingDocument, setIsSendingDocument] = useState(false);
//   const [isCancellingDocument, setIsCancellingDocument] = useState(false);  

//   const [audio, setAudio] = useState(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   const [isCancellingAudio, setIsCancellingAudio] = useState(false);

//   const startAudioRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const recorder = new MediaRecorder(stream);
//       setMediaRecorder(recorder);

//       const audioChunks = [];

//       recorder.ondataavailable = (e) => {
//         if (e.data.size > 0) {
//           audioChunks.push(e.data);
//         }
//       };

//       recorder.onstop = () => {
//         const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//         setAudio(audioBlob);
//         setIsRecording(false);
//       };

//       recorder.start();
//       setIsRecording(true);
//     } catch (error) {
//       console.error('Error al iniciar la grabación de audio:', error);
//       setError(true);
//     }
//   };

//   const stopAudioRecording = () => {
//     if (mediaRecorder) {
//       mediaRecorder.stop();
//       setIsCancellingAudio(true); // Indicar que se está cancelando la grabación de audio
//     }
//   };

//   const playRecordedAudio = () => {
//     if (audio) {
//       const audioURL = URL.createObjectURL(audio);
//       const audioElement = new Audio(audioURL);
//       audioElement.play();
//     }
//   };

//   const cancelAudioRecording = () => {
//     if (mediaRecorder) {
//       mediaRecorder.stop();
//       setIsRecording(false);
//       setIsCancellingAudio(false); // Restablecer el estado de cancelación
//       setAudio(null); // Limpiar el audio grabado
//     }
//   };



//   // Verificar si hay un chat seleccionado
//   const isChatSelected = data.chatId !== 'null';

//   const handleSendImage = async () => {
//     setIsSendingImage(true); // Indica que se está enviando la imagen
//     setIsCancelling(false); // Habilita el botón "Cancelar"
//     await handleSend(); // Llama a la función principal de envío
//     setShowImagePreview(false); // Cierra la vista previa de la imagen
//     setIsSendingImage(false); // Restablece el estado después del envío
//   };

//   const handleSendDocument = async () => {
//     setIsSendingDocument(true); // Indica que se está enviando el documento
//     setIsCancellingDocument(false); // Habilita el botón "Cancelar"
//     await handleSend(); // Llama a la función principal de envío
//     setShowDocumentPreview(false); // Cierra la vista previa del documento
//     setIsSendingDocument(false); // Restablece el estado después del envío
//   };

//   const handleCancel = () => {
//     setShowImagePreview(false); // Cierra la vista previa de la imagen
//   };

//   const handleImageUpload = (e) => {
//     const selectedImage = e.target.files[0];
//     if (selectedImage) {
//       // Crear una URL temporal para la vista previa de la imagen
//       const imageUrl = URL.createObjectURL(selectedImage);
//       setImagePreviewURL(imageUrl);
//       setShowImagePreview(true);
//       setImage(selectedImage); // Establecer la imagen seleccionada en el estado
//     }
//   };


//   const handleCancelDocumentPreview = () => {
//     setShowDocumentPreview(false);
//     setDocument(null);
//   };

//   const handleDocumentUpload = (e) => {
//     const selectedDocument = e.target.files[0];
//     if (selectedDocument) {
//       const documentName = selectedDocument.name;
//       setDocument(selectedDocument); // Establecer el documento seleccionado en el estado
  
//       // Crear una URL temporal para la vista previa del documento
//       const documentUrl = URL.createObjectURL(selectedDocument);
//       setDocumentPreviewURL(documentUrl);
//       setShowDocumentPreview(true);
//     }
//   };


//   const handleSend = async () => {
//     // Eliminar espacios en blanco al principio y al final del texto
//     const trimmedText = text.trim();
  
//     if (!trimmedText && !image && !document && !audio) {
//       // Si el texto está vacío después de eliminar espacios en blanco
//       // y no hay imagen, no hagas nada.
//       return;
//     }
  
//     if (!text && !image && !document && !audio) {
//       // No hay texto ni imagen para enviar, no hagas nada.
//       return;
//     }
  
//     let uploadedImageURL = null;
//     let uploadedDocumentURL = null;
//     let documentName = null;
//     let uploadedAudioURL = null;
  
//     if (image) {
//       const storageRef = ref(storage, uuid());
//       const uploadTask = uploadBytesResumable(storageRef, image);
  
//       try {
//         await uploadTask;
//         uploadedImageURL = await getDownloadURL(storageRef);
//       } catch (uploadError) {
//         console.error("Upload error:", uploadError);
//         setError(true);
//         return;
//       }
//     }

//     if (document) {
//       const documentStorageRef = ref(storage, uuid());
//       const documentUploadTask = uploadBytesResumable(documentStorageRef, document);
  
//       try {
//         await documentUploadTask;
//         uploadedDocumentURL = await getDownloadURL(documentStorageRef);

//         // Obtén el nombre del documento
//         documentName = document.name;
//       } catch (uploadDocumentError) {
//         console.error("Document upload error:", uploadDocumentError);
//         setError(true);
//         return;
//       }
//     }

//     if (audio) {
//       const audioStorageRef = ref(storage, uuid());
//       const audioUploadTask = uploadBytesResumable(audioStorageRef, audio);
  
//       try {
//         await audioUploadTask;
//         uploadedAudioURL = await getDownloadURL(audioStorageRef);
//       } catch (uploadAudioError) {
//         console.error("Audio upload error:", uploadAudioError);
//         setError(true);
//         return;
//       }
//     }
    
  
//     // Actualiza lastMessage en userChats
//     const lastMessageUpdate = {
//       text: text || (uploadedImageURL ? "Image" : null) || (uploadedDocumentURL ? "Document" : null) || (uploadedAudioURL ? "Audio" : null),
//       timestamp: serverTimestamp(),
//     };
  
//     if (uploadedImageURL) {
//       lastMessageUpdate.image = uploadedImageURL;
//     }

//     if (uploadedDocumentURL) {
//       lastMessageUpdate.document = uploadedDocumentURL;
//     }

//     if (uploadedAudioURL) {
//       lastMessageUpdate.audio = uploadedAudioURL;
//     }
  
//     try {
//       await updateDoc(doc(db, "userChats", currentUser.uid), {
//         [data.chatId + ".lastMessage"]: lastMessageUpdate,
//         [data.chatId + ".date"]: serverTimestamp(),
//       });
  
//       await updateDoc(doc(db, "userChats", data.user.uid), {
//         [data.chatId + ".lastMessage"]: lastMessageUpdate,
//         [data.chatId + ".date"]: serverTimestamp(),
//       });
//     } catch (firestoreError) {
//       console.error("Firestore error:", firestoreError);
//       setError(true);
//       return;
//     }
  
//     // Resto del código para actualizar messages en chats
//     if (uploadedImageURL || uploadedDocumentURL || uploadedAudioURL) {
//       // Si se cargó una imagen, actualiza messages con la URL de la imagen
//       try {
//         await updateDoc(doc(db, "chats", data.chatId), {
//           messages: arrayUnion({
//             id: uuid(),
//             text: text || null,
//             senderId: currentUser.uid,
//             date: Timestamp.now(),
//             image: uploadedImageURL || null, // Agregar la URL de la imagen si existe
//             document: uploadedDocumentURL || null, // Agregar la URL del documento si existe
//             documentName: documentName || null,
//             audio: uploadedAudioURL || null,
//           }),
//         });
//       } catch (firestoreError) {
//         console.error("Firestore error:", firestoreError);
//         setError(true);
//         return;
//       }
//     } else {
//       // Si no se cargó una imagen, actualiza messages sin la URL de la imagen
//       try {
//         await updateDoc(doc(db, "chats", data.chatId), {
//           messages: arrayUnion({
//             id: uuid(),
//             text,
//             senderId: currentUser.uid,
//             date: Timestamp.now(),
//           }),
//         });
//       } catch (firestoreError) {
//         console.error("Firestore error:", firestoreError);
//         setError(true);
//         return;
//       }
//     }
  
//     setText("");
//     setImage(null);
//     setDocument(null);
//     setIsSendingImage(false);
//     setAudio(null);
//   };
  
//   const pasteImage = async () => {
//     try {
//       const clipboardItems = await navigator.clipboard.read();
//       for (const clipboardItem of clipboardItems) {
//         for (const type of clipboardItem.types) {
//           if (type === 'image/png' || type === 'image/jpeg') {
//             const blob = await clipboardItem.getType(type);
//             if (blob) {
//               const imageUrl = URL.createObjectURL(blob);
//               setImagePreviewURL(imageUrl);
//               setShowImagePreview(true);
//               setImage(blob); // Establecer la imagen seleccionada en el estado
//             }
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error al pegar la imagen desde el portapapeles:', error);
//       setError(true); // Opcional: Configurar el estado de error
//     }
//   };

//   const handleKeyDown = async (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
  
//       if (imagePreviewURL) {
//         // Si hay una imagen en la vista previa, primero llama a handleSendImage
//         await handleSendImage();
//       } else {
//         // Si no hay imagen en la vista previa, llama a handleSend
//         handleSend();
//       }
  
//       setText("");
//     } else if (e.key === 'v' && e.ctrlKey) {
//       // Ctrl + V detectado, intenta pegar la imagen
//       pasteImage();
//     }
//   };

//   return (
//     <div className='input'>

//       {isChatSelected && (
//         <>
//           <div className='functionsContainer'>

//             {/* Botón para cargar documentos */}
//             <input 
//               type="file" 
//               style={{ display: "none" }} 
//               id='documentFile' 
//               download={true}
//               accept=".pdf, .doc, .docx, .txt"
//               onChange={handleDocumentUpload}
//             />
//             <label htmlFor="documentFile">
//               <Icon className='fileIcon addDocumentIcon' icon="ph:file-text" />
//             </label>
            
//             {/* Botón para cargar imágenes */}
//             <input 
//               type="file" 
//               style={{ display: "none" }} 
//               id='file' 
//               // onChange={(e) => setImage(e.target.files[0])}
//               onChange={handleImageUpload}
//             />
//             <label htmlFor="file">
//               <Icon className='addImageIcon' icon="iconoir:add-media-image" />
//             </label>
//           </div>
          
//           {showImagePreview && (
//             <div className="previewContainer">
//               <img src={imagePreviewURL} alt="Image Preview" className="imagePreview" />
//               <div className='buttonsContainer'>
//                 {isSendingImage ? (
//                   <button>
//                     <MessageLoader />
//                   </button>
//                 ) : (
//                   <>
//                     <button
//                       className='cancelSend'
//                       onClick={handleCancel}
//                       disabled={isSendingImage || isCancelling} // Deshabilita el botón si se está enviando o cancelando
//                     >
//                       Cancelar
//                     </button>
//                     <button className='confirmSend' onClick={handleSendImage}>
//                       Enviar
//                     </button>
//                   </>
//                 )}
//               </div>
//             </div>
//           )}

//           {showDocumentPreview && (
//             <div className="previewContainer">
//               <div className='docLinkContainer'>
//                 Ver documento: <a href={documentPreviewURL} className='documentLink' target="_blank" rel="noopener noreferrer"> {document.name} </a> 
//               </div>
//               <div className='buttonsContainer'>
//                 {isSendingDocument ? (
//                   <button>
//                     <MessageLoader />
//                   </button>
//                 ) : (
//                   <>
//                     <button
//                       className='cancelSend'
//                       onClick={handleCancelDocumentPreview}
//                       disabled={isSendingDocument || isCancellingDocument}
//                     >
//                       Cancelar
//                     </button>
//                     <button className='confirmSend' onClick={handleSendDocument}>
//                       Enviar
//                     </button>
//                   </>
//                 )}
//               </div>
//             </div>
//           )}

//           <input 
//             type="text" 
//             placeholder='Type something...' 
//             onChange={e => setText(e.target.value)}
//             value={text}
//             onKeyDown={handleKeyDown}
//           />

//           <button className='stopAudioRecording' onClick={stopAudioRecording} disabled={!isRecording}>
//             Stop
//           </button>

//           <FontAwesomeIcon 
//             icon={faTrash} 
//             className='cancelAudioRecording' 
//             onClick={cancelAudioRecording} 
//           />  

//           <FontAwesomeIcon 
//             icon={faPlay} 
//             className='playRecordedAudio' 
//             onClick={playRecordedAudio} 
//             disabled={!audio}
//           />  

//           <FontAwesomeIcon 
//             icon={faMicrophone} 
//             className='startAudioRecording' 
//             onClick={startAudioRecording}
//           />  

//           <div className="send">
//             <Icon className='sendIcon' icon="ic:baseline-send" onClick={handleSend} />
//           </div>

//         </>
//       )}

//     </div>
//   )
// }

// export default InputMessage



const InputMessage = () => {

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const [showImagePreview, setShowImagePreview] = useState(false);
  const [imagePreviewURL, setImagePreviewURL] = useState("");
  const [isSendingImage, setIsSendingImage] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [documentPreviewURL, setDocumentPreviewURL] = useState(""); 
  const [isSendingDocument, setIsSendingDocument] = useState(false);
  const [isCancellingDocument, setIsCancellingDocument] = useState(false);  

  const [audio, setAudio] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isCancellingAudio, setIsCancellingAudio] = useState(false);

  const [isTyping, setIsTyping] = useState(false);
  const [audioRecordingText, setAudioRecordingText] = useState("");
  const [isRecordingCompleted, setIsRecordingCompleted] = useState(false);
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const [isAudioRecordingCancelled, setIsAudioRecordingCancelled] = useState(false);
  // const [showFunctionsContainer, setShowFunctionsContainer] = useState(true);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = minutes;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const startAudioRecording = async () => {
    try {
      // Si hay un audio previo, lo eliminamos antes de comenzar una nueva grabación
      if (audio) {
        URL.revokeObjectURL(URL.createObjectURL(audio)); // Libera la URL del audio anterior
        setAudio(null); // Establece el audio en null para borrarlo
      }
  
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
  
      const audioChunks = [];
  
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.push(e.data);
        }
      };

      // Iniciar con "0:00"
      setRecordingTimer(0);
      setAudioRecordingText(`Grabando ${formatTime(0)}`);

      let timer = 0;
    
      // Actualizar el mensaje cada segundo mientras se graba
      const timerId = setInterval(() => {
        timer++;
        setRecordingTimer(timer);
        setAudioRecordingText(`Grabando ${formatTime(timer)}`);
      }, 1000);
  
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setAudio(audioBlob);
        setIsRecording(false);
        clearInterval(timerId);
        setIsRecordingCompleted(true); // Indicar que la grabación se ha completado
        setAudioRecordingText(`Duración: ${formatTime(timer)}`);
      };
  
      recorder.start();
  
      setIsRecording(true); // Cambia a modo de grabación de audio
      setIsAudioRecording(true); // Establecer isAudioRecording en true
      // setAudioRecordingText("Grabando...");
    } catch (error) {
      console.error('Error al iniciar la grabación de audio:', error);
      setError(true);
    }
  };
  
  const stopAudioRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsCancellingAudio(true); // Indicar que se está cancelando la grabación de audio
      setAudioRecordingText("Grabacion finalizada"); // Cambiar el texto cuando se detiene la grabación
    }
  };

  const playRecordedAudio = () => {
    if (audio) {
      const audioURL = URL.createObjectURL(audio);
      const audioElement = new Audio(audioURL);
      audioElement.play();
    }
  };

  const cancelAudioRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      setIsCancellingAudio(false);
      setAudio(null); // Establecer el audio en null para borrarlo
      setIsAudioRecording(false); // Establecer isAudioRecording en false
      setIsAudioRecordingCancelled(true);
      setAudioRecordingText(""); // Limpiar el texto de grabación de audio
    }
  };

  // Verificar si hay un chat seleccionado
  const isChatSelected = data.chatId !== 'null';

  const handleSendImage = async () => {
    setIsSendingImage(true); // Indica que se está enviando la imagen
    setIsCancelling(false); // Habilita el botón "Cancelar"
    await handleSend(); // Llama a la función principal de envío
    setShowImagePreview(false); // Cierra la vista previa de la imagen
    setIsSendingImage(false); // Restablece el estado después del envío
    setIsTyping(false); // Cuando se envía el mensaje, el usuario no está escribiendo
  };

  const handleSendDocument = async () => {
    setIsSendingDocument(true); // Indica que se está enviando el documento
    setIsCancellingDocument(false); // Habilita el botón "Cancelar"
    await handleSend(); // Llama a la función principal de envío
    setShowDocumentPreview(false); // Cierra la vista previa del documento
    setIsSendingDocument(false); // Restablece el estado después del envío
    setIsTyping(false); // Cuando se envía el mensaje, el usuario no está escribiendo
  };

  const handleCancel = () => {
    setShowImagePreview(false); // Cierra la vista previa de la imagen
  };

  const handleImageUpload = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      // Crear una URL temporal para la vista previa de la imagen
      const imageUrl = URL.createObjectURL(selectedImage);
      setImagePreviewURL(imageUrl);
      setShowImagePreview(true);
      setImage(selectedImage); // Establecer la imagen seleccionada en el estado
    }
  };


  const handleCancelDocumentPreview = () => {
    setShowDocumentPreview(false);
    setDocument(null);
  };

  const handleDocumentUpload = (e) => {
    const selectedDocument = e.target.files[0];
    if (selectedDocument) {
      const documentName = selectedDocument.name;
      setDocument(selectedDocument); // Establecer el documento seleccionado en el estado
  
      // Crear una URL temporal para la vista previa del documento
      const documentUrl = URL.createObjectURL(selectedDocument);
      setDocumentPreviewURL(documentUrl);
      setShowDocumentPreview(true);
    }
  };


  const handleSend = async () => {
    // Eliminar espacios en blanco al principio y al final del texto
    const trimmedText = text.trim();
  
    if (!trimmedText && !image && !document && !audio) {
      // Si el texto está vacío después de eliminar espacios en blanco
      // y no hay imagen, no hagas nada.
      return;
    }
  
    if (!text && !image && !document && !audio) {
      // No hay texto ni imagen para enviar, no hagas nada.
      return;
    }
  
    let uploadedImageURL = null;
    let uploadedDocumentURL = null;
    let documentName = null;
    let uploadedAudioURL = null;
  
    if (image) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, image);
  
      try {
        await uploadTask;
        uploadedImageURL = await getDownloadURL(storageRef);
      } catch (uploadError) {
        console.error("Upload error:", uploadError);
        setError(true);
        return;
      }
    }

    if (document) {
      const documentStorageRef = ref(storage, uuid());
      const documentUploadTask = uploadBytesResumable(documentStorageRef, document);
  
      try {
        await documentUploadTask;
        uploadedDocumentURL = await getDownloadURL(documentStorageRef);

        // Obtén el nombre del documento
        documentName = document.name;
      } catch (uploadDocumentError) {
        console.error("Document upload error:", uploadDocumentError);
        setError(true);
        return;
      }
    }

    if (audio && !isAudioRecordingCancelled) {
      const audioStorageRef = ref(storage, uuid());
      const audioUploadTask = uploadBytesResumable(audioStorageRef, audio);
  
      try {
        await audioUploadTask;
        uploadedAudioURL = await getDownloadURL(audioStorageRef);
      } catch (uploadAudioError) {
        console.error("Audio upload error:", uploadAudioError);
        setError(true);
        return;
      }
    }
    
  
    // Actualiza lastMessage en userChats
    const lastMessageUpdate = {
      text: text || (uploadedImageURL ? "Image" : null) || (uploadedDocumentURL ? "Document" : null) || (uploadedAudioURL ? "Audio" : null),
      timestamp: serverTimestamp(),
    };
  
    if (uploadedImageURL) {
      lastMessageUpdate.image = uploadedImageURL;
    }

    if (uploadedDocumentURL) {
      lastMessageUpdate.document = uploadedDocumentURL;
    }

    if (uploadedAudioURL) {
      lastMessageUpdate.audio = uploadedAudioURL;
    }
  
    try {
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"]: lastMessageUpdate,
        [data.chatId + ".date"]: serverTimestamp(),
      });
  
      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"]: lastMessageUpdate,
        [data.chatId + ".date"]: serverTimestamp(),
      });
    } catch (firestoreError) {
      console.error("Firestore error:", firestoreError);
      setError(true);
      return;
    }
  
    // Resto del código para actualizar messages en chats
    if (uploadedImageURL || uploadedDocumentURL || uploadedAudioURL) {
      // Si se cargó una imagen, actualiza messages con la URL de la imagen
      try {
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text: text || null,
            senderId: currentUser.uid,
            date: Timestamp.now(),
            image: uploadedImageURL || null, // Agregar la URL de la imagen si existe
            document: uploadedDocumentURL || null, // Agregar la URL del documento si existe
            documentName: documentName || null,
            audio: uploadedAudioURL || null,
          }),
        });
      } catch (firestoreError) {
        console.error("Firestore error:", firestoreError);
        setError(true);
        return;
      }
    } else {
      // Si no se cargó una imagen, actualiza messages sin la URL de la imagen
      try {
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });
      } catch (firestoreError) {
        console.error("Firestore error:", firestoreError);
        setError(true);
        return;
      }
    }

    if (isAudioRecording) {
      setIsAudioRecording(false);
    }
  
    setText("");
    setImage(null);
    setDocument(null);
    setIsSendingImage(false);
    setAudio(null);
    setIsRecordingCompleted(false);
    setIsTyping(false); // Cuando se envía el mensaje, el usuario no está escribiendo
    setIsAudioRecordingCancelled(false);
    // setShowFunctionsContainer(true);
  };
  
  const pasteImage = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type === 'image/png' || type === 'image/jpeg') {
            const blob = await clipboardItem.getType(type);
            if (blob) {
              const imageUrl = URL.createObjectURL(blob);
              setImagePreviewURL(imageUrl);
              setShowImagePreview(true);
              setImage(blob); // Establecer la imagen seleccionada en el estado
            }
          }
        }
      }
    } catch (error) {
      console.error('Error al pegar la imagen desde el portapapeles:', error);
      setError(true); // Opcional: Configurar el estado de error
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
  
      if (imagePreviewURL) {
        // Si hay una imagen en la vista previa, primero llama a handleSendImage
        await handleSendImage();
      } else {
        // Si no hay imagen en la vista previa, llama a handleSend
        handleSend();
      }
  
      setText("");
      setIsTyping(false); // Cuando se envía el mensaje, el usuario no está escribiendo
    } else if (e.key === 'v' && e.ctrlKey) {
      // Ctrl + V detectado, intenta pegar la imagen
      pasteImage();
    }
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    setIsTyping(newText !== ""); // Establece isTyping en true si hay texto en el input, independientemente de la tecla presionada
  };

  return (
    <div className='input'>

      {!isAudioRecording && isChatSelected &&  (
        <>
          <div className='functionsContainer'>

            {/* Botón para cargar documentos */}
            <input 
              type="file" 
              style={{ display: "none" }} 
              id='documentFile' 
              download={true}
              accept=".pdf, .doc, .docx, .txt"
              onChange={handleDocumentUpload}
            />
            <label htmlFor="documentFile">
              <Icon className='fileIcon addDocumentIcon' icon="ph:file-text" />
            </label>
            
            {/* Botón para cargar imágenes */}
            <input 
              type="file" 
              style={{ display: "none" }} 
              id='file' 
              // onChange={(e) => setImage(e.target.files[0])}
              onChange={handleImageUpload}
            />
            <label htmlFor="file">
              <Icon className='addImageIcon' icon="iconoir:add-media-image" />
            </label>
          </div>
          
          {showImagePreview && (
            <div className="previewContainer">
              <img src={imagePreviewURL} alt="Image Preview" className="imagePreview" />
              <div className='buttonsContainer'>
                {isSendingImage ? (
                  <button>
                    <MessageLoader />
                  </button>
                ) : (
                  <>
                    <button
                      className='cancelSend'
                      onClick={handleCancel}
                      disabled={isSendingImage || isCancelling} // Deshabilita el botón si se está enviando o cancelando
                    >
                      Cancelar
                    </button>
                    <button className='confirmSend' onClick={handleSendImage}>
                      Enviar
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {showDocumentPreview && (
            <div className="previewContainer">
              <div className='docLinkContainer'>
                Ver documento: <a href={documentPreviewURL} className='documentLink' target="_blank" rel="noopener noreferrer"> {document.name} </a> 
              </div>
              <div className='buttonsContainer'>
                {isSendingDocument ? (
                  <button>
                    <MessageLoader />
                  </button>
                ) : (
                  <>
                    <button
                      className='cancelSend'
                      onClick={handleCancelDocumentPreview}
                      disabled={isSendingDocument || isCancellingDocument}
                    >
                      Cancelar
                    </button>
                    <button className='confirmSend' onClick={handleSendDocument}>
                      Enviar
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          <input 
            type="text" 
            placeholder='Type something...' 
            onChange={handleTextChange}
            value={text}
            onKeyDown={handleKeyDown}
          />

          <div className='send'>
            {isTyping ? (
              // Si el usuario está escribiendo, muestra el icono de enviar
              <Icon className='sendIcon' icon="ic:baseline-send" onClick={handleSend} />
            ) : (
              // Si el usuario no está escribiendo, muestra el icono del micrófono
              <FontAwesomeIcon icon={faMicrophone} className='startAudioRecording' onClick={startAudioRecording} />
            )}
          </div>

        </>
      )}

      {isAudioRecording && ( // Muestra el componente de grabación de audio cuando se está grabando
        <div className="audioRecordingContainer">

          <div className='recordingFunctions'>

            <div className='firstContainer'>
              <FontAwesomeIcon 
                icon={faTrash} 
                className='cancelAudioRecording' 
                onClick={cancelAudioRecording} 
              />  

              <div className="audioRecordingMessage">{audioRecordingText}</div>
            </div>

            <div className='secondContainer'>
              <FontAwesomeIcon 
                icon={faCircleStop} 
                className='stopAudioRecording' 
                onClick={stopAudioRecording} 
                disabled={!isRecording}
              />  
              {audio && ( // Renderiza faPlay solo si hay un audio
                <FontAwesomeIcon 
                  icon={faPlay} 
                  className='playRecordedAudio' 
                  onClick={playRecordedAudio} 
                />
              )}
            </div>
          </div>

          <div className='send audioSend'>
            <Icon 
              className='sendIcon' 
              icon="ic:baseline-send" 
              onClick={handleSend} 
              // onClick={() => {
              //   handleSend();
              //   setShowFunctionsContainer(true); // Asegúrate de que showFunctionsContainer esté configurado en true al hacer clic
              // }}
            />
          </div>

        </div>
      )}

    </div>
  )
}

export default InputMessage