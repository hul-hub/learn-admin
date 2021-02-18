import Layout from "../../../views/layout";
import LayoutEmpty from "../../../views/layoutEmpty";
import LayoutFull from "../../../views/layoutFull/";
const importComp = require("../../_import_comp");

// 数据查询
export default {
  path: "/dataSearch",
  name: "dataSearch",
  component: Layout,
  redirect: "/dataSearch/oldRegister",
  alwaysShow: true,
  meta: {
    auth: true,
    title: "数据查询",
    icon: "dataSearch",
    roles: ["admin", "boss", "leader", "seoer"]
  },
  children: [
    {
      path: "oldRegister",
      name: "oldDataSearchRegister",
      component: importComp("dataSearch/oldRegister"),
      meta: {
        auth: true,
        title: "账号注册信息",
        noCache: true,
        roles: ["admin", "boss", "leader", "seoer"]
      }
    },
    {
      path: "register",
      name: "DataSearchRegister",
      component: importComp("dataSearch/register"),
      meta: {
        auth: true,
        title: "玩家游戏信息",
        noCache: true,
        roles: ["admin", "boss", "leader", "seoer"]
      }
    },
    {
      path: "player",
      name: "DataSearchPlayer",
      component: importComp("dataSearch/player"),
      meta: {
        auth: true,
        title: "玩家角色信息",
        noCache: true,
        roles: ["admin", "boss", "leader", "seoer"]
      }
    },
    {
      path: "recharge",
      name: "DataSearchRecharge",
      component: importComp("dataSearch/recharge"),
      meta: {
        auth: true,
        title: "玩家充值记录",
        noCache: true,
        roles: ["admin", "isShowGuildConsumeMoney"]
      }
    },
    {
      path: "gameStatic",
      name: "DataSearchGameStatic",
      component: importComp("dataSearch/gameStatic"),
      meta: {
        auth: true,
        title: "游戏分区数据汇总",
        noCache: true,
        roles: ["admin", "boss", "leader", "seoer"]
      }
    }
    // {
    //   path: 'dailyStatic',
    //   name: 'DataSearchDailyStatic',
    //   component: importComp('dataSearch/dailyStatic'),
    //   meta: {
    //     auth: true,
    //     title: '每日直播收入统计',
    //     noCache: true,
    //     roles: ['admin', 'boss'],
    //   },
    // },
  ]
};
