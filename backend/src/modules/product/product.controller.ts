import { Request, Response } from "express";
import { productService } from "./product.service";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/functionsCloudinary";
import { Product } from "@prisma/client";

export const productController = {
  // ✅ Busca todos os produtos de uma empresa (com cache e filtros opcionais)
  async getAll(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const { search, categoryId, active } = req.query;

      if (!slug) {
        return res.status(400).json({ error: "slug é obrigatório" });
      }

      const filters = {
        search: search as string,
        categoryId: categoryId as string,
        active: active ? active === "true" : undefined,
      };

      const products = await productService.findAllByBusiness(
        slug as string,
        filters
      );
      return res.status(200).json(products);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar produtos" });
    }
  },

  // ✅ Busca um produto específico pelo ID
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await productService.findById(id);
      if (!product)
        return res.status(404).json({ error: "Produto não encontrado" });
      return res.status(200).json(product);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar produto" });
    }
  },

  // ✅ Cria um novo produto vinculado a uma empresa
  async create(req: Request, res: Response) {
    try {
      const { slug, businessId, categoryId, name, description, price } =
        req.body;

      if (!businessId || !categoryId || !name || !slug) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes." });
      }

      const file = req.file as Express.Multer.File | undefined;
      const normalizedPrice =
        typeof price === "string" ? price.replace(",", ".") : price;

      // 1️⃣ Cria o produto primeiro no banco (sem imagem)
      const product = await productService.create({
        businessId,
        categoryId,
        name,
        description,
        price: normalizedPrice,
        imageUrl: null,
        imagePublicId: null,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Product);

      // 2️⃣ Se tiver imagem, envia para o Cloudinary e atualiza o produto
      if (file && file.buffer) {
        const result = await uploadToCloudinary(file.buffer, {
          folder: `${slug}/products`,
          publicId: `product_${product.id}`, // usa o ID real do produto
          overwrite: true,
          transformation: { width: 800, crop: "limit" },
        });

        await productService.update(product.id, {
          imageUrl: (result as any).secure_url,
          imagePublicId: (result as any).public_id,
        });
      }

      // 3️⃣ Busca o produto atualizado (com imagem)
      const newProduct = await productService.findById(product.id);

      return res.status(201).json(newProduct);
    } catch (error: any) {
      console.error("Erro ao criar produto:", error);
      return res
        .status(500)
        .json({ error: "Erro ao criar produto", details: error.message });
    }
  },

  // ✅ Atualiza produto (com controle de soft delete e atualização inteligente)
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { slug, categoryId, name, description, price, active } = req.body;

      if (!slug) {
        return res.status(400).json({ error: "Slug é obrigatório." });
      }
      let activeValue: boolean | undefined = undefined;

      if (active !== undefined) {
        activeValue = active === "true"; // converte string → boolean
      }

      const usage = await productService.canDelete(id);

      if (usage.hasCombo || usage.hasPromotion) {
        return res.status(409).json({
          error:
            "Este produto não pode ser inativado pois está vinculado a um combo, promoção ou pedido.",
        });
      }

      const file = req.file as Express.Multer.File | undefined;

      let imageUrl: string | undefined;
      let imagePublicId: string | undefined;

      // 1️⃣ Se o usuário enviou uma nova imagem, faz upload e sobrescreve no Cloudinary
      if (file && file.buffer) {
        const result = await uploadToCloudinary(file.buffer, {
          folder: `${slug}/products`,
          publicId: `product_${id}`, // usa sempre o id real → overwrite garantido
          overwrite: true,
          transformation: { width: 800, crop: "limit" },
        });

        imageUrl = (result as any).secure_url;
        imagePublicId = (result as any).public_id;
      }

      // 2️⃣ Atualiza os dados do produto no banco
      const updated = await productService.update(id, {
        categoryId,
        name,
        description,
        price,
        active: activeValue,
        ...(imageUrl && { imageUrl }),
        ...(imagePublicId && { imagePublicId }),
      });

      return res.status(200).json(updated);
    } catch (error: any) {
      console.error("Erro ao atualizar produto:", error);
      return res.status(500).json({
        error: "Erro ao atualizar produto",
        details: error.message,
      });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Primeiro busca o produto para obter o public_id da imagem
      const product = await productService.findById(id);
      if (!product) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      // Se tiver imagem vinculada, exclui do Cloudinary
      if (product.imagePublicId) {
        await deleteFromCloudinary(product.imagePublicId);
      }

      // Depois exclui do banco
      await productService.permanentDelete(id);

      return res.status(200).json({
        message: "Produto excluído com sucesso!",
      });
    } catch (error: any) {
      if (error.message.includes("não pode ser excluído")) {
        return res.status(409).json({
          error: error.message,
        });
      }

      console.error(error);
      return res.status(500).json({ error: "Erro ao deletar produto" });
    }
  },
};
