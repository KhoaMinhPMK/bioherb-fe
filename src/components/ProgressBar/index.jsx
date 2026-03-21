import React from 'react';
import './ProgressBar.scss';
const getVariant = (value) => {
    if (value >= 90)
        return 'success';
    if (value >= 50)
        return 'info';
    return 'warning';
};
const ProgressBar = ({ value = 0, size = 'sm', showLabel = true }) => {
    const clampedValue = Math.min(100, Math.max(0, value));
    const variant = getVariant(clampedValue);
    return (<div className={`progress-bar progress-bar--${size}`}>
            <div className="progress-bar__track">
                <div className={`progress-bar__fill progress-bar__fill--${variant}`} style={{ width: `${clampedValue}%` }} role="progressbar" aria-valuenow={clampedValue} aria-valuemin={0} aria-valuemax={100}/>
            </div>
            {showLabel && (<span className="progress-bar__label">{clampedValue}%</span>)}
        </div>);
};
export default ProgressBar;
