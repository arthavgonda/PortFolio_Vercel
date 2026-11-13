/*
 * The one heading pattern every section uses: a numbered eyebrow, the title,
 * and an optional lede. Reveals are declarative (see hooks/useReveal.js), so
 * the parent section must call useReveal. `trigger` is forwarded as
 * data-trigger for headings inside CSS-sticky containers.
 */
const SectionHeading = ({ index, label, title, lede, trigger, className = '' }) => (
    <header className={`section-head ${className}`}>
        <p data-reveal="up" data-trigger={trigger} className="eyebrow">
            <span className="eyebrow__index">{index}</span>
            <span className="eyebrow__rule" aria-hidden="true" />
            {label}
        </p>
        <h2 data-reveal="lines" data-trigger={trigger} className="section-title">
            {title}
        </h2>
        {lede && (
            <p data-reveal="up" data-trigger={trigger} data-delay="0.1" className="section-lede">
                {lede}
            </p>
        )}
    </header>
);

export default SectionHeading;
