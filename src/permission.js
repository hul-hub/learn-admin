import { Message } from "element-ui";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import router, { constantRouterMap } from "@/router";
import store from "@/store";
import { getAccountFromStorage } from "@/utils/auth";
import { getCertification } from "@/api/certification";
import http from "@/utils/http";
import Cookies from "js-cookie";

// NProgress Configuration
NProgress.configure({ showSpinner: true });

/**
 * 判断是否有访问权限
 * @param {*} roles
 * @param {*} permissionRoles
 */
function hasPermission(roles, permissionRoles) {
  // admin permission passed directly
  if (roles.indexOf("admin") >= 0) {
    return true;
  }
  if (!permissionRoles) {
    return true;
  }
  return roles.some(role => permissionRoles.indexOf(role) >= 0);
}

// @todo: has warning info "[vue-router] Duplicate named routes definition:"
/* eslint-disable no-lonely-if */
router.beforeEach(async (to, from, next) => {
  NProgress.start();

  const accountInfo = getAccountFromStorage();

  if (accountInfo) {
    // has token
    if (to.path === "/login") {
      next({ path: "/certification" });
      NProgress.done();
    } else {
      if (store.getters.roles.length === 0) {
        // 当前用户未获取完 user_info 信息, 发请求获取, 然后根据权限生成路由
        store.dispatch("getUserInfo").then(res => {
          // note: roles must be a array! such as: ['editor','develop']
          store.dispatch("generateRoutes", { ...res }).then(() => {
            // 根据权限动态添加可访问路由表
            router.addRoutes(store.getters.addRouters);
            next({ ...to, replace: true });
          });
        });
      } else {
        // 当前用户已获取完 user_info 信息
        if (hasPermission(store.getters.roles, to.meta.roles)) {
          // 有访问权限
          // 处理公会老板登录后的资质认证
          const isBoos = store.getters.roles.includes("boss");
          console.log("isBoos: ", isBoos);
          if (!isBoos) {
            next();
          } else {
            // 老板角色进来: 旧的公会经常跳过; 新的公会没有通过认证的, 一直卡在认证界面;
            const result = await getCertification();
            // Local Testting Set
            // result.state = 'fail';
            // result.data.status = 1; // -1: 认证失败 0: 待审核/未认证 1: 正常/认证通过
            // result.data.hasMsg = true;

            if (result.state === "fail") {
              Message.error(
                `${result.message}，无法登录` || "帐号异常，请联系管理员"
              );
              store.dispatch("logOut").then(() => {
                next("/login");
                NProgress.done();
              });
            } else if (result.state === "ok") {
              if (to.path === "/certification") {
                // certification page
                if (result.data.status === 1) {
                  // 资质认证页: 正常/认证通过状态 =>> 跳首页
                  console.log("资质认证页: 正常/认证通过状态 =>> 跳首页");
                  next({ path: "/", replace: true });
                } else if (result.data.status === 5) {
                  // 资质认证页: 待缴纳保证金状态 =>> 跳API接口支付二维码页面
                  console.log(
                    "资质认证页: 待缴纳保证金状态 =>> 跳API接口支付二维码页面"
                  );
                  const data = {
                    platformId: result.data.platformId || "",
                    appId: result.data.appId || "",
                    guildId: accountInfo.guildId,
                    userId: accountInfo.userId,
                    money: result.data.bailMoney
                  };
                  const url = `${
                    process.env.VUE_APP_PAYAPI_URL
                  }/Api/alipayGuildCash.do`;
                  console.log(data, url, "api-url");
                  http.get2(url, data).then(res => {
                    console.log(res);
                    if (res.state == 1) {
                      window["sessionStorage"].setItem(
                        "payChannelData",
                        res.payChannelData
                      );
                      next();
                    }
                  });
                } else {
                  // 资质认证页: 非正常/认证通过状态 =>> next
                  next();
                }
              } else if (to.meta.auth) {
                // need auth page
                if (result.data.status === 1) {
                  next();
                } else if (result.data.status === 2) {
                  store.dispatch("logOut").then(() => {
                    next("/login");
                    NProgress.done();
                  });
                } else if (result.data.status === 3) {
                  store.dispatch("logOut").then(() => {
                    next("/login");
                    NProgress.done();
                  });
                } else if (result.data.status === 4) {
                  store.dispatch("logOut").then(() => {
                    next("/login");
                    NProgress.done();
                  });
                } else {
                  next({ path: "/certification", replace: true });
                }
              } else {
                next();
              }
            }
          }
        } else {
          // 无访问权限
          next({ path: "/401", replace: true, query: { noGoBack: true } });
        }
      }
    }
  } else {
    const matchArr = constantRouterMap.filter(item => item.path === to.path);

    // has no token
    if (to.path === "/certification") {
      next({ path: "/login", replace: true });
    } else if (matchArr.length > 0) {
      // 在免登录白名单，直接进入
      next();
    } else {
      // 需要权限, 重定向到登录页
      const redirectUrl = encodeURIComponent(to.path);
      next(`/login?redirect=${redirectUrl}`);
      NProgress.done();
    }
  }
});

/**
 * 二级权限验证
 */
router.beforeEach(async (to, from, next) => {
  if (to.meta.checkAdmin) {
    const { code, msg } = await store.dispatch("checkAdmin");
    switch (code) {
      case 0:
        next();
        break;
      case 1:
        break;
      case 2:
        next();
        break;
      case 3:
        next({ path: "/personal/password" });
        break;
      case 4:
        break;
    }
  } else {
    next();
  }
});

router.afterEach(() => {
  NProgress.done();
});
