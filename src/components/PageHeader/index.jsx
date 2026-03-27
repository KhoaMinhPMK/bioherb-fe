import React from 'react';
import PropTypes from 'prop-types';
import './PageHeader.scss';
const PageHeader = ({ title, subtitle, actions }) => {
    return (
        <div className="page-header">
            <div className="page-header__info">
                <h1 className="page-header__title">{title}</h1>
                {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
            </div>
            {actions && <div className="page-header__actions">{actions}</div>}
        </div>
    );
};
PageHeader.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    actions: PropTypes.node,
};
export default PageHeader;
