import Layout from "../../../views/layout";
import LayoutEmpty from "../../../views/layoutEmpty";
const importComp = require("../../_import_comp");

// 会员管理
export default {
  name: "member",
  path: "/member",
  component: Layout,
  redirect: "/member/memberList/index",
  alwaysShow: true,
  meta: {
    auth: true,
    title: "渠道管理",
    icon: "member",
    roles: ["admin", "boss", "leader"]
  },
  children: [
    {
      path: "/member/leader",
      name: "leader",
      component: LayoutEmpty,
      redirect: "/member/leader/index",
      meta: {
        auth: true,
        title: "主渠道列表",
        noCache: true,
        roles: ["admin", "boss"]
      },
      children: [
        {
          path: "index",
          name: "leaderIndex",
          component: importComp("member/leader/index"),
          meta: {
            auth: true,
            title: "主渠道列表",
            noCache: true,
            crumbHidden: true,
            roles: ["admin", "boss"]
          }
        },
        {
          path: "create",
          name: "leaderCreate",
          component: importComp("member/leader/create"),
          hidden: true,
          meta: {
            auth: true,
            title: "添加",
            noCache: true,
            crumbHidden: true,
            roles: ["admin", "boss"]
          }
        },
        {
          path: "edit/:id",
          name: "leaderEdit",
          component: importComp("member/leader/edit"),
          hidden: true,
          meta: {
            auth: true,
            title: "编辑",
            noCache: true,
            crumbHidden: true,
            roles: ["admin", "boss"]
          }
        },
        {
          path: "password/:id",
          name: "leaderPassword",
          component: importComp("member/leader/password"),
          hidden: true,
          meta: {
            auth: true,
            title: "修改密码",
            noCache: true,
            crumbHidden: true,
            roles: ["admin", "boss"]
          }
        }
      ]
    },
    {
      path: "/member/promoters",
      name: "promoters",
      component: LayoutEmpty,
      redirect: "/member/promoters/index",
      meta: {
        auth: true,
        title: "子渠道列表",
        noCache: true,
        roles: ["admin", "boss", "leader"]
      },
      children: [
        {
          path: "index",
          name: "promotersIndex",
          component: importComp("member/promoters/index"),
          meta: {
            auth: true,
            title: "子渠道列表",
            noCache: true,
            crumbHidden: true,
            roles: ["admin", "boss", "leader"]
          }
        },
        {
          path: "create",
          name: "promotersCreate",
          component: importComp("member/promoters/create"),
          hidden: true,
          meta: {
            auth: true,
            title: "添加",
            noCache: true,
            crumbHidden: true,
            roles: ["admin", "boss", "leader"]
          }
        },
        {
          path: "edit/:id",
          name: "promotersEdit",
          component: importComp("member/promoters/edit"),
          hidden: true,
          meta: {
            auth: true,
            title: "编辑",
            noCache: true,
            crumbHidden: true,
            roles: ["admin", "boss", "leader"]
          }
        },
        {
          path: "password/:id",
          name: "promotersPassword",
          component: importComp("member/promoters/password"),
          hidden: true,
          meta: {
            auth: true,
            title: "修改密码",
            noCache: true,
            crumbHidden: true,
            roles: ["admin", "boss", "leader"]
          }
        }
      ]
    }
  ]
};
