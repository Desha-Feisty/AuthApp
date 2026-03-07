import { useState } from "react";
import { Mail, Lock, Loader } from "lucide-react";
import Input from "../components/input";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, error, isLoading } = useAuthStore();
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
                <h2 className="className='text-3xl font-bold mb-6 text-center bg-linear-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                    Welcome Back
                </h2>
                <form onSubmit={handleLogin}>
                    <Input
                        icon={Mail}
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        icon={Lock}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="flex items-center mb-6">
                        <Link
                            to="/forgot-password"
                            className="text-sm text-green-400 hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition duration-200"
                    >
                        {isLoading ? (
                            <Loader className="w-6 h-6 animate-spin  mx-auto" />
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
