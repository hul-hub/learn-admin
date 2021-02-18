<template>
  <div class="page-error">
    <h1 class="page-error-status">404</h1>
    <div class="page-error-content">很抱歉，此页面不存在或已删除!</div>
    <div class="page-error-action">
      <router-link :to="{ path: '/' }" replace>
        <el-button type="primary" round>返回首页</el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goback() {
      this.$router.back();
    }
  }
};
</script>

<style lang="scss">
.page-error {
  max-width: 420px;
  padding: 120px 0 50px;
  text-align: center;
  margin: 0 auto;

  &-status {
    font-weight: 400;
    font-size: 56px;
    margin: 0 0 10px;
  }
  &-content {
    padding: 0;
    margin: 0;
    font-size: 22px;
    opacity: 0.8;
  }
  &-action {
    margin-top: 35px;
    font-size: 15px;
    opacity: 0.8;

    .el-button {
      width: 100%;
    }
  }
}
</style>
