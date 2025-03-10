const NEW_USER_FLAG_KEY = "NEW_USER";

const setIsNewUser = () => {
  window.localStorage.setItem(NEW_USER_FLAG_KEY, "TRUE");
};

const clearIsNewUser = () => {
  window.localStorage.removeItem(NEW_USER_FLAG_KEY);
};

const isNewUser = () => {
  const isNewUser = window.localStorage.getItem(NEW_USER_FLAG_KEY);
  if (isNewUser) return true;
  else return false;
};

export { setIsNewUser, clearIsNewUser, isNewUser };
