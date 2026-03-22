import React from 'react';
import PropTypes from 'prop-types';
import { X, Save, Loader } from 'lucide-react';
import './JournalForm.scss';

/**
 * Drawer wrapper for all journal forms.
 * Opens from right side, supports mobile full-screen.
 */
const JournalFormDrawer = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    children,
    submitting = false,
}) => {
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <>
            <div className="journal-overlay" onClick={onClose} aria-hidden="true" />
            <aside className="journal-drawer" role="dialog" aria-label={title}>
                <div className="journal-drawer__header">
                    <h2 className="journal-drawer__title">{title}</h2>
                    <button
                        className="journal-drawer__close"
                        onClick={onClose}
                        aria-label="Đóng"
                    >
                        <X size={20} />
                    </button>
                </div>
                <form className="journal-drawer__body" onSubmit={handleSubmit}>
                    <div className="journal-drawer__content">
                        {children}
                    </div>
                    <div className="journal-drawer__footer">
                        <button
                            type="button"
                            className="btn btn--outline"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Huỷ
                        </button>
                        <button
                            type="submit"
                            className="btn btn--primary"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <><Loader size={16} className="spin" /> Đang lưu...</>
                            ) : (
                                <><Save size={16} /> Lưu nhật ký</>
                            )}
                        </button>
                    </div>
                </form>
            </aside>
        </>
    );
};

JournalFormDrawer.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    submitting: PropTypes.bool,
};

export default JournalFormDrawer;
