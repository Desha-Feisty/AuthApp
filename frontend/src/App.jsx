import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import Dashboard from "./pages/Dashboard.jsx";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore.js";
import { useEffect } from "react";
import { Loader } from "lucide-react";

const RedirectAuthenticatedUser = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();
    if (isAuthenticated && user.isVerified) {
        return <Navigate to="/" replace />;
    }
    return children;
};

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();
    if (isAuthenticated && user.isVerified) {
        return children;
    }
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!user.isVerified) return <Navigate to="/verify-email" replace />;
    return children;
};
const App = () => {
    const { isCheckingAuth, checkAuth } = useAuthStore();
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth) return <Loader className="animate-spin" />;

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center overflow-hidden">
            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                ></Route>
                <Route
                    path="/signup"
                    element={
                        <RedirectAuthenticatedUser>
                            <SignUpPage />
                        </RedirectAuthenticatedUser>
                    }
                ></Route>
                <Route
                    path="/login"
                    element={
                        <RedirectAuthenticatedUser>
                            <LoginPage />
                        </RedirectAuthenticatedUser>
                    }
                ></Route>
                <Route
                    path="/verify-email"
                    element={<EmailVerificationPage />}
                ></Route>
            </Routes>
            <Toaster />
        </div>
    );
};

export default App;
