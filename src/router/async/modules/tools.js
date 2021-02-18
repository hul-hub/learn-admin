import Layout from "../../../views/layout";
import LayoutEmpty from "../../../views/layoutEmpty";
import LayoutFull from "../../../views/layoutFull/";
const importComp = require("../../_import_comp");

// 常用工具
export default {
  path: "/tools",
  name: "tools",
  component: Layout,
  redirect: "/tools/productInsight/index",
  alwaysShow: true,
  meta: {
    auth: true,
    roles: ["admin", "boss", "allRole"],
    title: "常用工具",
    icon: "tools"
  },
  children: [
    {
      path: "changeBind",
      name: "toolsChangeBind",
      component: importComp("tools/changeBind"),
      meta: {
        auth: true,
        roles: ["admin", "boss"],
        title: "改绑玩家归属"
      }
    },
    {
      path: "guildStyle",
      name: "guildStyle",
      component: importComp("tools/guildStyle"),
      meta: {
        auth: true,
        roles: ["admin", "enablePrivate"],
        title: "自定义平台风格"
      }
    },
    {
      path: "productInsight/index",
      name: "toolsProductInsightIndex",
      component: importComp("tools/productInsight/index"),
      meta: {
        auth: true,
        roles: ["admin", "productWatch"],
        title: "产品洞察"
      }
    },
    {
      path: "/tools/seoerAuthorization",
      name: "seoerAuthorization",
      component: importComp("tools/seoerAuthorization"),
      hidden: true,
      meta: {
        auth: true,
        roles: ["admin", "productWatch"],
        title: "子渠道授权"
      }
    },
    {
      path: "guildGift",
      name: "toolsGuildGift",
      component: importComp("tools/guildGift"),
      meta: {
        auth: true,
        roles: ["admin", "giftPutOutAuth"],
        title: "发放福利礼包"
      }
    }
  ]
};
