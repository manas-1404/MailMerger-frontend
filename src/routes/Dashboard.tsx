import { useNavigate} from "react-router-dom";

function Dashboard(){
    const navigate = useNavigate();

    return (
        <div >
            <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Hello, Username</h1>
                <h2 className="text-white text-xl mb-8">Welcome to your email dashboard.</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-20">
                    <button onClick={() => navigate('/quick-email')}>📨 Send Quick Email</button>
                    <button onClick={() => navigate('/write-email')}>📝 Write Email</button>
                    <button onClick={() => navigate('/send-queue')}>📦 Send Email Queue</button>
                    <button onClick={() => navigate('/create-template')}>📂 Create Email Template</button>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;