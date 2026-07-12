import axios from "axios";

type ApiErrorDetail = {
  path?: string[];
  message?: string;
};

type ApiErrorResponse = {
  error?: {
    message?: string;
    details?: ApiErrorDetail[];
  };
};

export function getApiErrorMessage(error: unknown, fallback = "Nao foi possivel salvar os dados.") {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    if (error.response?.status === 429) {
      return "Muitas tentativas de acesso. Aguarde alguns minutos e tente novamente.";
    }

    const detail = error.response?.data.error?.details?.[0];
    const message = detail?.message ?? error.response?.data.error?.message;

    if (message) {
      const field = detail?.path?.join(".");
      return field ? `${field}: ${message}` : message;
    }
  }

  if (error instanceof Error && error.message) return error.message;

  return fallback;
}
