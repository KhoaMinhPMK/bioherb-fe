import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { LANDING_NAV_LINKS } from '../../../data/landingData';
import logo from '../../../assets/images/logo.svg';
import logoChar from '../../../assets/images/logo_char.svg';
import './LandingNav.scss';

function LandingNav({ ctaHref }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 32);
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobile = useCallback(() => {
        setMobileOpen((prev) => !prev);
    }, []);

    const closeMobile = useCallback(() => {
        setMobileOpen(false);
    }, []);

    return (
        <nav className={`landing-nav ${scrolled ? 'landing-nav--scrolled' : ''}`}>
            <div className="landing-nav__container">
                <Link to="/home" className="landing-nav__brand" onClick={closeMobile}>
                    <img src={logo} alt="SANKIT" className="landing-nav__logo" />
                    <img src={logoChar} alt="SANKIT" className="landing-nav__logo-char" />
                </Link>

                <ul className={`landing-nav__links ${mobileOpen ? 'landing-nav__links--open' : ''}`}>
                    {LANDING_NAV_LINKS.map((link) => (
                        <li key={link.id}>
                            <Link
                                to={link.href}
                                className={`landing-nav__link ${location.pathname === link.href ? 'landing-nav__link--active' : ''}`}
                                onClick={closeMobile}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="landing-nav__actions">
                    <Link to={ctaHref || '/login'} className="landing-nav__cta">
                        <span>Request Demo</span>
                    </Link>
                </div>

                <button
                    className="landing-nav__mobile-toggle"
                    onClick={toggleMobile}
                    aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {mobileOpen && (
                <div className="landing-nav__mobile-menu">
                    <ul className="landing-nav__mobile-links">
                        {LANDING_NAV_LINKS.map((link) => (
                            <li key={link.id}>
                                <Link
                                    to={link.href}
                                    className={`landing-nav__link ${location.pathname === link.href ? 'landing-nav__link--active' : ''}`}
                                    onClick={closeMobile}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="landing-nav__mobile-actions">
                        <Link to={ctaHref || '/login'} className="landing-nav__cta" onClick={closeMobile}>
                            <span>Request Demo</span>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}

LandingNav.propTypes = {
    ctaHref: PropTypes.string,
};

export default LandingNav;
