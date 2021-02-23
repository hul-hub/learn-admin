<template>
  <el-menu
    :mode="mode"
    :show-timeout="200"
    :default-active="$route.path"
    unique-opened
    background-color="#fff"
    text-color="#334451"
    active-text-color="#65a0df"
    style="height: 100%;overflow-y: scroll"
  >
    <!-- <sidebar-item :routes="permission_routers"></sidebar-item> -->
    <sidebar-item :floatLeft="floatLeft" :routes="routes"></sidebar-item>
  </el-menu>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";

export default {
  props: {
    routes: {
      type: Array,
      required: true
    },
    mode: {
      type: String,
      default: "vertical"
    },
    floatLeft: {
      type: Boolean,
      default: false
    }
  },
  components: { SidebarItem },
  computed: {
    ...mapGetters(["permission_routers", "sidebar"]),
    isCollapse() {
      return true;
      // return !this.sidebar.opened;
    }
  }
};
</script>

<style lang="scss">
.el-menu {
  border-right: none;
}
.el-menu-item,
.el-submenu__title {
  height: 45px;
  line-height: 45px;

  &:hover {
    background-color: transparent !important;
  }
}
.el-submenu__title,
.submenu-title-no-dropdown {
  font-weight: bold;
}
.el-submenu .el-menu-item {
  height: 36px;
  line-height: 36px;

  &:hover {
    color: #65a0df !important;
    background-color: transparent !important;
  }

  &.is-active {
    color: #334451 !important;
    background: #e0ecf9 !important;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 3px;
      background-color: #65a0df;
    }
  }
}
.el-submenu__title i {
  color: #333;
  font-size: 16px;
}
// .app-layout-sidebar {
//   width: 1300px;
// }
</style>
