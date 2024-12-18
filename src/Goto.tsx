import { useRef } from 'react';
import './Goto.css'

function Goto() {

  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    //get input roomId and redirect to /chat?${roomId}
    const roomId = inputRef.current?.value
    if (roomId) {
      window.location.href = `/Chat?${roomId}`
    }
  }
  return (
    <div>
      <input ref={inputRef} type='roomId' name='roomId' value='123456' />
      <button onClick={handleClick}>进入房间</button>
    </div>
  );
}

export default Goto 
