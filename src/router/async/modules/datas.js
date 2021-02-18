import Layout from "../../../views/layout";
import LayoutEmpty from "../../../views/layoutEmpty";
import LayoutFull from "../../../views/layoutFull/";
const importComp = require("../../_import_comp");

// 数据中心
export default {
  path: "/datas",
  name: "Datas",
  component: Layout,
  redirect: "/datas/daily",
  alwaysShow: true,
  meta: {
    auth: true,
    title: "数据中心",
    icon: "datas",
    roles: ["admin", "boss", "leader", "seoer"]
  },
  children: [
    {
      path: "daily",
      name: "DatasDaily",
      component: importComp("datas/daily"),
      meta: {
        auth: true,
        title: "每日渠道数据统计",
        noCache: true,
        roles: ["admin", "boss", "leader", "seoer"]
      }
    },
    {
      path: "leader",
      name: "DatasLeader",
      component: importComp("datas/leader"),
      meta: {
        auth: true,
        title: "主渠道数据汇总",
        noCache: true,
        roles: ["admin", "boss"]
      }
    },
    {
      path: "seoer",
      name: "DatasSeoer",
      component: importComp("datas/seoer"),
      meta: {
        auth: true,
        title: "子渠道数据汇总",
        noCache: true,
        roles: ["admin", "boss", "leader"]
      }
    },
    {
      path: "game",
      name: "DatasGame",
      component: importComp("datas/game"),
      meta: {
        auth: true,
        title: "游戏推广数据汇总",
        noCache: true,
        roles: ["admin", "boss", "leader", "seoer"]
      }
    }
  ]
};
