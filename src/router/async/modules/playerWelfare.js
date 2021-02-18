import Layout from "../../../views/layout";
import LayoutEmpty from "../../../views/layoutEmpty";
import LayoutFull from "../../../views/layoutFull/";
const importComp = require("../../_import_comp");

// 常用工具
export default {
  path: "/playerWelfare",
  name: "playerWelfare",
  component: Layout,
  redirect: "/playerWelfare/level",
  alwaysShow: true,
  meta: {
    auth: true,
    roles: ["admin", "giftPutOutAuth"],
    title: "玩家福利管理",
    icon: "playerWelfare"
  },
  children: [
    {
      path: "level",
      name: "playerWelfareLevel",
      component: importComp("playerWelfare/level"),
      meta: {
        auth: true,
        roles: ["admin", "giftPutOutAuth"],
        title: "等级福利列表"
      }
    },
    {
      path: "single",
      name: "playerWelfareSingle",
      component: importComp("playerWelfare/single"),
      meta: {
        auth: true,
        roles: ["admin", "giftPutOutAuth"],
        title: "单笔福利列表"
      }
    },
    {
      path: "oneDay",
      name: "playerWelfareOneDay",
      component: importComp("playerWelfare/oneDay"),
      meta: {
        auth: true,
        roles: ["admin", "giftPutOutAuth"],
        title: "单日累充福利"
      }
    },
    {
      path: "cumulative",
      name: "playerWelfareCumulative",
      component: importComp("playerWelfare/cumulative"),
      meta: {
        auth: true,
        roles: ["admin", "giftPutOutAuth"],
        title: "累计累充福利"
      }
    },
    {
      path: "daily",
      name: "playerWelfareDaily",
      component: importComp("playerWelfare/daily"),
      meta: {
        auth: true,
        roles: ["admin", "giftPutOutAuth"],
        title: "每日福利列表"
      }
    },
    {
      path: "roles",
      name: "playerWelfareRoles",
      component: importComp("playerWelfare/roles"),
      meta: {
        auth: true,
        roles: ["admin", "boss"],
        title: "员工授权"
      }
    }
  ]
};
