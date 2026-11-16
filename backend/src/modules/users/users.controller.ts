import { Request, Response } from "express";
import { userService } from "./users.service";

export const nomeDaFuncao = async (req: Request, res: Response) => {
  try {
    const usuarios = await userService.findAll();
    console.log(usuarios);
    res.status(200).json({ message: "Todos os Usuarios", usuarios: usuarios });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error });
  }
};
