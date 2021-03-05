<template>
  <div>
    <div class="page-crumbs">
      <div class="crumbs">
        <breadcrumb />
      </div>
    </div>
    <div v-if="status === -1 && (activeName === '1' || activeName === '2')">
      <!--<h3>初始数据信息。</h3>-->
    </div>
    <div
      class="head"
      v-else-if="status === 0 && (activeName === '1' || activeName === '2')"
    >
      <h3>您的资料已提交，正在等待审核。</h3>
    </div>
    <div
      class="pass"
      v-else-if="status === 1 && (activeName === '1' || activeName === '2')"
    >
      <h3>您的资质认证已通过。</h3>
    </div>
    <div
      class="notPass"
      v-else-if="status === 2 && (activeName === '1' || activeName === '2')"
    >
      <h3>
        您的资料未审核通过，认证失败，请检查资料后重新提交！拒绝原因：{{
          form.reason
        }}
      </h3>
    </div>

    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="个人资料" name="0">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <h3>个人资料</h3>
            <div class="extra">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="handleDownload"
                >编辑</el-button
              >
              <!-- <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  <h3>说明：</h3>
                  <p>
                    1.点击编辑按钮后，仅针对当时选项标签下的资料进行修改（个人资料、对账资料、认证资料）
                  </p>
                  <p>2.个人资料无需审核、对账资料及认证资料需要审核</p>
                </div>
                <i class="el-icon-question"></i>
              </el-tooltip> -->
            </div>
          </div>
          <div class="body">
            <el-form
              :model="form"
              :rules="rules"
              ref="personalFrom1"
              label-width="120px"
              class="form-personal"
            >
              <el-form-item label="性别：" prop="sex">
                <el-radio-group v-model="form.sex" :disabled="!isShow">
                  <el-radio-button label="1">汉子</el-radio-button>
                  <el-radio-button label="2">妹子</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="E-mail：" prop="email">
                <el-input
                  placeholder="输入E-mail"
                  :disabled="!isShow"
                  v-model="form.email"
                ></el-input>
              </el-form-item>
              <!--<el-form-item label="所在省市：" v-if="!isShow || oldData" prop="email">-->
              <!--<el-input placeholder="请选择省市" :disabled="!isShow" v-model="form.address"></el-input>-->
              <!--</el-form-item>-->
              <el-form-item label="所在省市： " prop="address">
                <el-cascader
                  ref="cityCascader"
                  class="js-city-cascader"
                  change-on-select
                  clearable
                  filterable
                  @change="handleCityChange"
                  :disabled="!isShow"
                  v-model="selectOptions"
                  :options="options"
                  :props="{
                    label: 'name',
                    value: 'code'
                  }"
                  style="width: 100%"
                ></el-cascader>
              </el-form-item>

              <el-form-item label="详细地址： " prop="addressDetail">
                <el-input
                  v-model="form.addressDetail"
                  :disabled="!isShow"
                  style="width:100%"
                  placeholder="请输入详细地址，便于平台发放奖品"
                ></el-input>
              </el-form-item>

              <el-form-item>
                <el-button
                  v-if="isShow"
                  type="info"
                  plain
                  @click="resSubmitForm"
                  :loading="submitting"
                  >取消</el-button
                >
                <el-button
                  v-if="isShow"
                  type="primary"
                  @click="submitForm('personalFrom1')"
                  :loading="submitting"
                  >保存</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="对账资料" name="2" v-if="false">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <h3>对账资料</h3>
            <div class="extra">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="handleDownload"
                >编辑</el-button
              >
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  <h3>说明：</h3>
                  <p>
                    1.点击编辑按钮后，仅针对当时选项标签下的资料进行修改（个人资料、对账资料、认证资料）
                  </p>
                  <p>2.个人资料无需审核、对账资料及认证资料需要审核</p>
                </div>
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
          </div>
          <div class="body">
            <el-form
              :model="form"
              :rules="rules"
              ref="personalFrom"
              label-width="140px"
              class="form-personal"
            >
              <el-form-item label="开户人姓名：" prop="bankName">
                <el-input
                  v-model="form.bankName"
                  :disabled="!isShow"
                  placeholder="请输入账户名"
                ></el-input>
              </el-form-item>
              <el-form-item label="银行卡号：" prop="bankNumber">
                <el-input
                  v-model="form.bankNumber"
                  :disabled="!isShow"
                  placeholder="请输入19位银行卡号，请勿空格"
                  maxlength="19"
                ></el-input>
              </el-form-item>
              <el-form-item label="开户银行：" prop="bank">
                <el-input
                  v-model="form.bank"
                  :disabled="!isShow"
                  placeholder="例如，中国工商银行天河支行"
                ></el-input>
              </el-form-item>
              <el-form-item label style="margin-top:-15px;"
                >提示：开户行信息不准确会导致打款失败。查询办法
                <el-tooltip class="item" effect="dark" placement="top-start">
                  <div slot="content">
                    <h3>拨打银行客服热线，根据提示语查询即可：</h3>
                    <div>
                      <p>中国银行：95566</p>
                      <p>工商银行：95588</p>
                      <p>建设银行：95533</p>
                      <p>农业银行：95599</p>
                      <p>招商银行：95555</p>
                      <p>中国邮政：95580</p>
                      <p>浦发银行：95528</p>
                      <p>中信银行：95558</p>
                      <p>交通银行：95559</p>
                    </div>
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="省市 : " prop="address">
                <el-cascader
                  ref="cityCascader"
                  class="js-city-cascader"
                  change-on-select
                  clearable
                  filterable
                  :disabled="!isShow"
                  v-model="citySelectOptions"
                  @change="handleCityChange2"
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
                  v-model="form.bankCounty"
                  style="width:40%"
                  :disabled="!isShow"
                  placeholder="请输入县级名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="开户行支行：" prop="address">
                <el-input
                  v-model="form.bankBranch"
                  style="width:40%"
                  :disabled="!isShow"
                  placeholder="开户行支行"
                ></el-input>
              </el-form-item>

              <el-form-item>
                <el-button
                  v-if="isShow"
                  type="info"
                  plain
                  @click="resSubmitForm"
                  :loading="submitting"
                  >取消</el-button
                >
                <el-button
                  v-if="isShow && !auditing2"
                  type="primary"
                  @click="submitForm('forms')"
                  :loading="submitting"
                  >提交审核</el-button
                >
                <el-button
                  v-if="isShow && auditing2"
                  type="primary"
                  :disabled="isShow && auditing2"
                  >审核中</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="认证资料" name="1" v-if="false">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <h3>认证资料</h3>
            <div class="extra">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="handleDownload"
                >编辑</el-button
              >
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  <h3>说明：</h3>
                  <p>
                    1.点击编辑按钮后，仅针对当时选项标签下的资料进行修改（个人资料、对账资料、认证资料）
                  </p>
                  <p>2.个人资料无需审核、对账资料及认证资料需要审核</p>
                </div>
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
          </div>
          <div class="body">
            <el-form
              ref="forms"
              :model="form"
              :rules="rules"
              label-width="140px"
            >
              <el-form-item label="认证类型 : ">
                <el-radio-group
                  v-model="form.type"
                  size="small"
                  :disabled="!isShow"
                >
                  <el-radio-button label="1">个人</el-radio-button>
                  <el-radio-button label="2">公司</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="姓名 : "
                v-if="form.type === '1' && activeName === '1'"
                prop="userName"
              >
                <el-input
                  v-model="form.userName"
                  style="width:40%"
                  :disabled="!isShow"
                  placeholder="姓名"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="身份证号码 : "
                v-if="form.type === '1' && activeName === '1'"
                prop="cardNumber"
              >
                <el-input
                  v-model="form.cardNumber"
                  style="width:40%"
                  :disabled="!isShow"
                  placeholder="身份证号码"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="公司名称 : "
                v-if="form.type === '2' && activeName === '1'"
                prop="name"
              >
                <el-input
                  v-model="form.name"
                  style="width:40%"
                  :disabled="!isShow"
                  placeholder="公司名称"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="营业执照扫描件 : "
                v-if="form.type === '2' && activeName === '1'"
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
                      :disabled="!isShow"
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
                v-if="form.type === '2' && activeName === '1'"
                prop="lawPerson"
              >
                <el-input
                  v-model="form.lawPerson"
                  style="width:40%"
                  :disabled="!isShow"
                  placeholder="真实姓名"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="法人身份证号码 : "
                v-if="form.type === '2' && activeName === '1'"
                prop="lawCardNumber"
              >
                <el-input
                  v-model="form.lawCardNumber"
                  style="width:40%"
                  :disabled="!isShow"
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
                      :disabled="!isShow"
                      :action="actionUrl"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                      :before-upload="beforeAvatarUpload"
                    >
                      <div v-if="!positiveImageUrl1 && form.type === '1'">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">身份证正面照</div>
                      </div>
                      <div v-if="!positiveImageUrl && form.type === '2'">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">身份证正面照</div>
                      </div>
                      <img
                        v-if="positiveImageUrl1 && form.type === '1'"
                        :src="positiveImageUrl1"
                        class="avatar"
                      />
                      <img
                        v-if="positiveImageUrl && form.type === '2'"
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
                      :disabled="!isShow"
                      :action="actionUrl"
                      :show-file-list="false"
                      :on-success="reverseHandle"
                      :before-upload="beforeAvatarUpload"
                    >
                      <!--<div v-if="!reverseImageUrl">-->
                      <!--<i class="el-icon-upload"></i>-->
                      <!--<div class="el-upload__text">身份证反面照</div>-->
                      <!--</div>-->
                      <!--<img v-if="reverseImageUrl" :src="reverseImageUrl" class="avatar">-->
                      <div v-if="!reverseImageUrl1 && form.type === '1'">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">身份证正面照</div>
                      </div>
                      <div v-if="!reverseImageUrl && form.type === '2'">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">身份证正面照</div>
                      </div>
                      <img
                        v-if="reverseImageUrl1 && form.type === '1'"
                        :src="reverseImageUrl1"
                        class="avatar"
                      />
                      <img
                        v-if="reverseImageUrl && form.type === '2'"
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
                      :disabled="!isShow"
                      :action="actionUrl"
                      :show-file-list="false"
                      :on-success="personHandle"
                      :before-upload="beforeAvatarUpload"
                    >
                      <!--<div v-if="!personImageUrl">-->
                      <!--<i class="el-icon-upload"></i>-->
                      <!--<div class="el-upload__text">个人手持身份证照片</div>-->
                      <!--</div>-->
                      <!--<img v-if="personImageUrl" :src="personImageUrl" class="avatar">-->
                      <div v-if="!personImageUrl1 && form.type === '1'">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">身份证正面照</div>
                      </div>
                      <div v-if="!reverseImageUrl && form.type === '2'">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">身份证正面照</div>
                      </div>
                      <img
                        v-if="personImageUrl1 && form.type === '1'"
                        :src="personImageUrl1"
                        class="avatar"
                      />
                      <img
                        v-if="personImageUrl && form.type === '2'"
                        :src="personImageUrl"
                        class="avatar"
                      />
                    </el-upload>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label style="margin-top:-10px;"
                >提示：上传图片格式为JPG或PNG，大小不超过2M
                <el-button
                  size="medium"
                  v-if="isShow"
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
              <el-form-item>
                <el-button
                  v-if="isShow"
                  type="info"
                  plain
                  @click="resSubmitForm"
                  :loading="submitting"
                  >取消</el-button
                >
                <el-button
                  v-if="isShow && !auditing"
                  type="primary"
                  @click="submitForm('forms')"
                  :loading="submitting"
                  >提交审核</el-button
                >
                <el-button
                  v-if="isShow && auditing"
                  type="primary"
                  :disabled="isShow && auditing"
                  >审核中</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import { auditingInfo, editAuditingInfo } from "@/api/account";
import pcCode from "@/datas/pc-code.json";

const ACTION_URL = `/guild/uploadFile.do`;

export default {
  name: "personalIndex",
  components: {
    Breadcrumb
  },
  data() {
    return {
      oldData: false,
      status: "",
      companyImageUrl: "",
      companyImageUrlToServer: "",
      positiveImageUrl: "",
      positiveImageUrlToServer: "",
      reverseImageUrl: "",
      reverseImageUrlToServer: "",
      personImageUrl: "",
      personImageUrlToServer: "",
      positiveImageUrl1: "",
      positiveImageUrlToServer1: "",
      reverseImageUrl1: "",
      reverseImageUrlToServer1: "",
      personImageUrl1: "",
      personImageUrlToServer1: "",
      actionUrl: ACTION_URL,
      options: pcCode,
      provinceCode: "",
      cityCode: "",
      selectOptions: [],
      citySelectOptions: [],
      isShow: false,
      auditing: false,
      auditing2: false,
      dialogVisible: false,
      activeName: "0",
      submitting: false,
      form: {
        userName: "",
        reason: "",
        type: "1",
        account: "",
        name: "",
        cardNumber: "",
        lawCardNumber: "",
        lawPerson: "",
        email: "",
        sex: "1",
        address: "",
        addressDetail: "",
        bank: "",
        bankName: "",
        bankNumber: "",
        bankAccountName: "",
        bankBranch: "",
        bankCounty: ""
      },
      rules: {
        // email: [
        //   {required: false, trigger: 'change'},
        // ],
        // sex: [
        //   {required: false, trigger: 'change'},
        // ],
        // addressDetail: [
        //   {required: true, message: "详细地址不能为空", trigger: "blur"}
        // ],
        // bank: [
        //   {required: true, message: "开户银行不能为空", trigger: "blur"}
        // ],
        // bankName: [
        //   {required: true, message: "银行账户名不能为空", trigger: "blur"}
        // ],
        // bankNumber: [
        //   {required: true, message: "银行卡号不能为空", trigger: "blur"}
        // ],
        // userName: [
        //   {required: true, message: "姓名不能为空", trigger: "blur"}
        // ],
        // cardNumber: [
        //   {required: true, message: "身份证号码不能为空", trigger: "blur"}
        // ],
        // cardPic: [
        //   {required: true, message: "身份证扫描件不能为空", trigger: "blur"}
        // ],
        // name: [
        //   {required: true, message: "公司名称不能为空", trigger: "blur"}
        // ],
        // companyPic: [
        //   {required: true, message: "营业执照扫描件不能为空", trigger: "blur"}
        // ],
        // lawPerson: [
        //   {required: true, message: "法人代表不能为空", trigger: "blur"}
        // ],
        // lawCardNumber: [
        //   {required: true, message: "法人身份证号码不能为空", trigger: "blur"}
        // ],
      }
    };
  },
  created() {
    this.handleClick();
    // this.getProvince();
  },
  methods: {
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

      const filterValue = value
        .filter(item => item !== "市辖区")
        .join(",")
        .replace(/,/g, "/");
      console.log(filterValue);
    },
    handleCityChange2(value) {
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

      const filterValue = value
        .filter(item => item !== "市辖区")
        .join(",")
        .replace(/,/g, "/");
      console.log(filterValue);
    },
    // 图片上传
    handleAvatarSuccess(res, file) {
      if (res.state === "ok") {
        this.positiveImageUrl =
          res.data.resUrl + res.data.pictureUrl + "?id=" + new Date().getTime();
        this.positiveImageUrlToServer =
          res.data.pictureUrl + "?id=" + new Date().getTime();
        this.positiveImageUrl1 =
          res.data.resUrl + res.data.pictureUrl + "?id=" + new Date().getTime();
        this.positiveImageUrlToServer1 =
          res.data.pictureUrl + "?id=" + new Date().getTime();
      } else if (res.state === "fail") {
        this.$message.error(res.message || "图片上传失败，请重试!");
      }
    },
    reverseHandle(res, file) {
      if (res.state === "ok") {
        this.reverseImageUrl =
          res.data.resUrl + res.data.pictureUrl + "?id=" + new Date().getTime();
        this.reverseImageUrlToServer =
          res.data.pictureUrl + "?id=" + new Date().getTime();
        this.reverseImageUrl1 =
          res.data.resUrl + res.data.pictureUrl + "?id=" + new Date().getTime();
        this.reverseImageUrlToServer1 =
          res.data.pictureUrl + "?id=" + new Date().getTime();
      } else if (res.state === "fail") {
        this.$message.error(res.message || "图片上传失败，请重试!");
      }
    },
    personHandle(res, file) {
      if (res.state === "ok") {
        this.personImageUrl =
          res.data.resUrl + res.data.pictureUrl + "?id=" + new Date().getTime();
        this.personImageUrlToServer =
          res.data.pictureUrl + "?id=" + new Date().getTime();
        this.personImageUrl1 =
          res.data.resUrl + res.data.pictureUrl + "?id=" + new Date().getTime();
        this.personImageUrlToServer1 =
          res.data.pictureUrl + "?id=" + new Date().getTime();
      } else if (res.state === "fail") {
        this.$message.error(res.message || "图片上传失败，请重试!");
      }
    },
    companyHandle(res, file) {
      if (res.state === "ok") {
        this.companyImageUrl =
          res.data.resUrl + res.data.pictureUrl + "?id=" + new Date().getTime();
        this.companyImageUrlToServer =
          res.data.pictureUrl + "?id=" + new Date().getTime();
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
    },
    handleClick() {
      const type = Number(this.activeName);
      editAuditingInfo(type).then(res => {
        console.log(res, "<=====res");
        if (res.data.auditType === 0) {
          this.form.sex = res.data.sex;
          // this.form.address = res.data.address;
          this.form.addressDetail = res.data.addressDetail;
          this.form.email = res.data.email;
          // this.selectOptions = [];
          try {
            let temp = JSON.parse(res.data.address.replace(/\\/g, ""));
            this.selectOptions = [temp.pCode, temp.cCode];
          } catch (error) {
            this.oldData = true;
            this.form.address = res.data.address;
          }
        } else if (res.data.auditType === 1 && res.data.authType === 1) {
          this.activeName = "1";
          this.form.reason = res.data.reason;
          this.form.type = "1";
          this.form.userName = res.data.realName;
          this.form.cardNumber = res.data.idCard;
          if (res.data.idCardFile !== "") {
            this.positiveImageUrl1 = res.data.idCardFileList[0];
            this.reverseImageUrl1 = res.data.idCardFileList[1];
            this.personImageUrl1 = res.data.idCardFileList[2];
            const idCardFile = res.data.idCardFile.split(",");
            this.positiveImageUrlToServer1 = idCardFile[0];
            this.reverseImageUrlToServer1 = idCardFile[1];
            this.personImageUrlToServer1 = idCardFile[2];
            this.positiveImageUrl = "";
            this.reverseImageUrl = "";
            this.personImageUrl = "";
          }
          if (res.data.state === 0) {
            this.auditing = true;
            this.status = 0;
          } else if (res.data.state === 1) {
            this.status = 1;
          } else if (res.data.state === 2) {
            this.status = 2;
          } else {
            this.status = -1;
          }
        } else if (res.data.auditType === 1 && res.data.authType === 2) {
          this.activeName = "1";
          this.form.reason = res.data.reason;
          this.form.type = "2";
          this.form.name = res.data.companyName;
          this.form.lawPerson = res.data.realName;
          this.form.lawCardNumber = res.data.idCard;
          this.companyImageUrl = res.data.imgUrl;
          this.companyImageUrlToServer = res.data.businessLicence;
          if (res.data.idCardFile !== "") {
            this.positiveImageUrl = res.data.idCardFileList[0];
            this.reverseImageUrl = res.data.idCardFileList[1];
            this.personImageUrl = res.data.idCardFileList[2];
            const idCardFile = res.data.idCardFile.split(",");
            this.positiveImageUrlToServer = idCardFile[0];
            this.reverseImageUrlToServer = idCardFile[1];
            this.personImageUrlToServer = idCardFile[2];
            this.positiveImageUrl1 = "";
            this.reverseImageUrl1 = "";
            this.personImageUrl1 = "";
          }
          if (res.data.state === 0) {
            this.auditing = true;
            this.status = 0;
          } else if (res.data.state === 1) {
            this.status = 1;
          } else if (res.data.state === 2) {
            this.status = 2;
          } else {
            this.status = -1;
          }
        } else if (res.data.auditType === 2) {
          this.form.bankCounty = res.data.bankCounty;
          this.form.bankBranch = res.data.bankBranch;
          this.provinceName = res.data.bankProvince;
          this.cityName = res.data.bankCity;
          pcCode.forEach(item => {
            let flag = false;
            if (item.name == res.data.bankProvince) {
              this.citySelectOptions.push(item.code);
              item.children.forEach(obj => {
                if (obj.name == res.data.bankCity) {
                  this.citySelectOptions.push(obj.code);
                  flag = true;
                }
              });
            }
            if (flag) {
              return;
            }
          });
          this.activeName = "2";
          this.form.reason = res.data.reason;
          this.selectOptions = [res.data.bankProvince, res.data.bankCity];
          this.form.bank = res.data.bankName;
          this.form.bankName = res.data.bankAccountName;
          this.form.bankNumber = res.data.bankAccount;
          if (res.data.state === 0) {
            this.auditing2 = true;
            this.status = 0;
          } else if (res.data.state === 1) {
            this.status = 1;
          } else if (res.data.state === 2) {
            this.status = 2;
          } else {
            this.status = -1;
          }
        }
      });
      console.log(type, "<=============console.log(type)");
    },
    handleDownload() {
      this.isShow = true;
    },
    resSubmitForm() {
      this.isShow = false;
    },
    async submitForm() {
      // 提交 loading
      this.submitting = true;
      let selectAddress = {
        pCode: this.provinceCode,
        pName: this.provinceName,
        cCode: this.cityCode,
        cName: this.cityName
      };
      var provinceName = this.provinceName;
      var cName = this.cityName;
      const data = {
        address: JSON.stringify(selectAddress),
        auditType: Number(this.activeName), //0:个人资料 1:认证资料2:对账资料
        authType: Number(this.form.type), //1-个人 2-公司 ,
        realName:
          this.form.type === "1" ? this.form.userName : this.form.lawPerson, //真实姓名/法人代表
        email: this.form.email,
        sex: this.form.sex,
        addressDetail: this.form.addressDetail, //详细地址
        // addressCity: this.activeName === '0' ? this.selectOptions[1] : '',//地址市
        // addressProvince: this.activeName === '0' ? this.selectOptions[0] : '',//地址省
        bankAccount: this.form.bankNumber, //银行卡号
        bankAccountName: this.form.bankName, //银行账户名
        bankName: this.form.bank, //开户银行账户
        bankCity: this.activeName == "0" ? "" : cName, //开户银行所在市
        bankProvince: this.activeName == "0" ? "" : provinceName, //开户银行所在省
        businessLicence: this.companyImageUrlToServer, //营业执照
        companyName: this.form.name, //公司名称
        bankBranch: this.form.bankBranch,
        bankCounty: this.form.bankCounty,
        idCard:
          this.form.type === "1"
            ? this.form.cardNumber
            : this.form.lawCardNumber, //身份号/法人身份证号
        idCardFile:
          this.form.type === "1"
            ? [
                //个人身份证文件ids
                this.positiveImageUrlToServer1,
                this.reverseImageUrlToServer1,
                this.personImageUrlToServer1
              ].join(",")
            : [
                //公司法人身份证文件ids
                this.positiveImageUrlToServer,
                this.reverseImageUrlToServer,
                this.personImageUrlToServer
              ].join(",")
      };
      console.log(data, "<<<<<<<=========data");
      if (Number(this.activeName) === 0 && this.selectOptions.length === 0) {
        this.$message.error("请选择省市");
        this.submitting = false;
        return;
      }
      if (Number(this.activeName) === 0 && this.form.email === "") {
        this.$message.error("请填写电子邮箱");
        this.submitting = false;
        return;
      }
      if (Number(this.activeName) === 0 && this.form.addressDetail === "") {
        this.$message.error("请填写详细地址");
        this.submitting = false;
        return;
      }
      if (Number(this.activeName) === 2 && this.form.bank === "") {
        this.$message.error("请填写开户银行");
        this.submitting = false;
        return;
      }
      if (Number(this.activeName) === 2 && this.form.bankName === "") {
        this.$message.error("请填写银行账户名");
        this.submitting = false;
        return;
      }
      if (Number(this.activeName) === 2 && this.form.bankNumber === "") {
        this.$message.error("请填写银行卡号");
        this.submitting = false;
        return;
      }
      if (
        Number(this.activeName) === 2 &&
        this.citySelectOptions.length === 0
      ) {
        this.$message.error("请填写开户银行所在省市");
        this.submitting = false;
        return;
      }
      if (
        Number(this.activeName) === 1 &&
        Number(this.form.type) === 2 &&
        this.form.name === ""
      ) {
        this.$message.error("请填写公司名称");
        this.submitting = false;
        return;
      }
      if (
        Number(this.activeName) === 1 &&
        Number(this.form.type) === 2 &&
        this.form.lawPerson === ""
      ) {
        this.$message.error("请填写法人姓名");
        this.submitting = false;
        return;
      }
      if (
        Number(this.activeName) === 1 &&
        Number(this.form.type) === 2 &&
        this.form.lawCardNumber === ""
      ) {
        this.$message.error("请填写法人身份证号码");
        this.submitting = false;
        return;
      }
      if (
        Number(this.activeName) === 1 &&
        Number(this.form.type) === 2 &&
        (this.companyImageUrlToServer === "" ||
          this.positiveImageUrlToServer === "" ||
          this.reverseImageUrlToServer === "" ||
          this.personImageUrlToServer === "")
      ) {
        this.$message.error("请上传所需营业和身份证文件");
        this.submitting = false;
        return;
      }
      if (
        Number(this.activeName) === 1 &&
        Number(this.form.type) === 1 &&
        this.form.userName === ""
      ) {
        this.$message.error("请填写姓名");
        this.submitting = false;
        return;
      }
      if (
        Number(this.activeName) === 1 &&
        Number(this.form.type) === 1 &&
        this.form.cardNumber === ""
      ) {
        this.$message.error("请填写身份证号码");
        this.submitting = false;
        return;
      }
      if (
        Number(this.activeName) === 1 &&
        Number(this.form.type) === 1 &&
        (this.positiveImageUrlToServer1 === "" ||
          this.reverseImageUrlToServer1 === "" ||
          this.personImageUrlToServer1 === "")
      ) {
        this.$message.error("请上传所需身份证文件");
        this.submitting = false;
        return;
      }

      await auditingInfo(data)
        .then(res => {
          this.submitting = false;
          if (res.state === "ok") {
            this.$message.success(res.message || "提交成功");
            this.handleClick();
            this.isShow = false;
          } else if (res.state === "fail") {
            this.$message.error(res.message || "网络链接失败，请刷新重试");
          }
        })
        .catch(() => {
          this.submitting = false;
          this.$message.error("提交失败，请重试");
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.form-personal {
  max-width: 500px;
}

.el-card {
  border: none;
  .el-card__header {
    background: none;
  }
}

.head {
  margin-bottom: 20px;
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
  margin-bottom: 20px;
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
  margin-bottom: 20px;
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
</style>
