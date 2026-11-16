import { Router } from "express";

//#region Import das Funções
import { nomeDaFuncao } from "./users.controller";
//#endregion

const userRouter = Router();

userRouter.get("/todos", nomeDaFuncao);

export default {
  path: "/users",
  router: userRouter,
};
