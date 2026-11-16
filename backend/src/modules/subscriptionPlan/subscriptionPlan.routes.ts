import { Router } from "express";
import adminAuthMiddleware from "../../middlewares/adminAuthMiddleware";
import { subscriptionPlanController } from "./subscriptionPlan.controller";

const subscriptionPlanRouter = Router();

subscriptionPlanRouter.get(
  "/getAll",
  adminAuthMiddleware,
  subscriptionPlanController.getAllSubscriptionPlans
);
subscriptionPlanRouter.post(
  "/create",
  adminAuthMiddleware,
  subscriptionPlanController.createSubscriptionPlan
);
subscriptionPlanRouter.put(
  "/update/:id",
  adminAuthMiddleware,
  subscriptionPlanController.updateSubscriptionPlan
);
subscriptionPlanRouter.delete(
  "/deactivate/:id",
  adminAuthMiddleware,
  subscriptionPlanController.deactivateSubscriptionPlan
);

export default {
  path: "/subscriptionPlan",
  router: subscriptionPlanRouter,
};
