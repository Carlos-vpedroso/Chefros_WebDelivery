import { Request, Response } from "express";
import { serviceService } from "./service.service";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/functionsCloudinary";
import { Service } from "@prisma/client";

export const serviceController = {
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

      const services = await serviceService.findAllByBusiness(
        slug as string,
        filters
      );
      return res.status(200).json(services);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar serviços" });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const service = await serviceService.findById(id);
      if (!service)
        return res.status(404).json({ error: "Serviço não encontrado" });
      return res.status(200).json(service);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar serviço" });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const {
        slug,
        businessId,
        categoryId,
        name,
        description,
        duration,
        price,
      } = req.body;

      if (!businessId || !categoryId || !name || !slug) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes." });
      }

      const file = req.file as Express.Multer.File | undefined;
      const normalizedPrice =
        typeof price === "string" ? price.replace(",", ".") : price;

      // 1️⃣ Cria o produto primeiro no banco (sem imagem)
      const service = await serviceService.create({
        businessId,
        categoryId,
        name,
        description,
        price: normalizedPrice,
        duration: Number(duration),
        imageUrl: null,
        imagePublicId: null,
        active: true,
      } as Service);

      // 2️⃣ Se tiver imagem, envia para o Cloudinary e atualiza o produto
      if (file && file.buffer) {
        const result = await uploadToCloudinary(file.buffer, {
          folder: `${slug}/services`,
          publicId: `service_${service.id}`, // usa o ID real do serviço
          overwrite: true,
          transformation: { width: 800, crop: "limit" },
        });

        await serviceService.update(service.id, {
          imageUrl: (result as any).secure_url,
          imagePublicId: (result as any).public_id,
        });
      }

      // 3️⃣ Busca o produto atualizado (com imagem)
      const newService = await serviceService.findById(service.id);

      return res.status(201).json(newService);
    } catch (error: any) {
      console.error("Erro ao criar serviço:", error);
      return res
        .status(500)
        .json({ error: "Erro ao criar serviço", details: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { slug, categoryId, name, description, price, duration, active } =
        req.body;

      if (!slug) {
        return res.status(400).json({ error: "Slug é obrigatório." });
      }
      let activeValue: boolean | undefined = undefined;

      if (active !== undefined) {
        activeValue = active === "true"; // converte string → boolean
      }

      const normalizedPrice =
        typeof price === "string" ? price.replace(",", ".") : price;
      const file = req.file as Express.Multer.File | undefined;

      let imageUrl: string | undefined;
      let imagePublicId: string | undefined;

      // 1️⃣ Se o usuário enviou uma nova imagem, faz upload e sobrescreve no Cloudinary
      if (file && file.buffer) {
        const result = await uploadToCloudinary(file.buffer, {
          folder: `${slug}/services`,
          publicId: `service_${id}`, // usa sempre o id real → overwrite garantido
          overwrite: true,
          transformation: { width: 800, crop: "limit" },
        });

        imageUrl = (result as any).secure_url;
        imagePublicId = (result as any).public_id;
      }

      // 2️⃣ Atualiza os dados do produto no banco
      const updated = await serviceService.update(id, {
        categoryId,
        name,
        description,
        price: normalizedPrice,
        duration: Number(duration),
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
      const product = await serviceService.findById(id);
      if (!product) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      // Se tiver imagem vinculada, exclui do Cloudinary
      if (product.imagePublicId) {
        await deleteFromCloudinary(product.imagePublicId);
      }

      // Depois exclui do banco
      await serviceService.permanentDelete(id);

      return res.status(200).json({
        message: "Serviço excluído com sucesso!",
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
