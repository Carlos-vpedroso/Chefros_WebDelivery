import { Router } from "express";
import { serviceController } from "./service.controller";
import employeeMiddleware from "../../middlewares/employeeMiddleware";
import { upload } from "../../middlewares/uploadImageMiddleware";

const serviceRouter = Router();
serviceRouter.get("/getall/:slug", serviceController.getAll);
serviceRouter.get(
  "/getbyid/:id",
  employeeMiddleware,
  serviceController.getById
);
serviceRouter.post(
  "/create",
  employeeMiddleware,
  upload.single("image"),
  serviceController.create
);
serviceRouter.put(
  "/update/:id",
  employeeMiddleware,
  upload.single("image"),
  serviceController.update
);
serviceRouter.delete(
  "/delete/:id",
  employeeMiddleware,
  serviceController.delete
);

export default {
  path: "/services",
  router: serviceRouter,
};
