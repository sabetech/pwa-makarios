import React, { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useLogin } from '../../hooks/useLogin';
import logo from '../../assets/makarios_log_trans_bg.png';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const loginMutation = useLogin();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard', { replace: true });
        }
    }, [navigate]);



    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate(formData, {
            onSuccess: () => {
                navigate('/dashboard');
            }
        });
    };

    const handleGoogleLogin = () => {
        console.log('Google login attempt');
        // Add Google login logic here
    };

    return (
        <div className="login-container">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === 'light' ? <FiMoon size={24} /> : <FiSun size={24} />}
            </button>

            <div className="login-card">
                <div className="login-logo-container">
                    <img src={logo} alt="Makarios Logo" className="login-logo-img" />
                </div>
                <h1 className="login-title">Welcome Back</h1>
                <p className="login-subtitle">Sign in to your account to continue</p>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-input"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-input"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loginMutation.isLoading}>
                        {loginMutation.isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                    {loginMutation.isError && (
                        <p style={{ color: 'red', marginTop: '10px' }}>
                            Login failed. Please check your credentials.
                        </p>
                    )}
                </form>

                <div className="divider">Or continue with</div>

                <button className="google-btn" onClick={handleGoogleLogin}>
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google logo"
                        width="20"
                        height="20"
                    />
                    Sign in with Google
                </button>
            </div>
        </div>
    );
};

export default Login;
