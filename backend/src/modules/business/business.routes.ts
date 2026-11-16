import { Router } from "express";
import { businessController } from "./business.controller";
import employeeMiddleware from "../../middlewares/employeeMiddleware";
import { upload } from "../../middlewares/uploadImageMiddleware";

const businessRouter = Router();

businessRouter.get("/getall", employeeMiddleware, businessController.getAll);
businessRouter.get(
  "/getid/:id",
  employeeMiddleware,
  businessController.getById
);
businessRouter.get("/getinfo/:slug", businessController.getBySlug);
businessRouter.put(
  "/update/:id",
  employeeMiddleware,
  businessController.update
);
businessRouter.delete(
  "/delete/:id",
  employeeMiddleware,
  businessController.delete
);
businessRouter.put(
  "/uploadimage/:id",
  employeeMiddleware,
  upload.single("image"),
  businessController.updateImage
);

export default {
  path: "/business",
  router: businessRouter,
};
