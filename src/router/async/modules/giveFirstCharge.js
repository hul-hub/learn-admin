import Layout from "../../../views/layout";
import LayoutEmpty from "../../../views/layoutEmpty";
import LayoutFull from "../../../views/layoutFull/";
const importComp = require("../../_import_comp");

// 赠送首充
export default {
  path: "/giveFirstCharge",
  name: "AidGiveFirstCharge",
  redirect: "/giveFirstCharge/index",
  component: Layout,
  alwaysShow: true,
  meta: {
    auth: true,
    title: "赠送首充",
    noCache: true,
    roles: ["admin", "boss", "leader", "support"]
  },
  children: [
    {
      path: "index",
      name: "AidGiveFirstChargeIndex",
      component: importComp("aid/giveFirstCharge/list"),
      meta: {
        auth: true,
        title: "赠送记录",
        noCache: true,
        roles: ["admin", "boss", "leader", "support"]
      }
    },
    {
      path: "give",
      name: "AidGiveFirstChargeGive",
      component: importComp("aid/giveFirstCharge/give"),
      meta: {
        auth: true,
        title: "赠送首充",
        noCache: true,
        roles: ["admin", "boss", "leader", "support"]
      }
    }
  ]
};
