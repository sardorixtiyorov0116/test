import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";

export const Notification = (text: string, type: any) => {
  createToast(text, {
    position: "top-right",
    type: type,
    timeout: 2000,
    transition: "bounce",
  });
};
