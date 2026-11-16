import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { JwtDecoded } from "../types/jwtEmployeeDecoded";

export function socketAuth(socket: Socket, next: Function) {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Token não informado"));
    }

    const decoded = jwt.verify(
      token,
      process.env.EMPLOYEE_TOKEN!
    ) as JwtDecoded;

    // Salva no socket
    socket.data.user = decoded;

    next();
  } catch (err) {
    next(new Error("Token inválido"));
  }
}
