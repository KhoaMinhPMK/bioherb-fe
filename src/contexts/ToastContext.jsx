import React, { createContext, useState, useCallback, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import Toast from '../components/Toast';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    }, []);

    // Expose to window for quick global access without Hooks during development
    useEffect(() => {
        window.addToast = addToast;

        // CATCH-ALL for generic un-wired action buttons globally reporting missing functionality
        const handleGlobalClick = (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;

            const title = btn.getAttribute('title') || '';
            const ariaLabel = btn.getAttribute('aria-label') || '';

            if (title.includes('Sửa') || ariaLabel.includes('Sửa') || title.includes('Chỉnh sửa')) {
                addToast('Tính năng cập nhật dữ liệu đang phát triển', 'info');
            } else if (title.includes('Xóa') || ariaLabel.includes('Xóa')) {
                addToast('Tính năng xóa dữ liệu đang phát triển', 'error');
            } else if (title.includes('Xem') || ariaLabel.includes('Xem') || title.includes('Chi tiết')) {
                // Ignore if it's already wired to route somewhere (like View Details usually do)
                // But if we want to catch it generically:
                addToast('Đang tải dữ liệu chi tiết...', 'info');
            }
        };

        document.addEventListener('click', handleGlobalClick, { capture: true });

        return () => {
            delete window.addToast;
            document.removeEventListener('click', handleGlobalClick, { capture: true });
        };
    }, [addToast]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            {document.body &&
                createPortal(
                    <div className="toast-container">
                        {toasts.map((toast) => (
                            <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                        ))}
                    </div>,
                    document.body,
                )}
        </ToastContext.Provider>
    );
};

ToastProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};
