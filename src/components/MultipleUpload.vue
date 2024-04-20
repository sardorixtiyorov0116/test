<template>
  <p class="px-[20px] mt-[80px] font-bold text-[15px]">
    ⚠️ Please ensure each file is less than {{ props.maxSize / 1024 / 1024 }}MB
<br />⚠️ Please choose a maximum of {{ props.maxElementCount }} files.
  </p>

  <div class="px-[50px] pt-[20px] flex w-full flex-wrap gap-10 items-end">
    <div
      class="flex justify-center items-center card"
      v-for="(item, index) in images"
      :key="index"
    >
      <div
        @click="buttonClicked(item)"
        class="w-[200px] h-[200px] relative flex clickCard"
        :title="!item.size ? 'Size is too high' : ''"
      >
        <i v-if="!item.size"class="absolute fa-solid top-3 right-3 fa-circle-xmark text-red-600 text-[23px]"></i>
        <i v-if="item.id == 1" class="absolute fa-solid top-3 right-3 fa-circle-check text-green-600 text-[23px]"></i>
        <i v-if="item.id == 2" class="absolute fa-solid top-3 right-3 fa-circle-exclamation text-red-600 text-[23px]"></i> 
        <button
          class="absolute right-[-15px] bottom-[-10px] border-2 border-red-600 px-3 py-1 bg-white text-red-500 rounded-full text-[14px]"
          @click="removeImage(index)"
        >
          Remove
        </button>
        <img :src="item.image" class="max-w-[100%] max-h-[100%]" />
      </div>
    </div>
    <label
      for="inputField1"
      class="w-[230px] h-[200px] flex flex-col gap-3 justify-center items-center bg-slate-200 rounded-md shadow-lg cursor-pointer hover:bg-slate-300"
      :title="isMaxCount ? 'You select maximum count file' : ''"
    >
      <input
        id="inputField1"
        type="file"
        multiple
        class="hidden"
        ref="fileInput"
        @change="handleFileChange"
      />
      <i class="fa-solid fa-cloud-arrow-up text-[25px]"></i>
      <h1>Choose File</h1>
    </label>
    <button
      class="px-5 py-3 rounded-full bg-blue-400 text-white flex gap-3 items-center justify-center"
      @click="save"
    >
      <div v-if="isLoading">
        <svg
          aria-hidden="true"
          class="w-5 h-5 text-[white] animate-spin dark:text-gray-600 fill-[white]"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>

      <h1>Upload</h1>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { AxiosResponse } from "axios";
import type { Ref } from "vue";
import { Notification } from "../plugins/notification";
import api from "../api/upload";

interface ImageItem {
  image: string;
  file: File;
  size: boolean;
  id: number;
}
const props = defineProps<{
  maxElementCount: number;
  maxSize: number;
}>();

const images: Ref = ref([]);
const fileInput: Ref = ref(null);
const isLoading: Ref = ref(false);
const isMaxCount: Ref = ref(false);

const handleFileChange = (event: Event): void => {
  const inputElement = event.target as HTMLInputElement;
  const files: FileList | null = inputElement.files;

  if (!files) return;
  
  if (images.value.length < props.maxElementCount) {
    const filesToProcess = Array.from(files).slice(
      0,
      props.maxElementCount - images.value.length
    );
    if (files.length > props.maxElementCount) isMaxCount.value = true;
    for (const file of filesToProcess) {
      const size: boolean = file.size <= props.maxSize;

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          images.value.push({
            image: reader.result as string,
            file,
            size,
            id: 0,
          });
        };
        reader.readAsDataURL(file);
      } else if (
        file.type.startsWith("video/") ||
        file.type.startsWith("audio/") ||
        file.type.startsWith("application/pdf") ||
        file.type.startsWith("application/zip") ||
        file.type.startsWith("application/sql") ||
        file.type.startsWith("text/html") ||
        file.type !== ""
      ) {
        images.value.push({
          image: getFileContent(file.type),
          file,
          size,
          id: 0,
        });
      }
    }
  } else {
    isMaxCount.value = true;
    Notification("You can select 5 files with maximum", "danger");
  }
};
 const getFileContent=(fileType: string):string=>{
  if (fileType.startsWith("video/")) {
    return "/video-icon.jpg";
  } else if (fileType.startsWith("audio/")) {
    return "/audio-icon.jpg";
  } else if (fileType.startsWith("application/pdf")) {
    return "/pdf-icon.jpg";
  } else if (fileType.startsWith("application/zip")) {
    return "/zip-icon.jpg";
  } else if (fileType.startsWith("application/sql")) {
    return "https://www.shareicon.net/data/2015/09/07/97430_document_512x512.png";
  } else if (fileType.startsWith("text/html")) {
    return "https://cdn4.iconfinder.com/data/icons/smashicons-file-types-flat/56/22_-_HTML_File_Flat-512.png";
  } else {
    return "/any_icon.jpg";
  }
}

const removeImage = (index: number): void => { images.value.splice(index, 1) };

const buttonClicked = async (item: ImageItem): Promise<void> => {
  if (item.id === 2) {
    isLoading.value = true;

    const res: AxiosResponse = await api.uploadFile(item);
    if (res.status === 200) {
      item.id = 1;
    }
  }
  isLoading.value = false;
};

const save = async (): Promise<void> => {
  if (images.value.length > 0) {
    isLoading.value = true;
    for (let img of images.value) {
      const imageItem = img as ImageItem;
      if (imageItem.size && imageItem.id !== 1) {
        try {
          await api.uploadFile(imageItem);
          imageItem.id = 1;
        } catch (error) {
          imageItem.id = 2;
        }
      }
    }
    isLoading.value = false;
  } else {
    Notification("Please, add any file", "danger");
  }
};
defineExpose({
  handleFileChange,
  getFileContent
});
</script>

<style lang="scss" scoped></style>
