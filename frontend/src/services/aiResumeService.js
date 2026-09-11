import api from "./api";

const analyzeResume = async (userId) => {
const response = await api.get(`/ai/analyze/${userId}`);
return response.data;
};

export { analyzeResume };
