import { useState } from 'react'
import './App.css'

function App() {
  // @ts-ignore
    const [count, setCount] = useState(0)

    const handleLogin = async () => {
        window.location.href = "http://localhost:8000/api/oauth/gmail-authorize"
    }

  return (
    <>
        <h1>Welcome to mail merger!</h1>
        <button onClick={handleLogin}>Log in with Google</button>
    </>
  )
}

export default App
