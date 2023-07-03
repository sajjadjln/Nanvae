import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";

const PrivateRoute = ({ children }) => {
  const { user } = useAppSelector((state) => state.account);
  const location = useLocation();

  return user ? (
    children
  ) : (
    <Navigate
      replace
      to={{ pathname: "/login" }}
      state={{ from: location.pathname }}
    />
  );
};

export default PrivateRoute;