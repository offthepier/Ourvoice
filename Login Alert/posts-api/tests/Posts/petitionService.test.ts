import petitionService from "../../src/service/PetitionService";
import { SCORE_TYPES } from "../../src/constants/scoreTypes";
import {
  TestGeneralPostSample,
  TestProposalPostSample,
} from "../utils/SamplePost";

jest.mock("aws-sdk", () => {
  return {
    DynamoDB: {
      // just an object, not a function
      DocumentClient: jest.fn(() => ({
        query: jest.fn().mockImplementation(() => {
          return {
            promise() {
              return Promise.resolve({
                Items: [
                  {
                    challengeID: "1234",
                    challenge: "Test Challenge",
                    community: "LOCAL",
                    postData: {
                      title: "Test Post",
                      description: "Test Description for tets post",
                      images: [],
                    },
                    postType: "PROPOSAL",
                    tags: ["Test"],
                    createdAt: new Date().toISOString(),
                    userId: "testuser@gmail.com",
                    userFirstName: "Test",
                    userLastName: "User",
                    userRole: "CITIZEN",
                    postId: "98fa966c-3bf4-4fc4-9ecd-39c5c0994f2p",
                  },
                ],
              });
            },
          };
        }),
        scan: jest.fn().mockImplementation(() => {
          return {
            promise() {
              return Promise.resolve({
                Items: [],
              });
            },
          };
        }),
      })),
    },
    SES: jest.fn(() => ({
      sendEmail: jest.fn().mockImplementation(() => {
        console.log("Mock Insert Done");
        return {
          promise() {
            return Promise.resolve({});
          },
        };
      }),
    })),
  };
});

describe("RepetitionScoreService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getMPPostsByElectorate test", async () => {
    const result = await petitionService.getMPPostsByElectorate(
      "LOCAL",
      10,
      null
    );

    expect(result).toHaveProperty("posts");
  });

  test("getPostsByElectorate test", async () => {
    const result = await petitionService.getPostsByElectorate(
      "LOCAL",
      10,
      null
    );

    expect(result).toHaveProperty("posts");
  });

  test("getPostsByElectorate test", async () => {
    const result = await petitionService.getPosts(10, null);

    expect(result).toHaveProperty("posts");
  });
  
  test("getPostsByElectorate test", async () => {
    const result = await petitionService.getMPPosts(10, null);

    expect(result).toHaveProperty("posts");
  });
});
