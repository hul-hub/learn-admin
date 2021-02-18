import { getUserGameList } from "@/api/aid";

const gameListform = {
  state: {
    gameListarr: []
  },
  getters: {
    gameListarr: state => state.gameListarr
  },
  actions: {
    /**
     * 获取游戏（去除平台）
     * @param commit
     * @returns {Promise}
     */
    getUserGameList({ commit }) {
      return new Promise((resolve, reject) => {
        getUserGameList()
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
    SET_PLATFORMLIST: (state, gameListarr) => {
      state.gameListarr = gameListarr;
    }
  }
};

export default gameListform;
