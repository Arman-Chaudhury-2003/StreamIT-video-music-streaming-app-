export const isAuthenticated = () => {
  // You can change this to check cookies or context later
  return !!localStorage.getItem("accessToken");
};

export const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};
