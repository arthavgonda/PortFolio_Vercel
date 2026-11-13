import { useCallback, useState } from 'react';

const useAlert = () => {
    const [alert, setAlert] = useState({ show: false, text: '', type: 'danger' });

    const showAlert = useCallback(({ text, type = 'danger' }) => setAlert({ show: true, text, type }), []);
    // Keep text/type while hiding so the toast can animate out with its content.
    const hideAlert = useCallback(() => setAlert((prev) => ({ ...prev, show: false })), []);

    return { alert, showAlert, hideAlert };
};

export default useAlert;
