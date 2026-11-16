import { Router } from "express";
import { activityLogController } from "./activityLog.controller";
import employeeMiddleware from "../../middlewares/employeeMiddleware";

const activityLogRouter = Router();

activityLogRouter.get(
  "/get-records/:slug",
  employeeMiddleware,
  activityLogController.getRecords
);

export default {
  path: "/activity",
  router: activityLogRouter,
};
