interface GetNotifications {
  body: {
    limit: number;
    lastEvaluatedKey: any;
  };
}

export default GetNotifications;
