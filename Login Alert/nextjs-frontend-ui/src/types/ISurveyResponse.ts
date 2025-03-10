export interface ISurveyResponseItem {
  questionId: string;
  answers: { answerId: string }[];
}

interface ISurveyResponse {
  surveyID: string;
  questions: ISurveyResponseItem[];
}

export default ISurveyResponse;

// {    "surveyID": "295f4526-f724-4f34-84de-a83bd6ebd0c6",    "questions": [        {            "questionId": "9bc28cf2-0ae8-4b37-b627-e1b02bb69874",            "answers": [                {                    "answerId": "9bc28cf2-0ae8-4b37-b627-e1b02bb69874"                }            ]        }    ]}
