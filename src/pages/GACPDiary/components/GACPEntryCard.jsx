import React from 'react';
import PropTypes from 'prop-types';
import { Edit, Trash2 } from 'lucide-react';
import { GACP_TYPE_MAP } from '../gacpConstants';
import GACPIconMap from '../gacpIcons';
import './GACPEntryCard.scss';

/**
 * GACPEntryCard — Timeline entry card with Lucide icon, auto-generated summary,
 * timestamp, and hover-reveal edit/delete actions.
 */
const GACPEntryCard = ({ entry, onEdit, onDelete, users }) => {
    const typeConfig = GACP_TYPE_MAP[entry.type];
    if (!typeConfig) return null;

    const IconComponent = GACPIconMap[typeConfig.iconName];

    // Auto-generate summary from first 2 non-empty data values
    const summary = Object.values(entry.data || {})
        .filter(Boolean)
        .slice(0, 2)
        .join(' — ');
    const creatorName = users?.find((u) => u.id === entry.createdBy)?.name || entry.createdBy;
    const time = entry.createdAt
        ? new Date(entry.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        : '';

    return (
        <div className="gacp-entry-card">
            {/* Icon column with timeline line */}
            <div className="gacp-entry-card__icon-col">
                <div className="gacp-entry-card__icon" style={{ color: typeConfig.color }}>
                    {IconComponent ? <IconComponent size={18} /> : '?'}
                </div>
                <div className="gacp-entry-card__line" />
            </div>

            {/* Content */}
            <div className="gacp-entry-card__content">
                <div className="gacp-entry-card__header">
                    <span className="gacp-entry-card__badge" style={{ background: typeConfig.color }}>
                        {typeConfig.label}
                    </span>
                    <span className="gacp-entry-card__time">{time}</span>
                </div>
                <p className="gacp-entry-card__summary">{summary || typeConfig.label}</p>
                {entry.note && <p className="gacp-entry-card__note">{entry.note}</p>}
                <div className="gacp-entry-card__footer">
                    <span className="gacp-entry-card__creator">{creatorName}</span>
                    <div className="gacp-entry-card__actions">
                        <button
                            className="gacp-entry-card__btn"
                            onClick={() => onEdit(entry)}
                            title="Sửa"
                            aria-label="Sửa"
                        >
                            <Edit size={14} />
                        </button>
                        <button
                            className="gacp-entry-card__btn gacp-entry-card__btn--danger"
                            onClick={() => onDelete(entry.id)}
                            title="Xóa"
                            aria-label="Xóa"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

GACPEntryCard.propTypes = {
    entry: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    users: PropTypes.array,
};

export default GACPEntryCard;
