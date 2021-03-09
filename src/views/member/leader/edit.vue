<template>
  <div class>
    <div class="page-crumbs">
      <div class="crumbs">
        <breadcrumb />
      </div>
    </div>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <h3>主渠道信息</h3>
      </div>
      <div>
        <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <el-form-item label="主渠道名称 :" prop="name">
            <el-input v-model="form.name" class="iptWidth"></el-input>
          </el-form-item>
          <el-form-item label="主渠道账号 :" prop="account">
            <el-input
              v-model="form.account"
              class="iptWidth"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="主渠道备注 :" prop="leaderName">
            <el-input v-model="form.leaderName" class="iptWidth"></el-input>
          </el-form-item>
          <el-form-item label>
            <template>
              <el-checkbox v-model="form.checked"></el-checkbox> </template
            >游戏资源特权
          </el-form-item>
          <el-form-item label="身份证号码 :" prop="idCard" v-if="form.checked">
            <el-input v-model="form.idCard" class="iptWidth"></el-input>
          </el-form-item>
          <!-- <el-form-item
            label="手机号码 :"
            prop="phoneNumber"
            v-if="form.checked"
          >
            <el-input v-model="form.phoneNumber" class="iptWidth"></el-input>
          </el-form-item> -->
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
              <el-radio-button label="3">冻结</el-radio-button>
            </el-radio-group>
          </el-form-item>
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
        name: "",
        account: "",
        leaderName: "",
        phoneNumber: "",
        QQ: "",
        idCard: "",
        status: 1,
        checked: false
      },
      rules: {
        name: [{ required: true, message: "主渠道名称", trigger: "blur" }],
        account: [
          { required: true, message: "主渠道账号不能为空", trigger: "blur" }
        ],
        leaderName: [
          { required: true, message: "主渠道备注不能为空", trigger: "blur" }
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
  methods: {
    getInfo() {
      let userid = this.$route.params.id;
      console.log(userid);
      const url = `/guild/selectmember.do?userId=${userid}`;
      http.get(url).then(res => {
        console.log(res);
        let infoData = res.data;
        this.form.name = infoData.channelName;
        this.form.account = infoData.loginName;
        this.form.leaderName = infoData.realName;
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
      });
    },
    radioChange(tag) {
      this.form.status = tag;
    },
    saveInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = {
            // userId: Number(this.$route.params.id),
            status: Number(this.form.status),
            channelName: this.form.name,
            loginName: this.form.account,
            mcid: "",
            password: "",
            isSupport: Number(this.form.checked),
            phoneNum: this.form.phoneNumber,
            idCard: this.form.idCard,
            userId: Number(this.$route.params.id),
            qq: "",
            realName: this.form.leaderName
          };
          const url = `/guild/updateleader.do`;
          http.post(url, data).then(res => {
            console.log(res);
            if (res.state === "ok") {
              this.$message.success({
                message: "保存成功",
                duration: 500,
                onClose: () => {
                  this.$router.replace("/member/leader/index");
                }
              });
            } else if (res.state === "fail") {
              this.$message.error({
                message: res.message || "保存失败",
                duration: 1000,
                onClose: () => {
                  this.$router.replace("/member/leader/index");
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
