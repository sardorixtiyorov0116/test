import { describe, expect, test, vi } from "vitest";
import { mount } from "@vue/test-utils";
import MultipleUpload from "../MultipleUpload.vue";

describe("MultipleUpload", (test) => {
  test("check to snapshot SingleUpload", async () => {
    const wrapper = mount(MultipleUpload, {
      props: { maxSize: 4, maxElementCount: 4 },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("should render multiple input  with error message", async () => {
    const wrapper = mount(MultipleUpload, {
      props: { maxElementCount: 1, maxSize: 20 },
    });
    const inputElement = wrapper.find('input[type="file"]')
      .element as HTMLInputElement;
    const file1 = new File(["foo"], "foo.txt", {
      type: "text/plain",
    });
    const file2 = new File(["moo"], "moo.txt", {
      type: "text/plain",
    });
    const mockFileList = Object.create(inputElement.files);
    mockFileList[0] = file1;
    mockFileList[1] = file2;
    Object.defineProperty(mockFileList, "length", { value: 2 });
    (wrapper.getCurrentComponent().exposed as any).handleFileChange({
      target: { files: mockFileList },
    });
    await wrapper.vm.$nextTick();
    const card = wrapper.findAll(".card");
    expect(card).toHaveLength(1);

    // expect(wrapper.find("label").attributes("title")).toBe(
    //   "You select maximum count file"
    // );
  });
  test("should render multiple input with OK", async () => {
    const wrapper = mount(MultipleUpload, {
      props: { maxElementCount: 3, maxSize: 20 },
    });
    const inputElement = wrapper.find('input[type="file"]')
      .element as HTMLInputElement;
    const file1 = new File(["foo"], "foo.txt", {
      type: "text/plain",
    });
    const file2 = new File(["moo"], "moo.txt", {
      type: "text/plain",
    });
    const mockFileList = Object.create(inputElement.files);
    mockFileList[0] = file1;
    mockFileList[1] = file2;
    Object.defineProperty(mockFileList, "length", { value: 2 });
    (wrapper.getCurrentComponent().exposed as any).handleFileChange({
      target: { files: mockFileList },
    });
    await wrapper.vm.$nextTick();
    const card = wrapper.findAll(".card");
    expect(card).toHaveLength(2);

    expect(wrapper.find("label").attributes("title")).toBe("");
  });
  test("should render multiple input  when siz is high", async () => {
    const wrapper = mount(MultipleUpload, {
      props: { maxElementCount: 1, maxSize: 2 },
    });
    const inputElement = wrapper.find('input[type="file"]')
      .element as HTMLInputElement;
    const file1 = new File(["foo"], "foo.txt", {
      type: "text/plain",
    });

    const mockFileList = Object.create(inputElement.files);
    mockFileList[0] = file1;
    Object.defineProperty(mockFileList, "length", { value: 1 });
    (wrapper.getCurrentComponent().exposed as any).handleFileChange({
      target: { files: mockFileList },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".clickCard").attributes("title")).toBe(
      "Size is too high"
    );
  });
  test("should render multiple input  when size is normal", async () => {
    const wrapper = mount(MultipleUpload, {
      props: { maxElementCount: 1, maxSize: 4 },
    });
    const inputElement = wrapper.find('input[type="file"]')
      .element as HTMLInputElement;
    const file1 = new File(["foo"], "foo.txt", {
      type: "text/plain",
    });

    const mockFileList = Object.create(inputElement.files);
    mockFileList[0] = file1;
    Object.defineProperty(mockFileList, "length", { value: 1 });
    (wrapper.getCurrentComponent().exposed as any).handleFileChange({
      target: { files: mockFileList },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".clickCard").attributes("title")).toBe("");
  });

  test("FileReader readAsDataURL is called with the file for image files", async () => {
    const readAsDataURLSpy = vi.spyOn(FileReader.prototype, "readAsDataURL");
    const wrapper = mount(MultipleUpload, {
      props: { maxSize: 4, maxElementCount: 4 },
    });
    const inputElement = wrapper.find('input[type="file"]')
      .element as HTMLInputElement;
    const file = new File(["foo"], "image.png", {
      type: "image/png",
    });
    const mockFileList = Object.create(inputElement.files);
    mockFileList[0] = file;
    Object.defineProperty(mockFileList, "length", { value: 1 });

    (wrapper.getCurrentComponent().exposed as any).handleFileChange({
      target: { files: mockFileList },
    });

    expect(readAsDataURLSpy).toHaveBeenCalledWith(file);
  });
 
  test("getFileContent returns correct content for different file types", () => {
    const wrapper = mount(MultipleUpload, { props: { maxSize: 4 ,maxElementCount:4} });
    expect(
      (wrapper.getCurrentComponent().exposed as any).getFileContent("video/")
    ).toBe("/video-icon.jpg");
    expect(
      (wrapper.getCurrentComponent().exposed as any).getFileContent("audio/")
    ).toBe("/audio-icon.jpg");
    expect(
      (wrapper.getCurrentComponent().exposed as any).getFileContent(
        "application/pdf"
      )
    ).toBe("/pdf-icon.jpg");
    expect(
      (wrapper.getCurrentComponent().exposed as any).getFileContent(
        "application/zip"
      )
    ).toBe("/zip-icon.jpg");
    expect(
      (wrapper.getCurrentComponent().exposed as any).getFileContent(
        "application/sql"
      )
    ).toBe(
      "https://www.shareicon.net/data/2015/09/07/97430_document_512x512.png"
    );
    expect(
      (wrapper.getCurrentComponent().exposed as any).getFileContent("text/html")
    ).toBe(
      "https://cdn4.iconfinder.com/data/icons/smashicons-file-types-flat/56/22_-_HTML_File_Flat-512.png"
    );
    expect(
      (wrapper.getCurrentComponent().exposed as any).getFileContent("unknown")
    ).toBe("/any_icon.jpg");
  });
 
});
