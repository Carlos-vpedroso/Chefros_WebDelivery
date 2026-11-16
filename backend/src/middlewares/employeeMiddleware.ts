import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";
import jwt from "jsonwebtoken";
import { JwtDecoded } from "../types/jwtEmployeeDecoded";

const employeeMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const slug = req.headers["slug"] as string;
  const businessId = req.headers["businessid"] as string;

  // Verifica se o header existe e começa com "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  if (!slug && !businessId) {
    return res.status(401).json({ error: "Slug ou BusinessId não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.EMPLOYEE_TOKEN as string);

    const business = await prisma.business.findUnique({
      where: { slug: slug || undefined, id: businessId || undefined },
      select: { id: true },
    });

    if (!business) {
      return res.status(404).json({ error: "Negócio não encontrado" });
    }

    if ((decoded as JwtDecoded).businessId !== business?.id) {
      return res.status(403).json({ error: "Acesso negado para este negócio" });
    }

    // Disponibiliza os dados do usuário
    (req as any).user = decoded;

    next(); // segue para a rota
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
};

export default employeeMiddleware;
