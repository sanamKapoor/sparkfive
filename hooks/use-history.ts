import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const useHistory = () => {
    const router = useRouter();
    const [history, setHistory] = useState({
        currentPath: router.asPath,
        previousPath: null,
    });

    useEffect(() => {
        const handleRouteChange = (url: string) => {
            setHistory((prevHistory) => ({
                currentPath: url,
                previousPath: prevHistory.currentPath,
            }));
        };

        // Subscribe to the route change event
        router.events.on('routeChangeComplete', handleRouteChange);

        // Cleanup the event listener when the component unmounts
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router]);

    return history;
};

export default useHistory;