import { Router } from "express";
import { comboAndPromoController } from "./comboAndPromo.controller";
import employeeMiddleware from "../../middlewares/employeeMiddleware";

const comboAndPromoRouter = Router();

// COMBOS
comboAndPromoRouter.get(
  "/getcombobyslug/:slug",
  comboAndPromoController.findComboBySlug
);
comboAndPromoRouter.post(
  "/create-combo",
  employeeMiddleware,
  comboAndPromoController.createCombo
);
comboAndPromoRouter.put(
  "/update-combo/:id",
  employeeMiddleware,
  comboAndPromoController.updateCombo
);
comboAndPromoRouter.delete(
  "/delete-combo/:id",
  employeeMiddleware,
  comboAndPromoController.deleteCombo
);

//PROMOS
comboAndPromoRouter.get(
  "/getpromobyslug/:slug",
  employeeMiddleware,
  comboAndPromoController.findPromoBySlug
);
comboAndPromoRouter.post(
  "/create-promo",
  employeeMiddleware,
  comboAndPromoController.createPromo
);
comboAndPromoRouter.put(
  "/update-promo/:id",
  employeeMiddleware,
  comboAndPromoController.updatePromo
);
comboAndPromoRouter.delete(
  "/delete-promo/:id",
  employeeMiddleware,
  comboAndPromoController.deletePromo
);

export default {
  path: "/combo-promo",
  router: comboAndPromoRouter,
};
