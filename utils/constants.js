const emailRegexp = /^\w+([.-_]?\w+)*@\w+([.-_]?\w+)*(\.\w{2,3})+$/;
const passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,128})/;

const userSubscription = ["pro", "business", "starter"];

module.exports = {
  emailRegexp,
  passwordRegexp,
  userSubscription,
};
