// Renders a link when given an href (the old version nested a <button> inside
// an <a>, which is invalid HTML and confuses keyboard and screen-reader users).
// `variant`: "secondary" (dark, default) or "primary" (light, for the one main
// call to action on screen).
const Button = ({ name, isBeam = false, variant = 'secondary', containerClass = '', href, onClick, type = 'button' }) => {
    const className = `btn btn--${variant} group ${containerClass}`;
    const content = (
        <>
            {isBeam && (
                <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                    <span className="btn-ping" />
                    <span className="btn-ping_dot" />
                </span>
            )}
            <span>{name}</span>
            <svg className="btn__arrow" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </>
    );

    return href ? (
        <a href={href} onClick={onClick} className={className}>
            {content}
        </a>
    ) : (
        <button type={type} onClick={onClick} className={className}>
            {content}
        </button>
    );
};

export default Button;
