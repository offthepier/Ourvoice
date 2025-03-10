import { GetItemOutput } from "@aws-sdk/client-dynamodb";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import petitionService from "src/service/PetitionService";
import Vote from "src/models/Vote";
import notificationService from "../NotificationService";
import commentsService from "../CommentsService";
import { POST_TYPES } from "src/constants/PostTypes copy";
import VOTES_TYPES from "src/constants/VotesType";
import getUpdatedScoreService from "src/service/repetitionScore";
import { SCORE_TYPES } from "src/constants/scoreTypes";
import Post from "src/models/Post";
interface IPostVoteStatus {
  votedPost: boolean;
  voteType: string;
  votedComments: string[];
}
class VotingService {
  constructor(
    private readonly docClient: DocumentClient,
    private readonly tableName: string
  ) {}

  //Map DynamoDB table column names
  mapAttributes = (item: GetItemOutput): Vote => {
    return {
      commentID: item?.["commentID"],
      postID: item?.["postID"],
      userID: item?.["userID"],
      voteType: item?.["voteType"],
    };
  };

  async getVoteByPost(userID: string, postID: string): Promise<Vote[]> {
    console.log(userID, postID);
    const votes = await this.docClient
      .query({
        TableName: this.tableName,
        KeyConditionExpression: "userID = :pk AND sk = :sk",
        ExpressionAttributeValues: {
          ":pk": userID,
          ":sk": `POST#${postID}`,
        },
      })
      .promise();
    console.log(votes);
    return votes.Items.map((e) => {
      return this.mapAttributes(e);
    });
  }

  /*
    This function will return all the voting activities a user has 
    done to post including comments.
  */
  async getVoteStatusByPost(
    userID: string,
    postID: string
  ): Promise<IPostVoteStatus> {
    //get vote status of the post
    const postVote = await this.getVoteByPost(userID, postID);

    //get voted comments of the post
    const likedComments = await this.getCommentsVoteStatus(userID, postID);

    let likedCommentsIds = likedComments
      .filter((object) => object.commentID)
      .map((object) => {
        if (object.commentID) {
          return object.commentID;
        }
      });

    //generate response
    const response: IPostVoteStatus = {
      votedPost: postVote.length > 0 ? true : false,
      voteType: postVote?.[0]?.voteType ?? null,
      votedComments: likedCommentsIds,
    };

    return response;
  }

  async updateUserScoreAfterAddVote(vote: Vote, post: Post) {
    if (post.postType === POST_TYPES.PROPOSAL) {
      //proposal voter get points
      if (vote.userID !== vote.postCreatorId) {
        try {
          await getUpdatedScoreService.getUpdatedScore({
            userEmail: vote.userID,
            type: {
              scoreType: SCORE_TYPES.proposalVoter,
            },
          });
        } catch (error) {
          console.log(error);
        }
      }
    }

    // check if the voter and proposal creater same user
    if (vote.userID != vote.postCreatorId) {
      try {
        await getUpdatedScoreService.getUpdatedScore({
          userEmail: vote.postCreatorId,
          type: {
            scoreType: SCORE_TYPES.liked,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }

    try {
      await getUpdatedScoreService.getUpdatedScore({
        userEmail: vote.userID,
        type: {
          scoreType: SCORE_TYPES.ownPostLike,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async updateUserScoreAfterUnvote(vote: Vote, post: Post) {
    if (post.postType === POST_TYPES.PROPOSAL) {
      if (vote.userID !== vote.postCreatorId) {
        try {
          await getUpdatedScoreService.getUpdatedScore({
            userEmail: vote.userID,
            type: {
              scoreType: SCORE_TYPES.unliked,
            },
          });
        } catch (error) {
          console.log(error);
        }
      }
    }

    // score descresed if user unlike
    if (vote.userID !== vote.postCreatorId) {
      try {
        await getUpdatedScoreService.getUpdatedScore({
          userEmail: vote.postCreatorId,
          type: {
            scoreType: SCORE_TYPES.unliked,
          },
        });
      } catch (error) {
        console.log(error);
      }
      try {
        await getUpdatedScoreService.getUpdatedScore({
          userEmail: vote.userID,
          type: {
            scoreType: SCORE_TYPES.ownPostLike,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  async votePost(vote: Vote): Promise<string> {
    const post = await petitionService.getPostById(vote.postID);

    //Change vote type to Like if post is general
    if (post.postType == POST_TYPES.GENERAL) {
      vote.voteType = VOTES_TYPES.LIKE;
    }

    if (vote.status) {
      // const current
      let dynamoObject = {
        Item: {
          userID: vote.userID,
          sk: `POST#${vote.postID}`,
          postID: vote.postID,
          voteType: vote.voteType,
        },
        TableName: this.tableName,
        ExpressionAttributeValues: {
          ":voteType": vote.voteType,
        },
        ConditionExpression: "voteType <> :voteType",
        ReturnValues: "ALL_OLD",
      };

      try {
        const voteBeforeUpdate = await this.docClient
          .put(dynamoObject)
          .promise();

        //check if we change the vote or added a new one
        if (
          voteBeforeUpdate.Attributes &&
          post.postType != POST_TYPES.GENERAL
        ) {
          console.log("Change Vote");
          await petitionService.changeVote(vote);
        } else {
          console.log("NEW Vote");
          await notificationService.generateUserVoteNotification(vote);
          await petitionService.votePost(vote);
          // Update User Scores
          await this.updateUserScoreAfterAddVote(vote, post);
        }
      } catch (e) {
        console.log("____Voting Service____");
        console.log(e);
        return e.message;
      }
    } else {
      try {
        const deletedItem = await this.docClient
          .delete({
            TableName: this.tableName,
            Key: {
              userID: vote.userID,
              sk: `POST#${vote.postID}`, // userId is my PK in this case
            },
            ReturnValues: "ALL_OLD",
            ConditionExpression: "voteType = :voteType",
            ExpressionAttributeValues: {
              ":voteType": vote.voteType,
            },
          })
          .promise();
        if (deletedItem.Attributes) {
          console.log("Unvote post");
          await petitionService.votePost(vote);

          //Update user  scores
          await this.updateUserScoreAfterUnvote(vote, post);
        } else return "Can't Unlike";
      } catch (e) {
        console.log("____Voting Service____");
        console.log(e);
        return e.message;
      }
    }

    return vote.status
      ? "Successfully Liked Post"
      : "Successfully Unliked Post";
  }

  async likeComment(vote: Vote): Promise<string> {
    if (!vote.status) {
      try {
        const deletedItem = await this.docClient
          .delete({
            TableName: this.tableName,
            Key: {
              userID: vote.userID,
              sk: `COMMENT#${vote.commentID}`,
            },
            ReturnValues: "ALL_OLD",
          })
          .promise();
        if (!deletedItem.Attributes) {
          return "Can't Unlike";
        }
        await commentsService.unlikeComment(vote.postID, vote.commentID);
        const comment = await commentsService.getPostById(
          vote.postID,
          vote.commentID
        );
        if (comment.userID !== vote.userID) {
          await getUpdatedScoreService.getUpdatedScore({
            userEmail: comment.userID,
            type: { scoreType: SCORE_TYPES.unliked },
          });
        }
        await getUpdatedScoreService.getUpdatedScore({
          userEmail: comment.userID,
          type: { scoreType: SCORE_TYPES.ownCommentLike },
        });
        return "Successfully Unliked Post";
      } catch (e) {
        console.log("____Voting Service____");
        console.log(e);
        return e.message;
      }
    }

    let dynamoObject = {
      Item: {
        userID: vote.userID,
        sk: `COMMENT#${vote.commentID}`,
        postID: vote.postID,
        commentID: vote.commentID,
        voteType: vote.voteType,
      },
      TableName: this.tableName,
      ReturnValues: "ALL_OLD",
    };

    try {
      const voteBeforeUpdate = await this.docClient.put(dynamoObject).promise();

      console.log(voteBeforeUpdate);

      if (voteBeforeUpdate.Attributes) {
        throw new Error("Comment Already Liked!");
      }

      await commentsService.likeComment(vote.postID, vote.commentID);

      const comment = await commentsService.getPostById(
        vote.postID,
        vote.commentID
      );
      if (comment.userID !== vote.userID) {
        await getUpdatedScoreService.getUpdatedScore({
          userEmail: comment.userID,
          type: { scoreType: SCORE_TYPES.commentLike },
        });
      }
      await getUpdatedScoreService.getUpdatedScore({
        userEmail: comment.userID,
        type: { scoreType: SCORE_TYPES.ownCommentLike },
      });
      await notificationService.generateCommentLikeNotification(vote);
      return "Successfully Liked Post";
    } catch (e) {
      console.log("____Voting Service____");
      console.log(e);
      return e.message;
    }
  }

  async getCommentsVoteStatus(userID: string, postID: string): Promise<Vote[]> {
    const votes = await this.docClient
      .query({
        TableName: this.tableName,
        KeyConditionExpression: "userID = :pk AND postID = :sk",
        IndexName: "PostsIndex",
        ExpressionAttributeValues: {
          ":pk": userID,
          ":sk": postID,
        },
      })
      .promise();

    return votes.Items.map((e) => {
      return this.mapAttributes(e);
    });
  }
}

export default VotingService;
