import Layout from "../../../views/layout";
import LayoutEmpty from "../../../views/layoutEmpty";
import LayoutFull from "../../../views/layoutFull/";
const importComp = require("../../_import_comp");

// 小程序推广页
export default {
  path: "/catfun",
  name: "catfun",
  component: Layout,
  redirect: "/catfun/index",
  meta: {
    auth: true,
    roles: ["admin", "boss", "leader", "seoer"],
    title: "喵乐斗",
    icon: "catfun"
  },
  children: [
    {
      path: "index",
      name: "catfunIndex",
      component: importComp("catfun/index"),
      meta: {
        auth: true,
        roles: ["admin", "boss", "leader", "seoer"],
        title: "获取小程序推广码"
      }
    },
    {
      path: "promoSum",
      name: "catfunPromoPromoSum",
      component: importComp("catfun/promoSum"),
      meta: {
        auth: true,
        roles: ["admin", "boss", "leader", "seoer"],
        title: "推广业绩汇总"
      }
    },
    {
      path: "promoTeamSum",
      name: "catfunPromoPromoTeamSum",
      component: importComp("catfun/promoTeamSum"),
      meta: {
        auth: true,
        roles: ["admin", "boss", "leader", "seoer"],
        title: "主渠道数据汇总"
      }
    },
    {
      path: "promoPersonSum",
      name: "catfunPromoPersonSum",
      component: importComp("catfun/promoPersonSum"),
      meta: {
        auth: true,
        roles: ["admin", "boss", "leader", "seoer"],
        title: "子渠道数据汇总"
      }
    },
    {
      path: "promoDataSum",
      name: "catfunPromoDataSum",
      component: importComp("catfun/promoDataSum"),
      meta: {
        auth: true,
        roles: ["admin", "boss", "leader", "seoer"],
        title: "小程序推广数据汇总"
      }
    }
  ]
};
