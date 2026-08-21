export const getShortFileName = (fileName: string) => {
  const extension = fileName.split(".").pop() || "";
  const name = fileName.replace(/\.[^/.]+$/, "");

  if (name.length <= 28) {
    return fileName;
  }

  return `${name.slice(0, 25)}...${extension ? `.${extension}` : ""}`;
};