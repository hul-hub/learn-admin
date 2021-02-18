import Layout from "../../../views/layout";
const importComp = require("../../_import_comp");
import store from "@/store";
// 游戏扶持
export default {
  path: "/aid",
  name: "Aid",
  component: Layout,
  redirect: "/aid/account",
  alwaysShow: true,
  meta: {
    auth: true,
    title: "游戏资源",
    icon: "aid",
    roles: ["admin", "support"]
  },
  children: [
    {
      path: "/aid/accountManage",
      name: "AidAccountManage",
      redirect: "/aid/accountManage/index",
      component: importComp("aid/accountManage/index"),
      meta: {
        auth: true,
        title: "资源号管理",
        noCache: true,
        roles: ["admin", "support"]
      },
      children: [
        {
          path: "index",
          name: "AidAccountManageIndex",
          component: importComp("aid/accountManage/index"),
          meta: {
            auth: true,
            title: "资源号管理",
            noCache: true,
            roles: ["admin", "leader", "support"],
            crumbHidden: true
          }
        },
        {
          path: "password/:id",
          name: "AidAccountManagePassword",
          component: importComp("aid/accountManage/password"),
          hidden: true,
          meta: {
            auth: true,
            title: "重置密码",
            noCache: true,
            roles: ["admin", "leader", "support"]
          }
        }
      ]
    },
    {
      path: "apply",
      name: "AidApplyList",
      component: importComp("aid/apply/list"),
      meta: {
        auth: true,
        title: "申请游戏资源",
        noCache: true,
        roles: ["admin", "support"]
      }
    },
    {
      path: "applyRecord",
      name: "AidAidApplyRecord",
      component: importComp("aid/apply/record"),
      meta: {
        auth: true,
        title: "我的申请记录",
        noCache: true,
        roles: ["admin", "support"]
      }
    },
    {
      path: "statistics",
      name: "AidStatistics",
      component: importComp("aid/statistics/index"),
      hidden:
        store.getters.account.isGuildBoss === 0 &&
        store.getters.account.userType === 3,
      meta: {
        auth: true,
        title: "资源统计表",
        noCache: true,
        roles: ["admin", "support"]
      }
    },
    // {
    //   path: 'auth/index',
    //   name: 'AidAuthIndex',
    //   component: importComp('aid/auth/list'),
    //   meta: {
    //     auth: true,
    //     title: '扶持权限管理',
    //     noCache: true,
    //     roles: ['admin', 'support'],
    //   },
    // },
    {
      path: "auth/edit/:id",
      name: "AidAuthEdit",
      component: importComp("aid/auth/edit"),
      hidden: true,
      meta: {
        auth: true,
        title: "编辑资源号权限管理",
        noCache: true,
        roles: ["admin", "support"]
      }
    }
  ]
};
