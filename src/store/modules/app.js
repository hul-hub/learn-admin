import Cookies from "js-cookie";

const app = {
  state: {
    device: "desktop",
    language: Cookies.get("language") || "en",
    sidebar: {
      opened: !+Cookies.get("sidebarStatus"),
      withoutAnimation: false
    },
    timer: 0,
    hadSubPwd: 0,
    firstLogin: 0
  },

  getters: {
    sidebar: state => state.sidebar,
    language: state => state.language,
    device: state => state.device,
    timer: state => Boolean(state.timer),
    hadSubPwd: state => state.hadSubPwd,
    firstLogin: state => state.firstLogin
  },

  actions: {
    // 切换 侧边菜单栏隐藏/显示
    toggleSideBar({ commit }) {
      commit("TOGGLE_SIDEBAR");
    },
    // 隐藏 侧边菜单栏
    closeSideBar({ commit }, { withoutAnimation }) {
      commit("CLOSE_SIDEBAR", withoutAnimation);
    },
    // 切换 当前浏览器设备 mobile/desktop
    toggleDevice({ commit }, device) {
      commit("TOGGLE_DEVICE", device);
    },
    // 设置 当前语言
    setLanguage({ commit }, language) {
      commit("SET_LANGUAGE", language);
    },
    setHadSubPwd({ commit }, device) {
      commit("HADSUBPWD", device);
    },
    setFirstLogin({ commit }, device) {
      commit("FIRSTLOGIN", device);
    }
  },

  mutations: {
    TOGGLE_SIDEBAR: state => {
      // sidebarStatus =>>  0: 显示; 1: 隐藏
      if (state.sidebar.opened) {
        Cookies.set("sidebarStatus", 1);
      } else {
        Cookies.set("sidebarStatus", 0);
      }
      state.sidebar.opened = !state.sidebar.opened;
      state.sidebar.withoutAnimation = false;
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set("sidebarStatus", 1);
      state.sidebar.opened = false;
      state.sidebar.withoutAnimation = withoutAnimation;
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device;
    },
    SET_LANGUAGE: (state, language) => {
      Cookies.set("language", language);
      state.language = language;
    },
    HADSUBPWD: (state, hadSubPwd) => {
      state.hadSubPwd = hadSubPwd;
    },
    FIRSTLOGIN: (state, firstLogin) => {
      state.firstLogin = firstLogin;
    }
  }
};

export default app;
