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
  uploadAvatar.upload.single("avatar"),
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

module.exports = authRouter;
