import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { users, farms, cooperatives } from '../data/mockData';

const AuthContext = createContext(null);

/**
 * Roles hierarchy:
 *   admin          → Toàn quyền hệ thống, xem tất cả HTX/Farm
 *   htx_manager    → Quản lý 1 HTX, xem các Farm trong HTX
 *   farm_manager   → Quản lý 1 Farm cụ thể
 *   approver       → Duyệt nhật ký / chấm công trong 1 Farm
 *   worker         → Nhập nhật ký, xem thông tin Farm mình
 */

export function AuthProvider({ children }) {
    // Default: farm_manager (U03 — Lê Văn Hùng, Farm Long An)
    // Change this to simulate different roles during development
    const [currentUserId, setCurrentUserId] = useState('U03');

    const currentUser = useMemo(() => {
        return users.find((u) => u.id === currentUserId) || users[0];
    }, [currentUserId]);

    const currentFarm = useMemo(() => {
        if (!currentUser.farmId) return null;
        return farms.find((f) => f.id === currentUser.farmId) || null;
    }, [currentUser]);

    const currentHtx = useMemo(() => {
        if (!currentUser.htxId) return null;
        return cooperatives.find((c) => c.id === currentUser.htxId) || null;
    }, [currentUser]);

    // --- Permission helpers ---
    const role = currentUser.role;

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

    const switchUser = useCallback((userId) => {
        setCurrentUserId(userId);
    }, []);

    const value = useMemo(() => ({
        currentUser,
        currentFarm,
        currentHtx,
        role,
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
        // Dev tool
        switchUser,
    }), [currentUser, currentFarm, currentHtx, role, isAdmin, isHtxManager, isFarmManager, isApprover, isWorker, canApprove, canEdit, canManageSystem, canSeeAllFarms, switchUser]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
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
