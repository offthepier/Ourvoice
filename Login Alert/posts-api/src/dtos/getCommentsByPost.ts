
interface GetCommentsByPost {
  body: {
    postID: string;
    limit: number;
    lastEvaluatedKey: any;
  };
}

export default GetCommentsByPost;
