import { Server, Socket } from "socket.io";
import http from "http";
import { socketAuth } from "./socketAuth";

let io: Server;

export function initSocket(server: http.Server) {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.use(socketAuth);

  io.on("connection", (socket: Socket) => {
    console.log("🟢 Autenticado:", socket.data.user.id);

    socket.on("join_room", (empresaSlug: string) => {
      const user = socket.data.user;

      if (user.businessSlug !== empresaSlug) {
        console.log("⛔ Tentativa de acesso indevido");
        return socket.disconnect();
      }

      socket.join(`business:${empresaSlug}`);
      console.log(`📥 ${socket.id} entrou na business:${empresaSlug}`);
    });
  });
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.IO não inicializado");
  }
  return io;
}
