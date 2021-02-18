//整理后的index入口

import Vue from "vue";
import Router from "vue-router";
import constRouterMap from "./constant";
import asyncRouterMap from "./async";
import testRouters from "./test";

Vue.use(Router);
//
let constantRouterMap = constRouterMap;

// 非生产环境，会把测试路由添加到静态路由上
process.env.NODE_ENV !== "production" &&
  (constantRouterMap = [...constRouterMap, ...testRouters]);

export { constantRouterMap, asyncRouterMap };

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
