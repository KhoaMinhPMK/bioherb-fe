import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown } from 'lucide-react';
import './Dropdown.scss';

const Dropdown = ({
    value,
    onChange,
    options,
    placeholder = 'Chọn một thuộc tính...',
    icon: Icon,
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div 
            className={`custom-dropdown ${className} ${isOpen ? 'custom-dropdown--open' : ''}`} 
            ref={dropdownRef}
        >
            <button 
                type="button" 
                className={`custom-dropdown__trigger ${!selectedOption ? 'custom-dropdown__trigger--placeholder' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                {Icon && <Icon size={16} className="custom-dropdown__trigger-icon" />}
                <span className="custom-dropdown__trigger-text">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown size={16} className="custom-dropdown__trigger-chevron" />
            </button>

            {isOpen && (
                <ul className="custom-dropdown__menu" role="listbox">
                    <li 
                        className={`custom-dropdown__item ${!value ? 'custom-dropdown__item--selected' : ''}`}
                        onClick={() => handleSelect('')}
                        role="option"
                        aria-selected={!value}
                    >
                        {placeholder}
                    </li>
                    {options.map((option) => (
                        <li
                            key={option.value}
                            className={`custom-dropdown__item ${value === option.value ? 'custom-dropdown__item--selected' : ''}`}
                            onClick={() => handleSelect(option.value)}
                            role="option"
                            aria-selected={value === option.value}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

Dropdown.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    placeholder: PropTypes.string,
    icon: PropTypes.elementType,
    className: PropTypes.string,
};

export default Dropdown;
