import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const RoleRoute = ({ children, roles = [] }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!userInfo) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(userInfo.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleRoute;
