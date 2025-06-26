import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const RotaProtegida = ({ children }: ProtectedRouteProps) => {
  const token = Cookies.get("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RotaProtegida;
