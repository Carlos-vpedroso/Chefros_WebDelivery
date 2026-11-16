// src/modules/employee/employee.controller.ts
import { Request, Response } from "express";
import { employeeService } from "./employee.service";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../../config/prisma";
import { activityLogService } from "../activityLog/activityLog.service";

export const employeeController = {
  async getAll(req: Request, res: Response) {
    try {
      const employees = await employeeService.findAll();
      return res.status(200).json(employees);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar funcionários" });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const employee = await employeeService.findById(id);
      if (!employee)
        return res.status(404).json({ error: "Funcionário não encontrado" });
      return res.status(200).json(employee);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar funcionário" });
    }
  },

  async getBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      if (!slug)
        return res
          .status(404)
          .json({ error: "Faltando um parametro obrigatório" });
      const employees = await employeeService.findBySlug(slug);
      return res.status(200).json(employees);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar funcionarios" });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const data = req.body;
      const newEmployee = await employeeService.create(data);
      return res.status(201).json(newEmployee);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao criar funcionário" });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const updated = await employeeService.update(id, data);
      return res.status(200).json(updated);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao atualizar funcionário" });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await employeeService.delete(id);
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao deletar funcionário" });
    }
  },
  async loginEmployee(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email e senha são obrigatórios." });
      }

      // Busca o funcionário pelo email
      const employee = await employeeService.findToLogin(email);
      if (!employee) {
        return res.status(404).json({ error: "Email ou Senha incorreta." });
      }
      // Verifica a senha
      const passwordMatch = await bcrypt.compare(password, employee.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Email ou Senha incorreta." });
      }

      const modules = await prisma.businessModule.findMany({
        where: { businessId: employee.businessId, active: true },
        select: {
          moduleType: true,
        },
      });

      // Gera o token JWT (expira em 6 horas)
      const token = jwt.sign(
        {
          id: employee.id,
          name: employee.name,
          email: employee.email,
          businessId: employee.businessId,
          businessSlug: employee.business.slug,
          role: employee.role,
          permissions: employee.permissions,
          modules: modules.map((m) => m.moduleType),
        },
        process.env.EMPLOYEE_TOKEN as string,
        { expiresIn: "6h" }
      );

      await activityLogService.create({
        businessId: employee.businessId as string,
        type: "EMPLOYEE_LOGIN",
        title: "Login realizado",
        description: `${employee.name} acessou o sistema`,
        actorType: "EMPLOYEE",
        employeeId: employee.id,
      });

      // Remove o hash da senha antes de retornar
      const { password: _, ...employeeData } = employee;
      return res.status(200).json({
        message: "Login realizado com sucesso!",
        employee: employeeData,
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao realizar login" });
    }
  },
};
