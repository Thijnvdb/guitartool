import React from "react";
import { useEffect, useState } from 'react';

export default function Route({ path, children }) {
    const [currentPath, setCurrentPath] = useState(window.location.pathname);
    const paths = typeof path === 'string' ? [path] : path;

    useEffect(() => {
        // Define callback as separate function so it can be removed later with cleanup function
        const onLocationChange = () => {
            // Update path state to current window URL
            setCurrentPath(window.location.pathname);
        }

        // Listen for popstate event
        window.addEventListener('popstate', onLocationChange);

        // Clean up event listener
        return () => {
            window.removeEventListener('popstate', onLocationChange)
        };
    }, [])

    const match = (pa) => {
        let b = false;
        pa.forEach((p) => {
            let regExprStr = '^';
            regExprStr += p.replace('/*', '[/a-zA-Z0-9-]*').replace('/:id', '/[a-zA-Z0-9-]*');
            regExprStr += '$';

            const regExpr = new RegExp(regExprStr);
            if (regExpr.test(currentPath)) b = true;
        });
        return b;
    };

    return (
        match(paths) ? children : null
    );
}

export function Router(props) {
    return (props.children);
}

export function navigate(path) {
    const url = new URL(path, window.location.origin);

    window.history.pushState({}, "", url);

    const navEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navEvent);
}