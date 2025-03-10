
interface GetPostsByUser {
  body: {
    limit: number;
    lastEvaluatedKey: any;
    userId: string;
  };
}

export default GetPostsByUser;
