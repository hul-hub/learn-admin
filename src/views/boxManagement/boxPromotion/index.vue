<template>
  <div>
    <div class="page-crumbs">
      <div class="crumbs">
        <breadcrumb />
      </div>
    </div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="color: #999; font-size: 18px">应用信息</span>
      </div>
      <div
        class="information"
        style="font-size: 16px; width: 60%; margin-left: 20px"
      >
        <div class="informationLeft">
          <div>
            <img class="imgs" :src="tableData.iconUrl" alt="" srcset="" />
          </div>
          <div class="informationRight">
            <div>应用名称：{{ tableData.appName || "-" }}</div>
            <div>
              安卓版本号：{{ tableData.androidVersion || "-" }}
              <el-button
                type="text"
                style="margin-left: 20px"
                v-if="
                  tableData.androidVersion !== tableData.guildAndroidVersion
                "
                @click="versionUpdate(1)"
                >[Android更新]</el-button
              >
            </div>
          </div>
        </div>
        <div class="informationRight">
          <div></div>
          <div>
            IOS版本号：{{ tableData.iosVersion || "-" }}
            <el-button
              type="text"
              style="margin-left: 20px"
              v-if="tableData.iosVersion !== tableData.guildIosVersion"
              @click="versionUpdate(2)"
              >[IOS更新]</el-button
            >
          </div>
        </div>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="color: #999; font-size: 18px">我的应用</span>
      </div>
      <div class="my" style="font-size: 16px; width: 40%; margin-left: 20px">
        <div>子渠道ID：{{ tableData.scId }}</div>
        <div>所属主渠道：{{ tableData.mcChannelName }}</div>
      </div>
      <div class="copyUrl">
        <!-- <div class="copy">
          <div style="margin-top: 4px">Android版下载地址</div>
          <el-button
            type="text"
            style="margin-left: 30px"
            v-clipboard:copy="url"
            v-clipboard:success="clipboardSuccess"
            @mouseenter="copyAndroid"
            @click="copyAndroid"
            >复制链接</el-button
          >
        </div>
        <div class="copy">
          <div style="margin-top: 4px">IOS版下载地址</div>
          <el-button
            type="text"
            style="margin-left: 30px"
            v-clipboard:copy="url"
            v-clipboard:success="clipboardSuccess"
            @mouseenter="copyIOS"
            @click="copyIOS"
            >复制链接</el-button
          >
        </div> -->
        <div class="copy">
          <div style="margin-top: 4px">推广页地址（各端通用）</div>
          <el-button
            type="text"
            style="margin-left: 30px"
            v-clipboard:copy="url"
            v-clipboard:success="clipboardSuccess"
            @mouseenter="copyExtension"
            @click="copyExtension"
            >复制链接</el-button
          >
        </div>
      </div>
    </el-card>
    <el-card class="box-card" v-if="this.isGuildBoss == 1">
      <div slot="header" class="clearfix">
        <span style="color: #999; font-size: 18px">渠道管理</span>
      </div>
      <div style="margin: 0px 0px 20px 20px; color: #999; font-size: 16px">
        默认选择开通所有渠道的推广权限，可使用“编辑渠道”功能可自助管理推广渠道。
      </div>
      <el-button
        type="primary"
        style="margin-left: 20px"
        size="medium"
        @click="edit"
        >编辑渠道</el-button
      >
    </el-card>
  </div>
</template>
<script>
import Breadcrumb from "@/components/Breadcrumb";
import http from "@/utils/http";
export default {
  name: "boxPromotionIndex",
  components: {
    Breadcrumb
  },
  data() {
    return {
      adventStatus: "",
      isGuildBoss: null,
      tableData: [],
      url: ""
    };
  },
  created() {
    this.isGuildBoss = JSON.parse(
      window.sessionStorage.getItem("Admin-Account-Union")
    ).isGuildBoss;
    this.init();
  },
  methods: {
    async init() {
      try {
        const res = await http.get2("/guild/boxInfo.do");
        if (res.state === "ok") {
          this.tableData = res.data;
          console.log(this.tableData);
        } else {
          this.$message.warning(res.message);
        }
      } catch (e) {
        console.log(e);
        this.$message.error("异常");
      }
    },
    //版本更新
    async versionUpdate(num) {
      try {
        const res = await http.get2(`/guild/boxVersionUpdate.do?typeId=${num}`);
        if (res.state === "ok") {
          this.$message.success(res.message || "更新成功");
        } else {
          this.$message.success(res.message || "更新失败");
        }
      } catch (e) {
        console.log(e);
        this.$message.error("异常");
      }
    },
    edit() {
      this.$router.push("channelManagement");
    },
    // copyAndroid() {
    //   this.url = this.tableData.androidDownloadUrl;
    //   this.buryingPoint(1);
    // },
    // copyIOS() {
    //   this.url = this.tableData.iosDownloadUrl;
    //   this.buryingPoint(2);
    // },
    copyExtension() {
      this.url = this.tableData.h5Url;
      this.buryingPoint(3);
    },
    async buryingPoint(type) {
      try {
        const res = await http.get2(`/guild/boxCopyLink.do?type=${type}`);
        if (res.state === "ok") {
          console.log("埋点成功");
        } else {
          console.log("埋点失败");
        }
      } catch (e) {
        console.log(e);
        this.$message.error("异常");
      }
    },

    //复制成功提示
    clipboardSuccess() {
      this.$message({
        message: "复制成功",
        type: "success"
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.information {
  display: flex;
  justify-content: space-between;
  .informationLeft {
    width: 40%;
    display: flex;
    justify-content: space-between;
  }
  .informationRight {
    display: flex;
    flex-direction: column;
    // align-items: center;
    justify-content: space-between;
  }
  .imgs {
    width: 80px;
    height: 80px;
    // border: 1px solid #999;
    // margin-right: 20px;
    // border-radius: 10px;
  }
}
.my {
  display: flex;
  justify-content: space-between;
}
.copyUrl {
  width: 20%;
  margin: 30px 0px 0px 20px;
  color: #999;
  font-size: 16px; // border-top: 1px solid #ccc;
  .copy {
    display: flex;
    justify-content: space-between;
  }
}
</style>
