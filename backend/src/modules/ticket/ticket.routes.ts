import { Router } from "express";
import { ticketController } from "./ticket.controller";
import employeeMiddleware from "../../middlewares/employeeMiddleware";

const ticketRouter = Router();

ticketRouter.get("/getbyid/:id", ticketController.findById);
ticketRouter.get(
  "/getbyslug/:slug",
  employeeMiddleware,
  ticketController.findAllByBusiness
);
ticketRouter.post(
  "/checkout/:slug/:ticketId",
  employeeMiddleware,
  ticketController.checkout
);

export default {
  path: "/tickets",
  router: ticketRouter,
};
