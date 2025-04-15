import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { currentUser } = useSelector((state) => state.recipes);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
