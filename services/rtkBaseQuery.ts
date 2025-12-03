import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosError, AxiosRequestConfig } from "axios";
import api, { normalizeApiError } from "./http";

export type AxiosBaseQueryArgs = {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
};

export interface AxiosBaseQueryError {
  status?: number;
  data?: unknown;
  message: string;
}

export const axiosBaseQuery =
  (): BaseQueryFn<AxiosBaseQueryArgs, unknown, AxiosBaseQueryError> =>
  async ({ url, method = "GET", data, params }) => {
    try {
      const result = await api({
        url,
        method,
        data,
        params,
      });
      return { data: result.data };
    } catch (error) {
      const err = normalizeApiError(error);
      return {
        error: {
          status: err.status,
          data: err.data,
          message: err.message,
        },
      };
    }
  };


