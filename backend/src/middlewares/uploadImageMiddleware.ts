import multer from "multer";

const storage = multer.memoryStorage(); // Armazena o arquivo em buffer na memória
export const upload = multer({ storage });
