import Layout from "../../../views/layout";
import LayoutEmpty from "../../../views/layoutEmpty";
import LayoutFull from "../../../views/layoutFull/";
const importComp = require("../../_import_comp");

// 个人中心
export default {
  path: "/personal",
  name: "personal",
  component: Layout,
  redirect: "/personal/index",
  meta: {
    auth: true,
    roles: ["admin", "boss", "leader", "seoer"],
    title: "个人中心",
    icon: "personal"
  },
  children: [
    {
      path: "index",
      name: "personalIndex",
      component: importComp("personal/index"),
      meta: {
        auth: true,
        roles: ["admin", "isShowPersonalCenter"],
        title: "修改公会资料"
      }
    },
    {
      path: "password",
      name: "personalPassword",
      component: importComp("personal/password"),
      meta: {
        auth: true,
        roles: ["admin", "boss", "leader", "seoer"],
        title: "修改密码"
      }
    },
    {
      path: "certification",
      component: importComp("certification/index"),
      meta: {
        auth: true,
        roles: ["admin", "isShowPersonalCenter"],
        title: "公会注册资料"
      }
    },
    {
      path: "rules",
      name: "personalRules",
      component: importComp("personal/rules"),
      meta: {
        auth: true,
        roles: ["admin", "isShowPersonalCenter"],
        title: "平台规则"
      }
    }
  ]
};
