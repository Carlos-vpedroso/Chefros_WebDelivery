import { Router } from "express";
import employeeMiddleware from "../../middlewares/employeeMiddleware";
import { dashboardVendasController } from "./dashboard.controller";

const dashboardRouter = Router();

dashboardRouter.get(
  "/vendas/analytics/:slug",
  employeeMiddleware,
  dashboardVendasController.analytics
);

dashboardRouter.get(
  "/produtos/vendidos/:slug",
  employeeMiddleware,
  dashboardVendasController.produtosVendidos
);

dashboardRouter.get(
  "/maisvendidos/:slug",
  employeeMiddleware,
  dashboardVendasController.produtosMaisVendidos
);

dashboardRouter.get(
  "/menosvendidos/:slug",
  employeeMiddleware,
  dashboardVendasController.produtosMenosVendidos
);

dashboardRouter.get(
  "/faturamentocategoria/:slug",
  employeeMiddleware,
  dashboardVendasController.faturamentoPorCategoria
);


export default {
  path: "/dashboard",
  router: dashboardRouter,
};
