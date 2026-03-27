import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Layers, ShieldCheck, ArrowRight } from 'lucide-react';
import { ABOUT_HERO, ABOUT_VISION, ABOUT_MISSION, ABOUT_WHY_SANKIT, ABOUT_CTA } from '../../../data/landingData';
import useScrollReveal from '../../../hooks/useScrollReveal';
import './AboutPage.scss';

const WHY_ICONS = {
    'root-to-top': Sprout,
    'multi-model': Layers,
    'data-integrity': ShieldCheck,
};

function AboutPage() {
    const containerRef = useScrollReveal();

    return (
        <div className="about-page" ref={containerRef}>
            {/* Hero — Split layout */}
            <section className="about-page__hero">
                <div className="about-page__container">
                    <div className="about-page__hero-grid">
                        <div className="about-page__hero-left reveal-left">
                            <div className="about-page__gold-line" />
                            <h1 className="about-page__hero-title">{ABOUT_HERO.title}</h1>
                            <p className="about-page__hero-desc">{ABOUT_HERO.description}</p>
                        </div>
                        <div className="about-page__hero-right reveal-right">
                            <blockquote className="about-page__hero-quote">
                                <span className="about-page__quote-mark">&ldquo;</span>
                                {ABOUT_HERO.quote}
                            </blockquote>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision & Mission — Sharp cards */}
            <section className="about-page__vm">
                <div className="about-page__container">
                    <div className="about-page__vm-grid">
                        <div className="about-page__vm-card about-page__vm-card--vision reveal-left">
                            <h2 className="about-page__vm-label">{ABOUT_VISION.title}</h2>
                            <p className="about-page__vm-desc">{ABOUT_VISION.description}</p>
                        </div>
                        <div className="about-page__vm-card about-page__vm-card--mission reveal-right">
                            <h2 className="about-page__vm-label">{ABOUT_MISSION.title}</h2>
                            <p className="about-page__vm-desc">{ABOUT_MISSION.description}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why SANKIT — Numbered editorial */}
            <section className="about-page__why">
                <div className="about-page__container">
                    <div className="about-page__section-header reveal">
                        <div className="about-page__gold-line" />
                        <h2 className="about-page__section-title">{ABOUT_WHY_SANKIT.title}</h2>
                        <p className="about-page__section-subtitle">{ABOUT_WHY_SANKIT.subtitle}</p>
                    </div>
                    <div className="about-page__why-grid">
                        {ABOUT_WHY_SANKIT.items.map((item, idx) => {
                            const IconComp = WHY_ICONS[item.id];
                            return (
                                <div key={item.id} className={`about-page__why-card reveal stagger-${idx + 1}`}>
                                    <div className="about-page__why-top-line" />
                                    <span className="about-page__why-num">{String(idx + 1).padStart(2, '0')}</span>
                                    <div className="about-page__why-icon">{IconComp && <IconComp size={36} />}</div>
                                    <h3 className="about-page__why-title">{item.title}</h3>
                                    <p className="about-page__why-desc">{item.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="about-page__cta">
                <div className="about-page__container about-page__cta-inner">
                    <h2 className="about-page__cta-title reveal-scale">{ABOUT_CTA.title}</h2>
                    <p className="about-page__cta-desc reveal">{ABOUT_CTA.description}</p>
                    <Link to="/login" className="about-page__cta-btn reveal">
                        <span>Đăng ký tư vấn</span>
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default AboutPage;
