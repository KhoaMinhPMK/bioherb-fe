import React, { useEffect, useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import './DetailDrawer.scss';
const DetailDrawer = ({ isOpen, onClose, title, children, width = '45%' }) => {
    const drawerRef = useRef(null);
    const previousFocusRef = useRef(null);
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            onClose();
            return;
        }
        if (e.key === 'Tab' && drawerRef.current) {
            const focusableEls = drawerRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusableEls.length === 0)
                return;
            const first = focusableEls[0];
            const last = focusableEls[focusableEls.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
            else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }, [onClose]);
    useEffect(() => {
        if (isOpen) {
            previousFocusRef.current = document.activeElement;
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                const closeBtn = drawerRef.current?.querySelector('.detail-drawer__close');
                closeBtn?.focus();
            }, 100);
        }
        else {
            document.body.style.overflow = '';
            previousFocusRef.current?.focus();
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKeyDown]);
    if (!isOpen)
        return null;
    return (<div className="detail-drawer__overlay" onClick={onClose} aria-hidden="true">
            <aside ref={drawerRef} className="detail-drawer" style={{ width }} role="dialog" aria-modal="true" aria-label={title || 'Chi tiết'} onClick={(e) => e.stopPropagation()}>
                <div className="detail-drawer__header">
                    <h2 className="detail-drawer__title">{title}</h2>
                    <button className="detail-drawer__close" onClick={onClose} aria-label="Đóng">
                        <X size={20}/>
                    </button>
                </div>
                <div className="detail-drawer__body">
                    {children}
                </div>
            </aside>
        </div>);
};
export default DetailDrawer;
