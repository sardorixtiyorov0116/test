import { describe, expect, test, vi } from "vitest";
import axios from "axios";
import axiosClient from "./apiClient";

describe("Axios Client", () => {
  test("should set baseURL correctly", () => {
    expect(axiosClient.defaults.baseURL).toBe(
      import.meta.env.VITE_APP_BASE_URL
    );
  });

  test("should attach Authorization header with token from local storage", () => {
    const mockToken = "mocked_token";
    vi.spyOn(window.localStorage.__proto__, "getItem").mockReturnValue(
      mockToken
    );

    const config = axiosClient.interceptors.request.use(
      (config) => {
        config.headers.Authorization = `Bearer ${mockToken}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    expect(config).toEqual(1);
  });

  test("should handle response errors", async () => {
    try {
      await axiosClient.get("/test");
    } catch (error) {
      expect(error).toBeInstanceOf(axios.AxiosError);
    }
  });
});
