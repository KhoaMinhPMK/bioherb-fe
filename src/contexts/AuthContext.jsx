import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';

const AuthContext = createContext(null);

/**
 * Roles hierarchy (maps to backend role.code):
 *   admin          → Toàn quyền hệ thống, xem tất cả HTX/Farm
 *   htx_manager    → Quản lý 1 HTX, xem các Farm trong HTX
 *   farm_manager   → Quản lý 1 Farm cụ thể
 *   approver       → Duyệt nhật ký / chấm công trong 1 Farm
 *   worker         → Nhập nhật ký, xem thông tin Farm mình
 */

const ROLE_LABELS = {
    admin: 'Admin',
    htx_manager: 'Quản lý HTX',
    farm_manager: 'Quản lý Farm',
    approver: 'Người duyệt',
    worker: 'Nhân viên',
};

const ACCESS_KEY = 'sankit_access_token';
const REFRESH_KEY = 'sankit_refresh_token';

/** Normalize /auth/me response → shape pages expect */
function normalizeUser(apiUser) {
    return {
        id: String(apiUser.id),
        name: apiUser.name,
        email: apiUser.email,
        phone: apiUser.phone || '',
        status: apiUser.status,
        role: apiUser.role?.code || apiUser.role || null,
        htxId: apiUser.cooperative?.id != null ? String(apiUser.cooperative.id) : null,
        farmId: apiUser.farm?.id != null ? String(apiUser.farm.id) : null,
        avatarUrl: apiUser.avatarUrl || null,
        lastLoginAt: apiUser.lastLoginAt || null,
    };
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    // ── Restore session on mount ──────────────────────────────
    useEffect(() => {
        const token = localStorage.getItem(ACCESS_KEY);
        if (!token) {
            setAuthLoading(false);
            return;
        }
        api.get('/auth/me')
            .then(({ data }) => {
                const user = normalizeUser(data);
                setCurrentUser(user);
                setIsAuthenticated(true);
                window.dispatchEvent(new CustomEvent('sankit:login', { detail: user }));
            })
            .catch(() => {
                localStorage.removeItem(ACCESS_KEY);
                localStorage.removeItem(REFRESH_KEY);
            })
            .finally(() => setAuthLoading(false));
    }, []);

    // ── Listen for forced logout from api interceptor ─────────
    useEffect(() => {
        const handler = () => {
            setCurrentUser(null);
            setIsAuthenticated(false);
        };
        window.addEventListener('sankit:logout', handler);
        return () => window.removeEventListener('sankit:logout', handler);
    }, []);

    // ── Permission helpers ────────────────────────────────────
    const role = currentUser?.role || null;

    const isAdmin = useCallback(() => role === 'admin', [role]);
    const isHtxManager = useCallback(() => role === 'htx_manager', [role]);
    const isFarmManager = useCallback(() => role === 'farm_manager', [role]);
    const isApprover = useCallback(() => role === 'approver', [role]);
    const isWorker = useCallback(() => role === 'worker', [role]);

    const canApprove = useCallback(() => ['admin', 'htx_manager', 'farm_manager', 'approver'].includes(role), [role]);
    const canEdit = useCallback(
        () => ['admin', 'htx_manager', 'farm_manager', 'approver', 'worker'].includes(role),
        [role],
    );
    const canManageSystem = useCallback(() => role === 'admin', [role]);
    const canSeeAllFarms = useCallback(() => ['admin', 'htx_manager'].includes(role), [role]);

    // ── Login ─────────────────────────────────────────────────
    const login = useCallback(async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem(ACCESS_KEY, data.accessToken);
            localStorage.setItem(REFRESH_KEY, data.refreshToken);
            const { data: profile } = await api.get('/auth/me');
            const user = normalizeUser(profile);
            setCurrentUser(user);
            setIsAuthenticated(true);
            window.dispatchEvent(new CustomEvent('sankit:login', { detail: user }));
            return { success: true, user };
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                (Array.isArray(err.response?.data?.message)
                    ? err.response.data.message[0]
                    : 'Sai tên đăng nhập hoặc mật khẩu');
            return { success: false, error: msg };
        }
    }, []);

    // ── Logout ────────────────────────────────────────────────
    const logout = useCallback(async () => {
        try {
            await api.post('/auth/logout');
        } catch (_) {
            // ignore — still clear local session
        }
        localStorage.removeItem(ACCESS_KEY);
        localStorage.removeItem(REFRESH_KEY);
        setCurrentUser(null);
        setIsAuthenticated(false);
        window.dispatchEvent(new Event('sankit:logout'));
    }, []);

    // ── canAccessRoute ────────────────────────────────────────
    const canAccessRoute = useCallback(
        (path) => {
            if (!role) return false;
            if (role === 'admin') return true;
            const adminOnly = ['/admin/users', '/admin/dashboard'];
            if (adminOnly.includes(path)) return false;
            const managerPlus = ['/settings'];
            if (managerPlus.includes(path)) return ['admin', 'htx_manager', 'farm_manager'].includes(role);
            return true;
        },
        [role],
    );

    // Lightweight stub — full farm object lives in DataContext.farms
    const currentFarm = useMemo(() => (currentUser?.farmId ? { id: currentUser.farmId } : null), [currentUser]);
    const currentHtx = useMemo(() => (currentUser?.htxId ? { id: currentUser.htxId } : null), [currentUser]);

    const value = useMemo(
        () => ({
            currentUser,
            currentFarm,
            currentHtx,
            role,
            roleLabel: role ? ROLE_LABELS[role] || role : '',
            isAuthenticated,
            authLoading,
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
            logout,
        }),
        [
            currentUser,
            currentFarm,
            currentHtx,
            role,
            isAuthenticated,
            authLoading,
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
