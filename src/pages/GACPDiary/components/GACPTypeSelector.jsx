import React from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import { GACP_ENTRY_TYPES } from '../gacpConstants';
import GACPIconMap from '../gacpIcons';
import './GACPTypeSelector.scss';

/**
 * GACPTypeSelector — Inline 3-column icon grid for selecting GACP entry type.
 * Uses Lucide icons instead of emojis for consistency with design system.
 * Can be rendered as modal or inline (controlled by isModal prop).
 */
const GACPTypeSelector = ({ isOpen, onClose, onSelect, isModal = true }) => {
    if (!isOpen) return null;

    const grid = (
        <div className="gacp-type-selector">
            {isModal && (
                <div className="gacp-type-selector__header">
                    <span className="gacp-type-selector__title">Chọn loại ghi nhật ký</span>
                    <button className="gacp-type-selector__close" onClick={onClose} aria-label="Đóng">
                        <X size={20} />
                    </button>
                </div>
            )}
            <div className="gacp-type-selector__grid">
                {GACP_ENTRY_TYPES.map((type) => {
                    const IconComponent = GACPIconMap[type.iconName];
                    return (
                        <button
                            key={type.id}
                            className="gacp-type-selector__item"
                            onClick={() => {
                                onSelect(type.id);
                                if (onClose) onClose();
                            }}
                            style={{ '--type-color': type.color }}
                            title={type.label}
                        >
                            <span className="gacp-type-selector__icon" style={{ color: type.color }}>
                                {IconComponent ? <IconComponent size={24} /> : '?'}
                            </span>
                            <span className="gacp-type-selector__label">{type.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );

    if (!isModal) return grid;

    return (
        <>
            <div className="gacp-type-overlay" onClick={onClose} />
            {grid}
        </>
    );
};

GACPTypeSelector.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    onSelect: PropTypes.func.isRequired,
    isModal: PropTypes.bool,
};

export default GACPTypeSelector;
