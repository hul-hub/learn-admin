import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app";
import permission from "./modules/permission";
import tagsView from "./modules/tagsView";
import user from "./modules/user";
import gamePlatform from "./modules/gamePlatform";
import gameList from "./modules/gameList";
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    permission,
    tagsView,
    user,
    gamePlatform,
    gameList
  }
});

export default store;
