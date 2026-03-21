import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../../assets/images/logo.svg';
import './Login.scss';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleSubmit = (e) => {
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
        // Simulate login
        setTimeout(() => {
            setIsLoading(false);
            navigate('/');
        }, 1000);
    };
    return (<div className="login-page">
            <div className="login-page__bg">
                <div className="login-page__bg-shape login-page__bg-shape--1"/>
                <div className="login-page__bg-shape login-page__bg-shape--2"/>
                <div className="login-page__bg-shape login-page__bg-shape--3"/>
            </div>

            <div className="login-page__container">
                <div className="login-card">
                    {/* Logo */}
                    <div className="login-card__logo">
                        <img src={logo} alt="SANKIT logo" className="login-card__logo-img"/>
                        <h1 className="login-card__logo-title">SANKIT</h1>
                        <p className="login-card__logo-sub">Hệ thống quản lý sản xuất nông nghiệp</p>
                    </div>

                    {/* Form */}
                    <form className="login-card__form" onSubmit={handleSubmit}>
                        {error && (<div className="login-card__error">
                                {error}
                            </div>)}

                        <div className="login-card__field">
                            <label htmlFor="login-username" className="login-card__label">Tên đăng nhập</label>
                            <input id="login-username" type="text" className="login-card__input" placeholder="Nhập tên đăng nhập hoặc email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username"/>
                        </div>

                        <div className="login-card__field">
                            <label htmlFor="login-password" className="login-card__label">Mật khẩu</label>
                            <div className="login-card__input-wrapper">
                                <input id="login-password" type={showPassword ? 'text' : 'password'} className="login-card__input" placeholder="Nhập mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password"/>
                                <button type="button" className="login-card__eye-btn" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>
                                    {showPassword ? <EyeOff size={18} aria-hidden="true"/> : <Eye size={18} aria-hidden="true"/>}
                                </button>
                            </div>
                        </div>

                        <div className="login-card__options">
                            <label className="login-card__checkbox">
                                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}/>
                                <span>Ghi nhớ đăng nhập</span>
                            </label>
                            <a href="#forgot" className="login-card__forgot">Quên mật khẩu?</a>
                        </div>

                        <button type="submit" className={`login-card__submit ${isLoading ? 'login-card__submit--loading' : ''}`} disabled={isLoading}>
                            {isLoading ? (<span className="login-card__spinner"/>) : ('Đăng nhập')}
                        </button>
                    </form>

                    <div className="login-card__footer">
                        <p>© 2026 FarmManager - Quản lý nông trại thông minh</p>
                    </div>
                </div>
            </div>
        </div>);
};
export default Login;
