<template>
  <div class="cer-page">
    <div class="head" v-if="status === 0 && hasMsg === false">
      <h3>帐号未认证，请尽快完成资质认证！</h3>
    </div>
    <div class="head" v-else-if="status === 0 && hasMsg === true">
      <h3>您的资料已提交，请耐心等待审核。</h3>
    </div>
    <div class="pass" v-else-if="status === 1 && hasMsg === true">
      <h3>您的资质认证已通过。</h3>
    </div>
    <div class="notPass" v-else-if="status === -1 && hasMsg === true">
      <h3>您的资料未审核通过，认证失败，请检查资料后重新提交！</h3>
    </div>
    <div class="body">
      <el-form
        ref="guildForm"
        :model="guildForm"
        :rules="rules"
        label-width="140px"
      >
        <el-form-item label="认证类型 : ">
          <el-radio-group
            v-model="guildForm.type"
            size="small"
            :disabled="flag"
          >
            <el-radio-button label="1">个人</el-radio-button>
            <el-radio-button label="2">公司</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="姓名 : "
          v-if="guildForm.type == 1"
          prop="userName"
        >
          <el-input
            v-model="guildForm.userName"
            style="width:40%"
            :disabled="flag"
            placeholder="姓名"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="身份证号码 : "
          v-if="guildForm.type == 1"
          prop="cardNumber"
        >
          <el-input
            v-model="guildForm.cardNumber"
            style="width:40%"
            :disabled="flag"
            placeholder="身份证号码"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="公司名称 : "
          v-if="guildForm.type == 2"
          prop="name"
        >
          <el-input
            v-model="guildForm.name"
            style="width:40%"
            :disabled="flag"
            placeholder="公司名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="营业执照扫描件 : "
          v-if="guildForm.type == 2"
          prop="companyPic"
        >
          <el-row>
            <el-col :span="8">
              <el-upload
                class="upload-demo"
                drag
                name="pictureFile"
                :data="{
                  type: 1
                }"
                :action="actionUrl"
                :disabled="flag"
                :show-file-list="false"
                :on-success="companyHandle"
                :before-upload="beforeAvatarUpload"
              >
                <div v-if="!companyImageUrl">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">营业执照扫描件</div>
                </div>
                <img
                  v-if="companyImageUrl"
                  :src="companyImageUrl"
                  class="avatar"
                />
              </el-upload>
            </el-col>
            <el-col :span="8"></el-col>
            <el-col :span="8"></el-col>
          </el-row>
        </el-form-item>
        <el-form-item
          label="法人代表 : "
          v-if="guildForm.type == 2"
          prop="lawPerson"
        >
          <el-input
            v-model="guildForm.lawPerson"
            style="width:40%"
            :disabled="flag"
            placeholder="真实姓名"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="法人身份证号码 : "
          v-if="guildForm.type == 2"
          prop="lawCardNumber"
        >
          <el-input
            v-model="guildForm.lawCardNumber"
            style="width:40%"
            :disabled="flag"
            placeholder="身份证号码"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证扫描件 : " prop="cardPic">
          <el-row>
            <el-col :span="8">
              <el-upload
                class="upload-demo"
                drag
                name="pictureFile"
                :data="{
                  type: 2
                }"
                :disabled="flag"
                :action="actionUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <div v-if="!positiveImageUrl">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">身份证正面照</div>
                </div>
                <img
                  v-if="positiveImageUrl"
                  :src="positiveImageUrl"
                  class="avatar"
                />
              </el-upload>
            </el-col>
            <el-col :span="8">
              <el-upload
                class="upload-demo"
                drag
                name="pictureFile"
                :data="{
                  type: 3
                }"
                :disabled="flag"
                :action="actionUrl"
                :show-file-list="false"
                :on-success="reverseHandle"
                :before-upload="beforeAvatarUpload"
              >
                <div v-if="!reverseImageUrl">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">身份证反面照</div>
                </div>
                <img
                  v-if="reverseImageUrl"
                  :src="reverseImageUrl"
                  class="avatar"
                />
              </el-upload>
            </el-col>
            <el-col :span="8">
              <el-upload
                class="upload-demo"
                drag
                name="pictureFile"
                :data="{
                  type: 4
                }"
                :disabled="flag"
                :action="actionUrl"
                :show-file-list="false"
                :on-success="personHandle"
                :before-upload="beforeAvatarUpload"
              >
                <div v-if="!personImageUrl">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">个人手持身份证照片</div>
                </div>
                <img
                  v-if="personImageUrl"
                  :src="personImageUrl"
                  class="avatar"
                />
              </el-upload>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label style="margin-top:-30px;"
          >提示：上传图片格式为JPG或PNG，大小不超过2M</el-form-item
        >
        <el-form-item label="开户银行 : " prop="bank">
          <el-input
            v-model="guildForm.bank"
            style="width:40%"
            :disabled="flag"
            placeholder="例如，中国工商银行天河支行"
          ></el-input>
        </el-form-item>
        <el-form-item label style="margin-top:-20px;"
          >提示：请确认个人认证信息真实准确，如不符，可能出现打款延时或无法打款的情况，由此导致的一切后果，由您自行负责。</el-form-item
        >
        <el-form-item label="银行账户名 : " prop="bankName">
          <el-input
            v-model="guildForm.bankName"
            style="width:40%"
            :disabled="flag"
            placeholder="账户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="银行卡号 : " prop="bankNumber">
          <el-input
            v-model="guildForm.bankNumber"
            style="width:40%"
            :disabled="flag"
            placeholder="卡号"
          ></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱 : ">
          <el-input
            v-model="guildForm.email"
            style="width:40%"
            :disabled="flag"
            placeholder="邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item label="地址 : ">
          <el-input
            v-model="guildForm.address"
            style="width:40%"
            :disabled="flag"
            placeholder="地址"
          ></el-input>
        </el-form-item>
        <el-form-item label>
          <el-button
            type="primary"
            style="width:40%"
            @click="submit('guildForm')"
            v-if="
              (status === 0 && hasMsg === false) ||
                (status === -1 && hasMsg === true)
            "
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
import { uploadImg } from "@/api/certification";
import { getCertification } from "@/api/certification";
import { saveCertification } from "@/api/certification";
import {
  validateMobile as checkMobile,
  validateQQ as checkQQ
} from "@/utils/validate";
const ACTION_URL = `/guild/uploadFile.do`;

export default {
  name: "certification",
  components: {
    Breadcrumb
  },
  props: [],
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
        callback(new Error("手机号码不能为空"));
      } else if (!checkMobile(value)) {
        callback(new Error("手机号码格式不对"));
      } else {
        callback();
      }
    };
    return {
      resturants: [],
      companyImageUrl: "",
      companyImageUrlToServer: "",
      positiveImageUrl: "",
      positiveImageUrlToServer: "",
      reverseImageUrl: "",
      reverseImageUrlToServer: "",
      personImageUrl: "",
      personImageUrlToServer: "",
      status: 0,
      flag: false,
      hasMsg: false,
      businessState: "",
      operateState: "",
      guildForm: {
        type: 1,
        userName: "",
        cardNumber: "",
        name: "",
        lawPerson: "",
        lawCardNumber: "",
        bank: "",
        bankName: "",
        bankNumber: "",
        email: "",
        address: ""
      },
      timeout: "",
      form: {
        name: "",
        account: "",
        bossName: "",
        phoneNumber: "",
        region: ""
      },
      rules: {
        userName: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "公司名称不能为空", trigger: "blur" }
        ],
        cardNumber: [
          { required: true, message: "身份证号码不能为空", trigger: "blur" }
        ],
        companyPic: [
          { required: true, message: "营业执照扫描件不能为空", trigger: "blur" }
        ],
        lawPerson: [
          { required: true, message: "法人代表不能为空", trigger: "blur" }
        ],
        lawCardNumber: [
          { required: true, message: "法人身份证号码不能为空", trigger: "blur" }
        ],
        cardPic: [
          { required: true, message: "身份证扫描件不能为空", trigger: "blur" }
        ],
        bank: [
          { required: true, message: "开户银行不能为空", trigger: "blur" }
        ],
        bankName: [
          { required: true, message: "银行账户名不能为空", trigger: "blur" }
        ],
        bankNumber: [
          { required: true, message: "银行卡号不能为空", trigger: "blur" }
        ]
      },
      actionUrl: ACTION_URL
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      getCertification().then(res => {
        console.log(res);
        this.status = res.data.status;
        this.hasMsg = res.data.hasMsg;
        this.flag =
          (res.data.status === 0 && res.data.hasMsg === true) ||
          (res.data.status === 1 && res.data.hasMsg === true);
        console.log(this.status);
        console.log(res.data.hasMsg);
        if (!res.data.hasMsg && res.data.status === 0) {
          // 未认证状态
          this.$message({
            showClose: true,
            message: "帐号未认证，请尽快完成资质认证！",
            type: "success"
          });
        } else if (res.data.hasMsg && res.data.status === -1) {
          // 认证失败
          (this.guildForm.address = res.data.address),
            (this.guildForm.type = res.data.authType),
            (this.guildForm.bankNumber = res.data.bankAccount),
            (this.guildForm.bankName = res.data.bankAccountName),
            (this.guildForm.bank = res.data.bankName),
            (this.guildForm.name = res.data.companyName),
            (this.guildForm.email = res.data.email),
            (this.companyImageUrl =
              res.data.imgUrl + res.data.businessLicence.slice(0)),
            (this.positiveImageUrl =
              res.data.imgUrl + res.data.idCardFile.split(",")[0]),
            (this.reverseImageUrl =
              res.data.imgUrl + res.data.idCardFile.split(",")[1]),
            (this.personImageUrl =
              res.data.imgUrl + res.data.idCardFile.split(",")[2]);
          if (res.data.authType === 1) {
            (this.guildForm.userName = res.data.idCard),
              (this.guildForm.cardNumber = res.data.realName);
          } else if (res.data.authType === 2) {
            (this.guildForm.lawCardNumber = res.data.idCard),
              (this.guildForm.lawPerson = res.data.realName);
          }
        } else if (res.data.hasMsg && res.data.status === 0) {
          // 认证中，待审核状态
          (this.guildForm.address = res.data.address),
            (this.guildForm.type = res.data.authType),
            (this.guildForm.bankNumber = res.data.bankAccount),
            (this.guildForm.bankName = res.data.bankAccountName),
            (this.guildForm.bank = res.data.bankName),
            (this.guildForm.name = res.data.companyName),
            (this.guildForm.email = res.data.email),
            (this.companyImageUrl =
              res.data.imgUrl + res.data.businessLicence.slice(0)),
            (this.positiveImageUrl =
              res.data.imgUrl + res.data.idCardFile.split(",")[0]),
            (this.reverseImageUrl =
              res.data.imgUrl + res.data.idCardFile.split(",")[1]),
            (this.personImageUrl =
              res.data.imgUrl + res.data.idCardFile.split(",")[2]);
          if (res.data.authType === 1) {
            (this.guildForm.userName = res.data.idCard),
              (this.guildForm.cardNumber = res.data.realName);
          } else if (res.data.authType === 2) {
            (this.guildForm.lawCardNumber = res.data.idCard),
              (this.guildForm.lawPerson = res.data.realName);
          }
        }
      });
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = {
            address: this.guildForm.address,
            authType: Number(this.guildForm.type),
            bankAccount: this.guildForm.bankNumber,
            bankAccountName: this.guildForm.bankName,
            bankName: this.guildForm.bank,
            businessLicence: this.companyImageUrlToServer,
            companyName: this.guildForm.name,
            email: this.guildForm.email,
            idCard: this.guildForm.lawCardNumber,
            idCardFile: [
              this.positiveImageUrlToServer,
              this.reverseImageUrlToServer,
              this.personImageUrlToServer
            ].join(","),
            realName: this.guildForm.lawPerson
          };
          saveCertification(data)
            .then(res => {
              console.log(res);
              this.$message({
                showClose: true,
                message: "提交成功",
                type: "success"
              });
              this.status = 0;
              this.hasMsg = true;
            })
            .catch(err => {
              this.$message.error("网络链接失败，请刷新重试");
            });
        } else {
          this.$message({
            showClose: true,
            message: "提交失败，请重新确认资料再提交",
            type: "error"
          });
          return false;
        }
      });
    },

    // 图片上传
    handleAvatarSuccess(res, file) {
      this.positiveImageUrl = URL.createObjectURL(file.raw);
      if (res.state === "ok") {
        this.positiveImageUrlToServer = res.data.pictureUrl;
      }
    },
    reverseHandle(res, file) {
      this.reverseImageUrl = URL.createObjectURL(file.raw);
      if (res.state === "ok") {
        this.reverseImageUrlToServer = res.data.pictureUrl;
      }
    },
    personHandle(res, file) {
      this.personImageUrl = URL.createObjectURL(file.raw);
      if (res.state === "ok") {
        this.personImageUrlToServer = res.data.pictureUrl;
      }
    },
    companyHandle(res, file) {
      this.companyImageUrl = URL.createObjectURL(file.raw);
      if (res.state === "ok") {
        this.companyImageUrlToServer = res.data.pictureUrl;
      }
    },
    // 图片格式和大小判断
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script>

<style lang="scss">
.cer-page {
  .el-row {
    // width: 1200px !important;
  }
  .head {
    // width: 120%;
    background-color: #d2eafa;
    height: 50px;
    line-height: 50px;
    border-radius: 8px;
    h3 {
      color: #3bb8ff;
      font-size: 14px;
      margin-left: 20px;
    }
  }
  .pass {
    // width: 120%;
    background-color: #e2fad2;
    height: 50px;
    line-height: 50px;
    border-radius: 8px;
    h3 {
      color: #008000;
      font-size: 14px;
      margin-left: 20px;
    }
  }
  .notPass {
    // width: 120%;
    background-color: #fad2d2;
    height: 50px;
    line-height: 50px;
    border-radius: 8px;
    h3 {
      color: #ff0000;
      font-size: 14px;
      margin-left: 20px;
    }
  }
  .body {
    margin-top: 20px;
  }
  .el-upload {
    padding: 0 5px;
    width: 100%;
  }
  .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #ccc;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 100%;
    line-height: 100%;
    text-align: center;
  }
  .el-upload-dragger {
    width: auto !important;
  }
  .avatar {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
