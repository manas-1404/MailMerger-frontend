import { Routes, Route } from 'react-router-dom'

import Dashboard from "./Dashboard.tsx";
import Home from "./routes/Home.tsx";
import './App.css'

function App() {
  
  return (
    <>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    </>
  )
}

export default App
