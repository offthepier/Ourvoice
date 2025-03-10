import { NextComponentType } from "next";
import Login from "src/pages/auth/login";
import { useAuth } from "@/context/AuthContext";

function withAuth(Component: NextComponentType) {
  const Auth = () => {
    const { getUser } = useAuth();

    if (getUser()) {
      return <Component />;
    }
    return <Login />;
  };

  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
}

export default withAuth;
