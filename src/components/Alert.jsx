// Always mounted so it can animate out as well as in (see .toast in index.css).
const Alert = ({ show, type, text }) => {
    const danger = type === 'danger';

    return (
        <div className="toast fixed bottom-5 right-5 left-5 sm:left-auto z-50" data-show={show} role="status" aria-live="polite">
            <div className="toast__body">
                <span className={`toast__dot ${danger ? 'bg-red-500' : 'bg-green-500'}`} aria-hidden="true" />
                <p className="font-medium text-white">{danger ? 'Not sent' : 'Sent'}</p>
                <p className="text-white-600">{text}</p>
            </div>
        </div>
    );
};

export default Alert;
