import { Router } from "express";
import { roleController } from "./employeeRole.controller";
import employeeMiddleware from "../../middlewares/employeeMiddleware";

const roleRouter = Router();

roleRouter.get("/getall/:slug", employeeMiddleware, roleController.list);

roleRouter.get("/getbyid/:id", employeeMiddleware, roleController.getById);

roleRouter.post("/create", employeeMiddleware, roleController.create);

roleRouter.put("/update/:id", employeeMiddleware, roleController.update);

roleRouter.delete("/delete/:id", employeeMiddleware, roleController.delete);

export default {
  path: "/role",
  router: roleRouter,
};
