import Layout from "../../../views/layout";
const importComp = require("../../_import_comp");

// 个人中心
export default {
  path: "/noticeBoard",
  component: Layout,
  meta: {
    auth: true,
    roles: ["boss"],
    title: "公示栏"
  },
  children: [
    {
      path: "index",
      name: "noticeBoard",
      component: importComp("personal/noticeBoard"),
      meta: {
        auth: true,
        roles: ["boss"],
        title: "公示栏"
      }
    }
  ]
};
