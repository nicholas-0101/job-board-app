import { apiCall } from "@/helper/axios";

export interface BadgeTemplate {
  id: number;
  name: string;
  icon?: string;
  description?: string;
  category?: string;
}

export const getAllBadgeTemplates = async () => {
  const response = await apiCall.get("/skill-assessment/badge-templates");
  return response.data;
};

export const getDeveloperBadgeTemplates = async () => {
  const response = await apiCall.get(
    "/skill-assessment/developer/badge-templates"
  );
  return response.data;
};

export const createBadgeTemplate = async (data: {
  name: string;
  description?: string;
  iconFile?: File;
  category?: string;
}) => {
  const formData = new FormData();
  formData.append("name", data.name);
  if (data.description) formData.append("description", data.description);
  if (data.iconFile) formData.append("icon", data.iconFile);
  if (data.category) formData.append("category", data.category);

  const response = await apiCall.post(
    "/skill-assessment/badge-templates",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const updateBadgeTemplate = async (
  id: number,
  data: {
    name?: string;
    description?: string;
    icon?: string;
    category?: string;
    iconFile?: File;
  }
) => {
  if (data.iconFile) {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.category) formData.append("category", data.category);
    formData.append("icon", data.iconFile);

    const response = await apiCall.patch(
      `/skill-assessment/badge-templates/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  const response = await apiCall.patch(
    `/skill-assessment/badge-templates/${id}`,
    data
  );
  return response.data;
};

export const deleteBadgeTemplate = async (id: number) => {
  const response = await apiCall.delete(
    `/skill-assessment/badge-templates/${id}`
  );
  return response.data;
};
