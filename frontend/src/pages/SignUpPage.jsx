import { Loader, Lock, Mail, User } from "lucide-react";
import { useState } from "react";

import Input from "../components/input";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore.js";
const SignUpPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signup, error, isLoading } = useAuthStore();
    const navigate = useNavigate();
    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await signup(email, password, name);
            navigate("/verify-email");
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div
            className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
			overflow-hidden"
        >
            <div className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-center bg-linear-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                    Create Account
                </h2>
                <form onSubmit={handleSignUp}>
                    <Input
                        icon={User}
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        icon={Mail}
                        value={email}
                        type="text"
                        placeholder="Name"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        icon={Lock}
                        value={password}
                        type="password"
                        placeholder="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && (
                        <p className="text-red-500 font-semibold mt-2">
                            {error}
                        </p>
                    )}

                    <PasswordStrengthMeter password={password} />
                    <button
                        className="w-full bg-linear-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-semibold py-2 mt-4 rounded-lg transition duration-200"
                        type="submit"
                    >
                        {isLoading ? (
                            <Loader
                                className=" animate-spin mx-auto"
                                size={24}
                            />
                        ) : (
                            "Sign Up"
                        )}
                    </button>
                </form>
            </div>
            <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
                <p className="tex-sm text-gray-400">
                    Already have an account?{" "}
                    <Link
                        className="text-green-400 hover:underline"
                        to={"/login"}
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;
