import { NextComponentType } from "next";
import Login from "src/pages/auth/login";
import { useAuth } from "@/context/AuthContext";
import { USER_ROLES } from "@/constants/UserRoles";

function withAuthMP(Component: NextComponentType) {
  const Auth = () => {
    const { getUser } = useAuth();

    if (getUser()?.role == USER_ROLES.MP || getUser()?.role == USER_ROLES.ADMIN) {
      return <Component />;
    }
    return <Login />;
  };

  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
}

export default withAuthMP;
