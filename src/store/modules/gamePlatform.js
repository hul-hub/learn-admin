import { getPlatformList } from "@/api/aid";

const gamePlatform = {
  state: {
    platformList: [],
    gameList: []
  },
  getters: {
    platformList: state => state.platformList,
    gameList: state => state.gameList
  },
  actions: {
    /**
     * 获取平台列表
     * @param commit
     * @returns {Promise}
     */
    getPlatformList({ commit }) {
      return new Promise((resolve, reject) => {
        getPlatformList()
          .then(res => {
            if (res.state === "ok") {
              commit("SET_PLATFORMLIST", res.data);
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch(() => {
            reject("roles must be a non-null array !");
          });
      });
    }
  },
  mutations: {
    SET_PLATFORMLIST: (state, platformList) => {
      state.platformList = platformList;
    }
  }
};

export default gamePlatform;
