import app from "./app";
import http from "http";
import dotenv from "dotenv";
import { initSocket } from "./src/socket";

dotenv.config();

const PORT = process.env.PORT || 3333;

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
