import React from 'react';
import PropTypes from 'prop-types';
import './FormField.scss';

/**
 * Shared form field component — text, number, date, textarea.
 * Touch-friendly: 44px height, 16px font on mobile to avoid iOS zoom.
 */
const FormField = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    disabled = false,
    error,
    hint,
    autoValue,
    rows = 3,
}) => {
    const inputId = `field-${name}`;
    const isTextarea = type === 'textarea';

    return (
        <div className={`form-field ${error ? 'form-field--error' : ''}`}>
            <label htmlFor={inputId} className="form-field__label">
                {label}
                {required && <span className="form-field__required">*</span>}
            </label>
            {autoValue !== undefined ? (
                <div className="form-field__auto">
                    <span className="form-field__auto-value">{autoValue}</span>
                    <span className="form-field__auto-tag">Tự động</span>
                </div>
            ) : isTextarea ? (
                <textarea
                    id={inputId}
                    name={name}
                    className="form-field__input form-field__input--textarea"
                    value={value}
                    onChange={(e) => onChange(name, e.target.value)}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    rows={rows}
                />
            ) : (
                <input
                    id={inputId}
                    name={name}
                    type={type}
                    className="form-field__input"
                    value={value}
                    onChange={(e) => onChange(name, e.target.value)}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                />
            )}
            {hint && !error && <span className="form-field__hint">{hint}</span>}
            {error && <span className="form-field__error">{error}</span>}
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['text', 'number', 'date', 'textarea', 'email', 'tel']),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    hint: PropTypes.string,
    autoValue: PropTypes.string,
    rows: PropTypes.number,
};

export default FormField;
