import React from 'react';
import PropTypes from 'prop-types';
import './TabNav.scss';

/**
 * Shared tab navigation component.
 * Responsive: scrollable horizontally on mobile.
 *
 * Usage:
 *   <TabNav
 *     tabs={[
 *       { key: 'overview', label: 'Tổng quan', icon: Info },
 *       { key: 'seed', label: 'Giống', icon: Sprout },
 *     ]}
 *     active="overview"
 *     onChange={(key) => setActiveTab(key)}
 *   />
 */
const TabNav = ({ tabs, active, onChange }) => {
    return (
        <nav className="tab-nav" role="tablist" aria-label="Tab navigation">
            <div className="tab-nav__track">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = active === tab.key;
                    return (
                        <button
                            key={tab.key}
                            role="tab"
                            className={`tab-nav__item ${isActive ? 'tab-nav__item--active' : ''}`}
                            onClick={() => onChange(tab.key)}
                            aria-selected={isActive}
                            aria-controls={`tabpanel-${tab.key}`}
                        >
                            {Icon && <Icon size={16} aria-hidden="true" className="tab-nav__icon" />}
                            <span className="tab-nav__label">{tab.label}</span>
                            {tab.count !== undefined && (
                                <span className="tab-nav__count">{tab.count}</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

TabNav.propTypes = {
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            icon: PropTypes.elementType,
            count: PropTypes.number,
        })
    ).isRequired,
    active: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default TabNav;
