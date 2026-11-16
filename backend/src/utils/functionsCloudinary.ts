import { UploadApiResponse } from "cloudinary";
import cloudinary from "../cloudinary";
import { Readable } from "stream";

/**
 * uploadBuffer
 * @param {Buffer} fileBuffer
 * @param {Object} options - { folder?: string, publicId?: string, overwrite?: boolean, transformation?: {} }
 * @returns {Promise<any>} resultado do cloudinary
 */
export function uploadToCloudinary(
  fileBuffer: Buffer,
  options: {
    folder?: string;
    publicId?: string;
    overwrite?: boolean;
    transformation?: {};
  }
): Promise<UploadApiResponse> {
  const { folder = "", publicId, overwrite = false, transformation } = options;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        overwrite,
        transformation,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result as UploadApiResponse);
      }
    );

    const readable = new Readable();
    readable._read = () => {}; // compat
    readable.push(fileBuffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
}

/**
 * deleteFromCloudinary
 * @param {string} publicId - o ID público da imagem no Cloudinary (ex: "produtos/abc123")
 * @returns {Promise<any>} resultado da exclusão
 */
export async function deleteFromCloudinary(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok" || result.result === "not found") {
      return { success: true, message: "Imagem excluída com sucesso!" };
    }

    return {
      success: false,
      message: `Falha ao excluir imagem: ${result.result}`,
    };
  } catch (error) {
    console.error("Erro ao excluir imagem do Cloudinary:", error);
    return { success: false, message: "Erro ao excluir imagem do Cloudinary" };
  }
}
