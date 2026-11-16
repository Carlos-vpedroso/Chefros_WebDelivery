import { Router } from "express";
import { orderController } from "./order.controller";
import employeeMiddleware from "../../middlewares/employeeMiddleware";

const orderRouter = Router();

orderRouter.get("/getall/:slug", employeeMiddleware, orderController.getAll);
orderRouter.post("/create", orderController.create);
orderRouter.put(
  "/update/:id",
  employeeMiddleware,
  orderController.changeStatus
);

export default {
  path: "/orders",
  router: orderRouter,
};
