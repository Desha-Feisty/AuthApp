import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
const App = () => {
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center overflow-hidden">
            <Routes>
                <Route path="/" element={"home"}></Route>
                <Route path="/signup" element={<SignUpPage />}></Route>
                <Route path="/login" element={<LoginPage />}></Route>
            </Routes>
        </div>
    );
};

export default App;
