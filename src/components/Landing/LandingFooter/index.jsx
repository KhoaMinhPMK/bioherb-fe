import React from 'react';
import { Link } from 'react-router-dom';
import { Share2, Mail, Phone } from 'lucide-react';
import { LANDING_FOOTER } from '../../../data/landingData';
import logo from '../../../assets/images/logo.svg';
import logoChar from '../../../assets/images/logo_char.svg';
import './LandingFooter.scss';

function LandingFooter() {
    return (
        <footer className="landing-footer">
            <div className="landing-footer__container">
                <div className="landing-footer__brand">
                    <Link to="/home" className="landing-footer__logo-link">
                        <img src={logo} alt="SANKIT" className="landing-footer__logo" />
                        <img src={logoChar} alt="SANKIT" className="landing-footer__logo-char" />
                    </Link>
                    <p className="landing-footer__tagline">{LANDING_FOOTER.brand.tagline}</p>
                </div>

                <div className="landing-footer__columns">
                    {LANDING_FOOTER.columns.map((col) => (
                        <div key={col.title} className="landing-footer__column">
                            <h4 className="landing-footer__column-title">{col.title}</h4>
                            <ul className="landing-footer__column-links">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        <Link to={link.href} className="landing-footer__link">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <div className="landing-footer__column">
                        <h4 className="landing-footer__column-title">{LANDING_FOOTER.newsletter.title}</h4>
                        <p className="landing-footer__newsletter-desc">{LANDING_FOOTER.newsletter.description}</p>
                        <div className="landing-footer__newsletter-form">
                            <input
                                type="email"
                                placeholder="Email của bạn"
                                className="landing-footer__newsletter-input"
                            />
                            <button type="button" className="landing-footer__newsletter-btn">
                                →
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="landing-footer__bottom">
                <div className="landing-footer__bottom-inner">
                    <p className="landing-footer__copyright">{LANDING_FOOTER.copyright}</p>
                    <p className="landing-footer__address">{LANDING_FOOTER.address}</p>
                    <div className="landing-footer__socials">
                        <button type="button" className="landing-footer__social" aria-label="Share">
                            <Share2 size={18} />
                        </button>
                        <button type="button" className="landing-footer__social" aria-label="Email">
                            <Mail size={18} />
                        </button>
                        <button type="button" className="landing-footer__social" aria-label="Phone">
                            <Phone size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default LandingFooter;
