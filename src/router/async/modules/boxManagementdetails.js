import Layout from "../../../views/layout";
import LayoutEmpty from "../../../views/layoutEmpty";
const importComp = require("../../_import_comp");

// 盒子管理
export default {
  path: "/boxManagement",
  component: Layout,
  redirect: "/boxManagement/boxPromotion/index",
  alwaysShow: true,
  meta: {
    auth: true,
    roles: ["adventStatus2"],
    title: "盒子管理"
  },
  //
  children: [
    {
      path: "/boxManagement/boxPromotion",
      name: "boxPromotionIndex",
      component: LayoutEmpty,
      redirect: "/boxManagement/boxPromotion/boxPromotion",
      meta: {
        auth: true,
        noCache: true,
        roles: ["adventStatus2"],
        title: "盒子推广"
      },
      children: [
        {
          path: "boxPromotion",
          name: "boxPromotionIndex",
          component: importComp("boxManagement/boxPromotion/index"),
          meta: {
            auth: true,
            roles: ["adventStatus2"],
            title: "盒子推广"
          }
        },
        {
          path: "channelManagement",
          name: "channelManagement",
          component: importComp("boxManagement/boxPromotion/channelManagement"),
          hidden: true,
          meta: {
            auth: true,
            roles: ["boss"],
            title: "渠道管理"
          }
        }
      ]
    },
    {
      path: "advertising",
      name: "advertising",
      component: importComp("boxManagement/boxPromotion/advertising"),
      meta: {
        auth: true,
        roles: ["boss"],
        title: "广告配置"
      }
    },
    {
      path: "boxData",
      name: "boxData",
      component: importComp("boxManagement/boxPromotion/boxData"),
      meta: {
        auth: true,
        roles: ["adventStatus2"],
        title: "盒子数据"
      }
    }
  ]
};
