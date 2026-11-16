import { Router } from "express";
import bodyParser from "body-parser";
import { stripeController } from "./controller";

const stripeRouter = Router();

stripeRouter.post("/create-session", stripeController.createSession);
// stripeRouter.post("/create-subscription", stripeController.createSubscription);


export default stripeRouter;
