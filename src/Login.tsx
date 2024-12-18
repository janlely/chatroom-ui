import './Login.css'
import { useRef } from 'react';
import axios from 'axios';

function Login() {
  const userRef= useRef<HTMLInputElement>(null)
  // const passwdRef = useRef<HTMLInputElement>(null)
  const roomIdRef = useRef<HTMLInputElement>(null)
  const optRef = useRef<HTMLInputElement>(null)
  
  const onClick = () => {
    console.log('submit')
    axios.post("/api/login", {
        username: userRef.current?.value,
        // password: passwdRef.current?.value,
        roomId: roomIdRef.current?.value,
        token: optRef.current?.value
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
    <div className="login-container">
      <input ref={userRef} type='text' placeholder='username' />
      {/* <input ref={passwdRef} type='password' placeholder='password' /> */}
      <input ref={optRef} type='text' placeholder='opt' />
      <input ref={roomIdRef} type='roomId' value="123456" />
      <button onClick={onClick}>登录</button>
    </div>
  );
}

export default Login
