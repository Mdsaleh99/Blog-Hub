import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname} = useLocation()
    useEffect(() => {
        window.scrollTo(0, 0) // scroll to top of the page when the pathname changes 
    }, [pathname])
    return null
}

export default ScrollToTop;
