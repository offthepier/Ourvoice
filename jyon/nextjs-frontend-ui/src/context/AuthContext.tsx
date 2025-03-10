import { CognitoUserSession } from "amazon-cognito-identity-js";
import { createContext, ReactNode, useState, useContext } from "react";
import UserSession from "../aws/cognito/UserSession";
import IUser from "@/types/IUser";

export interface IAuthContext {
  userSession: CognitoUserSession | null;
  setUserSession: (user: CognitoUserSession) => void;
  logout: () => void;
  getUser: () => IUser | null;
}
interface IAuthContextProps {
  children: ReactNode;
}

export const AuthContext = createContext<IAuthContext>({
  getUser() {
    return {} as IUser;
  },
  logout() {},
  setUserSession() {},
  userSession: null,
});

export const AuthProvider = ({ children }: IAuthContextProps) => {
  const [userSession, setUserSessionState] =
    useState<CognitoUserSession | null>(() => {
      return UserSession.getUserSession();
    });

  const setUserSession = (user: CognitoUserSession) => {
    setUserSessionState(user);
  };

  const logout = () => {
    UserSession.logout();
    setUserSessionState(null);
    localStorage.removeItem("selectedCommunity");
    localStorage.removeItem("isChallengeOrProposalSelected");
  };

  const getUser = (): IUser | null => {
    return userSession ? UserSession.getUserFromSession(userSession) : null;
  };

  return (
    <AuthContext.Provider
      value={{ userSession, setUserSession, getUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
