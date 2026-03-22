import React from 'react';
import PropTypes from 'prop-types';
import { CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import './PlanActualBadge.scss';

/**
 * PlanActualBadge — shows whether a task was planned or ad-hoc.
 *
 * type:  'planned'   → green "Theo KH"
 *        'unplanned' → yellow "Phát sinh — Chờ duyệt"
 *        'deviation' → red with reason
 */
const PlanActualBadge = ({ type = 'planned', reason }) => {
    if (type === 'planned') {
        return (
            <span className="plan-badge plan-badge--planned">
                <CheckCircle2 size={12} />
                Theo KH
            </span>
        );
    }

    if (type === 'unplanned') {
        return (
            <span className="plan-badge plan-badge--unplanned">
                <Clock size={12} />
                Phát sinh
            </span>
        );
    }

    if (type === 'deviation-minor') {
        return (
            <span className="plan-badge plan-badge--deviation-minor" title={reason}>
                <AlertTriangle size={12} />
                🟡 Lệch nhẹ
            </span>
        );
    }

    if (type === 'deviation-major') {
        return (
            <span className="plan-badge plan-badge--deviation-major" title={reason}>
                <AlertTriangle size={12} />
                🔴 Trễ nghiêm trọng
            </span>
        );
    }

    return null;
};

PlanActualBadge.propTypes = {
    type: PropTypes.oneOf(['planned', 'unplanned', 'deviation-minor', 'deviation-major']).isRequired,
    reason: PropTypes.string,
};

export default PlanActualBadge;
