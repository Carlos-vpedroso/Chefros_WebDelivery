import { Request, Response } from "express";
import { businessService } from "./business.service";
import { uploadToCloudinary } from "../../utils/functionsCloudinary";

export const businessController = {
  async getAll(req: Request, res: Response) {
    try {
      const businesses = await businessService.findAll();
      res.status(200).json(businesses);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar empresas", error });
    }
  },

  async getBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const business = await businessService.findBySlug(slug);
      res.status(200).json(business);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar empresas", error });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const business = await businessService.findById(id);
      if (!business)
        return res.status(404).json({ message: "Empresa não encontrada" });
      res.status(200).json(business);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar empresa", error });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await businessService.update(id, req.body);
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar empresa", error });
    }
  },

  async updateImage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { type } = req.query;

      if (type !== "logo" && type !== "banner") {
        return res.status(400).json({
          error: "Parâmetro inválido. Use ?type=logo ou ?type=banner",
        });
      }

      const file = req.file as Express.Multer.File;
      if (!file) {
        return res.status(400).json({ error: "Nenhuma imagem enviada." });
      }

      const business = await businessService.findById(id);
      if (!business) {
        return res.status(404).json({ error: "Empresa não encontrada." });
      }

      const uploadResult = await uploadToCloudinary(file.buffer, {
        folder: `${business.slug}`,
        publicId: `${business.slug}_${type}`,
        overwrite: true,
        transformation:
          type === "logo"
            ? { width: 500, height: 500, crop: "fill" }
            : { width: 1920, height: 600, crop: "fill" },
      });
      const imageUrl = uploadResult.secure_url;

      const updated = await businessService.update(id, {
        logoUrl: type === "logo" ? imageUrl : undefined,
        bannerUrl: type === "banner" ? imageUrl : undefined,
      });

      const newImageUrl = type === "logo" ? updated.logoUrl : updated.bannerUrl

      return res.json({
        success: true,
        message: "Imagem atualizada com sucesso!",
        imageUrl: newImageUrl,
      });
    } catch (error) {
      console.error("Erro ao atualizar imagem:", error);
      return res.status(500).json({
        error: "Erro interno ao atualizar imagem.",
      });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await businessService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir empresa", error });
    }
  },
};
