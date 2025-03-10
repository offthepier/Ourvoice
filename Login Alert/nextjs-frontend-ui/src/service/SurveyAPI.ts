import axios from "axios";
import UserSession from "../aws/cognito/UserSession";

//  baseURL: "https://vax5qqh64a.execute-api.ap-southeast-2.amazonaws.com/dev/",
const SurveyAPI = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_SURVEY_BASE_URL ||
    "https://69wnqa61cd.execute-api.ap-southeast-2.amazonaws.com/dev/",
  headers: {
    "Content-Type": "application/json",
  },
});

SurveyAPI.interceptors.request.use(
  (config: any) => {
    const token = UserSession.getUserSession()?.getIdToken().getJwtToken();
    if (token) {
      if (config.headers) config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

SurveyAPI.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    console.log(err.response);

    if (err.response) {
      // Access Token was expired
      //    && !originalConfig._retry
      if (err.response.status === 401) {
        originalConfig._retry = true;

        console.log(err);
        console.log("Token Expired");
        try {
          //Refresh User Session
          await UserSession.refreshSession();
          SurveyAPI.defaults.headers.common["Authorization"] =
            UserSession.getUserSession()?.getIdToken().getJwtToken();

          return SurveyAPI(originalConfig);
        } catch (_error: any) {
          if (_error.response && _error.response.data) {
            return Promise.reject(_error.response.data);
          }

          return Promise.reject(_error);
        }
      }

      if (err.response.status === 403 && err.response.data) {
        return Promise.reject(err.response.data);
      }
    }

    return Promise.reject(err);
  }
);

export default SurveyAPI;
