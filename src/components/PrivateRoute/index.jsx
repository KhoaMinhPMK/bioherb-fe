import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * PrivateRoute — Bảo vệ route:
 * - Chưa đăng nhập → redirect /login
 * - Không đủ quyền → redirect / + toast
 */
const PrivateRoute = ({ children }) => {
    const { isAuthenticated, canAccessRoute } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!canAccessRoute(location.pathname)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PrivateRoute;
