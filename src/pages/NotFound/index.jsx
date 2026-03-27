import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import './NotFound.scss';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found">
            <div className="not-found__content">
                <div className="not-found__icon">
                    <AlertTriangle size={64} />
                </div>
                <h1 className="not-found__code">404</h1>
                <h2 className="not-found__title">Không tìm thấy trang</h2>
                <p className="not-found__desc">Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
                <button className="btn btn--primary not-found__btn" onClick={() => navigate('/')}>
                    <Home size={18} />
                    Về trang chủ
                </button>
            </div>
        </div>
    );
};

export default NotFound;
