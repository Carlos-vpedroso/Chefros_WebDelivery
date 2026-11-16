import { Router } from "express";
import { productController } from "./product.controller";
import employeeMiddleware from "../../middlewares/employeeMiddleware";
import { upload } from "../../middlewares/uploadImageMiddleware";

const productRouter = Router();

productRouter.get("/getall/:slug", productController.getAll);
productRouter.get(
  "/getbyid/:id",
  employeeMiddleware,
  productController.getById
);
productRouter.post(
  "/create",
  employeeMiddleware,
  upload.single("image"),
  productController.create
);
productRouter.put(
  "/update/:id",
  employeeMiddleware,
  upload.single("image"),
  productController.update
);
productRouter.delete(
  "/delete/:id",
  employeeMiddleware,
  productController.delete
);

export default {
  path: "/products",
  router: productRouter,
};
