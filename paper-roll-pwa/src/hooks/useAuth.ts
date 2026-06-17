import { useState } from "react";
import { useEffect } from "react";

export function useAuth() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');

        if (token) {
            setIsAuthenticated(true);
        }

        setIsLoading(false);
    }, []);
    
    return { isLoading, isAuthenticated }
}