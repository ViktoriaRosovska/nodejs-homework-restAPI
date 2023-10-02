const { Router } = require("express");
const { validateBody, authenticate } = require("../../middlewares");
const schema = require("../../schemas/schema");
const controllers = require("../../controllers/auth");

const authRouter = Router();

// signup
authRouter.post("/register", validateBody(schema.userSchema), controllers.register);

// signin
authRouter.post("/login", validateBody(schema.userSchema), controllers.login);

// current
authRouter.get("/current", authenticate, controllers.getCurrent);

// logout
authRouter.post("/logout", authenticate, controllers.logout);

// update user subscription
authRouter.patch("/", authenticate, controllers.updateSubscription);

module.exports = authRouter;
