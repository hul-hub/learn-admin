// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
console.log(location, "<<<<<loction");

import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import App from "./App";
import router from "./router";
import store from "./store";
import "./permission"; // permission control
import * as filters from "./filters"; // global filters
import * as directives from "./directives";
import inject from "./utils/inject";
import "./styles/flex.scss";
import "./styles/size.scss";
import "./directives/tableLoadMore";
import "./plugins/element.js";
import { getCookies } from "./utils/toSub.js";
import "./directives/btnControl";
import VideoPlayer from "vue-video-player";
require("video.js/dist/video-js.css");
require("vue-video-player/src/custom-theme.css");
window.onload = function() {
  getCookies();
};

Vue.config.productionTip = false;

// register global filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

// register global directives.
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key]);
});
Vue.use(VideoPlayer);
// register global component
Vue.use(ElementUI);

Vue.use(inject);

Vue.prototype.$platform = undefined;

// import all svg
const requireAll = requireContext => {
  requireContext.keys().map(requireContext);
};
const req = require.context("@/assets/svg", true, /\.svg$/);
requireAll(req);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

console.group("应用信息：");
console.log("版本：", process.env.VUE_APP_VERSION);
console.log("平台：", process.env.VUE_APP_PLATFORM);
console.groupEnd();
