import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Check, Plus, Minus, ArrowRight } from 'lucide-react';
import { PRICING_HERO, PRICING_PLANS, PRICING_SETUP, PRICING_FAQ, PRICING_CTA } from '../../../data/landingData';
import useScrollReveal from '../../../hooks/useScrollReveal';
import './PricingPage.scss';

function PricingPage() {
    const [openFaq, setOpenFaq] = useState(null);
    const containerRef = useScrollReveal();

    const toggleFaq = useCallback((id) => {
        setOpenFaq((prev) => (prev === id ? null : id));
    }, []);

    return (
        <div className="pricing-page" ref={containerRef}>
            {/* Hero */}
            <section className="pricing-page__hero">
                <div className="pricing-page__container">
                    <div className="pricing-page__gold-line" />
                    <h1 className="pricing-page__hero-title reveal-scale">{PRICING_HERO.title}</h1>
                    <p className="pricing-page__hero-subtitle reveal">{PRICING_HERO.subtitle}</p>
                </div>
            </section>

            {/* Plans */}
            <section className="pricing-page__plans">
                <div className="pricing-page__container">
                    <div className="pricing-page__plans-grid">
                        {PRICING_PLANS.map((plan, idx) => (
                            <div
                                key={plan.id}
                                className={`pricing-page__plan-card ${plan.featured ? 'pricing-page__plan-card--featured' : ''} reveal stagger-${idx + 1}`}
                            >
                                {plan.featured && <div className="pricing-page__plan-badge">Phổ biến nhất</div>}
                                <h3 className="pricing-page__plan-name">{plan.name}</h3>
                                <p className="pricing-page__plan-subtitle">{plan.subtitle}</p>
                                <ul className="pricing-page__plan-features">
                                    {plan.features.map((feat) => (
                                        <li key={feat.text} className="pricing-page__plan-feature">
                                            <Check size={16} className="pricing-page__plan-check" />
                                            <span>{feat.text}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    to="/login"
                                    className={`pricing-page__plan-cta ${plan.featured ? 'pricing-page__plan-cta--primary' : ''}`}
                                >
                                    Liên hệ tư vấn
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Setup Fee */}
            <section className="pricing-page__setup">
                <div className="pricing-page__container">
                    <div className="pricing-page__setup-card reveal-scale">
                        <div className="pricing-page__setup-accent" />
                        <h2 className="pricing-page__setup-title">{PRICING_SETUP.title}</h2>
                        <p className="pricing-page__setup-desc">{PRICING_SETUP.description}</p>
                        <p className="pricing-page__setup-note">{PRICING_SETUP.note}</p>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="pricing-page__faq">
                <div className="pricing-page__container">
                    <div className="pricing-page__faq-grid">
                        <div className="pricing-page__faq-left reveal-left">
                            <div className="pricing-page__gold-line" />
                            <h2 className="pricing-page__faq-heading">
                                Câu hỏi
                                <br />
                                thường gặp
                            </h2>
                            <p className="pricing-page__faq-subtext">
                                Những thắc mắc phổ biến từ đối tác và khách hàng của SANKIT.
                            </p>
                        </div>
                        <div className="pricing-page__faq-right reveal">
                            {PRICING_FAQ.map((faq, idx) => (
                                <div
                                    key={faq.id}
                                    className={`pricing-page__faq-item ${openFaq === faq.id ? 'pricing-page__faq-item--open' : ''}`}
                                >
                                    <button
                                        className="pricing-page__faq-question"
                                        onClick={() => toggleFaq(faq.id)}
                                        aria-expanded={openFaq === faq.id}
                                    >
                                        <span className="pricing-page__faq-num">
                                            {String(idx + 1).padStart(2, '0')}
                                        </span>
                                        <span className="pricing-page__faq-q-text">{faq.question}</span>
                                        <span className="pricing-page__faq-toggle">
                                            {openFaq === faq.id ? <Minus size={18} /> : <Plus size={18} />}
                                        </span>
                                    </button>
                                    <div className="pricing-page__faq-answer-wrap">
                                        <div className="pricing-page__faq-answer">
                                            <p>{faq.answer}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="pricing-page__cta">
                <div className="pricing-page__container pricing-page__cta-inner">
                    <h2 className="pricing-page__cta-title reveal-scale">{PRICING_CTA.title}</h2>
                    <p className="pricing-page__cta-desc reveal">{PRICING_CTA.description}</p>
                    <Link to="/login" className="pricing-page__cta-btn reveal">
                        <span>Bắt đầu ngay</span>
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default PricingPage;
