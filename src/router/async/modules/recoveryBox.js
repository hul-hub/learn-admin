import Layout from "../../../views/layout";
import LayoutEmpty from "../../../views/layoutEmpty";
import LayoutFull from "../../../views/layoutFull/";
const importComp = require("../../_import_comp");

// 回收箱
export default {
  path: "/recoveryBox",
  name: "recoveryBox",
  component: Layout,
  redirect: "/recoveryBox/financialStatement",
  alwaysShow: true,
  meta: {
    auth: true,
    title: "回收箱",
    icon: "finance",
    roles: ["admin", "boss", "leader", "seoer"]
  },
  children: [
    {
      path: "internalTradeAssociationManagement",
      name: "recoveryBoxInternalTradeAssociationManagement",
      component: importComp("recoveryBox/internalTradeAssociationManagement"),
      meta: {
        auth: true,
        title: "内-渠道提现管理",
        noCache: true,
        roles: ["admin", "boss", "leader", "seoer"]
      }
    },
    {
      path: "publiccashCentre",
      name: "recoveryBoxPubliccashCentre",
      component: importComp("recoveryBox/publiccashCentre"),
      meta: {
        auth: true,
        title: "公-提现中心",
        noCache: true,
        roles: ["admin", "boss", "leader", "seoer"]
      }
    }
  ]
};
