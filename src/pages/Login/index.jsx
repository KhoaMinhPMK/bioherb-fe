import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import logoChar from '../../assets/images/logo_char.svg';
import './Login.scss';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    // Redirect if already logged in
    React.useEffect(() => {
        if (isAuthenticated) navigate('/');
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email.trim()) {
            setError('Vui lòng nhập tên đăng nhập');
            return;
        }
        if (!password.trim()) {
            setError('Vui lòng nhập mật khẩu');
            return;
        }
        setIsLoading(true);
        const result = await login(email.trim(), password);
        setIsLoading(false);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || 'Đăng nhập thất bại. Vui lòng thử lại.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-page__bg">
                <div className="login-page__bg-shape login-page__bg-shape--1" />
                <div className="login-page__bg-shape login-page__bg-shape--2" />
                <div className="login-page__bg-shape login-page__bg-shape--3" />
            </div>

            <div className="login-page__container">
                <div className="login-card">
                    {/* Logo */}
                    <div className="login-card__logo">
                        <img src={logoChar} alt="BioHerb" className="login-card__logo-char" />
                        <p className="login-card__logo-sub">Hệ thống quản lý sản xuất nông nghiệp</p>
                    </div>

                    {/* Form */}
                    <form className="login-card__form" onSubmit={handleSubmit}>
                        {error && <div className="login-card__error">{error}</div>}

                        <div className="login-card__field">
                            <label htmlFor="login-username" className="login-card__label">
                                Email đăng nhập
                            </label>
                            <input
                                id="login-username"
                                type="text"
                                className="login-card__input"
                                placeholder="Nhập email (vd: hung@sankit.vn)"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="username"
                            />
                        </div>

                        <div className="login-card__field">
                            <label htmlFor="login-password" className="login-card__label">
                                Mật khẩu
                            </label>
                            <div className="login-card__input-wrapper">
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="login-card__input"
                                    placeholder="Nhập mật khẩu (demo: 123456)"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="login-card__eye-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="login-card__options">
                            <label className="login-card__checkbox">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span>Ghi nhớ đăng nhập</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className={`login-card__submit ${isLoading ? 'login-card__submit--loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="login-card__spinner" />
                            ) : (
                                <>
                                    <LogIn size={18} />
                                    Đăng nhập
                                </>
                            )}
                        </button>
                    </form>

                    <div className="login-card__footer">
                        <p>© 2026 BioHerb - Hệ thống quản lý nông nghiệp thông minh</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
