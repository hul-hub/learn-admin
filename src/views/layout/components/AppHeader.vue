<template>
  <section
    :style="{ backgroundColor: platForm ? '#fff' : '' }"
    class="app-layout-header clearfix"
  >
    <div class="header-left">
      <button class="header-button" @click="handleOpenSidebar">
        <!-- eslint-disable max-len -->
        <svg
          t="1527227540201"
          class="icon"
          style="
            width: 1em;
            height: 1em;
            vertical-align: middle;
            fill: currentColor;
            overflow: hidden;
          "
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="1024"
          data-spm-anchor-id="a313x.7781069.0.i0"
        >
          <path
            d="M192.037 287.953h640.124c17.673 0 32-14.327 32-32s-14.327-32-32-32H192.037c-17.673 0-32 14.327-32 32s14.327 32 32 32zM192.028 543.17h393.608c17.673 0 32-14.327 32-32s-14.327-32-32-32H192.028c-17.673 0-32 14.327-32 32s14.327 32 32 32zM832.161 735.802H192.037c-17.673 0-32 14.327-32 32s14.327 32 32 32h640.124c17.673 0 32-14.327 32-32s-14.327-32-32-32zM705.162 671.594l160-160-160-160z"
            fill
            p-id="1025"
          />
        </svg>
      </button>
    </div>
    <div :class="platForm === '666' ? 'right' : 'right1'">
      <div
        v-if="
          isBoss == 1 &&
            checkMixedPointShow &&
            isShowServerRatio == 1 &&
            (hadSubPwd2 === 1 || hadSubPwd === 1)
        "
        class="tipItem"
        style="padding-top: 2px"
        @click="$router.push(`/gameManage/Mixed/index`)"
      >
        <i class="el-icon-s-release" style="margin-right: 5px"></i>
        <span title="系统消息">通服点位表</span>
      </div>
      <div @click="showDrawer" class="tipItem">
        <el-badge :value="messNum" :hidden="messNum == 0" style="color: #fff">
          <i class="el-icon-message-solid" style="margin-right: 5px"></i>
          <span title="系统消息">消息</span>
        </el-badge>
      </div>
      <el-dropdown
        class="avatar-container right-menu-item"
        trigger="hover"
        placement="bottom"
      >
        <div class="avatar-wrapper">
          <span class="nickname">{{ "我的工作台" }}</span>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown" placement="bottom-end">
          <el-dropdown-item>
            <span @click="showdownloadDrawer">下载任务</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown
        class="avatar-container right-menu-item"
        trigger="hover"
        placement="bottom"
      >
        <div class="avatar-wrapper">
          <!-- eslint-disable max-len -->
          <span class="nickname">{{ showName }}</span>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown" placement="bottom-end">
          <el-dropdown-item v-if="isBoss === 1">
            <router-link to="/personal/index">{{ "个人中心" }}</router-link>
          </el-dropdown-item>
          <!--保证金上一版本判断： v-if="isBoss === 1"-->
          <el-dropdown-item v-if="false">
            <span
              @click="showGloble"
              style="display: block; margin: 0 -20px; text-align: center"
              >{{ "我的保证金" }}</span
            >
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="logout" style="display: block">{{ "退出登录" }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="header-logout" @click="logout" title="退出">
        <svg class="icon-logout" viewBox="0 0 24 24">
          <path
            d="M9 20h-4c-0.6 0-1-0.4-1-1v-14c0-0.6 0.4-1 1-1h4c0.6 0 1-0.4 1-1s-0.4-1-1-1h-4c-1.7 0-3 1.3-3 3v14c0 1.7 1.3 3 3 3h4c0.6 0 1-0.4 1-1s-0.4-1-1-1z"
          />
          <path
            d="M21.9 12.4c0.1-0.2 0.1-0.5 0-0.8-0.1-0.1-0.1-0.2-0.2-0.3l-5-5c-0.4-0.4-1-0.4-1.4 0s-0.4 1 0 1.4l3.3 3.3h-9.6c-0.6 0-1 0.4-1 1s0.4 1 1 1h9.6l-3.3 3.3c-0.4 0.4-0.4 1 0 1.4 0.2 0.2 0.5 0.3 0.7 0.3s0.5-0.1 0.7-0.3l5-5c0.1-0.1 0.2-0.2 0.2-0.3z"
          />
        </svg>
        <span>退出</span>
      </div>
    </div>

    <div class="logo">
      <router-link v-if="!platForm" :to="{ path: '/' }">
        <div v-if="filters.showTosub">
          <img src="../../../assets/logo.png" alt />
          <h1>游戏推广平台</h1>
        </div>
        <div v-else>
          <img :src="filters.mediaUrl" alt />
          <h1>{{ filters.platName }}</h1>
        </div>
      </router-link>

      <router-link v-if="platForm === '666'" :to="{ path: '/' }">
        <div>
          <img src="../../../assets/logo.6661.png" alt id="imgs" />
        </div>
      </router-link>
    </div>

    <sidebar
      v-if="platForm"
      class="app-layout-sidebar"
      mode="horizontal"
      :floatLeft="true"
      :routes="permission_routers"
    ></sidebar>
    <el-drawer :visible.sync="drawer" direction="rtl" class="drawerTile">
      <div slot="title" style="font-weight: 700; font-size: 14px">
        <i class="el-icon-message-solid" style="margin-right: 5px"></i>消息提醒
      </div>
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="公告" name="first">
          <div class="drawerCon flex col" v-infinite-scroll="loadMore">
            <div
              class="flex between drawerConItem"
              @click="showMessDetail(item.postId, item.readState)"
              :class="{ activeItem: item.readState == 0 }"
              v-for="(item, index) in list"
              :key="index"
            >
              <div style="padding-left: 15px">{{ item.postTitle }}</div>
              <div style="padding-right: 15px">
                {{ item.postDate | formatTime2 }}
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="系统消息" name="second">
          <div class="drawerCon flex col" v-infinite-scroll="loadMore2">
            <div
              class="flex between drawerConItem"
              @click="showMessDetail2(item.postId, item.readState)"
              :class="{ activeItem: item.readState == 0 }"
              v-for="(item, index) in list2"
              :key="index"
            >
              <div style="padding-left: 15px">{{ item.postTitle }}</div>
              <div style="padding-right: 15px">
                {{ item.postDate | formatTime2 }}
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
    <el-dialog
      title="公告详情"
      :visible.sync="dialogConShow"
      width="50%"
      :modal-append-to-body="false"
    >
      <div
        style="
          border-left: 5px solid #409eff;
          padding-left: 5px;
          font-size: 18px;
        "
      >
        {{ dialog.postTitle }}
      </div>
      <div class="subtitle">
        发布时间：
        <span>{{ dialog.postDate | formatTime }}</span>
        可见人群：
        <span>{{ dialog.visibleCrowd | visibleCrowdFilter }}</span>
      </div>
      <div v-html="dialog.postContent" class="ql-editor"></div>
    </el-dialog>
    <!--<el-dialog-->
    <!--title="消息提醒"-->
    <!--:visible.sync="dialogShow"-->
    <!--:modal-append-to-body="false"-->
    <!--width="350px"-->
    <!--center-->
    <!--&gt;-->
    <!--<p style="margin-bottom: -10px 0;font-size: 16px">-->
    <!--您有一条新的消息，请及时查看~-->
    <!--</p>-->
    <!--<span slot="footer" class="dialog-footer">-->
    <!--<el-button type="primary" @click="closeDialogShow">-->
    <!--立即查看-->
    <!--</el-button>-->
    <!--</span>-->
    <!--</el-dialog>-->
    <el-dialog
      title="我的保证金"
      :visible.sync="dialogVisible"
      width="30%"
      :modal-append-to-body="false"
    >
      <div>
        <el-row class="flex mid mb10">
          <el-col :span="12" class="flex end">保证金金额（元）：</el-col>
          <el-col :span="12">
            {{ bailGear }}
            <!-- <el-button
              v-if="refundStatus === 0"
              type="text"
              style="margin-left:15px"
              @click="innerVisibleChange"
              >申请退款</el-button
            >-->
            <el-button
              v-if="refundStatus !== 0"
              type="text"
              style="margin-left: 15px"
              >{{
                refundStatus === 2
                  ? "退款中"
                  : refundStatus === 1
                  ? "退款完成"
                  : ""
              }}</el-button
            >
          </el-col>
        </el-row>
        <el-row class="flex mid mb20">
          <el-col :span="12" class="flex end">支付时间：</el-col>
          <el-col :span="12">{{ orderTime }}</el-col>
        </el-row>
        <el-row class="flex mid mb20">
          <el-col :span="12" class="flex end">支付宝账号：</el-col>
          <el-col :span="12">{{ aliPayAccount }}</el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small"
          >返回首页</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      width="30%"
      title="申请退款"
      :visible.sync="innerVisible"
      :modal-append-to-body="true"
    >
      <div>
        <el-row class="flex mid mb20">
          <el-col :span="12" class="flex end">退款金额（元）：</el-col>
          <el-col :span="12">{{ bailGear }}</el-col>
        </el-row>
        <el-row class="flex mid mb20">
          <el-col :span="12" class="flex end">退款支付宝账号：</el-col>
          <el-col :span="8">
            <el-input
              v-model="aliPayAccountIput"
              placeholder="退款支付宝账号"
            ></el-input>
          </el-col>
        </el-row>
        <el-row class="flex mid mb20">
          <el-col :span="12" class="flex end">支付宝用户名：</el-col>
          <el-col :span="8">
            <el-input
              v-model="aliPayAccountName"
              placeholder="支付宝实名认证姓名"
            ></el-input>
          </el-col>
        </el-row>
        <el-row class="flex end mb20"
          >支付宝信息仅用于核对保证金退款账号信息，本平台将不作他用。</el-row
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="refundCash" size="small" type="primary"
          >提交申请</el-button
        >
      </span>
    </el-dialog>
    <!-- 待签署合同提醒弹窗 -->
    <el-dialog
      v-if="
        isBoss == 1 && (hadSubPwd2 == 0 || hadSubPwd == 1) && isFormalPwd == 1
      "
      title="待签署合同提醒"
      :visible.sync="centerDialogVisible"
      width="24%"
      center
      :append-to-body="true"
      @close="handleClose"
    >
      <div class="lineHeight">尊敬的用户，您好：</div>
      <div class="lineHeight" style="color: red">
        系统检测到您有待签署的合同！
      </div>
      <div class="lineHeight">
        为了保障您的合法权益，请先签署网络合作协议，签署成功后即可
      </div>
      <div>正常推广游戏。</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCheck" type="primary">立即查看</el-button>
        <el-button @click="centerDialogVisible = false">暂不处理</el-button>
      </span>
    </el-dialog>
    <!-- 修改密码 -->
    <el-dialog
      title="提示"
      :visible.sync="passWordDialogVisible"
      width="30%"
      :append-to-body="true"
    >
      <span
        >该账号的登录密码不符合平台新密码规则，为避免账号出现问题，请及时修改密码！</span
      >
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closePassword">去修改密码</el-button>
      </span>
    </el-dialog>
    <el-drawer
      title="下载任务"
      :visible.sync="drawerDownload"
      :modal-append-to-body="false"
    >
      <div class="draweDiv" v-for="(item, index) in drawerList" :key="index">
        <div>日期：{{ item.optDate }}</div>
        <div class="mt10 mb10">文件：{{ item.fileName }}</div>
        <div class="flex between mid">
          <div>
            状态：
            <span
              :class="
                item.status == 1
                  ? 'addStyle'
                  : item.status == 2
                  ? 'addStyle2'
                  : ''
              "
              >{{ item.statusStr }}</span
            >
          </div>
          <div>
            <el-button
              v-if="item.status == 1"
              @click="download(item.downloadLink)"
              type="primary"
              plain
              size="mini"
              >下载</el-button
            >
            <el-button
              v-if="item.status == 2"
              @click="cancel(item.taskId)"
              type="danger"
              plain
              size="mini"
              >取消</el-button
            >
          </div>
        </div>
      </div>
    </el-drawer>
  </section>
</template>

<script>
// let timer = null;
let socket;
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import moment from "moment";
import http from "@/utils/http";
import { mapGetters } from "vuex";
import store from "@/store";
import { findPrivateLogo, getWebSocketUrl } from "@/api/tools";
import Sidebar from "./Sidebar";
import md5 from "js-md5";
import Cookies from "js-cookie";
// @TODO: will fix bug 一级菜单输出如果redirect = 'noredirect' 时候, 路由的 path 会输出 '#/noredirect'
export default {
  name: "AppHeader",
  components: {
    Sidebar
  },
  props: {
    routes: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      hadSubPwd2: "",
      isFormalPwd: "",
      isShowServerRatio: "",
      activeName: "first",
      centerDialogVisible: false,
      drawerDownload: false,
      passWordDialogVisible: false,
      drawerList: [],
      refundStatus: 0,
      isBoss: "",
      dialogVisible: false,
      innerVisible: false,
      aliPayAccount: "",
      aliPayAccountIput: "",
      aliPayAccountName: "",
      payRecordId: "",
      bailGear: "",
      orderTime: "",
      socket: {},
      platForm: undefined,
      checkMixedPointShow: false,
      platForm2: process.env.VUE_APP_PLATFORM,
      filters: {
        mediaUrl: "",
        platName: "",
        mark: "",
        showTosub: true
      },
      drawer: false,
      list: [], //人工公告
      list2: [], //系统消息
      messNum: 0,
      dialogConShow: false,
      dialog: {},
      dialogShowFlag: true,
      dialogShow: false,
      pageNo: 1,
      pageNo2: 1,
      pageSize: 25,
      listOrign: [],
      listSegment: [],
      listOrign2: [],
      listSegment2: [],
      tmpMessNum: 0,
      first: ""
    };
  },
  computed: {
    ...mapGetters([
      "account",
      "roles",
      "permission_routers",
      "hadSubPwd",
      "firstLogin"
    ]),
    showName() {
      const { realName, loginName } = this.account;
      const prefixCall = this.getPrefixCall(this.roles);

      if (realName) {
        return `${prefixCall}${realName}`;
      } else if (loginName) {
        return `${prefixCall}${loginName}`;
      }

      return "--";
    }
  },
  created() {
    this.first = sessionStorage.getItem("firstLogin");
    this.getWebSocket();
    store.dispatch("getDetailsUserInfo").then(() => {
      this.channelPost();
      this.isBoss = this.account.isGuildBoss;
      console.log(this.isBoss);
      if (this.isBoss === 1) {
        this.checkMixedPoint();
      }
      if (this.isBoss === 1 && this.firstLogin == 1) {
        this.guildContract();
      }
      if (this.isBoss === 1 && this.first == "1") {
        this.guildContract();
        sessionStorage.setItem("firstLogin", "0");
      }
    });
    this.getCookies();
    this.hadSubPwd2 = JSON.parse(
      window.sessionStorage["Admin-Account-Union"]
    ).hadSubPwd;
    this.isFormalPwd = JSON.parse(
      window.sessionStorage["Admin-Account-Union"]
    ).isFormalPwd;
    this.isShowServerRatio = JSON.parse(
      window.sessionStorage["Admin-Account-Union"]
    ).isShowServerRatio;
    console.log(this.isFormalPwd, this.isBoss);
    if (
      this.isFormalPwd == 0 &&
      JSON.parse(window.sessionStorage["Admin-Account-Union"]).isGuildBoss == 1
    ) {
      this.passWordDialogVisible = true;
    } else {
      this.passWordDialogVisible = false;
    }

    // clearTimeout(timer);
    // this.startTimer();
  },
  watch: {
    messNum() {
      if (this.tmpMessNum != this.messNum) {
        this.dialogShowFlag = true;
      }
      if (this.messNum == 0) {
        this.$notify.closeAll();
      }
    }
  },
  filters: {
    visibleCrowdFilter(val) {
      switch (val) {
        case 1:
          return "渠道";
        case 2:
          return "全部";
      }
    },
    formatTime(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
    formatTime2(time) {
      return moment(time).format("MM-DD");
    }
  },
  methods: {
    closePassword() {
      this.$router.push(`/personal/password`);
      this.passWordDialogVisible = false;
    },
    handleClick(tab, event) {
      this.pageNo = 1;
    },
    handleCheck() {
      this.centerDialogVisible = false;
      this.$router.push(`/gameManage/admission/index`);
      this.$store.dispatch("setFirstLogin", 0);
    },
    handleClose() {
      this.$store.dispatch("setFirstLogin", 0);
    },
    //校验是否要签署合同
    guildContract() {
      const query = {
        guildId: JSON.parse(
          window.sessionStorage.getItem("Admin-Account-Union")
        ).guildId
      };
      http.get2("/guildContract.check.do", query).then(res => {
        if (res.state == "ok") {
          console.log(res.message);
        } else {
          this.centerDialogVisible = true;
        }
      });
    },
    //校验是否自建体系
    checkMixedPoint() {
      const query = {
        guildId: JSON.parse(
          window.sessionStorage.getItem("Admin-Account-Union")
        ).guildId
      };
      http.get2("/checkMixedPointShow.do", query).then(res => {
        if (res.state == "ok") {
          this.checkMixedPointShow = true;
        } else {
          console.log("错误");
        }
      });
    },
    showdownloadDrawer() {
      this.myExportWorking();
    },
    myExportWorking() {
      const data = {
        userId: this.account.userId
      };
      http.get2("/guild/myExportWorking.get.do", data).then(res => {
        if (res.state == "ok") {
          this.drawerList = res.data;
          this.drawerDownload = true;
        } else {
          this.$message.error(res.message || "获取下载任务失败");
          this.drawerDownload = false;
        }
      });
    },
    download(item) {
      let a = document.createElement("a");
      a.href = item;
      a.click();
    },
    cancel(item) {
      const data = {
        taskId: item
      };
      http.get2("/guild/cancel.export.do", data).then(res => {
        if (res.state == "ok") {
          this.$message.success(res.message);
          this.myExportWorking();
        } else {
          this.$message.error(res.message || "取消任务失败");
        }
      });
    },
    innerVisibleChange() {
      this.innerVisible = true;
      this.aliPayAccountIput = this.aliPayAccount;
    },
    refundCash() {
      if (this.aliPayAccountIput == "" || this.aliPayAccountIput == undefined) {
        this.$message.error("请填写退款支付宝账号");
        return;
      }
      if (this.aliPayAccountName == "" || this.aliPayAccountName == undefined) {
        this.$message.error("请填写支付宝实名认证姓名");
        return;
      }
      const data = {
        guildId: this.account.guildId,
        payRecordId: this.payRecordId,
        refundAccount: this.aliPayAccountIput,
        refundAccountName: this.aliPayAccountName
      };
      const url = `/guild/refundCash.do`;
      http.postForm(url, data).then(res => {
        if (res.state === "ok") {
          this.innerVisible = false;
          this.dialogVisible = false;
          this.$message.success(res.message || "申请成功");
        } else if (res.state === "fail") {
          this.$message.error(res.message || "申请失败");
        }
      });
    },
    showGloble() {
      this.guildBail();
      this.dialogVisible = true;
    },
    guildBail() {
      const data = {
        guildId: this.account.guildId
      };
      const url = `/guild/guildBail.getOne.do`;
      http.get2(url, data).then(res => {
        if (res.state === "ok") {
          this.refundStatus = res.data.refundStatus ? res.data.refundStatus : 0;
          this.aliPayAccount = res.data.aliPayAccount;
          this.bailGear = res.data.bailGear;
          this.orderTime = res.data.orderTime;
          this.payRecordId = res.data.payRecordId;
        } else if (res.state === "fail") {
          this.$message.error(res.message || "获取失败，请重试");
        }
      });
    },
    getWebSocket() {
      getWebSocketUrl().then(res => {
        if (res.state == "ok") {
          const TOKEN = Cookies.get("sso_sessionid2");
          const INIT_KEY = "init_123456";
          let private_key = "";
          let url = "";
          if (process.env.VUE_APP_API_URL == "https://c.62wy.com") {
            url = "wss://" + res.message + "/ws/websocket";
          } else {
            url = "ws://" + res.message + "/ws/websocket";
          }
          socket = new WebSocket(url);
          var send = (operation, message = {}) => {
            const data = {};
            data.operation = operation;
            data.message = { ...message };
            operation === 1 && (data.message.requestId = TOKEN);
            const sign = `${operation}${JSON.stringify(data.message)}${
              operation === 1 ? INIT_KEY : private_key
            }`;
            data.sign = md5(sign);
            if (socket.readyState === 1) {
              socket.send(JSON.stringify(data));
            }
          };
          // this.socket = socket;
          socket.onopen = function({ data }) {
            send(1);
          };
          let time;
          let timer;
          let _this = this;
          socket.onmessage = function({ data }) {
            const res = JSON.parse(data);
            time = 3 * 60 * 1000;
            if (res.state === "1") {
              if (res.type === 1) {
                private_key = res.data;
                console.group("socket: init success");
                console.groupEnd();
              } else if (res.type === 2) {
                let data = res.data;
                if (data === "CS_ChannelPost") {
                  _this.channelPost();
                }
              }
            }
            // clearInterval(timer);
            // timer = setInterval(function() {
            //   send(5);
            // }, time);
          };

          socket.onclose = function() {
            console.group("socket: close");
            socket = new WebSocket(url);
            send(1);
            _this.$message({
              message: "socket断开连接，若无法接收信息，请刷新页面重连！",
              duration: 2000,
              type: "error"
            });
            console.groupEnd();
          };
        }
      });
    },
    getCookies() {
      var c_param = "";
      if (document.cookie.length > 0) {
        var arr = document.cookie.split("; ");
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split("="); //再次切割
          //判断查找相对应的值
          if (arr2[0] == "Admin-Token-platform") {
            c_param = arr2[1];
            //保存到保存数据的地方
          }
        }
        this.filters.mark = c_param;
        this.findPrivateLogo();
      }
    },
    findPrivateLogo() {
      const data = {
        postfixName: this.filters.mark
      };
      findPrivateLogo(data)
        .then(res => {
          if (res.state === "fail") {
            this.$message.error(res.message || "获取失败，请重试");
            return;
          } else {
            if (res.data.privateName !== "" && res.data.logoImage !== "") {
              this.filters.platName = res.data.privateName;
              this.filters.mediaUrl = res.data.logoImage;
              this.filters.showTosub = false;
            }
            if (
              (res.data.privateName === "" && res.data.logoImage === "") ||
              (res.data.privateName === null && res.data.logoImage === null)
            ) {
              this.filters.showTosub = true;
            }
          }
        })
        .catch(e => {
          this.$message.error("查询失败，请重试");
        });
    },
    logout() {
      this.$store.dispatch("logOut").then(() => {
        // 退出成功, 重定向到登录页面
        // this.$router.replace('/login');
        // console.log(window.location.origin)
        // window.location.href = window.location.origin;
        if (this.platForm === "666") {
          this.$router.replace("/login");
        } else if (this.platForm2 === "newPlatform") {
          this.$router.replace("/login");
        } else {
          window.location.href =
            this.filters.mark !== ""
              ? window.location.origin + "/?platform=" + this.filters.mark
              : window.location.origin;
        }

        // 退出成功, 重新刷新页面, 初始化程序; 防止切换不同权限账号时路由渲染出问题
        // window.location.reload();

        // window.location.assign("http://c.91vv.com")
      });
    },
    handleOpenSidebar() {
      this.$emit("openSidebar");
    },
    // 获取前缀称呼
    getPrefixCall(roles) {
      if (roles.includes("boss")) {
        return "渠道 - ";
      }
      if (roles.includes("leader")) {
        return "主渠道 - ";
      }
      if (roles.includes("seoer")) {
        return "子渠道 - ";
      }

      return "";
    },
    // 消息通知相关业务
    // startTimer() {
    //   timer = setInterval(() => {
    //     this.channelPost();
    //   }, 5000);
    // },
    // clearTimer() {
    //   clearTimeout(timer);
    // },
    showDrawer() {
      this.drawer = true;
    },
    async channelPost() {
      let data = {
        isGuildBoss: this.account.isGuildBoss,
        userId: this.account.userId,
        guildId: this.account.guildId
      };
      try {
        const res = await http.get2("/guild/ChannelPostNew.list.do", data);
        if (res.state === "fail") {
          this.$message.error(res.message || "获取消息通知列表失败");
          // clearTimeout(timer);
        } else if (res.state === "ok") {
          this.messNum = res.data.newMessageNum;
          if (this.dialogShowFlag && res.data.remindWay == 1) {
            //this.dialogShow = true;
            this.$notify.closeAll();
            this.$notify({
              title: "消息提醒",
              dangerouslyUseHTMLString: true,
              message: `
                        <div style="display: flex;flex-direction: column;align-items: center;margin-left: 22px;">
                          <span style="margin: 15px 0;display: block;">您有一条新的消息，请及时查看~</span>
                          <button style="width: 100px" type="button" class="el-button el-button--primary">
                            <span>立即查看</span>
                          </button>
                        </div>
                        `,
              onClick: () => {
                this.closeDialogShow();
                this.$notify.closeAll();
              },
              onClose: () => {
                this.tmpMessNum = res.data.newMessageNum;
              },
              offset: 200,
              duration: 0
            });
            this.dialogShowFlag = false;
          }
          //this.list = res.data.channelPostGuildEntities;
          this.listOrign = res.data.channelPostGuildEntities.filter(item => {
            if (item.postType == 2) return item;
          });
          this.listOrign2 = res.data.channelPostGuildEntities.filter(item => {
            if (item.postType == 1) return item;
          });
          this.getListSegment(this.listOrign);
          this.getListSegment2(this.listOrign2);
          this.pageNo = 1;
          this.pageNo2 = 1;
          const data = this.getListByPage();
          this.list = data;
          const data2 = this.getListByPage2();
          this.list2 = data2;
          //this.list = this.listOrign
        }
      } catch (error) {
        console.error("获取消息通知列表异常");
        // clearTimeout(timer);
      }
    },
    async showMessDetail(postId, readState) {
      try {
        const res = await http.get2("/guild/ChannelPost.get.do", {
          postId,
          userId: this.account.userId
        });
        if (res.state === "fail") {
          this.$message.error(res.message || "获取消息失败");
        } else if (res.state === "ok") {
          this.dialog = res.data;
          this.dialogConShow = true;
          this.drawer = false;
          if (readState == 0) {
            this.messNum -= 1;
          }
          this.list.forEach(item => {
            if (item.postId == postId) {
              item.readState = 1;
            }
          });
        }
      } catch (error) {
        this.$message.error("获取消息异常");
      }
    },
    closeDialogShow() {
      this.dialogShow = false;
      this.drawer = true;
    },
    loadMore() {
      const data = this.getListByPage();
      if (data.length === 0) {
        return;
      }
      this.list = this.list.concat(data);
    },
    getListSegment(list) {
      const len = list.length;
      const n = this.pageSize;
      const lineNum = len % n === 0 ? len / n : Math.floor(len / n + 1);
      const res = [];
      for (let i = 0; i < lineNum; i++) {
        let temp = list.slice(i * n, i * n + n);
        res.push(temp);
      }
      this.listSegment = res;
    },
    getListByPage() {
      const data = this.listSegment[this.pageNo - 1];
      this.pageNo++;
      if (data) {
        return data;
      } else {
        return [];
      }
    },
    async showMessDetail2(postId, readState) {
      try {
        const res = await http.get2("/guild/ChannelPost.get.do", {
          postId,
          userId: this.account.userId
        });
        if (res.state === "fail") {
          this.$message.error(res.message || "获取消息失败");
        } else if (res.state === "ok") {
          this.dialog = res.data;
          this.dialogConShow = true;
          this.drawer = false;
          if (readState == 0) {
            this.messNum -= 1;
          }
          this.list2.forEach(item => {
            if (item.postId == postId) {
              item.readState = 1;
            }
          });
        }
      } catch (error) {
        this.$message.error("获取消息异常");
      }
    },
    loadMore2() {
      const data = this.getListByPage2();
      if (data.length === 0) {
        return;
      }
      this.list2 = this.list2.concat(data);
    },
    getListSegment2(list2) {
      const len = list2.length;
      const n = this.pageSize;
      const lineNum = len % n === 0 ? len / n : Math.floor(len / n + 1);
      const res = [];
      for (let i = 0; i < lineNum; i++) {
        let temp = list2.slice(i * n, i * n + n);
        res.push(temp);
      }
      this.listSegment2 = res;
    },
    getListByPage2() {
      const data = this.listSegment2[this.pageNo2 - 1];
      this.pageNo2++;
      if (data) {
        return data;
      } else {
        return [];
      }
    }
  }
};
</script>

<style lang="scss">
$height: 50px;
$background: #2e6fac;
$bgHoverColor: #427db4;

.app-layout-header {
  height: $height;
  background-color: $background;
  color: #fff;
  overflow: hidden;
  position: relative;
  z-index: 1002;

  .header-button {
    outline: none;
    border: none;
    cursor: pointer;
    background-color: transparent;
    padding: 0 15px;
    color: #fff;
    font-size: 22px;
    display: inline-block;
    line-height: 50px;
  }

  .header-left {
    display: none;
  }

  .logo {
    float: left;
    line-height: $height;
    padding: 0 20px;

    img {
      height: $height - 20px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 12px;
    }

    h1 {
      color: #fff;
      font-size: 16px;
      margin: 0;
      font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica, sans-serif;
      font-weight: 400;
      display: inline-block;
      vertical-align: middle;
    }
  }

  .header-nav {
    float: left;
    line-height: $height;
    margin-left: 10px;

    a {
      display: inline-block;
      padding: 0 15px;
      transition: background-color 0.25s;
      &:hover {
        background-color: $bgHoverColor;
      }
    }
  }
  .right {
    float: right;
    padding-right: 10px;
    line-height: $height;
    color: #fff;
    height: 50px;
    .el-dropdown {
      padding: 0 10px;
      cursor: pointer;
      transition: background-color 0.25s;
      position: relative;
      top: -2px;

      &:hover {
        background-color: #fff;
      }
    }

    .el-dropdown-menu {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.25);
    }

    .avatar-container,
    .header-logout {
      display: inline-block;
    }

    .header-logout {
      padding: 0 15px;
      color: #fff;
      font-size: 20px;
      cursor: pointer;

      .icon-logout {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
      }

      span {
        font-size: 14px;
        margin-left: 2px;
        position: relative;
        top: -2px;
      }
    }
  }
}
.right1 {
  float: right;
  padding-right: 10px;
  line-height: $height;
  color: #fff;
  height: 50px;
  .tipItem {
    cursor: pointer;
    float: left;
    padding-left: 10px;
    padding-right: 18px;
    .el-badge__content.is-fixed {
      top: 9px;
      right: 10px;
    }
    &:hover {
      background-color: #427db4;
    }
  }
  .el-dropdown {
    padding: 0 10px;
    cursor: pointer;
    color: #fff;
    transition: background-color 0.25s;
    position: relative;
    top: -2px;

    &:hover {
      background-color: $bgHoverColor;
    }
  }

  .el-dropdown-menu {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.25);
  }

  .avatar-container,
  .header-logout {
    display: inline-block;
  }

  .header-logout {
    padding: 0 15px;
    color: #fff;
    font-size: 20px;
    cursor: pointer;

    .icon-logout {
      width: 1em;
      height: 1em;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }

    span {
      font-size: 14px;
      margin-left: 2px;
      position: relative;
      top: -2px;
    }
  }
}
//
.mobile {
  .app-layout-header {
    display: flex;
    align-items: center;
    overflow: visible;
    .header-left,
    .right {
      flex: 0.2;
    }

    .logo {
      flex: 1;
      text-align: center;
      display: none;
    }

    .header-left {
      display: block;
    }

    .right {
      text-align: right;
      flex: 1;
    }
  }
}
#imgs {
  width: 156px;
  height: 60px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 12px;
}
.drawerTile {
  .el-drawer__header > :first-child {
    color: rgb(0, 121, 254);
  }
  .el-drawer__body {
    overflow-y: scroll;
  }
  .drawerCon {
    /*overflow-y: scroll;*/
    color: #999;
    padding: 0 30px;
    .drawerConItem {
      padding: 10px 0;
      cursor: pointer;
      &:not(:last-child) {
        border-bottom: 1px solid #f1f1f1;
      }
      &.activeItem {
        color: rgb(0, 121, 254);
        font-weight: 700;
      }
    }
  }
}
.subtitle {
  color: #999;
  background: #f9f9f9;
  border: 1px solid #ccc;
  padding: 0 15px;
  margin-top: 15px;
  span {
    margin-right: 15px;
    color: #666;
  }
}
// .app-layout-header .logo h1{
//   color:#000;
// }
.el-drawer__body {
  overflow: auto;
}
.draweDiv {
  color: #72767b;
  padding: 20px;
  border-top: 1px solid #babbbd;
}
.draweDiv:last-child {
  color: #72767b;
  padding: 20px;
  border-bottom: 1px solid #babbbd;
}
.addStyle {
  color: #409eff;
}
.addStyle2 {
  color: #67c23a;
}
.lineHeight {
  margin-bottom: 10px;
}
</style>
