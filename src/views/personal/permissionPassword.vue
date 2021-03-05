<template>
  <div>
    <el-card>
      <div slot="header"><h3>修改权限密码</h3></div>
      <div class="body">
        <el-form class="w500" :model="form" :rules="rules" label-width="120px">
          <el-form-item :class="{ hide: !hasPassword }" label="旧密码：">
            <el-input
              type="password"
              v-model="form.oldPsw"
              placeholder="请输入旧密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="新密码：">
            <el-input
              type="password"
              v-model="form.newPsw1"
              placeholder="6-15个字符，至少含数字、字母、符号中的2种"
            ></el-input>
          </el-form-item>
          <el-form-item label="重复新密码：">
            <el-input
              type="password"
              v-model="form.newPsw2"
              placeholder="6-15个字符，至少含数字、字母、符号中的2种"
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
  </div>
</template>

<script>
import {
  gameMangerSaveRolePassword,
  gameMangerCheckRole
} from "../../api/account";
export default {
  name: "permissionPassword",
  data() {
    return {
      submitting: false,
      hasPassword: false,
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
    this.checkPassword();
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
      if (num >= 2 && (strPassword.length >= 6 && strPassword.length <= 16)) {
        return true;
      } else {
        return false;
      }
    },
    async ensure() {
      if (this.hasPassword && this.form.oldPsw.length === 0) {
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

      try {
        const body = {
          oldRolePwd: this.form.oldPsw,
          newRolePwd: this.form.newPsw1,
          confirmRolePwd: this.form.newPsw2
        };
        const res = await gameMangerSaveRolePassword(body);
        if (res.state === "ok") {
          this.clear();
          this.$message.success({
            message: "修改成功",
            duration: 2000,
            onClose: () => {
              this.$router.go(-1);
            }
          });
        } else {
          this.$message.warning(res.message);
        }
      } catch (e) {
        this.$message.error("异常");
      }
    },
    async checkPassword() {
      try {
        const res = await gameMangerCheckRole();
        if (res.state === "ok") {
          res.data === 0 && (this.hasPassword = false);
          res.data === 1 && (this.hasPassword = true);
        } else {
          this.$message.warning(res.message);
        }
      } catch (e) {
        this.$message.error("异常");
      }
    },
    clear() {
      this.form.oldPsw = "";
      this.form.newPsw1 = "";
      this.form.newPsw2 = "";
    }
  }
};
</script>

<style scoped>
.hide {
  display: none;
}
</style>
