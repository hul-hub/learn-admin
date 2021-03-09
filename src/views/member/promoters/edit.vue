<template>
  <div class>
    <div class="page-crumbs">
      <div class="crumbs">
        <breadcrumb />
      </div>
    </div>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <h3>子渠道信息</h3>
      </div>
      <div>
        <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <el-form-item label="子渠道帐号 :" prop="loginName">
            <el-input
              v-model="form.loginName"
              class="iptWidth"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="子渠道备注 :" prop="realName">
            <el-input v-model="form.realName" class="iptWidth"></el-input>
          </el-form-item>
          <el-form-item label="所属主渠道 :" prop="mcid">
            <el-select v-model="form.channelName" class="iptWidth" disabled>
              <el-option
                :key="form.mcid"
                :label="form.channelName"
                :value="form.mcid"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="手机号码 :" prop="phoneNumber">
                <el-input v-model="form.phoneNumber" class="iptWidth"></el-input>
            </el-form-item>
            <el-form-item label="QQ :" prop="QQ">
                <el-input v-model="form.QQ" class="iptWidth"></el-input>
          </el-form-item>-->
          <el-form-item label="帐号状态 :">
            <el-radio-group
              v-model="form.status"
              size="medium"
              @change="radioChange"
            >
              <el-radio-button label="1">正常</el-radio-button>
              <el-radio-button label="3" v-if="isBossOrLeader"
                >冻结</el-radio-button
              >
              <el-radio-button label="4" v-if="isAdmin">封停</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label v-if="form.mcIsSupport">
            <template>
              <el-checkbox v-model="form.checked"></el-checkbox> </template
            >资源特权
            <el-popover
              placement="top"
              title="说明"
              width="350"
              trigger="hover"
              content="默认情况下只有主渠道可申请游戏资源，勾选该项后，该子渠道也可以申请游戏资源。"
            >
              <i slot="reference" class="el-icon-question"></i>
            </el-popover>
          </el-form-item>
          <el-form-item
            label="身份证号码 :"
            prop="idCard"
            v-if="form.checked && form.mcIsSupport"
          >
            <el-input v-model="form.idCard" class="iptWidth"></el-input>
          </el-form-item>
          <!-- <el-form-item
            label="手机号码 :"
            prop="phoneNumber"
            v-if="form.checked && form.mcIsSupport"
          >
            <el-input v-model="form.phoneNumber" class="iptWidth"></el-input>
          </el-form-item> -->
          <el-form-item label>
            <el-button class="iptWidth" type="primary" @click="saveInfo('form')"
              >保存</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import {
  validateMobile as checkMobile,
  validateIdCard as checkIdCard,
  validateQQ as checkQQ
} from "@/utils/validate";
import http from "@/utils/http";
export default {
  name: "MemberIndex",
  components: {
    Breadcrumb
  },
  data() {
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
        callback();
      } else if (!checkMobile(value)) {
        callback(new Error("手机号码格式不对"));
      } else {
        callback();
      }
    };
    const validateIdCard = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("身份证号码为空"));
      } else if (!checkIdCard(value)) {
        callback(new Error("身份证格式不对"));
      } else {
        callback();
      }
    };
    return {
      form: {
        channelName: "",
        loginName: "",
        realName: "",
        mcid: "",
        phoneNumber: "",
        idCard: "",
        QQ: "",
        status: 1,
        checked: false,
        mcIsSupport: false
      },
      rules: {
        loginName: [
          { required: true, message: "子渠道账号不能为空", trigger: "blur" }
        ],
        realName: [
          { required: true, message: "子渠道备注不能为空", trigger: "blur" }
        ],
        mcid: [
          { required: true, message: "权限角色不能为空", trigger: "blur" }
        ],
        phoneNumber: [
          { required: false, trigger: "blur", validator: validateMobile }
        ],
        idCard: [
          { required: true, trigger: "blur", validator: validateIdCard }
        ],
        QQ: [{ required: true, trigger: "blur", validator: validateQQ }]
      }
    };
  },
  created() {
    this.getInfo();
  },
  computed: {
    ...mapGetters(["roles"]),
    isBossOrLeader() {
      return this.roles.includes("boss") || this.roles.includes("leader");
    },
    isAdmin() {
      return this.roles.includes("admin");
    }
  },
  methods: {
    getInfo() {
      let userid = this.$route.params.id;
      console.log(userid);
      const url = `/guild/selectmember.do?userId=${userid}`;
      http.get(url).then(res => {
        let infoData = res.data;
        this.form.loginName = infoData.loginName;
        this.form.realName = infoData.realName;
        this.form.phoneNumber = infoData.phoneNum;
        this.form.idCard = infoData.idCard;
        this.form.QQ = infoData.qq;
        if (infoData.status === 0) {
          this.form.status = 1;
        } else {
          this.form.status = infoData.status;
        }
        if (infoData.isSupport === 0) {
          this.form.checked = false;
        } else if (infoData.isSupport === 1) {
          this.form.checked = true;
        }
        if (infoData.mcIsSupport === 0) {
          this.form.mcIsSupport = false;
        } else if (infoData.mcIsSupport === 1) {
          this.form.mcIsSupport = true;
        }
        this.form.channelName = infoData.channelName;
        this.form.mcid = infoData.mcid;
        // this.ListOptions.value = infoData.mcid;
        // this.ListOptions.label = infoData.channelName;
      });
    },
    radioChange(tag) {
      this.form.status = tag;
    },
    saveInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // alert('submit!');
          let data = {
            status: Number(this.form.status),
            channelName: this.form.channelName,
            loginName: this.form.loginName,
            mcid: this.form.mcid,
            password: "",
            realName: this.form.realName,
            isSupport: Number(this.form.checked),
            userId: Number(this.$route.params.id),
            phoneNum: this.form.phoneNumber,
            idCard: this.form.idCard,
            qq: ""
          };
          const url = `/guild/updatemember.do`;
          http.post(url, data).then(res => {
            console.log(res);
            if (res.state === "ok") {
              this.$message.success({
                message: "保存成功",
                duration: 500,
                onClose: () => {
                  this.$router.replace("/member/promoters/index");
                }
              });
            } else if (res.state === "fail") {
              this.$message.error({
                message: res.message || "保存失败",
                duration: 1000,
                onClose: () => {
                  this.$router.replace("/member/promoters/index");
                }
              });
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.iptWidth {
  width: 300px;
}
.btnWidth {
  width: 140px;
}
.el-form-item__label {
  color: red !important;
}
</style>
