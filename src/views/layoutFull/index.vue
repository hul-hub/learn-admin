<template>
  <div class="app-layout app-layout-full" :class="classObj">
    <app-header
      :routes="firstLevelRouters"
      :account="accountFormat"
      @openSidebar="handleOpenSidebar"
    />
    <div class="app-layout-body">
      <app-main class="app-layout-main"></app-main>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getAccountFromStorage } from "@/utils/auth.js";
import { AppHeader, Navbar, Sidebar, AppMain, TagsView } from "./components";

// 简体窗口缩小的 mixin
import ResizeMixin from "./mixin/ResizeHandler";

export default {
  name: "layout",
  components: {
    AppHeader,
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  data() {
    return {
      firstLevelRouters: [],
      currentRouteTree: [],
      sidebarToggle: false
    };
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapGetters(["permission_routers", "account"]),
    accountFormat() {
      let account = getAccountFromStorage();
      if (!account.userId) {
        account = { ...this.account };
      }
      return account;
    },
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    classObj() {
      return {
        // hideSidebar: !this.sidebar.opened,
        "without-animation": this.sidebar.withoutAnimation,
        mobile: this.device === "mobile",
        "open-sidebar": this.sidebarToggle
      };
    }
  },
  watch: {
    $route() {
      this.currentRouteTree = this.getCurrentRouteTree(this.$route.matched);

      if (this.device !== "desktop") {
        this.sidebarToggle = false;
      }
    },
    permission_routers() {
      // this.firstLevelRouters = this.getFirstLevelRoutes(this.permission_routers);
    }
  },
  created() {
    // this.firstLevelRouters = this.getFirstLevelRoutes(this.permission_routers);
    // this.currentRouteTree = this.getCurrentRouteTree(this.$route.matched);
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("closeSideBar", { withoutAnimation: false });
    },
    handleOpenSidebar() {
      this.sidebarToggle = !this.sidebarToggle;
    },
    /*
     * 获取第一层的路由
     *
     * @params {any} baseRouters 整颗路由树
     */
    getFirstLevelRoutes(baseRouters) {
      const routers = baseRouters.filter(route => !route.hidden);

      const firstRouter = routers.map(route => {
        // 不存在 meta
        if (!route.meta) {
          route.meta = {};
        }

        // 不存在 titlte, 获取第一项子路由的 meta
        if (!route.meta.title || route.meta.title === "") {
          route.meta = route.children[0].meta;
        }

        return route;
      });
      return firstRouter;
    },
    /*
     * 获取当前路由根节点下的整个分支树
     *
     * @params {any} routeInfo matched匹配当前路由的信息
     */
    getCurrentRouteTree(routeInfo) {
      const routePath = routeInfo[0].path;
      const currentRouteTree = this.permission_routers.filter(
        route => route.path === routePath
      );
      return currentRouteTree;
    }
  }
};
</script>

<style lang="scss">
.app-layout-full {
  .app-layout-body {
    padding-left: 0 !important;
    max-width: 1020px;
    margin: 0 auto;
  }

  &.mobile {
    .app-layout-header .header-left {
      display: none;
    }
    .app-layout-header .logo {
      display: block;
      text-align: left;

      h1 {
        margin-left: 0;
      }
    }
  }
}
</style>
