import { Request, Response } from "express";

import crypto from "crypto";
import { createOnboardingMaterialSchema, updateOnboardingMaterialSchema } from "./onboarding.validation.ts";
import { uploadFileToS3 } from "../../config/storage.ts";
import { createOnboardingMaterial, deleteOnboardingMaterial, getOnboardingMaterials, updateOnboardingMaterial } from "./onboarding.service.ts";

export const createOnboardingMaterialController = async (
  req: Request,
  res: Response
) => {
  const validatedData = createOnboardingMaterialSchema.parse(req.body);

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Onboarding document is required",
    });
  }

  const fileExtension = req.file.originalname.split(".").pop();

  const key = `onboarding/${crypto.randomUUID()}.${
    fileExtension ?? "pdf"
  }`;

  const documentUrl = await uploadFileToS3(
    key,
    req.file.buffer,
    req.file.mimetype
  );

  const material = await createOnboardingMaterial(
    validatedData,
    documentUrl
  );

  return res.status(201).json({
    success: true,
    message: "Onboarding material created successfully",
    data: material,
  });
};

export const getOnboardingMaterialsController = async (
  req: Request,
  res: Response
) => {
  const materials = await getOnboardingMaterials();

  return res.status(200).json({
    success: true,
    message: "Onboarding materials retrieved successfully",
    data: materials,
  });
};




export const updateOnboardingMaterialController = async (
  req: Request,
  res: Response
) => {
  const validatedData = updateOnboardingMaterialSchema.parse(req.body);

  const { id } = req.params;

  if (typeof id !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid onboarding material ID",
    });
  }

  const material = await updateOnboardingMaterial(
    id,
    validatedData,
    req.file
  );

  return res.status(200).json({
    success: true,
    message: "Onboarding material updated successfully",
    data: material,
  });
};

export const deleteOnboardingMaterialController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid onboarding material ID",
    });
  }

  await deleteOnboardingMaterial(id);

  return res.status(200).json({
    success: true,
    message: "Onboarding material deleted successfully",
  });
};