import React from 'react';
import PropTypes from 'prop-types';
import './FormSelect.scss';

/**
 * Shared select / radio component.
 * mode="select" → native <select>, mode="radio" → inline radio buttons.
 */
const FormSelect = ({
    label,
    name,
    value,
    onChange,
    options = [],
    mode = 'select',
    required = false,
    disabled = false,
    error,
    placeholder = 'Chọn...',
}) => {
    const inputId = `select-${name}`;

    return (
        <div className={`form-select ${error ? 'form-select--error' : ''}`}>
            <label htmlFor={inputId} className="form-select__label">
                {label}
                {required && <span className="form-select__required">*</span>}
            </label>

            {mode === 'radio' ? (
                <div className="form-select__radios" role="radiogroup" aria-label={label}>
                    {options.map((opt) => (
                        <label
                            key={opt.value}
                            className={`form-select__radio ${value === opt.value ? 'form-select__radio--active' : ''}`}
                        >
                            <input
                                type="radio"
                                name={name}
                                value={opt.value}
                                checked={value === opt.value}
                                onChange={(e) => onChange(name, e.target.value)}
                                disabled={disabled}
                            />
                            <span className="form-select__radio-label">{opt.label}</span>
                        </label>
                    ))}
                </div>
            ) : (
                <select
                    id={inputId}
                    name={name}
                    className="form-select__input"
                    value={value}
                    onChange={(e) => onChange(name, e.target.value)}
                    required={required}
                    disabled={disabled}
                >
                    <option value="">{placeholder}</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            )}

            {error && <span className="form-select__error">{error}</span>}
        </div>
    );
};

FormSelect.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    mode: PropTypes.oneOf(['select', 'radio']),
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    placeholder: PropTypes.string,
};

export default FormSelect;
