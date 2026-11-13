import emailjs from '@emailjs/browser';
import { useRef, useState } from 'react';

import useAlert from '../hooks/useAlert.js';
import useReveal from '../hooks/useReveal.js';
import Alert from '../components/Alert.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { EMAIL, LOCATION, socials } from '../constants/index.js';
import { gsap, useGSAP, EASE, MOTION_OK } from '../lib/gsap.js';

const EMPTY_FORM = { name: '', email: '', message: '' };

const Contact = () => {
    const sectionRef = useRef(null);
    const formRef = useRef(null);

    const { alert, showAlert, hideAlert } = useAlert();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);

    useReveal(sectionRef);

    // The form card rises in as one piece; its fields then stagger in via
    // data-reveal="stagger" on the form.
    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add(MOTION_OK, () => {
                gsap.from(formRef.current, {
                    y: 60,
                    autoAlpha: 0,
                    duration: 1.3,
                    ease: EASE.reveal,
                    scrollTrigger: { trigger: formRef.current, start: 'clamp(top 88%)', once: true },
                });
            });
        },
        { scope: sectionRef },
    );

    const handleChange = ({ target: { name, value } }) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        emailjs
            .send(
                'service_7t8a6oq',
                'template_5lqmqq3',
                {
                    from_name: form.name,
                    // These two were still the tutorial's values ("JavaScript
                    // Mastery" / sujata@jsmastery.pro).
                    to_name: 'Anoop',
                    from_email: form.email,
                    to_email: EMAIL,
                    message: form.message,
                },
                'd3C9qISmZaeDSIw39',
            )
            .then(
                () => {
                    setLoading(false);
                    setForm(EMPTY_FORM);
                    showAlert({ text: 'Thanks for reaching out. I’ll get back to you soon.', type: 'success' });
                    setTimeout(hideAlert, 3500);
                },
                (error) => {
                    setLoading(false);
                    console.error(error);
                    showAlert({ text: `Something went wrong. Please email me at ${EMAIL}.`, type: 'danger' });
                    setTimeout(hideAlert, 5000);
                },
            );
    };

    return (
        <section className="section c-space" id="contact" ref={sectionRef}>
            <Alert {...alert} />

            <div className="contact-layout">
                <div className="contact-intro">
                    <SectionHeading
                        index="05"
                        label="Contact"
                        title="Let’s talk"
                        lede="Whether you’re looking to build a new website, improve your existing platform, or bring a unique project to life, I’m here to help."
                    />

                    <dl data-reveal="stagger" data-delay="0.15" className="contact-details">
                        <div>
                            <dt>Email</dt>
                            <dd>
                                <a href={`mailto:${EMAIL}`} className="contact-link">
                                    {EMAIL}
                                </a>
                            </dd>
                        </div>
                        <div>
                            <dt>Based in</dt>
                            <dd>
                                {LOCATION}
                            </dd>
                        </div>
                        <div>
                            <dt>Elsewhere</dt>
                            <dd className="flex flex-wrap gap-x-5 gap-y-2">
                                {socials.map(({ label, href }) => (
                                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="contact-link">
                                        {label}
                                        <span aria-hidden="true"> ↗</span>
                                    </a>
                                ))}
                            </dd>
                        </div>
                    </dl>
                </div>

                <div ref={formRef} className="contact-card">
                    <form data-reveal="stagger" data-delay="0.1" onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <label className="flex flex-col gap-2.5">
                            <span className="field-label">Name</span>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                autoComplete="name"
                                className="field-input"
                                placeholder="Your name"
                            />
                        </label>

                        <label className="flex flex-col gap-2.5">
                            <span className="field-label">Email</span>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                                className="field-input"
                                placeholder="you@company.com"
                            />
                        </label>

                        <label className="flex flex-col gap-2.5">
                            <span className="field-label">Message</span>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                required
                                rows={6}
                                className="field-input resize-none"
                                placeholder="Tell me about your project, timeline and goals."
                            />
                        </label>

                        {/* Wrapped so the reveal animates the div, never the button's own transform. */}
                        <div className="mt-2">
                            <button className="btn btn--primary group w-full" type="submit" disabled={loading}>
                                <span>{loading ? 'Sending…' : 'Send message'}</span>
                                <svg className="btn__arrow" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                                    <path
                                        d="M3 8h10M9 4l4 4-4 4"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
