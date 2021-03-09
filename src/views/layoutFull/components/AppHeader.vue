<template>
  <section class="app-layout-header clearfix">
    <div class="header-left">
      <button class="header-button" @click="handleOpenSidebar">
        <!-- eslint-disable max-len -->
        <svg
          t="1527227540201"
          class="icon"
          style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="1024"
          data-spm-anchor-id="a313x.7781069.0.i0"
        >
          <path
            d="M192.037 287.953h640.124c17.673 0 32-14.327 32-32s-14.327-32-32-32H192.037c-17.673 0-32 14.327-32 32s14.327 32 32 32zM192.028 543.17h393.608c17.673 0 32-14.327 32-32s-14.327-32-32-32H192.028c-17.673 0-32 14.327-32 32s14.327 32 32 32zM832.161 735.802H192.037c-17.673 0-32 14.327-32 32s14.327 32 32 32h640.124c17.673 0 32-14.327 32-32s-14.327-32-32-32zM705.162 671.594l160-160-160-160z"
            fill=""
            p-id="1025"
          ></path>
        </svg>
      </button>
    </div>

    <div class="logo">
      <router-link :to="{ path: '/' }">
        <!-- eslint-disable max-len -->
        <img src="../../../assets/logo.png" alt="" />
        <h1>游戏推广平台</h1>
      </router-link>
    </div>

    <!-- <div class="header-nav">
      <router-link
        v-for="route in routes"
        :key="route.path"
        :to="{path: route.path || '/'}"
        :data-path="route.path || '/'"
      >
        {{route.meta ? route.meta.title : ''}}
      </router-link>
    </div> -->

    <div class="header-right">
      <el-dropdown
        class="avatar-container right-menu-item"
        trigger="hover"
        placement="bottom"
      >
        <div class="avatar-wrapper">
          <!-- eslint-disable max-len -->
          <span class="nickname">{{ showName }}</span>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown" placement="bottom-end">
          <!-- <el-dropdown-item>
            <router-link to="/personal/index">{{'个人中心'}}</router-link>
          </el-dropdown-item> -->
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">{{ "退出登录" }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="header-logout" @click="logout" title="退出">
        <svg class="icon-logout" viewBox="0 0 24 24">
          <path
            d="M9 20h-4c-0.6 0-1-0.4-1-1v-14c0-0.6 0.4-1 1-1h4c0.6 0 1-0.4 1-1s-0.4-1-1-1h-4c-1.7 0-3 1.3-3 3v14c0 1.7 1.3 3 3 3h4c0.6 0 1-0.4 1-1s-0.4-1-1-1z"
          ></path>
          <path
            d="M21.9 12.4c0.1-0.2 0.1-0.5 0-0.8-0.1-0.1-0.1-0.2-0.2-0.3l-5-5c-0.4-0.4-1-0.4-1.4 0s-0.4 1 0 1.4l3.3 3.3h-9.6c-0.6 0-1 0.4-1 1s0.4 1 1 1h9.6l-3.3 3.3c-0.4 0.4-0.4 1 0 1.4 0.2 0.2 0.5 0.3 0.7 0.3s0.5-0.1 0.7-0.3l5-5c0.1-0.1 0.2-0.2 0.2-0.3z"
          ></path>
        </svg>
        <span>退出</span>
      </div>
    </div>
  </section>
</template>

<script>
// @TODO: will fix bug 一级菜单输出如果redirect = 'noredirect' 时候, 路由的 path 会输出 '#/noredirect'
import { mapGetters } from "vuex";
export default {
  name: "AppHeader",
  props: {
    routes: {
      type: Array,
      required: true
    },
    account: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters(["roles"]),
    showName() {
      const { realName, loginName } = this.account;
      const prefixCall = this.getPrefixCall(this.roles);

      if (realName) {
        return `${prefixCall}${realName}`;
      } else if (loginName) {
        return `${prefixCall}${loginName}`;
      }

      return "--";
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("logOut").then(() => {
        // 退出成功, 重定向到登录页面
        this.$router.replace("/login");
        // 退出成功, 重新刷新页面, 初始化程序; 防止切换不同权限账号时路由渲染出问题
        window.location.reload();
      });
    },
    handleOpenSidebar() {
      this.$emit("openSidebar");
    },
    // 获取前缀称呼
    getPrefixCall(roles) {
      if (roles.includes("boss")) {
        return "公会 - ";
      }
      if (roles.includes("leader")) {
        return "主渠道 - ";
      }
      if (roles.includes("seoer")) {
        return "子渠道 - ";
      }

      return "";
    }
  }
};
</script>

<style lang="scss">
$height: 50px;
$background: #2e6fac;
$bgHoverColor: #427db4;

.app-layout-header {
  height: $height;
  background-color: $background;
  color: #fff;
  overflow: hidden;
  position: relative;
  z-index: 1002;

  .header-button {
    outline: none;
    border: none;
    cursor: pointer;
    background-color: transparent;
    padding: 0 15px;
    color: #fff;
    font-size: 22px;
    display: inline-block;
    line-height: 50px;
  }

  .header-left {
    display: none;
  }

  .logo {
    float: left;
    line-height: $height;
    padding: 0 20px;

    img {
      height: $height - 20px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 12px;
    }

    h1 {
      color: #fff;
      font-size: 16px;
      margin: 0;
      font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica, sans-serif;
      font-weight: 400;
      display: inline-block;
      vertical-align: middle;
    }
  }

  .header-nav {
    float: left;
    line-height: $height;
    margin-left: 10px;

    a {
      display: inline-block;
      padding: 0 15px;
      transition: background-color 0.25s;

      &:hover {
        background-color: $bgHoverColor;
      }
    }
  }

  .header-right {
    float: right;
    padding-right: 10px;
    line-height: $height;
    color: #fff;

    * {
      color: inherit;
    }

    .el-dropdown {
      padding: 0 10px;
      cursor: pointer;
      transition: background-color 0.25s;
      position: relative;
      top: -2px;

      &:hover {
        background-color: $bgHoverColor;
      }
    }

    .el-dropdown-menu {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.25);
    }

    .avatar-container,
    .header-logout {
      display: inline-block;
    }

    .header-logout {
      padding: 0 15px;
      color: #fff;
      font-size: 20px;
      cursor: pointer;

      .icon-logout {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
      }

      span {
        font-size: 14px;
        margin-left: 2px;
        position: relative;
        top: -2px;
      }
    }
  }
}

//
.mobile {
  .app-layout-header {
    display: flex;
    align-items: center;

    .header-left,
    .header-right {
      flex: 0.2;
    }

    .logo {
      flex: 1;
      text-align: center;
      display: none;
    }

    .header-left {
      display: block;
    }

    .header-right {
      text-align: right;
      flex: 1;
    }
  }
}
</style>
