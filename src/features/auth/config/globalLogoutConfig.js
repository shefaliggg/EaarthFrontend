let logoutFunction = null;

export const setLogoutFunction = (fn) => {
  logoutFunction = fn;
};

export const triggerGlobalLogout = () => {
  if (logoutFunction) logoutFunction();
};
