import Layout from "../../views/layout";
import LayoutEmpty from "../../views/layoutEmpty";
import LayoutFull from "../index";

const importComp = require("../_import_comp");

// 静态路由. 不需要权限检测
export default [
  {
    path: "",
    component: Layout,
    redirect: "dashboard",
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: importComp("dashboard/index"),
        meta: {
          auth: true,
          roles: ["admin", "boss", "leader", "seoer"],
          title: "首页",
          icon: "dashboard",
          noCache: true
        }
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: importComp("login/index"),
    hidden: true
  },
  {
    path: "/register",
    name: "Register",
    component: importComp("register/index"),
    hidden: true
  },
  {
    path: "/404",
    name: "NotFound",
    component: importComp("errorPage/404"),
    hidden: true
  },
  {
    path: "/401",
    name: "NoAuthority",
    component: importComp("errorPage/401"),
    hidden: true
  },
  {
    path: "/agreement",
    name: "Agreement",
    component: importComp("agreement/game"),
    hidden: true
  },
  {
    path: "",
    component: LayoutEmpty,
    redirect: "certification",
    hidden: true,
    children: [
      // 资质认证
      {
        path: "/certification",
        component: importComp("certification/index"),
        hidden: true,
        meta: {
          auth: true,
          roles: ["admin", "boss"],
          title: "资质认证"
        }
      }
    ]
  }
];
