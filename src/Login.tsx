import './Login.css'

function Login() {

  return (
    <form action='/api/login' method='POST'>
      <input type='text' name='usernameField' placeholder='username' />
      <input type='password' name='passwordField' placeholder='password' />
      <input type='roomId' name='roomIdField' placeholder='roomId' />
      <input type='submit' />
    </form>
  );
}

export default Login
