/**
 * Module - Surevy Service
 * Date - 16/03/2023
 */

import { DocumentClient, GetItemOutput } from "aws-sdk/clients/dynamodb";
import MpService from "../MpService";
import Survey, { IQuestion, IAnswer } from "src/models/Survey";
import { NotFoundError } from "src/helpers/httpErrors/NotFoundError";
import { ERROR_MESSAGES } from "src/constants/ErrorMessages";
import COMMUNITY_TYPES from "src/constants/CommunityTypes";
import IGetMpSurveys from "src/interfaces/GetMpSurveys.interface";
import userProfileService from "../UserProfile";
import { v4 as uuid } from "uuid";
import IGetUserSurvey from "src/interfaces/GetUserSurvey.interface";
import responseService from "../Response";
import adminService from "../AdminService";
import { DynamoObject } from "src/utils/Survey";
import Notification from "src/models/Notification";
import NOTIFICATION_TYPES from "src/constants/NotificationTypes";
import notificationService from "../Notification";
interface IGetSurveys {
  surveys: Survey[];
  limit: number;
}

class SurveyService {
  constructor(
    private readonly docClient: DocumentClient,
    private readonly tableName: string
  ) {}

  //Map DynamoDB table column names
  mapAttributes = (item: GetItemOutput): Survey => {
    return {
      surveyID: item?.["surveyID"],
      surveyTitle: item?.["surveyTitle"],
      surveyDesc: item?.["surveyDesc"],
      community: item?.["community"],
      uniqueCommunity: item?.["uniqueCommunity"],
      userId: item?.["userID"],
      expireDate: item?.["expireDate"],
      createdAt: item?.["createdAt"],
      status: item?.["status"],
      questions: item?.["questions"],
    };
  };

  //create a new survey

  buildDynamoObject(
    survey: Survey,
    community: string,
    communityType: string
  ): DynamoObject {
    return {
      surveyID: survey.surveyID,
      community: community,
      communityType: communityType,
      uniqueCommunity: `${community}#${communityType}`,
      surveyTitle: survey.surveyTitle,
      surveyDesc: survey.surveyDesc,
      userID: survey.userId,
      expireDate: survey.expireDate,
      createdAt: survey.createdAt,
      questions: survey.questions.map((question) => ({
        questionId: uuid(),
        questionTitle: question.questionTitle,
        randomize: question.randomize ?? false,
        questionType: question.questionType,
        answers: question.answers.map((answer) => ({
          answerId: uuid(),
          answer: answer.answer,
          count: 0,
        })),
      })),
      status: survey.status,
    };
  }

  async createSurvey(survey: Survey): Promise<Survey> {
    const mp = await MpService.getMPInviteByEmail(survey.userId);
    //check if its a mp email
    if (!mp) {
      throw new NotFoundError(ERROR_MESSAGES.INVALID_MP);
    }

    // Check if the expiration date is in the past
    if (new Date(survey.expireDate) < new Date()) {
      throw new Error("Expiration date must be in the future");
    }

    let dynamoObject = this.buildDynamoObject(
      survey,
      mp.electorateName?.toLowerCase() || "",
      mp.electorateType
    );

    await this.docClient
      .put({
        TableName: this.tableName,
        Item: dynamoObject,
      })
      .promise();

    const users = await userProfileService.getUsersByElectorate(
      mp.electorateName,
      mp.electorateType
    );

    console.log(users);

    for (const user of users) {
      const notification: Notification = {
        userID: user.email,
        fromUserId: survey.userId,
        notificationType: NOTIFICATION_TYPES.SURVEY_PENDING,
        createdAt: new Date().toISOString(),
      };
      await notificationService.createNotification(notification);
    }
    return survey;
  }

  async createSurveyByAdmin(survey: Survey): Promise<Survey> {
    const admin = await adminService.getAdminByEmail(survey.userId);
    //check if its a admin email
    if (!admin) {
      throw new NotFoundError(ERROR_MESSAGES.INVALID_MP);
    }

    // Check if the expiration date is in the past
    if (new Date(survey.expireDate) < new Date()) {
      throw new Error("Expiration date must be in the future");
    }

    let dynamoObject = this.buildDynamoObject(
      survey,
      COMMUNITY_TYPES.ALL.toLowerCase(),
      COMMUNITY_TYPES.ALL
    );

    await this.docClient
      .put({
        TableName: this.tableName,
        Item: dynamoObject,
      })
      .promise();

    const users = await userProfileService.getAllCitizens();
    for (const user of users) {
      const notification: Notification = {
        userID: user.email,
        fromUserId: survey.userId,
        notificationType: NOTIFICATION_TYPES.ADMIN_SURVEY_PENDING,
        createdAt: new Date().toISOString(),
      };
      await notificationService.createNotification(notification);
    }
    return survey;
  }

  async getMPSurveyByElectorate(
    electorate: string,
    limit: number
  ): Promise<IGetMpSurveys> {
    console.log("Load from ", electorate);
    const surveys = await this.docClient
      .query({
        TableName: this.tableName,
        IndexName: "SortedCommunityIndex",
        KeyConditionExpression: "uniqueCommunity = :pk",
        ExpressionAttributeValues: {
          ":pk": `${electorate}`,
        },
        Limit: limit,
        ScanIndexForward: false,
      })
      .promise();
    console.log(surveys.Items, "123");
    return {
      surveys: surveys.Items.map((e) => {
        return this.mapAttributes(e);
      }),
      count: surveys.Count,
    };
  }

  //Returns latest Surveys belongs to all three electorates of MP
  async getMPSurveysByAllElectorates(
    localElectorate: string,
    stateElectorate: string,
    federalElectorate: string,
    limit
  ): Promise<IGetMpSurveys> {
    let localSurveys = await this.getMPSurveyByElectorate(
      `${localElectorate.toLowerCase()}#${COMMUNITY_TYPES.LOCAL}`,
      limit
    );
    console.log("local MP ", localSurveys);
    let stateSurveys = await this.getMPSurveyByElectorate(
      `${stateElectorate.toLowerCase()}#${COMMUNITY_TYPES.STATE}`,
      limit
    );
    console.log("state MP ", stateSurveys);

    let federalSurveys = await this.getMPSurveyByElectorate(
      `${federalElectorate.toLowerCase()}#${COMMUNITY_TYPES.FEDERAL}`,
      limit
    );
    console.log("federal MP ", federalSurveys);

    // Combine the three arrays into one
    let combinedArray = localSurveys.surveys.concat(
      stateSurveys.surveys,
      federalSurveys.surveys
    );

    console.log("combined MP ", combinedArray);

    // Sort the combined array by the "createdAt" attribute in descending order
    combinedArray.sort((a, b) => {
      return b.createdAt.localeCompare(a.createdAt);
    });

    return {
      surveys: combinedArray.slice(0, limit),
      count: combinedArray.slice(0, limit).length,
    };
  }

  //get user all electorate
  async getUserSurveyByAllElectorates(
    localElectorate: string,
    stateElectorate: string,
    federalElectorate: string,
    limit
  ): Promise<IGetUserSurvey> {
    let localSurveys = await this.getUserSurveyByElectorate(
      `${localElectorate.toLowerCase()}#${COMMUNITY_TYPES.LOCAL}`,
      limit
    );
    console.log("local ", localSurveys);
    let stateSurveys = await this.getUserSurveyByElectorate(
      `${stateElectorate.toLowerCase()}#${COMMUNITY_TYPES.STATE}`,
      limit
    );
    console.log("state  ", stateSurveys);

    let federalSurveys = await this.getUserSurveyByElectorate(
      `${federalElectorate.toLowerCase()}#${COMMUNITY_TYPES.FEDERAL}`,
      limit
    );
    console.log("federal ", federalSurveys);

    // Combine the three arrays into one
    let combinedArray = localSurveys.surveys.concat(
      stateSurveys.surveys,
      federalSurveys.surveys
    );

    // Sort the combined array by the "createdAt" attribute in descending order
    combinedArray.sort((a, b) => {
      return b.createdAt.localeCompare(a.createdAt);
    });

    return {
      surveys: combinedArray.slice(0, limit),
      count: combinedArray.slice(0, limit).length,
    };
  }

  //get surveys for mp
  async getMpSurvey({
    userId,
    limit,
  }: // community,
  {
    userId: string;
    limit: number;
    // community: string;
  }): Promise<IGetSurveys> {
    const surveys = await this.docClient
      .query({
        TableName: this.tableName,
        KeyConditionExpression: "userID = :userID",
        ExpressionAttributeValues: { ":userID": userId },
        Limit: limit,
      })
      .promise();

    let allSurveys = [];

    if (surveys?.Items) {
      allSurveys = [...surveys?.Items];
      return {
        surveys: allSurveys,
        limit: limit,
      };
    }
    return {
      surveys: [],
      limit: limit,
    };
  }

  //

  async getUserSurveyByElectorate(
    electorate: string,
    limit: number
  ): Promise<IGetMpSurveys> {
    const surveys = await this.docClient
      .query({
        TableName: this.tableName,
        IndexName: "SortedCommunityIndex",
        KeyConditionExpression: "uniqueCommunity = :pk",
        ExpressionAttributeValues: {
          ":pk": `${electorate}`,
        },
        Limit: limit,
        ScanIndexForward: false,
      })
      .promise();
    console.log(surveys.Items, "123");
    return {
      surveys: surveys.Items.map((e) => {
        return this.mapAttributes(e);
      }),
      count: surveys.Count,
    };
  }

  //publish survey

  async getUserSurvey(userId: string, limit: number): Promise<IGetSurveys> {
    const user = await userProfileService.getUserProfile(userId);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.INVALID_USER);
    }
    let userSurveys: any;
    userSurveys = await this.getUserSurveyByAllElectorates(
      user.electorate.localElectorate,
      user.electorate.stateElectorate,
      user.electorate.federalElectorate,
      limit
    );

    console.log(userSurveys, "__ALL__");
    let allSurveys = [];

    if (userSurveys?.surveys) {
      allSurveys = [...userSurveys.surveys];
      return {
        surveys: allSurveys,
        limit: limit,
      };
    }
    return {
      surveys: [],
      limit: limit,
    };
  }

  //async getCompletedSurveys

  //answercount update
  async answerCountUpdate(
    userID: string,
    surveyID: string,
    questionId: string,
    answerId: string
  ): Promise<string> {
    const params = {
      TableName: this.tableName,
      Key: {
        userID: userID,
        surveyID: surveyID,
      },
      UpdateExpression:
        "SET questions[questionIndex].answers[answerIndex].count = questions[questionIndex].answers[answerIndex].count + :increment",
      ExpressionAttributeNames: {
        "#question": "questionId",
        "#answer": "answerId",
      },
      ExpressionAttributeValues: {
        ":questionIndex": this.docClient.createSet([questionId]),
        ":answerIndex": this.docClient.createSet([answerId]),
        ":increment": 1,
      },
      ReturnValues: "UPDATED_NEW",
      ConditionalExpression:
        "contains(questions.#question, :question) and contains(questions[questionIndex].answers.#answer, :answer)",
    };
    try {
      const data = await this.docClient.update(params).promise();
      console.log(data);

      if (data) return "Successfully Answer Count updated";
    } catch (err) {
      console.error("Error updating count in DynamoDB: ", err);
      return "Error updating the count";
    }
  }

  //batch get data

  async getRespondedSurveys(surveyId: string): Promise<any> {
    const respondedSurvey = await this.docClient
      .query({
        TableName: this.tableName,
        IndexName: "RespondedSurveyIndex",
        KeyConditionExpression: "surveyID = :surveyId",
        ExpressionAttributeValues: {
          ":surveyId": `${surveyId}`,
        },
        ScanIndexForward: false,
      })
      .promise();

    return respondedSurvey.Items;
  }

  //get completed survey by user
  async getCompletedUserSurvey(
    userId: string,
    limit: number
  ): Promise<IGetSurveys> {
    const user = await userProfileService.getUserProfile(userId);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.INVALID_USER);
    }
    let userSurveys: any;
    userSurveys = await this.getUserSurveyByAllElectorates(
      user.electorate.localElectorate,
      user.electorate.stateElectorate,
      user.electorate.federalElectorate,
      limit
    );

    let allSurveys = [];

    let adminObject = await this.getUserSurveyByElectorate(
      `${COMMUNITY_TYPES.ALL.toLowerCase()}#${COMMUNITY_TYPES.ALL}`,
      limit
    );

    let adminSurvey = adminObject.surveys;

    if (userSurveys?.surveys) {
      allSurveys = [...userSurveys.surveys, ...adminSurvey];
      console.log(allSurveys);

      //user response
      const response: any[] = await responseService.getCompletedSurveyByUser(
        userId
      );

      // responded survey ids
      const surveyIds = new Set(response.map((r) => r.surveyId));
      console.log(surveyIds, "surveyIds");

      const surveyResponses = await Promise.all(
        Array.from(surveyIds).map(async (surveyId) => {
          return await this.getRespondedSurveys(surveyId);
        })
      );

      console.log(surveyResponses);

      let completedSurveyList = allSurveys.filter((survey) =>
        surveyIds.has(survey.surveyID)
      );

      console.log(completedSurveyList);

      const changes = await this.completedSurveyList(
        completedSurveyList,
        response
      );

      let latestSurveys = changes.surveys;
      latestSurveys.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      return {
        surveys: latestSurveys,
        limit: limit,
      };
    }

    return {
      surveys: [],
      limit: limit,
    };
  }

  async completedSurveyList(surveyArray: any[], responseArray: any[]) {
    const result = {
      surveys: [],
    };

    if (!Array.isArray(surveyArray)) {
      return result;
    }

    for (const survey of surveyArray) {
      const questions = [];
      for (const question of survey.questions) {
        const answers = [];
        for (const answer of question.answers) {
          const response = responseArray.find(
            (r) =>
              r.questionId === question.questionId &&
              r.surveyId === survey.surveyID &&
              r.answerId === answer.answerId
          );
          answers.push({
            answerId: answer.answerId,
            answer: answer.answer,
            status: Boolean(response),
          });
        }
        if (answers.length > 0) {
          questions.push({
            answers: answers,
            questionId: question.questionId,
            questionTitle: question.questionTitle,
            questionType: question.questionType,
          });
        }
      }
      if (questions.length > 0) {
        result.surveys.push({
          surveyID: survey.surveyID,
          surveyTitle: survey.surveyTitle,
          surveyDesc: survey.surveyDesc,
          community: survey.community,
          userId: survey.userID,
          expireDate: survey.expireDate,
          createdAt: survey.createdAt,
          status: survey.status,
          questions: questions,
        });
      }
    }

    return result;
  }

  async getMpPublishSurvey(userID: string): Promise<any> {
    const surveys = await this.docClient
      .query({
        TableName: this.tableName,
        IndexName: "PublishIndex",
        KeyConditionExpression: "userID = :pk",
        ExpressionAttributeValues: {
          ":pk": `${userID}`,
        },
        ScanIndexForward: false,
      })
      .promise();

    const updatedSurveys = await Promise.all(
      surveys.Items.map(async (survey: Survey) => {
        const updatedQuestions = await Promise.all(
          survey.questions.map(async (question: IQuestion) => {
            const { questionId, answers } = question;
            const updatedAnswers = await Promise.all(
              answers.map(async (answer: IAnswer) => {
                const count = await responseService.getResponseCount(
                  questionId,
                  answer.answerId
                );
                return { ...answer, count };
              })
            );
            const respondedCount =
              await responseService.getRespondedCountforQuestion(questionId);
            return {
              ...question,
              answers: updatedAnswers,
              respondedCount: respondedCount,
            };
          })
        );
        return { ...survey, questions: updatedQuestions };
      })
    );

    return updatedSurveys.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getPendingSurvey(userId: string, limit: number): Promise<IGetSurveys> {
    const user = await userProfileService.getUserProfile(userId);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.INVALID_USER);
    }
    let userSurveys: any;

    console.log(user);

    userSurveys = await this.getUserSurveyByAllElectorates(
      user.electorate.localElectorate,
      user.electorate.stateElectorate,
      user.electorate.federalElectorate,
      limit
    );

    let adminObject = await this.getUserSurveyByElectorate(
      `${COMMUNITY_TYPES.ALL.toLowerCase()}#${COMMUNITY_TYPES.ALL}`,
      limit
    );

    let adminSurvey = adminObject.surveys;

    let allSurveys = [];

    if (userSurveys?.surveys) {
      allSurveys = [...userSurveys.surveys];
      console.log(allSurveys);

      console.log(adminObject);

      allSurveys = [...allSurveys, ...adminSurvey];
      //check the user responded to the respone schem
      const response: any[] = await responseService.getCompletedSurveyByUser(
        userId
      );

      // get particular user responded survey id
      const surveyIds = new Set(response.map((r) => r.surveyId));

      let filteredSurveyList = allSurveys.filter(
        (survey) => !surveyIds.has(survey.surveyID)
      );

      filteredSurveyList.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      return {
        surveys: filteredSurveyList,
        limit: limit,
      };
    }

    return {
      surveys: [],
      limit: limit,
    };
  }
}

export default SurveyService;
