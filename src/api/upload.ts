import axiosClient from "./apiClient";
interface ImageItem {
  image: string;
  file: File;
  size: boolean;
  id: number;
}
const files = {
  uploadFile(payload: ImageItem) {
    const url = "/file/upload/public";
    const data = new FormData();
    data.append("module", "test");
    data.append("tenantId", "test");
    data.append("fileName", "test");
    data.append("file", payload.file);

    return axiosClient.post(url, data);
  },
};
export default files;
