import { Router } from "express";
import adminAuthMiddleware from "../../middlewares/adminAuthMiddleware";
import { businessModuleController } from "./businessModule.controller";

const businessModuleRouter = Router();

businessModuleRouter.get(
  "/getmodules/:slug",
  adminAuthMiddleware,
  businessModuleController.getBySlug
);
businessModuleRouter.post(
  "/create",
  adminAuthMiddleware,
  businessModuleController.create
);
businessModuleRouter.delete(
  "/delete/:id",
  adminAuthMiddleware,
  businessModuleController.delete
);

export default {
  path: "/businessModule",
  router: businessModuleRouter,
};
