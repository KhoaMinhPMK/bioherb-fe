import React from 'react';
import PropTypes from 'prop-types';
import './StatusBadge.scss';
const STATUS_MAP = {
    approved: { label: 'Đã duyệt', variant: 'success' },
    done: { label: 'Hoàn thành', variant: 'success' },
    active: { label: 'Hoạt động', variant: 'info' },
    Active: { label: 'Active', variant: 'info' },
    pending: { label: 'Chờ duyệt', variant: 'warning' },
    draft: { label: 'Nháp', variant: 'neutral' },
    submitted: { label: 'Đã nộp', variant: 'info' },
    returned: { label: 'Trả lại', variant: 'error' },
    rejected: { label: 'Từ chối', variant: 'error' },
    closed: { label: 'Đã đóng', variant: 'neutral' },
    Closed: { label: 'Closed', variant: 'neutral' },
    harvesting: { label: 'Thu hoạch', variant: 'success' },
    Harvesting: { label: 'Harvesting', variant: 'success' },
    overdue: { label: 'Trễ hạn', variant: 'error' },
    'in-progress': { label: 'Đang thực hiện', variant: 'info' },
    resolved: { label: 'Đã xử lý', variant: 'success' },
    monitoring: { label: 'Theo dõi', variant: 'warning' },
};
const StatusBadge = ({ status, label: customLabel, variant: customVariant }) => {
    const mapped = STATUS_MAP[status] || {};
    const variant = customVariant || mapped.variant || 'neutral';
    const label = customLabel || mapped.label || status;
    return <span className={`status-badge status-badge--${variant}`}>{label}</span>;
};
StatusBadge.propTypes = {
    status: PropTypes.string,
    label: PropTypes.string,
    variant: PropTypes.oneOf(['success', 'info', 'warning', 'error', 'neutral']),
};
export default StatusBadge;
