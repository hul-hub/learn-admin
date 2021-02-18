import Layout from "../../../views/layout";
import LayoutEmpty from "../../../views/layoutEmpty";
import LayoutFull from "../../../views/layoutFull/";
const importComp = require("../../_import_comp");

// 财务结算
export default {
  path: "/finance",
  name: "finance",
  component: Layout,
  redirect: "/finance/financialStatement",
  alwaysShow: true,
  meta: {
    auth: true,
    title: "财务结算表",
    roles: ["admin", "isShowGuildBalance"]
  },
  children: [
    {
      path: "financialStatement",
      name: "financeFinancialStatement",
      component: importComp("finance/financialStatement"),
      meta: {
        auth: true,
        title: "财务结算单",
        noCache: true,
        roles: ["admin", "boss"],
        checkAdmin: true
      }
    },
    {
      path: "gameProceeds",
      name: "gameProceeds",
      component: importComp("finance/gameProceeds"),
      meta: {
        auth: true,
        title: "游戏收入对账表",
        noCache: true,
        roles: ["admin", "boss"],
        checkAdmin: true
      }
    },
    {
      path: "deductionsRecord",
      name: "deductionsRecord",
      component: importComp("finance/deductionsRecord"),
      meta: {
        auth: true,
        title: "补款扣款记录",
        noCache: true,
        roles: ["admin", "boss"],
        checkAdmin: true
      }
    }
  ]
};
