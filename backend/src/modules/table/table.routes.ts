import { Router } from "express";
import employeeMiddleware from "../../middlewares/employeeMiddleware";
import { tableController } from "./table.controller";

const tableRouter = Router();

tableRouter.get("/getall/:slug", employeeMiddleware, tableController.getAll);
tableRouter.get("/getbyid/:id", employeeMiddleware, tableController.getById);
tableRouter.post("/create", employeeMiddleware, tableController.create);
tableRouter.put("/update/:id", employeeMiddleware, tableController.update);
tableRouter.delete("/delete/:id", employeeMiddleware, tableController.delete);

export default {
  path: "/tables",
  router: tableRouter,
};
