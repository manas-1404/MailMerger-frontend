import { Routes, Route } from 'react-router-dom'

import Dashboard from "./routes/Dashboard.tsx";
import WriteEmail from "./routes/WriteEmail.tsx";
import Home from "./routes/Home.tsx";
import './App.css'

function App() {
  
  return (
    <>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/write-email" element={<WriteEmail />} />

        </Routes>
    </>
  )
}

export default App
