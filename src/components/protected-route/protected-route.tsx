import { Preloader } from "@ui";
import { ReactElement } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { getIsAuthenticated, getIsUserLoading, getUser } from "../../services/slices/userSlice";
import { useSelector } from "../../services/store";

type ProtectedRouteProps = {
  onlyAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({ onlyAuth = false, children }:ProtectedRouteProps): ReactElement => {
  const isAuthenticated = useSelector(getIsAuthenticated);
  const isUserLoading = useSelector(getIsUserLoading);
  const location = useLocation();
  const from = location.state?.from || {pathname: '/'};

  if (!isAuthenticated && isUserLoading) {
    return <Preloader />;
  }

  if (onlyAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} />
  }

  if (!onlyAuth && isAuthenticated) {
    return <Navigate replace to={from} state={location} />
  }

  return children;
}
