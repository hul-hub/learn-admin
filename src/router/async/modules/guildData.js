import Layout from "../../../views/layout";
import LayoutEmpty from "../../../views/layoutEmpty";
import LayoutFull from "../../../views/layoutFull/";
const importComp = require("../../_import_comp");

export default {
  path: "/guildData",
  name: "guildData",
  component: Layout,
  redirect: "/guildData/userDayBasics/index",
  alwaysShow: true,
  meta: {
    auth: true,
    roles: ["showGuildDataReport"],
    title: "公会数据报表",
    icon: "guildData"
  },
  children: [
    {
      path: "userDayBasics/index",
      name: "userDayBasics",
      component: importComp("guildData/userDayBasics/index"),
      meta: {
        auth: true,
        roles: ["showGuildDataReport"],
        title: "公会用户日基础报表",
        checkAdmin: true
      }
    },
    {
      path: "userDayNewlyAddQuality/index",
      name: "userDayNewlyAddQuality",
      component: importComp("guildData/userDayNewlyAddQuality/index"),
      meta: {
        auth: true,
        roles: ["showGuildDataReport"],
        title: "公会用户日新增质量报表",
        checkAdmin: true
      }
    },
    {
      path: "PromoterDayQuailty/index",
      name: "PromoterDayQuailty",
      component: importComp("guildData/PromoterDayQuailty/index"),
      meta: {
        auth: true,
        roles: ["showGuildDataReport"],
        title: "子渠道日质量报表",
        checkAdmin: true
      }
    },
    {
      path: "anchorIncomeTop/index",
      name: "anchorIncomeTop",
      component: importComp("guildData/anchorIncomeTop/index"),
      meta: {
        auth: true,
        roles: ["showGuildDataReport"],
        title: "主播收入top榜",
        checkAdmin: true
      }
    },
    {
      path: "channelIncomeTop/index",
      name: "channelIncomeTop",
      component: importComp("guildData/channelIncomeTop/index"),
      meta: {
        auth: true,
        roles: ["showGuildDataReport"],
        title: "频道收入top榜",
        checkAdmin: true
      }
    },
    {
      path: "basicsRevenue/index",
      name: "basicsRevenue",
      component: importComp("guildData/basicsRevenue/index"),
      meta: {
        auth: true,
        roles: ["showGuildDataReport"],
        title: "基础营收表",
        checkAdmin: true
      }
    }
  ]
};
