import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isLoading, isAuthenticated } = useAuth();

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to='/login' replace />;
    }

    return <>{children}</>
}