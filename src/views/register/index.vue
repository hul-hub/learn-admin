<template>
  <div
    :style="{
      background:
        platForm === '666'
          ? 'url(' + url + ')no-repeat center'
          : platForm === 'newPlatform'
          ? 'url(' + url2 + ')no-repeat center'
          : 'url(' + url1 + ') no-repeat center'
    }"
    class="account-container"
  >
    <div class="account-content">
      <div class="account-top">
        <div class="logo">
          <img
            v-if="platForm !== '666' && platForm !== 'newPlatform'"
            src="../../assets/logo.png"
            alt=""
          />
        </div>
        <div class="header" v-if="platForm === '666'">注册</div>
        <div class="header" v-else-if="platForm === 'newPlatform'">
          平台注册
        </div>
        <div class="header" v-else>注册渠道</div>
      </div>
      <div
        class="account-main"
        :class="{ 'new-platform-account-main': platForm === 'newPlatform' }"
      >
        <el-form
          class="account-form"
          autoComplete="off"
          :model="registerForm"
          :rules="registerRules"
          ref="registerForm"
          label-position="left"
          status-icon
        >
          <el-form-item prop="username">
            <el-input
              class="indent"
              name="username"
              type="text"
              v-model="registerForm.username"
              placeholder="账户"
            />
            <span class="icon-account icon-account-user"></span>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              class="indent"
              name="password"
              :type="passwordType"
              v-model="registerForm.password"
              placeholder="密码"
            />
            <span class="icon-account icon-account-password"></span>
          </el-form-item>

          <el-form-item prop="name">
            <el-input
              name="name"
              type="text"
              v-model="registerForm.name"
              placeholder="渠道名称"
              @keyup.space.native="searchList"
            />
          </el-form-item>

          <el-form-item prop="qq">
            <el-input
              name="qq"
              type="text"
              v-model="registerForm.qq"
              placeholder="QQ"
            />
          </el-form-item>

          <el-form-item prop="mobile">
            <el-input
              name="mobile"
              type="text"
              v-model="registerForm.mobile"
              placeholder="手机号码"
            />
          </el-form-item>

          <div
            class="form-item-code flex row-flex-middle row-flex-space-between"
          >
            <div class="code flex-1">
              <el-form-item prop="smsCode" style="margin-bottom: 0">
                <el-input
                  name="code"
                  type="text"
                  v-model="registerForm.smsCode"
                  placeholder="验证码"
                />
              </el-form-item>
            </div>
            <div class="code-get">
              <el-button
                :class="{ 'new-platform-btn': platForm === 'newPlatform' }"
                type="primary"
                @click="getSMSCode"
                :disabled="!isCanGetSMS"
                >{{ getSMSCodeText }}</el-button
              >
            </div>
          </div>
          <!--<el-form-item>-->
          <!--<el-checkbox-->
          <!--v-model="registerForm.checked"-->
          <!--style="margin-right: 8px;"-->
          <!--&gt;</el-checkbox>-->
          <!--我已阅读并同意<router-link to="/agreement" target="_blank"-->
          <!--&gt;《游戏推广协议》</router-link-->
          <!--&gt;-->
          <!--</el-form-item>-->

          <el-button
            type="primary"
            style="width: 100%"
            :class="{ 'new-platform-btn': platForm === 'newPlatform' }"
            :style="{ height: platForm === 'newPlatform' ? '50px' : 'auto' }"
            :loading="loading"
            @click.native.prevent="handleRegister"
            >{{ platForm === "newPlatform" ? "立即注册" : "注册" }}</el-button
          >
        </el-form>

        <!-- <div class="form-item-other flex row-flex-middle row-flex-center">
          <div>已有账号？<router-link :to="{path: 'login'}">立即登录</router-link></div>
        </div> -->
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="70%">
      <game153wan v-if="platForm === 'newPlatform'"></game153wan>
      <game v-else></game>
      <div style="display: flex; flex-direction: row; justify-content: center">
        <el-button type="primary" @click="sureClick" :disabled="sureDisabled"
          >我已阅读并同意条款</el-button
        >
        <el-button @click="noSureClick">不同意</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  validateMobile as checkMobile,
  validateQQ as checkQQ
} from "@/utils/validate";

import { getSMSCode } from "@/api/global";
import {
  register,
  checkGuildName,
  checkUsername,
  checkPhoneNumber
} from "@/api/account";
import game from "@/views/agreement/game";
import game153wan from "@/views/agreement/153wanGame";
export default {
  name: "login",
  data() {
    const validateUsername = async (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("帐号不能为空"));
      } else if (!/^[A-Za-z0-9]+$/g.test(value)) {
        callback(new Error("只能输入字母或者数字"));
      }

      try {
        const res = await checkUsername(value);
        if (res.state === "ok") {
          callback(res.message || "账户已经存在");
        } else if (res.state === "fail") {
          callback();
        }
      } catch (error) {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      const reg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,}$/;

      if (value.trim() === "") {
        callback(new Error("密码不能为空"));
      } else if (value.trim().length < 8) {
        callback(new Error("密码长度不能小于 8 位数"));
      } else if (!reg.test(value)) {
        callback(new Error("密码至少含有数字、字母、符号中的两种"));
      } else {
        callback();
      }
    };
    const validateName = async (rule, value, callback) => {
      const reg2 = new RegExp(
        "[`~!@#$^&*()=|{}':;',\\\\.<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ %丨亅丿乛一乚丶勹冫卜刂匚阝丷卩冂冖凵亻厶亠匸讠廴艹屮彳巛辶廾彐彑宀犭彡饣扌氵纟囗兀忄尢灬卝旡耂肀牜爿攴攵礻殳尣爫癶钅疒罒疋曱乀丅丄卐卍甴弍弎弐卄巜囧厃广衤釒飠糹丩丬夊皿臼虍歺夬氺丂亇]"
      );
      if (value.trim() === "") {
        callback(new Error("渠道名称不能为空"));
        return false;
      } else if (reg2.test(value)) {
        callback(new Error("渠道名称只支持填写数字、英文字母、文字输入"));
        return false;
      }
      try {
        const res = await checkGuildName(value);
        if (res.state === "fail") {
          callback(res.message || "渠道名称已经存在");
        } else if (res.state === "ok") {
          callback();
        }
      } catch (error) {
        callback();
      }
    };
    const validateQQ = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("QQ不能为空"));
      } else if (!checkQQ(value)) {
        callback(new Error("QQ格式不对"));
      } else {
        callback();
      }
    };
    const validateMobile = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("手机号码不能为空"));
      } else if (!checkMobile(value.trim())) {
        callback(new Error("手机号码格式不对"));
      } else {
        callback();
      }
    };
    const validateSMSCode = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("短信验证码不能为空"));
      } else {
        callback();
      }
    };

    return {
      platForm: process.env.VUE_APP_PLATFORM,
      url: require("../../assets/images/bg2.png"),
      url1: require("../../assets/images/bg.png"),
      url2: require("../../assets/images/bg3.jpg"),
      registerForm: {
        username: "",
        password: "",
        name: "",
        qq: "",
        mobile: "",
        smsCode: "",
        checked: "",
        bsId: ""
      },
      dialogVisible: false,
      sureDisabled: true,
      registerRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ],
        name: [{ required: true, trigger: "blur", validator: validateName }],
        qq: [{ required: true, trigger: "blur", validator: validateQQ }],
        mobile: [
          { required: true, trigger: "blur", validator: validateMobile }
        ],
        smsCode: [
          { required: true, trigger: "blur", validator: validateSMSCode }
        ]
      },
      loading: false,
      passwordType: "password",
      getSMSCodeText: "获取短信验证码",
      isCanGetSMS: true,
      countDown: 60
    };
  },
  components: {
    game,
    game153wan
  },
  created() {
    // 获取 url 商务体系的ID bsId
    const { bsid, bsId } = this.$route.query;
    this.registerForm.bsId = bsid || bsId || "";
  },
  methods: {
    searchList() {
      this.registerForm.name = this.registerForm.name.replace(/^\s+|\s/g, "");
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
    },
    async getSMSCode() {
      if (this.registerForm.mobile === "") {
        this.$message.error("请填写手机号码");
        return;
      } else if (!checkMobile(this.registerForm.mobile)) {
        this.$message.error("手机号码格式不对");
        return;
      }

      if (!this.isCanGetSMS) {
        console.log("倒计时还没有结束");
        return;
      }
      let data = {
        phoneNumber: this.registerForm.mobile
      };
      try {
        const res = await checkPhoneNumber(data);
        if (res.state === "fail") {
          this.$message.error(res.message || "手机号码超过限制");
        } else if (res.state === "ok") {
          getSMSCode(
            this.registerForm.mobile,
            this.platForm === "newPlatform" ? 1 : 0
          ).then(res => {
            console.log(res);
            if (res.state === "fail") {
              this.$message.error(res.message || "短信验证码获取失败，请重试");
            } else if (res.state === "ok") {
              this.$message.success("短信验证码发送成功");
              // 按钮倒计时
              this.isCanGetSMS = false;
              let timer;
              let countDown = this.countDown;
              const countDownFn = () => {
                if (countDown <= 1) {
                  this.isCanGetSMS = true;
                  this.getSMSCodeText = "获取短信验证码";
                  clearInterval(timer);
                } else {
                  countDown -= 1;
                  this.getSMSCodeText = `${countDown}秒后重新获取`;
                }
              };

              countDownFn();
              timer = setInterval(() => {
                countDownFn();
              }, 1000);
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
      // 请求获取短信验证码
      console.log("请求获取短信验证码");
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (!valid) return false;
        // if (!this.registerForm.checked) {
        //   this.$message.error("勾选同意《游戏推广协议》");
        //   return;
        // }
        this.dialogVisible = true;
        console.log("提交注册请求");
        // this.loading = true;
        setTimeout(() => {
          this.sureDisabled = false;
        }, 5000);
      });
    },
    noSureClick() {
      this.$message({
        message: "温馨提示：您需要同意协议才能继续下一步，否则无法注册渠道。",
        type: "warning"
      });
    },
    sureClick() {
      this.loading = true;
      const data = {
        loginName: this.registerForm.username,
        pwd: this.registerForm.password,
        guildName: this.registerForm.name,
        qq: this.registerForm.qq,
        phoneNumber: this.registerForm.mobile.trim(),
        msgCode: this.registerForm.smsCode,
        bsId: this.registerForm.bsId,
        regRource: this.platForm === "newPlatform" ? 1 : 0
      };
      this.$store
        .dispatch("registerAndLogin", data)
        .then(res => {
          this.loading = false;
          if (res.state === "fail") {
            this.$message.error(res.message || "注册失败，请重试");
          } else if (res.state === "ok") {
            this.$message.success({
              message: "注册成功"
            });
            const redirectUrl = this.$route.query.redirect
              ? decodeURIComponent(this.$route.query.redirect)
              : "/";
            this.$router.replace({ path: redirectUrl });
            this.loading = false;
          }
        })
        .catch(() => {
          this.$message.error("注册失败，请重试");
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.account-container {
  background-size: cover;
  min-height: 100%;

  .account-top {
    .header {
      color: #fff;
    }
  }

  .account-main {
    max-width: 400px;
    background-color: #fff;
    border-radius: 8px;
    padding: 40px;

    h3 {
      text-align: center;
      font-weight: 400;
      margin-top: -10px;
      margin-bottom: 30px;
    }
  }

  .new-platform-account-main {
    max-width: 490px;
  }

  .form-item-other {
    margin-bottom: 0;
  }

  .icon-account {
    display: inline-block;
    width: 24px;
    height: 24px;
    overflow: hidden;
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);

    &-user {
      background: url(../../assets/images/icon-user.png);
    }
    &-password {
      background: url(../../assets/images/icon-password.png);
    }
  }

  .indent .el-input__inner {
    padding-left: 40px;
    padding-right: 25px;
  }
}
.new-platform-btn {
  background: #683fff;
  border-color: #683fff;
  transition: 0.5s;
  &:hover,
  &:active,
  &:focus {
    background: #fe8900;
    border-color: #fe8900;
  }
}
.flex-1 {
  flex: 1;
}
@media (max-width: 576px) {
  .account-container {
    .account-content {
      padding-top: 60px;
    }
    .account-main {
      width: 100%;
      max-width: 320px;
      padding: 20px;
    }
  }
}
</style>
