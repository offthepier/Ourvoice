import { NextComponentType } from "next";
import Login from "src/pages/auth/login";
import { useAuth } from "@/context/AuthContext";

function withAuthRedirect(Component: NextComponentType, path: string) {
  const Auth = () => {
    const { getUser } = useAuth();

    if (getUser()) {
      return <Component />;
    }
    return <Login redirectPath={path} />;
  };

  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
}

export default withAuthRedirect;
