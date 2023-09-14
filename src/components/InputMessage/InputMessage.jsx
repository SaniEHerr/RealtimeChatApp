import Attach from '../../img/attach.png'
import Img from '../../img/img.png'

const InputMessage = () => {
  return (
    <div className='input'>
      <input type="text" placeholder='Type something...' />
      <div className="send">
        <div className='functionsContainer'>
          <img src={Attach} alt="" />
          <input type="text" style={{ display: "none" }} id='file' />
          <label htmlFor="file">
            <img src={Img} alt="" />
          </label>
        </div>
        <button>
          Send
        </button>
      </div>
    </div>
  )
}

export default InputMessage