const SUB_PATH = {
  USER: "user-api/users",
  SURVEY: "survey-api/survey",
  MP: "user-api/mp",
  CHALLENGES: "posts-api/challenges",
  POSTS: "posts-api/posts",
  FOLLOWERS: "posts-api/followers",
  FOLLOWING: "posts-api/following",
  NOTIFCATIONS: "posts-api/notifications",
};

const USER_ENDPOINTS = {
  GET_USER_DETAILS: `${SUB_PATH.USER}/profile`,
  GET_USER_PUBLIC_PROFILE: `${SUB_PATH.USER}/publicProfile`,
  GET_USER_PROFILE_PICTURE: `${SUB_PATH.USER}/profilePicture`,
  GET_USER_POSTS: `${SUB_PATH.POSTS}/user`,
  UNSUBSCRIBE_EMAILS: `${SUB_PATH.USER}/email/subscription`,
};

const SURVEY_ENDPOINTS = {
  GET_USER_SURVEYS: `${SUB_PATH.SURVEY}/pending`,
  GET_MP_SURVEYS: `${SUB_PATH.SURVEY}/publish`,
  GET_COMPLETED_SURVEYS: `${SUB_PATH.SURVEY}/completed`,
  CREATE_SURVEY: `${SUB_PATH.SURVEY}/mp`,
  CREATE_SURVEY_BY_ADMIN: `${SUB_PATH.SURVEY}/admin`,
  GET_SURVEY_RESPONSE: `${SUB_PATH.SURVEY}/response`,
};

const MP_ENDPOINTS = {
  CREATE_NEW_MP: `${SUB_PATH.MP}`,
  CREATE_BULK_MP: `${SUB_PATH.MP}/bulk`,
};

const CHALLENGES_ENDPOINTS = {
  GET_CHALLENGES: `${SUB_PATH.CHALLENGES}`,
  GET_TOP_CHALLENGES: `${SUB_PATH.CHALLENGES}/top`,
};

const COMMENTS_ENDPOINTS = {
  GET_COMMENTS: `${SUB_PATH.POSTS}/comments/all`,
  CREATE_NEW_COMMENTS: `${SUB_PATH.POSTS}/comment`,
  LIKE_COMMENT: `${SUB_PATH.POSTS}/vote/comment`,
};

const FOLLOWERS_ENDPOINTS = {
  GET_FOLLOWERS_COUNT: `${SUB_PATH.FOLLOWERS}/user/count`,
  GET_FOLLOWING_STATUS: `${SUB_PATH.FOLLOWING}/user/status`,
  FOLLOW_CHALLENGE: `${SUB_PATH.FOLLOWERS}/challenge`,
  UNFOLLOW_CHALLENGE: `${SUB_PATH.FOLLOWERS}/unfollow/challenge`,
  FOLLOW_POST: `${SUB_PATH.FOLLOWERS}/post`,
  UNFOLLOW_POST: `${SUB_PATH.FOLLOWERS}/unfollow/post`,
  FOLLOW_USER: `${SUB_PATH.FOLLOWERS}/user`,
  UNFOLLOW_USER: `${SUB_PATH.FOLLOWERS}/unfollow/user`,
};

const KYC_VERIFICATION = {
  USER_VERIFY: `user-api/verify`,
};

const NEWS_FEED = {
  GET_NEWS_FEED_POSTS: `${SUB_PATH.POSTS}/user/feed`,
  LIKE_POST: `${SUB_PATH.POSTS}/vote/post`,
  GET_TOP_PROPOSALS: `${SUB_PATH.POSTS}/proposals/top`,
  GET_USER_ACTIVITITES: `${SUB_PATH.POSTS}/user/activities`,
  GET_POSTS_BY_CHALLENGE: `${SUB_PATH.CHALLENGES}/posts/10`,
  GET_POSTS_BY_ID: `${SUB_PATH.POSTS}`,
};

const NOTIFICATION_ENDPOINT = {
  GET_NOTIFICATION: `${SUB_PATH.NOTIFCATIONS}/user/latest`,
  GET_NOTIFICATION_ALL: `${SUB_PATH.NOTIFCATIONS}/user/all`,
  NOTIFICATIONS_READ: `${SUB_PATH.NOTIFCATIONS}/user/markRead`,
};

const PETITION_ENDPOINT = {
  GET_PETITIONS: `posts-api/getUserProfile`,
  CREATE_NEW_PETITION: `posts-api/posts`,
  UPDATE_PETITION: `posts-api/posts`,
};

const SEARCH_ENDPOINT = {
  SEARCH: "posts-api/search",
};

export {
  USER_ENDPOINTS,
  SURVEY_ENDPOINTS,
  MP_ENDPOINTS,
  CHALLENGES_ENDPOINTS,
  COMMENTS_ENDPOINTS,
  FOLLOWERS_ENDPOINTS,
  KYC_VERIFICATION,
  NEWS_FEED,
  NOTIFICATION_ENDPOINT,
  PETITION_ENDPOINT,
  SEARCH_ENDPOINT,
};
