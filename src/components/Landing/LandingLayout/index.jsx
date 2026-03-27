import React from 'react';
import PropTypes from 'prop-types';
import LandingNav from '../LandingNav';
import LandingFooter from '../LandingFooter';
import './LandingLayout.scss';

function LandingLayout({ children }) {
    return (
        <div className="landing-layout">
            <LandingNav />
            <main className="landing-layout__content">{children}</main>
            <LandingFooter />
        </div>
    );
}

LandingLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default LandingLayout;
