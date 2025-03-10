interface IAnswer {
  answerId?: string;
  answer: string;
  count?: number;
  status?: boolean;
}
interface IQuestion {
  questionId?: string;
  questionTitle: string;
  questionType: string;
  answers: IAnswer[];
}
interface ISurvey {
  surveyID?: string;
  community?: string;
  surveyTitle?: string;
  surveyDesc?: string;
  userId?: string;
  expireDate?: string;
  createdAt?: string;
  questions?: IQuestion[];
  communityType?: string;
  status?: string;
}
export default ISurvey;

// "community": "STATE",
// "surveyTitle": "General Questions",
// "surveyDesc": "intial survey",
// "expireDate": "10/12/2023",
// "questions": [
//     {
//         "questionId": "1",
//         "questionTitle": "What is the type of food",
//         "questionType": "RADIO",
//         "answers": [
//             {
//                 "answerId": "1",
//                 "answer": "one",
//                    "count":  getResponseCount(QuestionID, answerID)
//             },
//             {
//                 "id": "2",
//                 "answer": "two"
//             }
//         ]
//     }
// ]
