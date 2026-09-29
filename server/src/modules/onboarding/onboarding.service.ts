import crypto from "crypto";

import prisma from "../../config/prisma.ts";
import {
  deleteFromStorage,
  getPresignedUrl,
  uploadFileToS3,
} from "../../config/storage.ts";
import {
  CreateOnboardingMaterialInput,
  UpdateOnboardingMaterialInput,
} from "./onboarding.validation.ts";

export const createOnboardingMaterial = async (
  data: CreateOnboardingMaterialInput,
  documentKey: string
) => {
  return prisma.onboardingMaterial.create({
    data: {
      title: data.title,
      description: data.description,
      documentKey,
      type: data.type,
      sortOrder: data.sortOrder ?? 0,
    },
  });
};

export const getOnboardingMaterials = async () => {
  const materials = await prisma.onboardingMaterial.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
  });

  return Promise.all(
    materials.map(async (material) => ({
      ...material,
      documentUrl: await getPresignedUrl(material.documentKey),
    }))
  );
};

export const updateOnboardingMaterial = async (
  id: string,
  data: UpdateOnboardingMaterialInput,
  file?: Express.Multer.File
) => {
  const existingMaterial = await prisma.onboardingMaterial.findUnique({
    where: { id },
  });

  if (!existingMaterial) {
    throw new Error("Onboarding material not found");
  }

  let documentKey = existingMaterial.documentKey;

  if (file) {
    const fileExtension = file.originalname.split(".").pop();

    const newKey = `onboarding/${crypto.randomUUID()}.${
      fileExtension ?? "pdf"
    }`;

    documentKey = await uploadFileToS3(
      newKey,
      file.buffer,
      file.mimetype
    );

    await deleteFromStorage(existingMaterial.documentKey);
  }

  const material = await prisma.onboardingMaterial.update({
    where: { id },
    data: {
      ...(data.title !== undefined && {
        title: data.title,
      }),
      ...(data.description !== undefined && {
        description: data.description,
      }),
      ...(data.sortOrder !== undefined && {
        sortOrder: data.sortOrder,
      }),
      ...(data.isActive !== undefined && {
        isActive: data.isActive,
      }),
      ...(data.type !== undefined && {
        type: data.type,
      }),
      ...(file && {
        documentKey,
      }),
    },
  });

  const documentUrl = await getPresignedUrl(material.documentKey);

  return {
    ...material,
    documentUrl,
  };
};

export const deleteOnboardingMaterial = async (id: string) => {
  const material = await prisma.onboardingMaterial.findUnique({
    where: { id },
  });

  if (!material) {
    throw new Error("Onboarding material not found");
  }

  await deleteFromStorage(material.documentKey);

  await prisma.onboardingMaterial.delete({
    where: { id },
  });
};