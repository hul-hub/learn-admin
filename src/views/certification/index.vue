<template>
  <!-- 保证金二维码页面 -->
  <div class="cer-page ml20 mr20" v-if="payChannelData && status === 5">
    <div class="flex center">
      <h3 style="color: #67c23a;">
        您在游戏推广平台提交的资料已经通过审核。请您缴纳推广保证金，缴纳完成后，将对您开启后台的所有游戏推广功能。
      </h3>
    </div>
    <div class="mt20 mb20 flex center">
      <div style="border:2px solid #8b9abb;padding: 30px;">
        <div>
          <div class="flex between mb20">
            <span>缴纳保证金</span
            ><span
              >支付
              <span style="color:#f69f2a;font-weight:bold;font-size:22px;">{{
                bailMoney / 100
              }}</span>
              元</span
            >
          </div>
          <div>
            温馨提示：为保障您的交易安全，本次支付将在支付宝网页中进行交易，您需要登录支付账号进行支付。<br />支付完成后，将对您开启后台的所有游戏推广功能。
          </div>
        </div>
        <div class="mt30">
          <el-button
            type="primary"
            size="small"
            style="width:120px"
            @click="changePayChannelData"
            >确认付款</el-button
          >
        </div>
      </div>
    </div>
    <div v-html="payChannelData" id="payChannelDataForm"></div>
    <!-- <div class="flex center">
       <iframe style="width:35%;height:420px;" v-if="isShowIfram" frameborder="no" :src="isShowIfram?'https://mclient.alipay.com/cashier/mobilepay.htm?alipay_exterface_invoke_assign_target=invoke_32f8548ca5a40d5bd593ff85ff73d14e&alipay_exterface_invoke_assign_sign=c_y_s_pn_y_rq_e_s1_h_a%2B_g_o_sn_wl_mp4_z_d_z5_tkjc_m5t_a_tyixhq_q_jn_h_i_y_uys087_q%3D%3D':''" width="100%" height="100%"></iframe>
      </div> -->
  </div>
  <!-- end -->
  <div class="cer-page" v-else>
    <div class="head" v-if="status === 0 && hasMsg === false">
      <h3>帐号未认证，请尽快完成资质认证！</h3>
    </div>
    <div class="head" v-else-if="status === 0 && hasMsg === true">
      <h3>您的资料已提交，正在等待审核，请联系您的维护专员加速审核。</h3>
    </div>
    <div class="pass" v-else-if="status === 1">
      <h3>您的资质认证已通过。</h3>
    </div>
    <div class="notPass" v-else-if="status === -1">
      <h3>您的资料未审核通过，认证失败，请检查资料后重新提交！</h3>
    </div>
    <div class="body">
      <el-form
        ref="forms"
        :model="guildForm"
        :rules="rules"
        label-width="140px"
      >
        <el-form-item label="姓名 : " prop="userName">
          <el-input
            v-model="guildForm.userName"
            style="width:40%"
            :disabled="flag"
            placeholder="姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证号码 : " prop="cardNumber">
          <el-input
            v-model="guildForm.cardNumber"
            style="width:40%"
            :disabled="flag"
            placeholder="身份证号码"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证扫描件 : " prop="cardPic">
          <el-form-item label style="color:red;"
            >身份证姓名需要与开户人姓名一致。</el-form-item
          >
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
        <el-form-item label style="margin-top:0px;"
          >提示：上传图片格式为JPG或PNG，大小不超过2M
          <el-button
            v-if="!isShow"
            size="medium"
            @click="dialogVisible = true"
            type="primary"
            plain
            style="float:right"
          >
            <i class="el-icon-question"></i>&nbsp;如何拍摄照片
          </el-button>
        </el-form-item>
        <el-dialog :visible.sync="dialogVisible" width="60%">
          <div class="pic">
            <img src="../../assets/images/certification.jpg" alt />
          </div>
        </el-dialog>
        <el-divider content-position="left">银行信息</el-divider>
        <el-form-item label style="margin-top:-20px;"
          >提示：请确认个人认证信息真实准确，如不符，可能出现打款延时或无法打款的情况，由此导致的一切后果，由您自行负责。</el-form-item
        >
        <el-form-item label="银行卡号 : " prop="bankNumber">
          <el-input
            v-model="guildForm.bankNumber"
            style="width:40%"
            :disabled="flag"
            placeholder="请输入19位银行卡号，请勿空格"
          ></el-input>
        </el-form-item>
        <el-form-item label="开户银行 : " prop="bank">
          <el-input
            v-model="guildForm.bank"
            style="width:40%"
            :disabled="flag"
            placeholder="例如，中国工商银行"
          ></el-input>
        </el-form-item>
        <el-form-item label="省市 : " prop="address" v-if="oldData">
          <el-input
            v-model="guildForm.address"
            style="width: 40%"
            v-if="oldData"
            :disabled="flag"
            placeholder="请输入省市"
          ></el-input>
          <el-cascader
            ref="cityCascader"
            class="js-city-cascader"
            clearable
            filterable
            :disabled="flag"
            v-else
            v-model="selectOptions"
            @change="handleCityChange"
            :options="options"
            :props="{
              label: 'name',
              value: 'code'
            }"
            style="width: 40%"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="省市 : " prop="address" v-if="!oldData">
          <!--<el-input v-model="guildForm.address" v-if="!oldData" :disabled = 'flag' placeholder="请输入常用地址"></el-input>-->
          <el-cascader
            ref="cityCascader"
            class="js-city-cascader"
            clearable
            filterable
            :disabled="flag"
            v-model="selectOptions"
            @change="handleCityChange"
            :options="options"
            :props="{
              label: 'name',
              value: 'code'
            }"
            style="width: 40%"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="县 : ">
          <el-input
            v-model="guildForm.bankCounty"
            style="width:40%"
            :disabled="flag"
            placeholder="请输入县级名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="开户人姓名 : " prop="bankName">
          <el-input
            v-model="guildForm.bankName"
            style="width:40%"
            :disabled="flag"
            placeholder="账户名,需与身份证姓名一致"
          ></el-input>
        </el-form-item>
        <el-form-item label="开户行支行 : " prop="bankBranch">
          <el-input
            v-model="guildForm.bankBranch"
            style="width:40%"
            :disabled="flag"
            placeholder="例如，中国工商银行天河支行"
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
        <el-form-item label="详细地址 : " v-if="oldData">
          <el-input
            v-model="guildForm.addressDetail"
            style="width:40%"
            :disabled="flag"
            placeholder
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="地址2 : " v-if="isShow">
                <el-input v-model="guildForm.address" style="width:40%" disabled placeholder="地址"></el-input>
        </el-form-item>-->
        <el-form-item label="详细地址 : " v-if="!oldData">
          <el-input
            v-model="guildForm.addressDetail"
            style="width:40%"
            :disabled="flag"
            placeholder
          ></el-input>
        </el-form-item>
        <el-form-item label style="margin-top:-20px;"
          >提示：便于平台发放奖品</el-form-item
        >
        <el-form-item label="营业执照扫描件 : ">
          <el-radio-group v-model="companyRadio" :disabled="flag">
            <el-radio label="1">立即上传(建议)</el-radio>
            <el-radio label="0">不上传</el-radio>
          </el-radio-group>
          <el-row v-if="companyRadio == '1'">
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
        <el-form-item label>
          <el-button
            type="primary"
            style="width:40%"
            @click="submit"
            v-if="(status === 0 && hasMsg === false) || status === -1"
            >提交</el-button
          >
        </el-form-item>
        <el-form-item label style="margin-bottom:50px;"
          ><span style="color: red"
            >*请确认个人认证信息真实准确，如不符，可能出现打款延时或无法打款的情况，由此导致的一切后果，由您自行负责。</span
          ></el-form-item
        >
      </el-form>
    </div>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
import { uploadImg } from "@/api/certification";
import pcCode from "@/datas/pc-code.json";
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
    const validatePhoto = (rule, value, callback) => {
      console.log(rule, value);
      console.log(
        this.positiveImageUrlToServer,
        this.reverseImageUrlToServer,
        this.personImageUrlToServer
      );
      if (
        this.positiveImageUrlToServer != "" &&
        this.reverseImageUrlToServer != "" &&
        this.personImageUrlToServer != ""
      ) {
        callback();
      } else {
        callback(new Error("身份证扫描件不能为空"));
      }
    };
    return {
      bailMoney: "",
      isShowIfram: false,
      payChannelData: "",
      companyRadio: "1",
      options: pcCode,
      dialogVisible: false,
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
        userName: "",
        cardNumber: "",
        bank: "",
        bankName: "",
        bankNumber: "",
        email: "",
        address: "",
        addressDetail: "", //详细地址
        bankCounty: "",
        bankBranch: "",
        cardPic: "",
        companyPic: ""
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
        cardNumber: [
          { required: true, message: "身份证号码不能为空", trigger: "blur" }
        ],
        companyPic: [
          { required: true, message: "营业执照扫描件不能为空", trigger: "blur" }
        ],
        cardPic: [
          {
            required: true,
            message: "身份证扫描件不能为空",
            trigger: "blur",
            validator: validatePhoto
          }
        ],
        bank: [
          { required: true, message: "开户银行不能为空", trigger: "blur" }
        ],
        bankName: [
          { required: true, message: "银行账户名不能为空", trigger: "blur" }
        ],
        bankNumber: [
          { required: true, message: "银行卡号不能为空", trigger: "blur" }
        ],
        address: [
          { required: true, message: "省市不能为空", trigger: "change" }
        ],
        bankBranch: [
          { required: true, message: "开户支行不能为空", trigger: "blur" }
        ]
      },
      actionUrl: ACTION_URL,
      selectOptions: [],
      provinceName: "",
      cityName: "",
      provinceCode: "",
      cityCode: "",
      oldData: false,
      disabled: false
    };
  },
  created() {
    //  设置保证金二维码支付
    this.payChannelData = window["sessionStorage"].getItem("payChannelData");
    // if (this.payChannelData) {
    //   setTimeout(() => {
    //     document.querySelector("#payChannelDataForm").children[0].submit();
    //   }, 500);
    // }
    console.log(this.$route);
    this.getInfo();
  },
  computed: {
    isShow() {
      return this.$route.fullPath === "/personal/certification";
    }
  },
  methods: {
    changePayChannelData() {
      // this.isShowIfram = true;
      document.querySelector("#payChannelDataForm").children[0].submit();
    },
    handleCityChange(value) {
      console.log("city value", value);
      this.provinceCode = value[0];
      this.cityCode = value[1];
      for (var i = 0; i < this.options.length; i++) {
        if (this.options[i].code == this.provinceCode) {
          this.provinceName = this.options[i].name;
          for (var j = 0; j < this.options[i].children.length; j++) {
            if (this.options[i].children[j].code === this.cityCode) {
              this.cityName = this.options[i].children[j].name;
            }
          }
        }
      }
      console.log("this.provinceName=====>>>", this.provinceName);
      console.log("this.cityName=====>>>", this.cityName);

      // const cityNameStr = this.$refs.cityCascader.innerHTML;
      // console.log(this.$refs.cityCascader.referenceElm.querySelector('.el-cascader__label').value);

      const filterValue = value
        .filter(item => item !== "市辖区")
        .join(",")
        .replace(/,/g, "/");
      // this.gui.address = filterValue;
      console.log(filterValue);
      this.guildForm.address = filterValue;
    },
    getInfo() {
      getCertification().then(res => {
        console.log(res);
        this.bailMoney = res.data.bailMoney;
        this.status = res.data.status;
        this.hasMsg = res.data.hasMsg;
        this.guildForm.bankCounty = res.data.bankCounty;
        this.guildForm.bankBranch = res.data.bankBranch;
        this.guildForm.address = res.data.address;
        this.flag =
          (res.data.status === 0 && res.data.hasMsg === true) ||
          res.data.status === 1;
        console.log(this.status);
        if (this.hasMsg) {
          if (res.data.idCardFile !== "") {
            const idCardFile = res.data.idCardFile.split(",");
            this.positiveImageUrlToServer = idCardFile[0];
            this.reverseImageUrlToServer = idCardFile[1];
            this.personImageUrlToServer = idCardFile[2];
          }
          if (res.data.businessLicence !== "") {
            this.companyImageUrlToServer = res.data.businessLicence;
            this.companyRadio = "1";
          } else {
            this.companyRadio = "0";
          }
        }
        if (!res.data.hasMsg && res.data.status === 0) {
          // 未认证状态
          this.$message({
            showClose: true,
            message: "帐号未认证，请尽快完成资质认证！",
            type: "success"
          });
        } else if (res.data.status === -1) {
          // 认证失败
          // (this.guildForm.address = res.data.address),
          // (this.selectOptions = [JSON.parse(res.data.address).pCode,JSON.parse(res.data.address).cCode]),
          try {
            // let temp = JSON.parse(res.data.address.replace(/\\/g, ""));
            // this.selectOptions = [temp.pCode, temp.cCode];
            this.getCity(res);
          } catch (error) {
            this.oldData = true;
            this.guildForm.address = res.data.address;
          }
          (this.guildForm.bankNumber = res.data.bankAccount),
            (this.guildForm.bankName = res.data.bankAccountName),
            (this.guildForm.bank = res.data.bankName),
            (this.guildForm.email = res.data.email);
          this.guildForm.addressDetail = res.data.addressDetail;
          if (res.data.businessLicence != "") {
            this.companyImageUrl =
              res.data.imgUrl + res.data.businessLicence.slice(0);
          }
          (this.positiveImageUrl =
            res.data.imgUrl + res.data.idCardFile.split(",")[0]),
            (this.reverseImageUrl =
              res.data.imgUrl + res.data.idCardFile.split(",")[1]),
            (this.personImageUrl =
              res.data.imgUrl + res.data.idCardFile.split(",")[2]);
          (this.guildForm.userName = res.data.realName),
            (this.guildForm.cardNumber = res.data.idCard);
        } else if (res.data.hasMsg && res.data.status === 0) {
          // 认证中，待审核状态
          try {
            // let temp = JSON.parse(res.data.address.replace(/\\/g, ""));
            // this.selectOptions = [temp.pCode, temp.cCode];
            this.getCity(res);
          } catch (error) {
            this.oldData = true;
            this.guildForm.address = res.data.address;
            console.log("gui11111", this.guildForm.address);
          }
          (this.guildForm.bankNumber = res.data.bankAccount),
            (this.guildForm.bankName = res.data.bankAccountName),
            (this.guildForm.bank = res.data.bankName),
            (this.guildForm.email = res.data.email),
            (this.guildForm.addressDetail = res.data.addressDetail),
            (this.companyImageUrl =
              res.data.imgUrl + res.data.businessLicence.slice(0)),
            (this.positiveImageUrl =
              res.data.imgUrl + res.data.idCardFile.split(",")[0]),
            (this.reverseImageUrl =
              res.data.imgUrl + res.data.idCardFile.split(",")[1]),
            (this.personImageUrl =
              res.data.imgUrl + res.data.idCardFile.split(",")[2]);
          (this.guildForm.userName = res.data.realName),
            (this.guildForm.cardNumber = res.data.idCard);
        } else if (res.data.hasMsg && res.data.status === 1) {
          // 认证通过状态
          // (this.selectOptions = [JSON.parse(res.data.address).pCode,JSON.parse(res.data.address).cCode]),

          try {
            // let temp = JSON.parse(res.data.address.replace(/\\/g, ""));
            // this.selectOptions = [temp.pCode, temp.cCode];
            this.getCity(res);
          } catch (error) {
            this.oldData = true;
            this.guildForm.address = res.data.address;
          }
          (this.guildForm.bankNumber = res.data.bankAccount),
            (this.guildForm.bankName = res.data.bankAccountName),
            (this.guildForm.bank = res.data.bankName),
            (this.guildForm.email = res.data.email),
            (this.guildForm.addressDetail = res.data.addressDetail),
            (this.companyImageUrl =
              res.data.imgUrl + res.data.businessLicence.slice(0)),
            (this.positiveImageUrl =
              res.data.imgUrl + res.data.idCardFile.split(",")[0]),
            (this.reverseImageUrl =
              res.data.imgUrl + res.data.idCardFile.split(",")[1]),
            (this.personImageUrl =
              res.data.imgUrl + res.data.idCardFile.split(",")[2]);
          (this.guildForm.userName = res.data.realName),
            (this.guildForm.cardNumber = res.data.idCard);
        }
      });
    },
    getCity(res) {
      pcCode.forEach(item => {
        let flag = false;
        if (item.name == res.data.bankProvince) {
          this.selectOptions.push(item.code);
          item.children.forEach(obj => {
            if (obj.name == res.data.bankCity) {
              this.selectOptions.push(obj.code);
              flag = true;
            }
          });
        }
        if (flag) {
          return;
        }
      });
    },
    submit() {
      if (
        this.positiveImageUrlToServer == "" ||
        this.reverseImageUrlToServer == "" ||
        this.personImageUrlToServer == ""
      ) {
        this.$message.error("身份证照片不能为空");
      }
      this.$refs["forms"].validate(valid => {
        if (!valid) {
          return false;
        }
        let selectAddress = {
          pCode: this.provinceCode,
          pName: this.provinceName,
          cCode: this.cityCode,
          cName: this.cityName
        };
        let bankProvince = this.provinceName;
        let bankCity = this.cityName;
        let data = {
          bankProvince: bankProvince,
          bankCity: bankCity,
          address: JSON.stringify(selectAddress),
          addressDetail: this.guildForm.addressDetail,
          authType: 3,
          bankAccount: this.guildForm.bankNumber.replace(/\s/g, ""),
          bankAccountName: this.guildForm.bankName,
          bankName: this.guildForm.bank,
          businessLicence: this.companyImageUrlToServer,
          email: this.guildForm.email,
          realName: this.guildForm.userName,
          idCard: this.guildForm.cardNumber,
          idCardFile: [
            this.positiveImageUrlToServer,
            this.reverseImageUrlToServer,
            this.personImageUrlToServer
          ].join(","),
          bankCounty: this.guildForm.bankCounty,
          bankBranch: this.guildForm.bankBranch,
          guildId: JSON.parse(
            window.sessionStorage.getItem("Admin-Account-Union")
          ).guildId
        };
        console.log(data);

        let errMsg = [];
        if (this.guildForm.userName != this.guildForm.bankName) {
          this.$message.error("身份证姓名与开户人姓名需一致");
          return;
        }
        if (this.guildForm.userName === "") {
          errMsg.push("姓名不能为空");
        } else if (this.guildForm.cardNumber === "") {
          errMsg.push("身份证号码不能为空");
        } else if (this.positiveImageUrlToServer === "") {
          errMsg.push("身份证正面照片不能为空");
        } else if (this.reverseImageUrlToServer === "") {
          errMsg.push("身份证反面照片不能为空");
        } else if (this.personImageUrlToServer === "") {
          errMsg.push("身份证手持照片不能为空");
        } else if (this.guildForm.bank === "") {
          errMsg.push("开户银行不能为空");
        } else if (this.guildForm.bankName === "") {
          errMsg.push("银行账户名不能为空");
        } else if (this.guildForm.bankNumber === "") {
          errMsg.push("银行卡号不能为空");
        } else if (this.guildForm.bankNumber.length > 19) {
          errMsg.push("银行卡号位数超过限制");
        }
        console.log(errMsg);
        if (errMsg.length > 0) {
          this.$message.error(errMsg[0]);
        } else {
          saveCertification(data)
            .then(res => {
              if (res.state === "ok") {
                this.$message.success("提交成功，请等待审核");
                this.status = 0;
                this.hasMsg = true;
                this.flag = true;
              } else if (res.state === "fail") {
                this.$message.error(res.message || "提交失败，请重试");
              }
            })
            .catch(err => {
              this.$message.error("网络链接失败，请刷新重试");
            });
        }
      });
    },

    // 图片上传
    handleAvatarSuccess(res, file) {
      if (res.state === "ok") {
        this.positiveImageUrl =
          res.data.resUrl + res.data.pictureUrl + "?id=" + new Date().getTime();
        this.positiveImageUrlToServer =
          res.data.pictureUrl + "?" + new Date().getTime();
        if (
          this.positiveImageUrlToServer != "" &&
          this.reverseImageUrlToServer != "" &&
          this.personImageUrlToServer != ""
        ) {
          this.guildForm.cardPic = this.positiveImageUrlToServer;
        }
      } else if (res.state === "fail") {
        this.$message.error(res.message || "图片上传失败，请重试!");
      }
    },
    reverseHandle(res, file) {
      if (res.state === "ok") {
        this.reverseImageUrl =
          res.data.resUrl + res.data.pictureUrl + "?id=" + new Date().getTime();
        this.reverseImageUrlToServer =
          res.data.pictureUrl + "?" + new Date().getTime();
        if (
          this.positiveImageUrlToServer != "" &&
          this.reverseImageUrlToServer != "" &&
          this.personImageUrlToServer != ""
        ) {
          this.guildForm.cardPic = this.reverseImageUrlToServer;
        }
      } else if (res.state === "fail") {
        this.$message.error(res.message || "图片上传失败，请重试!");
      }
    },
    personHandle(res, file) {
      if (res.state === "ok") {
        this.personImageUrl =
          res.data.resUrl + res.data.pictureUrl + "?id=" + new Date().getTime();
        this.personImageUrlToServer =
          res.data.pictureUrl + "?" + new Date().getTime();
        if (
          this.positiveImageUrlToServer != "" &&
          this.reverseImageUrlToServer != "" &&
          this.personImageUrlToServer != ""
        ) {
          this.guildForm.cardPic = this.personImageUrlToServer;
        }
      } else if (res.state === "fail") {
        this.$message.error(res.message || "图片上传失败，请重试!");
      }
    },
    companyHandle(res, file) {
      if (res.state === "ok") {
        this.companyImageUrl =
          res.data.resUrl + res.data.pictureUrl + "?id=" + new Date().getTime();
        this.companyImageUrlToServer =
          res.data.pictureUrl + "?" + new Date().getTime();
        if (this.companyImageUrlToServer != "") {
          this.guildForm.companyPic = this.companyImageUrlToServer;
        }
      } else if (res.state === "fail") {
        this.$message.error(res.message || "图片上传失败，请重试!");
      }
    },
    // 图片格式和大小判断
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error("上传头像图片只能是 JPG或PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return (isJPG || isPNG) && isLt2M;
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
  .headCter {
    text-align: center;
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
  .el-dialog__header {
    padding: 0 !important;
  }
  .el-dialog__body {
    width: 100%;
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    img {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
    }
  }
}
</style>
