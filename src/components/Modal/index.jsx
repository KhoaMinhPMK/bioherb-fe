import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import './Modal.scss';

const Modal = ({ isOpen, onClose, title, children, footer, maxWidth = '500px' }) => {
    const modalRef = useRef(null);

    // Xử lý đóng khi bấm phím ESC, hoặc click ra ngoài nội dung
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden'; // Ngăn cuộn trang phía sau
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="modal-overlay" aria-modal="true" role="dialog">
            <div 
                className="modal-content" 
                ref={modalRef}
                style={{ maxWidth }}
            >
                <div className="modal-content__header">
                    <h3 className="modal-content__title">{title}</h3>
                    <button className="modal-content__close" onClick={onClose} aria-label="Close modal">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="modal-content__body">
                    {children}
                </div>

                {footer && (
                    <div className="modal-content__footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    footer: PropTypes.node,
    maxWidth: PropTypes.string
};

export default Modal;
