import UiSlider from "./UiSlider";

const install = Vue => {
  Vue.component("uiSlider", UiSlider);
};

export default {
  install
};

export { UiSlider };