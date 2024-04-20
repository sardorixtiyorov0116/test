import { describe, expect, test, vi } from "vitest";
import { mount } from "@vue/test-utils";
import upload from "./upload";

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}));
vi.mock("axios", async (importActual) => {
  const actual = await importActual<typeof import("axios")>();

  const mockAxios = {
    default: {
      ...actual.default,
      create: vi.fn(() => ({
        ...actual.default.create(),
        get: mocks.get,
        post: mocks.post,
      })),
    },
  };

  return mockAxios;
});
describe("Files Module", () => {
  test("uploadFile should sent correct data to the server", async () => {
    const payload = {
      image: "image.png",
      file: new File(["foo"], "foo.txt", { type: "text/plain" }),
      size: true,
      id: 1,
    };

    await upload.uploadFile(payload);
    expect(mocks.post).toHaveBeenCalledWith(
      "/file/upload/public",
      expect.any(FormData)
    );
  });
});
