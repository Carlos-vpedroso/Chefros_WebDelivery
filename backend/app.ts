import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./src/routes/index";
import stripeRouter from "./src/stripe/routes";
import webhookRouter from "./src/stripe/webhook";

// Cria o app express
const app: Application = express();

app.use(webhookRouter);
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api", routes);
app.use("/api/stripe", stripeRouter);

// Checagem de data no formato brasileiro
// morgan.token("date-br", () => {
//   return new Date().toLocaleString("pt-BR");
// });

// app.use(morgan(":method :url :status :response-time ms - - :date-br"));

// Health check (rota simples pra testar servidor)
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "🚀 Pedroso Delivery API Online" });
});

export default app;
