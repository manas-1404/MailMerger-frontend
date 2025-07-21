import { Routes, Route } from 'react-router-dom'

import Layout from "./components/Layout.tsx";
import Dashboard from "./routes/Dashboard.tsx";
import WriteEmail from "./routes/WriteEmail.tsx";
import './App.css'
import Login from "./routes/Login.tsx";
import Signup from "./routes/Signup.tsx";
import MakeTemplate from "./routes/MakeTemplate.tsx";
import ManageTemplates from "./routes/ManageTemplates.tsx";
import ManageQueuedEmails from "./routes/ManageQueuedEmails.tsx";
import UploadFilePage from "./routes/FileUpload.tsx";

function App() {

    return (
    <>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="signup" element={<Signup />} />
                <Route path="login" element={<Login />} />
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="write-email" element={<WriteEmail />} />
                <Route path="make-template" element={<MakeTemplate />} />
                <Route path="manage-templates" element={<ManageTemplates />} />
                <Route path="manage-email-queue" element={<ManageQueuedEmails />} />
                <Route path="upload-file" element={<UploadFilePage />} />
            </Route>
        </Routes>
    </>
  )
}

export default App
