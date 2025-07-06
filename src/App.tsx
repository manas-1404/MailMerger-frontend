import { Routes, Route } from 'react-router-dom'

import Layout from "./components/Layout.tsx";
import Dashboard from "./routes/Dashboard.tsx";
import WriteEmail from "./routes/WriteEmail.tsx";
import KeyValueCard from "./components/KeyValueCard.tsx";
import './App.css'

function App() {

    const dummyTemplates = [
        {
            tid: 1,
            uid: 101,
            t_body: "Hi {{name}},\n\nWelcome to the {{team}} team! We're thrilled to have you onboard.\nLet us know if you have any questions.\n\nCheers,\nHR Team",
            t_key: "name, team"
        },
        {
            tid: 2,
            uid: 101,
            t_body: "Dear {{name}},\n\nThis is a reminder that your task \"{{task_name}}\" is due on {{due_date}}.\nPlease make sure to submit it before the deadline.\n\nBest,\nProject Manager",
            t_key: "name, task_name, due_date"
        },
        {
            tid: 3,
            uid: 101,
            t_body: "Hello {{name}},\n\nYour order {{order_id}} has been shipped and is expected to arrive by {{delivery_date}}.\nTrack your order using the tracking ID: {{tracking_id}}.\n\nThanks for shopping with us!",
            t_key: "name, order_id, delivery_date, tracking_id"
        },
        {
            tid: 4,
            uid: 101,
            t_body: "Hi {{employee_name}},\n\nYour leave for the dates {{leave_start}} to {{leave_end}} has been approved.\nPlease make sure to hand over your responsibilities before leaving.\n\nRegards,\nAdmin",
            t_key: "employee_name, leave_start, leave_end"
        },
        {
            tid: 5,
            uid: 101,
            t_body: "Dear {{student_name}},\n\nYou have scored {{marks}} in {{subject}}.\nKeep up the good work and continue improving!\n\nTeacher",
            t_key: "student_name, marks, subject"
        }
    ];


    return (
    <>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="write-email" element={<WriteEmail templates={dummyTemplates} />} />
                <Route path="make-template" element={<KeyValueCard />} />
            </Route>
        </Routes>
    </>
  )
}

export default App
