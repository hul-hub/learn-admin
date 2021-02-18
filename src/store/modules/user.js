// import { Message } from 'element-ui';
import formatRoles from "@/utils/formatRoles";
import {
  getToken,
  setToken,
  removeToken,
  getAccountFromStorage,
  setAccountFromStorage,
  removeAccountFromStorage,
  setSsoSession
} from "@/utils/auth";
import { loginByUsername, getUserDetailsInfo, register } from "@/api/account";
import { checkAdmin } from "../../api/account";
import { Message, MessageBox } from "element-ui";
import store from "@/store";

const user = {
  state: {
    roles: [],
    token: getToken(),
    account: getAccountFromStorage() || {},
    detailsAccount: {}
  },
  getters: {
    roles: state => state.roles,
    account: state => state.account,
    detailsAccount: state => state.detailsAccount
  },
  actions: {
    checkAdmin() {
      return new Promise(async resolve => {
        try {
          if (getAccountFromStorage().hadSubPwd === 0) {
            const { value } = await MessageBox.prompt(
              "请输入二级权限密码",
              "权限验证",
              {
                inputType: "password",
                distinguishCancelAndClose: true,
                confirmButtonText: "确定",
                cancelButtonText: "去设置"
              }
            );
            const res = await checkAdmin(value);
            if (res.state === "ok") {
              setAccountFromStorage(res.data);
              Message.success("验证成功");
              store.dispatch("setHadSubPwd", 1);
              resolve({
                code: 0,
                msg: "验证成功"
              });
              // window.location.reload();
            } else {
              Message.warning("验证失败");
              resolve({
                code: 1,
                msg: "验证失败"
              });
            }
          } else {
            resolve({
              code: 2,
              msg: "已验证"
            });
          }
        } catch (res) {
          if (res === "cancel") {
            resolve({
              code: 3,
              msg: "去设置"
            });
          } else {
            resolve({
              code: 4,
              msg: "取消"
            });
          }
        }
      });
    },
    // 获取用户信息
    /* eslint-disable no-console */
    getUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        const accountInfo = getAccountFromStorage();
        const roles = formatRoles(accountInfo);

        // 验证返回的roles是否是一个非空数组
        if (roles && roles.length > 0) {
          commit("SET_ROLES", roles);
        } else {
          reject("roles must be a non-null array !");
        }

        accountInfo.roles = roles;
        resolve(accountInfo);
      });
    },
    // 获取详细用户信息
    getDetailsUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getUserDetailsInfo()
          .then(res => {
            const { state, data } = res;
            if (state === "ok") {
              console.log("用户信息 getDetailsUserInfo", data);
              commit("SET__DETAILSACCOUNT", data);
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 用户名登录
    loginByUsername({ commit }, loginInfo) {
      return new Promise((resolve, reject) => {
        loginByUsername(loginInfo)
          .then(res => {
            if (res.state === "fail") {
              resolve(res);
            } else if (res.state === "ok") {
              if (!res.data) {
                reject(res);
              }
              const { data } = res;
              store.dispatch("setFirstLogin", 1);
              commit("SET_TOKEN", data.userId);
              commit("SET_ROLES", []);
              commit("RESET_COMMIT");
              setToken(data.userId);
              setAccountFromStorage(data);
              setSsoSession(data.sessionId);
              resolve(res);
            }
          })
          .catch(error => {
            if (error.status !== 401) {
              reject(error);
            }
          });
      });
    },
    // 用户注册并登陆
    registerAndLogin({ commit }, loginInfo) {
      return new Promise((resolve, reject) => {
        register(loginInfo)
          .then(res => {
            if (res.state === "fail") {
              resolve(res);
            } else if (res.state === "ok") {
              if (!res.data) {
                reject(res);
              }
              const data = res.data;
              commit("SET_TOKEN", data.userId);
              commit("SET_ROLES", []);
              commit("RESET_COMMIT");
              setToken(data.userId);
              setAccountFromStorage(data);
              resolve(res);
            }
          })
          .catch(error => {
            if (error.status !== 401) {
              reject(error);
            }
          });
      });
    },
    // 退出登录
    logOut({ commit }) {
      return new Promise(resolve => {
        commit("SET_TOKEN", "");
        commit("SET_ROLES", []);
        removeToken();
        removeAccountFromStorage();
        resolve();
      });
    },
    // 前端 登出
    logOutFront({ commit }) {
      return new Promise(resolve => {
        commit("SET_TOKEN", "");
        removeToken();
        resolve();
      });
    }
  },
  mutations: {
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET__DETAILSACCOUNT: (state, account) => {
      state.detailsAccount = account;
      state.account = {
        ...state.account,
        ...account
      };
      console.log(state.account, "--------------state.account");
    }
  }
};

export default user;
