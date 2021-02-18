import Layout from "../../../views/layout";
import LayoutEmpty from "../../../views/layoutEmpty";
import LayoutFull from "../../../views/layoutFull/";
const importComp = require("../../_import_comp");

// 游戏管理
export default {
  name: "gameManage",
  path: "/gameManage",
  component: Layout,
  redirect: "/gameManage/link",
  alwaysShow: true,
  meta: {
    auth: true,
    title: "游戏管理",
    icon: "member",
    roles: ["admin", "boss", "leader", "seoer"]
  },
  children: [
    {
      path: "link",
      name: "GameManageLink",
      component: importComp("gameManage/link"),
      meta: {
        auth: true,
        title: "游戏推广链接",
        noCache: true,
        roles: ["admin", "boss", "leader", "seoer"]
      }
    },
    {
      path: "/gameManage/admission",
      name: "admission",
      component: LayoutEmpty,
      redirect: "/gameManage/admission/index",
      meta: {
        auth: true,
        title: "游戏入驻管理",
        noCache: true,
        roles: ["admin", "boss"]
        // checkAdmin: true
      },
      children: [
        {
          path: "index",
          name: "gameManageAdmissionIndex",
          component: importComp("gameManage/admission/index"),
          meta: {
            auth: true,
            title: "游戏入驻管理",
            noCache: true,
            crumbHidden: true,
            roles: ["admin", "boss"]
            // checkAdmin: true
          }
        },
        {
          path: "edit",
          name: "gameManageAdmissionEdit",
          component: importComp("gameManage/admission/edit"),
          hidden: true,
          meta: {
            auth: true,
            title: "编辑子渠道",
            noCache: true,
            crumbHidden: true,
            roles: ["admin", "boss"]
          }
        }
      ]
    },
    {
      path: "/gameManage/mygame",
      name: "mygame",
      component: LayoutEmpty,
      redirect: "/gameManage/mygame/index",
      meta: {
        auth: true,
        title: "我的游戏",
        noCache: true,
        roles: ["admin", "boss", "leader", "seoer"]
      },
      children: [
        {
          path: "index",
          name: "gameManageMygameIndex",
          component: importComp("gameManage/mygame/index"),
          meta: {
            auth: true,
            title: "我的游戏",
            noCache: true,
            crumbHidden: true,
            roles: ["admin", "boss", "leader", "seoer"]
          }
        }
      ]
    },
    {
      path: "/gameManage/Mixed",
      name: "mixed",
      component: LayoutEmpty,
      redirect: "/gameManage/Mixed/index",
      hidden: true,
      meta: {
        auth: true,
        title: "通服点位表",
        noCache: true,
        roles: ["isShowServerRatio"],
        checkAdmin: true
      },
      children: [
        {
          path: "index",
          name: "gameManageMixedIndex",
          component: importComp("gameManage/Mixed/index"),
          meta: {
            auth: true,
            title: "通服点位表",
            noCache: true,
            crumbHidden: true,
            roles: ["isShowServerRatio"],
            checkAdmin: true
          }
        }
      ]
    },
    {
      path: "/gameManage/advertisingList",
      name: "advertisingList",
      component: LayoutEmpty,
      redirect: "/gameManage/advertisingList/index",
      meta: {
        auth: true,
        title: "广告投放列表",
        noCache: true,
        roles: ["admin", "posterPutInIsEnable"]
      },
      children: [
        {
          path: "advertisingList/index",
          name: "advertisingListIndex",
          component: importComp("gameManage/advertisingList/index"),
          meta: {
            auth: true,
            title: "广告投放列表",
            noCache: true,
            crumbHidden: true,
            roles: ["admin", "posterPutInIsEnable"]
          }
        }
      ]
    },
    {
      path: "/gameManage/monitoringList",
      name: "monitoringList",
      component: LayoutEmpty,
      redirect: "/gameManage/monitoringList/index",
      meta: {
        auth: true,
        title: "广告监���报表",
        noCache: true,
        roles: ["admin", "posterPutInIsEnable"]
      },
      children: [
        {
          path: "monitoringList/index",
          name: "monitoringListIndex",
          component: importComp("gameManage/monitoringList/index"),
          meta: {
            auth: true,
            title: "广告监测报表",
            noCache: true,
            crumbHidden: true,
            roles: ["admin", "posterPutInIsEnable"]
          }
        }
      ]
    }

    // {
    //   path: "/gameManage/mainPromotionGame",
    //   name: "mainPromotionGame",
    //   component: LayoutEmpty,
    //   redirect: "/gameManage/mainPromotionGame/index",
    //   meta: {
    //     auth: true,
    //     title: "主推游戏",
    //     noCache: true,
    //     roles: ["admin", "boss", "leader"]
    //   },
    //   children: [
    //     {
    //       path: "index",
    //       name: "mainPromotionGameIndex",
    //       component: importComp("gameManage/mainPromotionGame/index"),
    //       meta: {
    //         auth: true,
    //         title: "主推游戏",
    //         noCache: true,
    //         crumbHidden: true,
    //         roles: ["admin", "boss", "leader"]
    //       }
    //     }
    //   ]
    // }
  ]
};
