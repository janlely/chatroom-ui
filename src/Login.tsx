import './Login.css'
import { useRef } from 'react';
import axios from 'axios';

function Login() {
  const userRef= useRef<HTMLInputElement>(null)
  const passwdRef = useRef<HTMLInputElement>(null)
  const roomIdRef = useRef<HTMLInputElement>(null)
  
  const onClick = () => {
    console.log('submit')
    axios.post("/api/login", {
        username: userRef.current?.value,
        password: passwdRef.current?.value,
        roomId: roomIdRef.current?.value
    }).then(res => {
      if (res.status !== 200) {
        alert(`登录失败: ${res.status}`)
      } else {
        window.location.href = `/Chat?${roomIdRef.current?.value}`
      }
    }).catch(err => {
      alert(`${err.response.data}`)
    })
  }
  return (
    <div>
      <input ref={userRef} type='text' name='usernameField' placeholder='username' />
      <input ref={passwdRef} type='password' name='passwordField' placeholder='password' />
      <input ref={roomIdRef} type='roomId' name='roomIdField' placeholder='roomId' />
      {/* <button onClick={onSubmit}/>登录</button> */}
      <button onClick={onClick}>登录</button>
    </div>
  );
}

export default Login
