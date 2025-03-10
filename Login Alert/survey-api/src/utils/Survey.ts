interface DynamoObject {
  surveyID: string;
  community: string;
  communityType: string;
  uniqueCommunity: string;
  surveyTitle: string;
  surveyDesc: string;
  userID: string;
  expireDate: string;
  createdAt: string;
  questions: {
    questionId: string;
    questionTitle: string;
    questionType: string;
    answers: {
      answerId: string;
      answer: string;
      count: number;
    }[];
  }[];
  status: string;
}

export { DynamoObject };
