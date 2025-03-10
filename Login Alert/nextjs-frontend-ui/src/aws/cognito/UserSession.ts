import { CognitoUserSession } from "amazon-cognito-identity-js";
import IUser from "../../types/IUser";
import UserPool from "./UserPool";

class UserSession {
  //get Cognito User Session
  getUserSession(): CognitoUserSession | null {
    let session = null;
    UserPool.getCurrentUser()?.getSession(
      (err: Error | null, sessionObj: CognitoUserSession | null) => {
        console.log(sessionObj);
        if (sessionObj?.isValid()) session = sessionObj;
      }
    );
    return session;
  }

  //get cognito User
  getUserFromSession(session: CognitoUserSession): IUser | null {
    return {
      email: session?.getIdToken()?.payload?.email,
      firstName: session?.getIdToken()?.payload?.["custom:First_Name"],
      lastName: session?.getIdToken()?.payload?.["custom:Last_Name"],
      country: session?.getIdToken()?.payload?.["custom:Country"],
      role: session?.getIdToken()?.payload?.["cognito:groups"]?.[0],
      imageUrl: session?.getIdToken()?.payload?.["custom:profilePic"],
      verificationStatus:
        session?.getIdToken()?.payload?.["custom:verificationStatus"],
    } as IUser;
  }

  //get cognito User
  getUser(): IUser | null {
    UserPool.getCurrentUser()?.getSession(
      (err: Error | null, session: CognitoUserSession | null) => {
        if (session) {
          return this.getUserFromSession(session);
        } else return null;
      }
    );
    return null;
  }

  async refreshSession() {
    const refreshToken = this.getUserSession()?.getRefreshToken();
    if (refreshToken)
      UserPool.getCurrentUser()?.refreshSession(refreshToken, (err: any) => {
        console.log("Cant Refresh Token", err);
      });
  }

  //logout User
  logout() {
    UserPool.getCurrentUser()?.signOut();
  }
}
export default new UserSession();
