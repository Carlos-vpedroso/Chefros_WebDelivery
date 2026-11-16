import { Request, Response } from "express";
import { categoryService } from "./category.service";
import { CategoryType } from "@prisma/client";

export const categoryController = {
  // ✅ Busca todas as categorias de uma empresa
  async getAll(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const { type } = req.query;

      if (!slug) {
        return res.status(400).json({ error: "slug é obrigatório" });
      }

      const categories = await categoryService.findAllByBusiness(
        slug as string,
        type as string
      );
      return res.status(200).json(categories);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar categorias" });
    }
  },

  // ✅ Busca categoria por ID
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const category = await categoryService.findById(id);
      if (!category)
        return res.status(404).json({ error: "Categoria não encontrada" });
      return res.status(200).json(category);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar categoria" });
    }
  },

  // ✅ Cria uma nova categoria
  async create(req: Request, res: Response) {
    try {
      const { businessId, name, type, parentId } = req.body;
      if (!businessId || !name || !type) {
        return res.status(400).json({
          message: "businessId, name e type são obrigatórios",
        });
      }

      // Valida o type
      if (!["PRODUCT", "SERVICE"].includes(type)) {
        return res.status(400).json({
          message: "Type deve ser PRODUCT ou SERVICE",
        });
      }

      const newCategory = await categoryService.create({
        businessId,
        name,
        type,
        parentId,
      });
      return res.status(201).json(newCategory);
    } catch (error: any) {
      console.error(error);

      // Erro de unique constraint
      if (error.code === "P2002") {
        return res.status(400).json({
          error: "Já existe uma categoria com este nome para este tipo",
        });
      }

      return res.status(500).json({ error: "Erro ao criar categoria" });
    }
  },

  // ✅ Atualiza categoria
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, type, parentId } = req.body;

      const updated = await categoryService.update(id, {
        name,
        type,
        parentId,
      });
      return res.status(200).json(updated);
    } catch (error: any) {
      console.error(error);

      if (error.code === "P2002") {
        return res.status(400).json({
          error: "Já existe uma categoria com este nome para este tipo",
        });
      }

      return res.status(500).json({ error: "Erro ao atualizar categoria" });
    }
  },

  // ✅ Deleção lógica (ou física dependendo da sua regra)
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Verifica se a categoria tem produtos/serviços vinculados
      const hasProducts = await categoryService.hasProducts(id);
      if (hasProducts) {
        return res.status(400).json({
          message:
            "Não é possível excluir categoria com produtos/serviços vinculados",
        });
      }

      await categoryService.delete(id);
      return res
        .status(200)
        .json({ message: "Categoria deletada com sucesso!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao deletar categoria" });
    }
  },

  // ✅ Busca categorias com contagem de produtos
  async getWithCounts(req: Request, res: Response) {
    try {
      const { businessId, type } = req.query;

      if (!businessId) {
        return res.status(400).json({ error: "businessId é obrigatório" });
      }

      const categories = await categoryService.findWithProductCount(
        businessId as string,
        type as CategoryType
      );
      return res.status(200).json(categories);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar categorias" });
    }
  },
};
