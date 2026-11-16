import { Router } from "express";
import { employeeController } from "./employee.controller";
import employeeMiddleware from "../../middlewares/employeeMiddleware";

const employeeRouter = Router();

// Rotas no mesmo padrão das outras
employeeRouter.get("/getall", employeeMiddleware, employeeController.getAll);
employeeRouter.get(
  "/getbyid/:id",
  employeeMiddleware,
  employeeController.getById
);
employeeRouter.get(
  "/getbyslug/:slug",
  employeeMiddleware,
  employeeController.getBySlug
);
employeeRouter.post("/create", employeeController.create);
employeeRouter.put(
  "/update/:id",
  employeeMiddleware,
  employeeController.update
);
employeeRouter.delete(
  "/delete/:id",
  employeeMiddleware,
  employeeController.delete
);
employeeRouter.post("/login", employeeController.loginEmployee);

export default {
  path: "/employees",
  router: employeeRouter,
};
