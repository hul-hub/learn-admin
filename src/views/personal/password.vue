<template>
  <div>
    <div class="page-crumbs">
      <div class="crumbs">
        <breadcrumb />
      </div>
    </div>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <h3>修改密码</h3>
      </div>
      <div class="body">
        <el-form
          :model="form"
          :rules="rules"
          ref="passwordForm"
          label-width="120px"
          class="form-password"
        >
          <el-form-item label="旧密码：" prop="oldPsw">
            <el-input
              type="password"
              placeholder="请输入旧密码"
              v-model="form.oldPsw"
            ></el-input>
          </el-form-item>
          <el-form-item label="新密码：" prop="newPsw1">
            <el-input
              type="password"
              placeholder="请使用数字+大小写字母 长度为6-15位组合密码"
              v-model="form.newPsw1"
            ></el-input>
          </el-form-item>
          <el-form-item label="重复新密码：" prop="newPsw2">
            <el-input
              type="password"
              placeholder="请使用数字+大小写字母 长度为6-15位组合密码"
              v-model="form.newPsw2"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="ensure()"
              :loading="submitting"
              style="width: 100%"
              >修改
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <permission-password v-if="isBoss === 1"></permission-password>
  </div>
</template>
<script>
import Breadcrumb from "@/components/Breadcrumb";
import { savePwd } from "@/api/account";
import permissionPassword from "./permissionPassword";
import store from "@/store";
import { mapGetters } from "vuex";

export default {
  name: "personalPassword",
  components: {
    Breadcrumb,
    permissionPassword
  },
  data() {
    return {
      isBoss: "",
      submitting: false,
      form: {
        oldPsw: "",
        newPsw1: "",
        newPsw2: ""
      },
      rules: {
        oldPsw: [
          { required: true, message: "旧密码不能为空", trigger: "blur" }
        ],
        newPsw1: [{ required: true, message: "请输入新密码", trigger: "blur" }],
        newPsw2: [
          { required: true, message: "请再次输入新密码", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.isBoss = this.account.isGuildBoss;
  },
  methods: {
    txtPassword_check(strPassword) {
      let num = 0;
      if (strPassword.search(/[A-Z]/) != -1) {
        num += 1;
      }
      if (strPassword.search(/[0-9]/) != -1) {
        num += 1;
      }
      if (strPassword.search(/[a-z]/) != -1) {
        num += 1;
      }
      if (strPassword.search(/[^A-Za-z0-9]/) != -1) {
        num += 1;
      }
      if (num >= 2 && strPassword.length >= 6 && strPassword.length <= 16) {
        return true;
      } else {
        return false;
      }
    },
    ensure() {
      if (this.form.oldPsw.length === 0) {
        this.$message.error("旧密码不能为空");
        return;
      }
      if (this.form.newPsw1 !== this.form.newPsw2) {
        this.$message.error("新密码输入不一致");
        return;
      }
      if (this.form.newPsw1.length < 6 || this.form.newPsw2.length < 6) {
        this.$message.error("密码不能少于6位");
        return;
      }
      if (!this.txtPassword_check(this.form.newPsw1)) {
        this.$message.error("密码至少含数字、字母、符号中的2种");
        return;
      }
      const data = {
        oldPwd: this.form.oldPsw,
        newPwd: this.form.newPsw1,
        confirmPwd: this.form.newPsw2
      };
      savePwd(data)
        .then(res => {
          console.log("success");
          console.log(res);
          this.submitting = false;
          const { message } = res;

          if (res.state === "ok") {
            this.clear();
            this.$message.success({
              message: "修改成功，请重新登录",
              duration: 2000,
              onClose: () => {
                this.$store.dispatch("logOut").then(() => {
                  // 退出成功, 重新刷新页面, 初始化程序; 防止切换不同权限账号时路由渲染出问题
                  window.location.reload();
                });
              }
            });
          } else {
            this.$message.error(message || "提交失败，请重试");
          }
        })
        .catch(() => {
          console.log("catch");
          this.submitting = false;
          this.$message.error("提交失败，请重试");
        });
    },
    clear() {
      this.form.oldPsw = "";
      this.form.newPsw1 = "";
      this.form.newPsw2 = "";
    }
  },
  computed: {
    ...mapGetters(["account", "roles", "permission_routers"])
  }
};
</script>
<style lang="scss" scoped>
.form-password {
  max-width: 500px;
}
</style>
