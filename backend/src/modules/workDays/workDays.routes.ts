import { Router } from "express";
import employeeMiddleware from "../../middlewares/employeeMiddleware";
import { workDaysController } from "./workDays.controller";

const workDaysRouter = Router();

workDaysRouter.get("/getAll/:slug", workDaysController.getAll);

workDaysRouter.put(
  "/updateAll/:slug",
  employeeMiddleware,
  workDaysController.updateAll
);

export default {
  path: "/workDays",
  router: workDaysRouter,
};
