<template>
  <div class>
    <div class="page-crumbs">
      <div class="crumbs">
        <breadcrumb />
      </div>
    </div>
    <el-card class="box-card" shadow="never">
      <div>
        <el-form ref="form" :model="form" label-width="150px" :rules="rules">
          <el-form-item label="新密码 :" prop="newPassword">
            <el-input
              v-model="form.newPassword"
              class="iptWidth"
              placeholder="6~15个字符,至少含数字、字母、符号中的2种"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="iptWidth"
              type="primary"
              @click="rePassword('form')"
              >重置密码</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import Breadcrumb from "@/components/Breadcrumb";
import { validateNewPassword as checkPassword } from "@/utils/validate";
import http from "@/utils/http";

export default {
  name: "MemberIndex",
  components: {
    Breadcrumb
  },
  data() {
    const validateNewPassword = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("新密码不能为空"));
      } else if (!checkPassword(value)) {
        callback(new Error("新密码格式不对"));
      } else {
        callback();
      }
    };
    return {
      form: {
        newPassword: ""
      },
      rules: {
        newPassword: [
          { required: true, trigger: "blur", validator: validateNewPassword }
        ]
      }
    };
  },
  created() {},
  methods: {
    rePassword(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = {
            userId: Number(this.$route.params.id),
            // status: 1,
            // alterTime: "",
            // channelName: "",
            // isSupport: 0,
            // loginName: "",
            // mcid: "",
            password: this.form.newPassword
            // phoneNum: "",
            // qq: "",
            // realName: "",
            // scid: ""
          };
          const url = `/guild/updatememberpwd.do`;
          http.post(url, data).then(res => {
            console.log(res);
            if (res.state === "ok") {
              this.$message.success({
                message: res.message || "修改密码成功",
                duration: 500,
                onClose: () => {
                  this.$router.replace("/member/promoters/index");
                }
              });
            } else if (res.state === "fail") {
              this.$message.error({
                message: res.message || "修改密码失败,请重新修改"
              });
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.iptWidth {
  width: 350px;
}
</style>
