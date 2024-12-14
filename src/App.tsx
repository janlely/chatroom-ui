// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import Login from './Login';
import Chat from './Chat';
import { BrowserRouter, Routes, Route} from 'react-router';



function App() {
  //设置各个页面的路由
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={<Login/>} />
        <Route path="/Chat" element={<Chat/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
