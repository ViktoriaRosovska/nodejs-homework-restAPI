const { Router } = require("express");
const { validateBody, authenticate } = require("../../middlewares");
const schema = require("../../schemas/schema");
const controllers = require("../../controllers/auth");
const { uploadAvatar } = require("../../middlewares");
const multer = require("multer");
const authRouter = Router();

// signup
authRouter.post(
  "/register",
  uploadAvatar.upload.single("avatars"),
  validateBody(schema.registerSchema),
  controllers.register
);

// signin
authRouter.post("/login", multer().none(), validateBody(schema.loginSchema), controllers.login);

// current
authRouter.get("/current", authenticate, controllers.getCurrent);

// logout
authRouter.post("/logout", authenticate, controllers.logout);

// update user subscription
authRouter.patch("/", authenticate, controllers.updateSubscription);

// update avatar image
authRouter.patch("/avatars", authenticate, uploadAvatar.upload.single("avatars"), controllers.updateAvatar);

// get user's verification token
authRouter.get("/verify/:verificationToken", controllers.verifyEmail);

authRouter.post("/verify", validateBody(schema.emailSchema), controllers.resendVerifyEmail);

module.exports = authRouter;
