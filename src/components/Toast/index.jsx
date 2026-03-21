import React from 'react';
import PropTypes from 'prop-types';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import './Toast.scss';

const ICONS = {
    success: <CheckCircle size={18} />,
    error: <AlertCircle size={18} />,
    info: <Info size={18} />
};

const Toast = ({ toast, onClose }) => {
    return (
        <div className={`toast toast--${toast.type}`}>
            <div className="toast__icon">
                {ICONS[toast.type] || <Info size={18} />}
            </div>
            <div className="toast__content">
                {toast.message}
            </div>
            <button className="toast__close" onClick={onClose} aria-label="Close toast">
                <X size={16} />
            </button>
        </div>
    );
};

Toast.propTypes = {
    toast: PropTypes.shape({
        id: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['success', 'error', 'info']).isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired
};

export default Toast;
