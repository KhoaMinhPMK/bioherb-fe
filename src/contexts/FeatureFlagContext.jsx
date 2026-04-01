import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { featureFlags as defaultFlags, sidebarPathToFeatureKey } from '../data/featureFlagData';

const FeatureFlagContext = createContext(null);

const STORAGE_KEY = 'sankit_feature_flags';

function loadFlags() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
    } catch {
        /* ignore corrupt data */
    }
    return defaultFlags;
}

export function FeatureFlagProvider({ children }) {
    const [flags, setFlags] = useState(loadFlags);

    const persist = useCallback((next) => {
        setFlags(next);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }, []);

    /** Check if a feature is enabled for a given role */
    const isFeatureEnabled = useCallback(
        (featureKey, role) => {
            const flag = flags.find((f) => f.key === featureKey);
            if (!flag) return true; // unknown key → don't block
            if (flag.status === 'disabled') return false;
            if (!role) return flag.status === 'enabled' || flag.status === 'beta';
            return !!flag.roles[role];
        },
        [flags],
    );

    /** Check if a sidebar path is enabled for a given role */
    const isSidebarPathEnabled = useCallback(
        (path, role) => {
            const key = sidebarPathToFeatureKey[path];
            if (!key) return true; // no flag controls this path
            return isFeatureEnabled(key, role);
        },
        [isFeatureEnabled],
    );

    /** Check if a route is enabled for a given role */
    const isRouteEnabled = useCallback(
        (routePath, role) => {
            const key = sidebarPathToFeatureKey[routePath];
            if (!key) return true;
            return isFeatureEnabled(key, role);
        },
        [isFeatureEnabled],
    );

    /** Update a single flag field (used by admin page) */
    const updateFlag = useCallback(
        (featureKey, patch) => {
            const next = flags.map((f) => {
                if (f.key !== featureKey) return f;
                return { ...f, ...patch, updatedAt: new Date().toISOString().slice(0, 10) };
            });
            persist(next);
        },
        [flags, persist],
    );

    /** Toggle a role within a flag */
    const toggleFlagRole = useCallback(
        (featureKey, roleKey) => {
            const next = flags.map((f) => {
                if (f.key !== featureKey) return f;
                return {
                    ...f,
                    roles: { ...f.roles, [roleKey]: !f.roles[roleKey] },
                    updatedAt: new Date().toISOString().slice(0, 10),
                };
            });
            persist(next);
        },
        [flags, persist],
    );

    /** Cycle status: enabled -> beta -> disabled -> enabled */
    const cycleStatus = useCallback(
        (featureKey) => {
            const flag = flags.find((f) => f.key === featureKey);
            if (!flag || flag.protected) return;
            const order = ['enabled', 'beta', 'disabled'];
            const idx = order.indexOf(flag.status);
            const nextStatus = order[(idx + 1) % order.length];
            updateFlag(featureKey, { status: nextStatus });
        },
        [flags, updateFlag],
    );

    /** Reset all flags to defaults */
    const resetFlags = useCallback(() => {
        persist(defaultFlags);
    }, [persist]);

    const value = useMemo(
        () => ({
            flags,
            isFeatureEnabled,
            isSidebarPathEnabled,
            isRouteEnabled,
            updateFlag,
            toggleFlagRole,
            cycleStatus,
            resetFlags,
        }),
        [
            flags,
            isFeatureEnabled,
            isSidebarPathEnabled,
            isRouteEnabled,
            updateFlag,
            toggleFlagRole,
            cycleStatus,
            resetFlags,
        ],
    );

    return <FeatureFlagContext.Provider value={value}>{children}</FeatureFlagContext.Provider>;
}

FeatureFlagProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export function useFeatureFlags() {
    const ctx = useContext(FeatureFlagContext);
    if (!ctx) throw new Error('useFeatureFlags must be used within FeatureFlagProvider');
    return ctx;
}
