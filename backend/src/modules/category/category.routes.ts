// src/modules/category/category.routes.ts
import { Router } from "express";
import { categoryController } from "./category.controller";
import employeeMiddleware from "../../middlewares/employeeMiddleware";

const categoryRouter = Router();

// 🔒 Rotas protegidas
categoryRouter.get("/getall/:slug", categoryController.getAll);
categoryRouter.get(
  "/getbyid/:id",
  employeeMiddleware,
  categoryController.getById
);
categoryRouter.post("/create", employeeMiddleware, categoryController.create);
categoryRouter.put(
  "/update/:id",
  employeeMiddleware,
  categoryController.update
);
categoryRouter.delete(
  "/delete/:id",
  employeeMiddleware,
  categoryController.delete
);
categoryRouter.get(
  "/with-counts",
  employeeMiddleware,
  categoryController.getWithCounts
);

export default {
  path: "/categories",
  router: categoryRouter,
};
