import Survey from "src/models/Survey";

interface IGetUserSurvey {
  surveys: Survey[];
  count: number;
}

export default IGetUserSurvey;
