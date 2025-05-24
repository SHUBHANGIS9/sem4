// src/SwaggerApi.ts
import axios from 'axios';

export const fetchSwaggerDefinition = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};
