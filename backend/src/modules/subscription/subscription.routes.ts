import { Router } from "express";
import { subscriptionController } from "./subscription.controller";
import employeeMiddleware from "../../middlewares/employeeMiddleware";

const subscriptionRouter = Router();

subscriptionRouter.post(
  "/partial-checkout",
  subscriptionController.partialCheckout
);
subscriptionRouter.get(
  "/getbyslug/:slug",
  employeeMiddleware,
  subscriptionController.getByBusinessSlug
);
export default {
  path: "/subscription",
  router: subscriptionRouter,
};
