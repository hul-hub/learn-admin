<template>
  <div class="app-layout" :class="classObj">
    <app-header
      :routes="firstLevelRouters"
      :account="accountFormat"
      @openSidebar="handleOpenSidebar"
    />
    <sidebar
      v-if="!platForm"
      style="width: 230px"
      class="app-layout-sidebar"
      :routes="permission_routers"
    ></sidebar>
    <div class="app-layout-sidebar-overlay" @click="handleOpenSidebar"></div>
    <div
      :style="{ paddingLeft: platForm === '666' ? '0' : '' }"
      class="app-layout-body"
    >
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
      sidebarToggle: false,
      platForm: undefined
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
      console.log(routeInfo, "www");
      return currentRouteTree;
    }
  }
};
</script>

<style lang="scss">
@import "src/styles/mixin.scss";

.app-layout {
  @include clearfix;

  position: relative;
  width: 100%;
  height: 100%;
  background-color: #edeef0;

  &-body {
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    background: #edeef0;
    padding: 0 0 0 230px;
  }

  &-sidebar {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 100%;
    font-size: 0px;
    z-index: 1001;
    overflow: hidden;

    border-right: 1px solid #bdbdbd;
    background: #fff;
    transition: width 0.28s, transform 0.28s;

    &-overlay {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba($color: #000, $alpha: 0.6);
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.25s;
    }
  }

  &-main {
    padding: 20px;
    min-height: 100%;
  }

  // 移动端样式
  &.mobile {
    .app-layout-body {
      padding-left: 0;
    }

    .app-layout-sidebar {
      transform: translateX(-100%);
    }

    // 展开
    &.open-sidebar {
      .app-layout-sidebar {
        transform: translateX(0);
        border-right: none;
      }
      .app-layout-sidebar-overlay {
        opacity: 1;
        visibility: visible;
      }
    }
  }
}
</style>
