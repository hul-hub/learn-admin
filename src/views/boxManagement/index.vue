<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="color: #999; font-size: 18px">盒子简介</span>
      </div>
      <div style="width: 885px; font-size: 16px">
        <span>
          神起推出全新的游戏盒子，打包了超过80款精品游戏，入驻盒子的公会默认获得这些游戏的推广权限，公会推广盒子，玩家通过推广盒子链接，下载并注册盒子账号，在80款默认入驻的游戏内产生游戏消费，将按照原先的分成逻辑与公会进行分成。
        </span>
        <span
          >同时，公会可以根据自己的推广需求调整盒子的游戏排序、广告内容。</span
        >
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="color: #999; font-size: 18px">盒子优势</span>
      </div>
      <div
        style="
          font-size: 16px;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
        "
      >
        <div v-for="(item, index) in arr" :key="index">
          <div class="box">
            <div class="line"></div>
            <div class="line2"></div>
            <div class="line3"></div>
            <div class="line4"></div>
            <div style="margin-top: 55px; transform: translateY(-50%)">
              {{ item.title1 }}
            </div>
            <div>{{ item.title2 }}</div>
          </div>
        </div>
      </div>
      <el-button
        type="primary"
        round
        style="
          margin-left: 50%;
          transform: translateX(-50%);
          margin-top: 30px;
          width: 150px;
        "
        @click="use"
        >立即使用</el-button
      >
    </el-card>
  </div>
</template>
<script>
import Layout from "../layout";
import importComp from "../../router/_import_comp";
import http from "@/utils/http";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      arr: [
        {
          title1: "80款精品游戏入驻",
          title2: "满足更多玩家需求"
        },
        {
          title1: "更多推广权限",
          title2: "更高分成收益"
        },
        {
          title1: "一键打包所有游戏",
          title2: "推广超简单超高效"
        },
        {
          title1: "持续推出平台活动",
          title2: "助力推广转化"
        },
        {
          title1: "用户下载盒子游戏",
          title2: "公会都参与分成"
        },
        {
          title1: "自定义盒子游戏",
          title2: "推广个性化"
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["account"])
  },
  created() {
    // if (this.$route.fullPath == "/boxManagement/index") {
    //   console.log(11);
    // }
    // console.log(window.sessionStorage.getItem());
    // this.account.adventStatus = 4;
  },
  methods: {
    async use() {
      try {
        const res = await http.get2("/guild/settled.do");
        if (res.state === "ok") {
          this.$message.success(res.message);
          this.init();
        } else {
          this.$message.warning(res.message);
        }
      } catch (e) {
        this.$message.error("异常");
      }
    },
    init() {
      const createProgramerData = JSON.parse(
        sessionStorage.getItem("Admin-Account-Union")
      );
      const {
        adventStatus,
        bsystemId,
        businessVisible,
        enablePrivate,
        giftPutOutAuth,
        guildId,
        hadSubPwd,
        isGuildBoss,
        isShowGuildBalance,
        isShowPersonalCenter,
        isShowServerRatio,
        isSupport,
        loginName,
        platVisible,
        posterPutInIsEnable,
        postfix,
        productWatch,
        realName,
        roleGroupIds,
        sessionId,
        userId,
        user
      } = createProgramerData; // 返回数据
      let str = createProgramerData;
      str.adventStatus = 4;
      str.bsystemId = bsystemId;
      str.businessVisible = businessVisible;
      str.enablePrivate = enablePrivate;
      str.giftPutOutAuth = giftPutOutAuth;
      str.guildId = guildId;
      str.hadSubPwd = hadSubPwd;
      str.isGuildBoss = isGuildBoss;
      str.isShowGuildBalance = isShowGuildBalance;
      str.isShowPersonalCenter = isShowPersonalCenter;
      str.isShowServerRatio = isShowServerRatio;
      str.isSupport = isSupport;
      str.loginName = loginName;
      str.platVisible = platVisible;
      str.posterPutInIsEnable = posterPutInIsEnable;
      str.postfix = postfix;
      str.productWatch = productWatch;
      str.realName = realName;
      str.roleGroupIds = roleGroupIds;
      str.sessionId = sessionId;
      str.userId = userId;
      str.user = user;
      sessionStorage.setItem("Admin-Account-Union", JSON.stringify(str));
      this.$router.push("/boxManagement/boxPromotion/boxPromotion");
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }
};
</script>
<style lang="scss" scoped>
.box {
  font-size: 20px;
  height: 150px;
  width: 300px;
  border: 1px solid #999;
  position: relative;
  text-align: center;
  margin: 15px 80px;
}
.line {
  height: 1px;
  width: 90px;
  color: #999;
  position: absolute;
  top: 22px;
  left: -5px;
  background-color: #999;
  -webkit-transform: rotateZ(29deg);
  transform: rotateZ(29deg);
}
.line2 {
  height: 1px;
  width: 90px;
  color: #999;
  position: absolute;
  top: 22px;
  right: -5px;
  background-color: #999;
  -webkit-transform: rotateZ(151deg);
  transform: rotateZ(151deg);
}
.line3 {
  height: 1px;
  width: 90px;
  color: #999;
  position: absolute;
  bottom: 22px;
  right: -5px;
  background-color: #999;
  -webkit-transform: rotateZ(210deg);
  transform: rotateZ(210deg);
}
.line4 {
  height: 1px;
  width: 90px;
  color: #999;
  position: absolute;
  bottom: 22px;
  left: -5px;
  background-color: #999;
  -webkit-transform: rotateZ(331deg);
  transform: rotateZ(331deg);
}
</style>
