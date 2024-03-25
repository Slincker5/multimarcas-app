import { ref } from "vue";

export const useFooterStore = () => {
  const isFooterVisible = ref(false);

  const showFooter = () => {
    isFooterVisible.value = true;
  };

  const hideFooter = () => {
    isFooterVisible.value = false;
  };

  return { isFooterVisible, showFooter, hideFooter };
};
