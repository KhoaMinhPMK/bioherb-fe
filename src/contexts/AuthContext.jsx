import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { users as allUsers, farms, cooperatives, roleLabels } from '../data/mockData';

const AuthContext = createContext(null);

/**
 * Roles hierarchy:
 *   admin          → Toàn quyền hệ thống, xem tất cả HTX/Farm
 *   htx_manager    → Quản lý 1 HTX, xem các Farm trong HTX
 *   farm_manager   → Quản lý 1 Farm cụ thể
 *   approver       → Duyệt nhật ký / chấm công trong 1 Farm
 *   worker         → Nhập nhật ký, xem thông tin Farm mình
 */

const STORAGE_KEY = 'bioherb_auth_user';

export function AuthProvider({ children }) {
    const [currentUserId, setCurrentUserId] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved || null;
    });
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem(STORAGE_KEY);
    });

    const currentUser = useMemo(() => {
        if (!currentUserId) return null;
        return allUsers.find((u) => u.id === currentUserId) || null;
    }, [currentUserId]);

    const currentFarm = useMemo(() => {
        if (!currentUser?.farmId) return null;
        return farms.find((f) => f.id === currentUser.farmId) || null;
    }, [currentUser]);

    const currentHtx = useMemo(() => {
        if (!currentUser?.htxId) return null;
        return cooperatives.find((c) => c.id === currentUser.htxId) || null;
    }, [currentUser]);

    // --- Permission helpers ---
    const role = currentUser?.role || null;

    const isAdmin = useCallback(() => role === 'admin', [role]);
    const isHtxManager = useCallback(() => role === 'htx_manager', [role]);
    const isFarmManager = useCallback(() => role === 'farm_manager', [role]);
    const isApprover = useCallback(() => role === 'approver', [role]);
    const isWorker = useCallback(() => role === 'worker', [role]);

    /** Can this user approve task logs / attendance? */
    const canApprove = useCallback(() => {
        return ['admin', 'htx_manager', 'farm_manager', 'approver'].includes(role);
    }, [role]);

    /** Can this user create/edit task logs? */
    const canEdit = useCallback(() => {
        return ['admin', 'htx_manager', 'farm_manager', 'approver', 'worker'].includes(role);
    }, [role]);

    /** Can this user manage system settings / users? */
    const canManageSystem = useCallback(() => {
        return ['admin'].includes(role);
    }, [role]);

    /** Can this user see all farms (admin/htx level)? */
    const canSeeAllFarms = useCallback(() => {
        return ['admin', 'htx_manager'].includes(role);
    }, [role]);

    /** Login: match email + password from mockData */
    const login = useCallback((email, password) => {
        const user = allUsers.find((u) => u.email === email && u.password === password && u.status === 'active');
        if (!user) {
            return { success: false, error: 'Sai tên đăng nhập hoặc mật khẩu' };
        }
        setCurrentUserId(user.id);
        setIsAuthenticated(true);
        localStorage.setItem(STORAGE_KEY, user.id);
        return { success: true, user };
    }, []);

    /** Quick login by userId (for demo selector) */
    const loginAsUser = useCallback((userId) => {
        const user = allUsers.find((u) => u.id === userId);
        if (!user) return false;
        setCurrentUserId(user.id);
        setIsAuthenticated(true);
        localStorage.setItem(STORAGE_KEY, user.id);
        return true;
    }, []);

    /** Logout */
    const logout = useCallback(() => {
        setCurrentUserId(null);
        setIsAuthenticated(false);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    /** Check if a route is accessible for current role */
    const canAccessRoute = useCallback(
        (path) => {
            if (!role) return false;
            // Admin can access everything
            if (role === 'admin') return true;
            // Admin-only routes
            const adminOnly = ['/admin/users', '/admin/dashboard'];
            if (adminOnly.includes(path)) return role === 'admin';
            // Manager+ routes
            const managerPlus = ['/settings'];
            if (managerPlus.includes(path)) return ['admin', 'htx_manager', 'farm_manager'].includes(role);
            // All authenticated users
            return true;
        },
        [role],
    );

    const value = useMemo(
        () => ({
            currentUser,
            currentFarm,
            currentHtx,
            role,
            roleLabel: role ? roleLabels[role] : '',
            isAuthenticated,
            // Role checks
            isAdmin,
            isHtxManager,
            isFarmManager,
            isApprover,
            isWorker,
            // Permission checks
            canApprove,
            canEdit,
            canManageSystem,
            canSeeAllFarms,
            canAccessRoute,
            // Auth actions
            login,
            loginAsUser,
            logout,
        }),
        [
            currentUser,
            currentFarm,
            currentHtx,
            role,
            isAuthenticated,
            isAdmin,
            isHtxManager,
            isFarmManager,
            isApprover,
            isWorker,
            canApprove,
            canEdit,
            canManageSystem,
            canSeeAllFarms,
            canAccessRoute,
            login,
            loginAsUser,
            logout,
        ],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
