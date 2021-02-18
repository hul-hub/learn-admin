import Layout from "../../../views/layout";
const importComp = require("../../_import_comp");

// 盒子管理
export default {
  path: "/boxManagement",
  component: Layout,
  meta: {
    auth: true,
    roles: ["adventStatus"],
    title: "盒子管理"
  },
  children: [
    {
      path: "index",
      name: "boxManagementIndex",
      component: importComp("boxManagement/index"),
      meta: {
        auth: true,
        roles: ["adventStatus"],
        title: "盒子管理"
      }
    }
    // {
    //   path: "boxPromotion",
    //   name: "boxPromotionIndex",
    //   component: importComp("boxManagement/boxPromotion"),
    //   hidden: true,
    //   meta: {
    //     auth: true,
    //     roles: ["boss"],
    //     title: "盒子推广"
    //   }
    // }
  ]
};
