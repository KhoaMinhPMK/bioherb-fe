import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FileX, TrendingDown, SearchX, MapPin, BookOpen, ArrowRight, Check } from 'lucide-react';
import { HOME_HERO, HOME_CHALLENGES, HOME_PHILOSOPHY, HOME_ECOSYSTEM, HOME_CTA } from '../../../data/landingData';
import useScrollReveal from '../../../hooks/useScrollReveal';
import useCountUp from '../../../hooks/useCountUp';
import heroImg from '../../../assets/images/img1.png';
import './HomePage.scss';

const CHALLENGE_ICONS = {
    'file-x': FileX,
    'trending-down': TrendingDown,
    'search-x': SearchX,
};

function StatValue({ value }) {
    const [ref, display] = useCountUp(value);
    return (
        <span ref={ref} className="home-page__stat-value">
            {display}
        </span>
    );
}

StatValue.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

function HomePage() {
    const containerRef = useScrollReveal();

    return (
        <div className="home-page" ref={containerRef}>
            {/* ===== HERO — Full-bleed image with overlay ===== */}
            <section className="home-page__hero">
                <div className="home-page__hero-bg">
                    <img src={heroImg} alt="" className="home-page__hero-bg-img" />
                    <div className="home-page__hero-overlay" />
                </div>
                <div className="home-page__hero-content">
                    <div className="home-page__hero-label">
                        <span className="home-page__hero-label-line" />
                        {HOME_HERO.label}
                    </div>
                    <h1 className="home-page__hero-title">
                        <span className="home-page__brand-san">SAN</span>
                        <span className="home-page__brand-kit">KIT</span>
                        <br />
                        {HOME_HERO.titleLine2}
                        <br />
                        {HOME_HERO.titleLine3}
                    </h1>
                    <p className="home-page__hero-subtitle">{HOME_HERO.subtitle}</p>
                    <div className="home-page__hero-actions">
                        <Link to="/login" className="home-page__btn home-page__btn--primary">
                            <span>{HOME_HERO.ctaPrimary}</span>
                            <ArrowRight size={16} />
                        </Link>
                        <Link to="/about" className="home-page__btn home-page__btn--ghost">
                            {HOME_HERO.ctaSecondary}
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== CHALLENGES — Horizontal editorial rows ===== */}
            <section className="home-page__challenges">
                <div className="home-page__container">
                    <div className="home-page__section-header reveal">
                        <div className="home-page__gold-line" />
                        <h2 className="home-page__section-title">{HOME_CHALLENGES.title}</h2>
                        <p className="home-page__section-subtitle">{HOME_CHALLENGES.subtitle}</p>
                    </div>
                    <div className="home-page__challenges-list">
                        {HOME_CHALLENGES.items.map((item, idx) => {
                            const IconComp = CHALLENGE_ICONS[item.icon];
                            return (
                                <div key={item.id} className={`home-page__challenge-row reveal stagger-${idx + 1}`}>
                                    <div className="home-page__challenge-num">{String(idx + 1).padStart(2, '0')}</div>
                                    <div className="home-page__challenge-icon">
                                        {IconComp && <IconComp size={32} />}
                                    </div>
                                    <div className="home-page__challenge-content">
                                        <h3 className="home-page__challenge-title">{item.title}</h3>
                                        <p className="home-page__challenge-desc">{item.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ===== PHILOSOPHY — Dark block with quote ===== */}
            <section className="home-page__philosophy">
                <div className="home-page__container">
                    <div className="home-page__philosophy-inner reveal-scale">
                        <span className="home-page__philosophy-deco">&ldquo;</span>
                        <h2 className="home-page__philosophy-title">{HOME_PHILOSOPHY.title}</h2>
                        <div className="home-page__philosophy-divider" />
                        <p className="home-page__philosophy-subtitle">{HOME_PHILOSOPHY.subtitle}</p>
                    </div>
                </div>
            </section>

            {/* ===== ECOSYSTEM — Bento grid ===== */}
            <section className="home-page__ecosystem" id="features">
                <div className="home-page__container">
                    <div className="home-page__section-header reveal">
                        <div className="home-page__gold-line" />
                        <h2 className="home-page__section-title">{HOME_ECOSYSTEM.title}</h2>
                        <p className="home-page__section-subtitle">{HOME_ECOSYSTEM.subtitle}</p>
                    </div>
                    <div className="home-page__ecosystem-grid">
                        {HOME_ECOSYSTEM.features.map((feat, idx) => (
                            <div key={feat.id} className={`home-page__eco-card reveal stagger-${idx + 1}`}>
                                <div className="home-page__eco-card-header">
                                    <div className="home-page__eco-card-icon">
                                        {feat.id === 'gis' ? <MapPin size={36} /> : <BookOpen size={36} />}
                                    </div>
                                    <h3 className="home-page__eco-card-title">{feat.title}</h3>
                                </div>
                                <p className="home-page__eco-card-desc">{feat.description}</p>
                                {feat.highlights && (
                                    <ul className="home-page__eco-highlights">
                                        {feat.highlights.map((h) => (
                                            <li key={h}>
                                                <Check size={16} /> {h}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {feat.stats && (
                                    <div className="home-page__eco-stats">
                                        {feat.stats.map((s) => (
                                            <div key={s.label} className="home-page__eco-stat">
                                                <StatValue value={s.value} />
                                                <span className="home-page__eco-stat-label">{s.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA — Dark with geometric lines ===== */}
            <section className="home-page__cta">
                <div className="home-page__container home-page__cta-inner">
                    <h2 className="home-page__cta-title reveal-scale">{HOME_CTA.title}</h2>
                    <p className="home-page__cta-subtitle reveal">{HOME_CTA.subtitle}</p>
                    <p className="home-page__cta-note reveal">{HOME_CTA.note}</p>
                    <Link to="/login" className="home-page__btn home-page__btn--cta-light reveal">
                        <span>Đăng ký tư vấn miễn phí</span>
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default HomePage;
