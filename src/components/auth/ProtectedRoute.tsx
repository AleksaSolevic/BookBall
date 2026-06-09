import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface Props {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  const { session, loading } = useAuth();

  if (loading) return null;

  if (!session) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
