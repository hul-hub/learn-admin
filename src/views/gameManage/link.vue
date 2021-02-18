<template>
  <div>
    <div class="page-crumbs">
      <div class="crumbs">
        <breadcrumb />
      </div>
    </div>

    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <h3>查询条件</h3>
      </div>
      <div class="body">
        <div class="filters">
          <el-row :gutter="10">
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <div class="merge">
                <el-select
                  v-model="filters.queryType"
                  placeholder="请选择"
                  style="width: 150px;"
                  @change="handleQueryTypeChange"
                >
                  <el-option
                    v-for="item in filters.queryTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-input
                  @keyup.enter.native="submitFilter"
                  v-model="filters.queryValue"
                  placeholder="请输入查询值"
                ></el-input>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" v-if="false">
              <div class="flex">
                <el-select
                  v-model="filters.platformType"
                  placeholder="选择平台类型"
                  style="width: 100%;"
                  @change="handleChangePlatform"
                >
                  <el-option
                    v-for="item in filters.platformTypes"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <!--<el-select-->
                <!--v-model="filters.gameEnvi"-->
                <!--placeholder="选择游戏运行环境"-->
                <!--style="width: 100%;"-->
                <!--@change="handleChangeGameEnvi"-->
                <!--&gt;-->
                <!--<el-option-->
                <!--v-for="item in filters.gameEnvis"-->
                <!--:key="item.value"-->
                <!--:label="item.text"-->
                <!--:value="item.value"-->
                <!--&gt;-->
                <!--</el-option>-->
                <!--</el-select>-->
                <el-select
                  v-model="filters.game"
                  placeholder="选择游戏"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in filters.games"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </el-col>
            <!-- 去除平台后的 -->
            <el-col :xs="24" :sm="12" :md="12" :lg="10" :xl="5" v-if="false">
              <div class="flex flex-align-center">
                <p>游戏：</p>
                <el-select
                  v-model="filters.queryGame"
                  placeholder="请选择"
                  style="width: 150px;"
                  @change="handleQueryGameChangenew"
                  filterable
                >
                  <el-option
                    v-for="item in filters.queryGameList"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </el-col>
            <!-- 返利盒子的 -->
            <el-col :xs="24" :sm="12" :md="12" :lg="10" :xl="10">
              <BoxGame
                ref="BoxGame"
                @change="handleGamesChange"
                :defaultPlatformId="filters.queryPlatformid"
                :defaultGame="filters.gameId"
                :hasZoom="false"
              ></BoxGame>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-input
                @keyup.enter.native="submitFilter"
                v-model="filters.link"
                placeholder="请输入推广链接"
              ></el-input>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-button @click="submitFilter" type="primary">查询</el-button>
              <el-button @click="resetFilter('filters')">重置</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>

    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <h3>游戏推广链接</h3>
      </div>
      <div class="body">
        <el-table
          :data="links"
          tooltip-effect="dark"
          style="width: 100%"
          border
          v-loading="loading"
        >
          <el-table-column prop="id" label="编号" align="center">
            <template slot-scope="scope">{{ scope.row.id || "-" }}</template>
          </el-table-column>
          <el-table-column
            label="游戏名称"
            width="100"
            prop="gamename"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.gameName || "-"
            }}</template>
          </el-table-column>
          <el-table-column prop label="主渠道" width="150" align="center">
            <template slot-scope="scope">{{
              scope.row.channelName || "-"
            }}</template>
          </el-table-column>
          <el-table-column
            prop="mcId"
            label="主渠道ID"
            align="center"
            width="150"
          >
            <template slot-scope="scope">{{ scope.row.mcId || "-" }}</template>
          </el-table-column>
          <el-table-column
            prop="scRealName"
            label="子渠道备注"
            width="200"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.scRealName || "-"
            }}</template>
          </el-table-column>
          <el-table-column
            prop="scId"
            label="子渠道ID"
            align="center"
            width="120"
          >
            <template slot-scope="scope">{{ scope.row.scId || "-" }}</template>
          </el-table-column>
          <el-table-column
            prop="downloadUrl"
            label="下载链接"
            width="500"
            align="center"
          >
            <template slot-scope="scope">
              <div v-if="isOldPlatForm">
                <span style="display: block;">
                  安卓：{{
                    scope.row.gameContract && scope.row.gameContract == "待签署"
                      ? ""
                      : scope.row.downloadUrl || "-"
                  }}
                </span>
                <span style="display: block;">
                  IOS：{{
                    scope.row.gameContract && scope.row.gameContract == "待签署"
                      ? ""
                      : scope.row.iosdownloadUrl || "-"
                  }}
                </span>
              </div>
              <span v-if="!isOldPlatForm">
                {{
                  scope.row.gameContract && scope.row.gameContract == "待签署"
                    ? ""
                    : scope.row.downloadUrl
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" align="center">
            <template slot-scope="scope">
              <span v-if="isOldPlatForm">-</span>
              <span
                v-if="!isOldPlatForm"
                class="action-button"
                @click="getShortLink(scope.row)"
                >[获取短链接]</span
              >
              <span
                v-if="scope.row.hasPc"
                class="action-button"
                @click="
                  getPcLink(scope.row.pcDownloadUrl, scope.row.platformId)
                "
                >获取PC分包链接</span
              >
              <div class="action-button" @click="generatorH5Link(scope.row)">
                [获取h5链接]
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-footer">
          <div class="actions"></div>
          <div class="pages">
            <el-pagination
              background
              layout="prev, pager, next, total"
              :current-page="page"
              :page-size="size"
              :total="total"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </div>
      </div>
    </el-card>

    <el-dialog title="提示" :visible.sync="clipboardDialog.visible">
      <div>请复制生成的短连接</div>
      <div class="flex" style="margin-top: 20px;">
        <el-input
          v-model="clipboardDialog.link"
          disabled
          class="flex-1 hl-disabled"
        ></el-input>
        <el-button
          style="margin-left: 20px;"
          type="primary"
          icon="document"
          v-clipboard:copy="clipboardDialog.link"
          v-clipboard:success="clipboardSuccess"
          >复制</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="签署合同提醒"
      :visible.sync="dialogVisibleContract"
      width="30%"
    >
      <div>
        <p>尊敬的用户，您好：</p>
        <p>
          为了保障您的合法权益，请先签署网络合作协议，签署成功后即可正常推广游戏。
        </p>
        <p>
          <img class="w80 h80" :src="dialogObj.iconFileUrl" alt />
          {{ dialogObj.gameName }}
        </p>
      </div>
      <span slot="footer" class="dialog-footer flex center">
        <el-button type="primary" @click="dialogVisibleContract = false"
          >请使用老板账号签署合同</el-button
        >
      </span>
    </el-dialog>
    <!-- 待签署合同弹窗 -->
    <el-dialog
      title="待签署合同提醒"
      :visible.sync="signContractDialog"
      width="24%"
      center
      :append-to-body="true"
    >
      <div class="lineHeight">尊敬的用户，您好：</div>
      <div class="lineHeight" style="color:red">
        系统检测到您有待签署的合同！
      </div>
      <div class="lineHeight">
        为了保障您的合法权益，请先签署网络合作协议，签署成功后即可
      </div>
      <div class="lineHeight">正常推广游戏。</div>
      <div class="lineHeight">
        <img class="w80 h80" :src="gameImg" alt />
        {{ gameName }}
      </div>
      <div>温馨提示：签署成功后，请刷新页面查看结果。</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmSignContract" type="primary"
          >签署合同</el-button
        >
        <el-button @click="signContractDialog = false">暂不签署</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="实名认证"
      :visible.sync="RealNameVerifiyDialog"
      width="80%"
      style="height:800px"
    >
      <iframe
        :src="RealNameVerifiyUrl"
        width="100%"
        style="height:800px"
      ></iframe>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
import { getShortLink, generatorH5Link } from "@/api/global";
import BoxGame from "@/components/Games/boxGame";
import {
  getGameSpreadLinks,
  getPlatforms,
  getGameEnvis,
  getGames
} from "@/api/gameManage";
import { getUserGameList } from "@/api/aid";
import { mapGetters } from "vuex";
import http from "@/utils/http";

// 默认值
const defaults = {
  platformTypes: [
    {
      text: "全部平台",
      value: ""
    }
  ],
  gameEnvis: [
    {
      text: "全部环境",
      value: ""
    }
  ],
  games: [
    {
      text: "全部游戏",
      value: ""
    }
  ]
};
export default {
  name: "GameManageLink",
  components: {
    Breadcrumb,
    BoxGame
  },
  data() {
    return {
      dialogVisibleContract: false,
      dialogObj: {},
      signContractDialog: false,
      gameImg: "",
      gameName: "",
      RealNameVerifiyDialog: false,
      RealNameVerifiyUrl: "",
      status: "",
      gameContractId: "",
      filters: {
        isDiscountGame: 0,
        queryPlatformid: "",
        queryGameid: "",
        queryGame: "",
        queryGameList: [],

        queryType: "1",
        queryTypes: [
          {
            label: "主渠道帐号",
            value: "1"
          },
          {
            label: "主渠道名称",
            value: "2"
          },
          {
            label: "主渠道ID",
            value: "3"
          },
          {
            label: "子渠道账号",
            value: "4"
          },
          {
            label: "子渠道ID",
            value: "5"
          }
        ],
        queryValue: "",

        // 游戏平台
        platformType: "",
        platformTypes: defaults.platformTypes,
        // 游戏运行环境
        gameEnvi: "",
        gameEnvis: defaults.gameEnvis,
        // 游戏列表
        game: "",
        games: defaults.games,
        // 是否是老平台
        isOldPlatForm: false,

        // 短连接
        link: ""
      },

      links: [],
      loading: false,
      page: 1,
      pageCount: 0,
      size: 10,
      total: 0,
      // 复制弹窗
      clipboardDialog: {
        visible: false,
        link: ""
      }
    };
  },
  created() {
    this.getPlatforms();
    this.getGameEnvis();
    this.getGameSpreadLinks();
    // this.getUserGameList();
  },
  computed: {
    ...mapGetters(["roles"]),
    isBoss() {
      return this.roles.includes("boss");
    }
  },
  methods: {
    //签署合同
    confirmSignContract() {
      const data = {
        guildId: JSON.parse(
          window.sessionStorage.getItem("Admin-Account-Union")
        ).guildId
      };
      http.get2("/guildRealNameVerifiy.check.do", data).then(res => {
        if (res.state === "fail") {
          if (res.data == "0" || res.data == "4") {
            this.guildRealNameVerifiy();
          } else {
            this.$message.warning(res.message);
          }
        } else {
          if (res.data == "2") {
            this.generateContract();
          } else {
            this.$message.warning(res.message);
          }
        }
      });
    },
    generateContract() {
      const data = {
        id: this.gameContractId
      };
      http.get2("/guildContract.generateContract.do", data).then(res => {
        if (res.state === "fail") {
          this.$message.warning(res.message);
        } else {
          const a = document.createElement("a");
          a.href = res.message;
          a.click();
          this.signContractDialog = false;
        }
      });
    },
    //实名认证
    guildRealNameVerifiy() {
      const data = {
        status: this.status,
        guildId: JSON.parse(
          window.sessionStorage.getItem("Admin-Account-Union")
        ).guildId
      };
      http.get2("/guildRealNameVerifiy.do", data).then(res => {
        if (res.state === "fail") {
          this.$message.error(res.message);
        } else {
          this.RealNameVerifiyUrl = res.message;
          window.open(
            res.message,
            "_blank",
            "width=1288,height=767,top=100px,left=0px"
          );
        }
      });
    },
    handleGamesChange(data) {
      this.filters.platformType = data.platformType;
      if (this.filters.platformType == "0") {
        this.filters.isDiscountGame = 0;
      } else {
        this.filters.isDiscountGame = 1;
      }
      this.filters.queryPlatformid = data.platformId;
      this.filters.queryGameid = data.gameId;
      this.filters.queryZone = data.zoomId;
    },
    //去除平台后的游戏区服列表
    async getUserGameList() {
      try {
        const res = await getUserGameList();
        if (res.state === "ok") {
          const arr = [];
          res.data.forEach(function(val, idx) {
            arr.push({
              value: val.platformId + "," + val.gameId,
              text: val.gameName
            });
          });
          this.filters.queryGameList = arr;
        }
      } catch (error) {
        console.error(error);
        return;
      }
    },
    handleQueryGameChangenew(option) {
      const arrPlat = option.split(",");
      this.filters.queryPlatformid = arrPlat[0];
      this.filters.queryGameid = arrPlat[1];
    },
    async getPlatforms() {
      const result = await getPlatforms();
      console.log(result);
      if (result.state === "ok") {
        this.filters.platformTypes = defaults.platformTypes.concat(result.data);
      }
    },
    async getGameEnvis() {
      const result = await getGameEnvis();
      console.log(result);
      if (result.state === "ok") {
        this.filters.gameEnvis = defaults.gameEnvis.concat(result.data);
      }
    },
    async getGames() {
      const { platformType: platformId, gameEnvi: rtType } = this.filters;
      const result = await getGames(platformId, rtType);
      if (result.state === "ok") {
        this.filters.game = "";
        this.filters.games = defaults.games.concat(result.data);
      } else if (result.state === "fail") {
        this.$message.error("获取游戏列表失败，请重试");
      }
    },
    async getGameSpreadLinks() {
      console.log("获取列表");

      if (this.loading) {
        return;
      }

      this.loading = true;

      console.log("page: ", this.page);
      console.log("filters.queryType: ", this.filters.queryType);
      console.log("filters.queryValue: ", this.filters.queryValue);
      console.log("filters.link: ", this.filters.link);

      try {
        const query = {
          pageNo: this.page,
          pageSize: this.size,
          queryType: this.filters.queryType,
          queryValue: this.filters.queryValue,
          // platformId: this.filters.platformType,
          rtType: this.filters.gameEnvi,
          // gameId: this.filters.game,
          platFormId: this.filters.queryPlatformid,
          gameId: this.filters.queryGameid,
          isDiscountGame: this.filters.isDiscountGame,
          link: encodeURIComponent(this.filters.link)
        };

        const result = await getGameSpreadLinks(query);
        console.log(result);
        this.loading = false;
        if (result.state === "ok") {
          const { data, pagination } = result;
          if (data.length > 0) {
            this.isOldPlatForm = data[0].isOldPlatForm;
          } else {
            this.isOldPlatForm = false;
          }

          console.log("this.isOldPlatForm =>>", this.isOldPlatForm);
          // data.forEach(item => {
          //   if (!(item.innerVersion || item.iosInnerVersion)) {
          //     item.downloadUrl = "--";
          //   }
          // });
          this.links = data;
          this.pageCount = Math.ceil(pagination.count / pagination.pageSize);
          this.total = pagination.count;
        } else if (result.state === "fail") {
          this.$message.error(result.message || "网络链接失败，请刷新重试");
        }
      } catch (error) {
        this.loading = false;
        this.$message.error("网络链接失败，请刷新重试");
      }
    },
    // 提交筛选查询
    submitFilter() {
      this.page = 1;
      console.log("获取列表数据");
      this.getGameSpreadLinks();
    },
    // 重置
    resetFilter() {
      this.filters.queryType = "1";
      this.filters.queryValue = "";
      this.filters.platformType = "";
      this.filters.gameEnvi = "";
      this.filters.game = "";
      this.filters.link = "";
      this.page = 1;

      this.filters.queryGame = "";
      this.filters.queryPlatformid = "";
      this.filters.queryGameid = "";
      //专服/折扣
      this.$refs.BoxGame.handleChangePlatform("0");
      this.$refs.BoxGame.handleChangeGame("");
      this.getGameSpreadLinks();
    },
    // 查询类型 select change
    handleQueryTypeChange(option) {
      this.filters.queryType = option;
    },
    // 平台类型 change
    handleChangePlatform(option) {
      this.getGames();
    },
    // 运行环境 change
    handleChangeGameEnvi(option) {
      console.log(this.filters.gameEnvi);
      this.getGames();
    },
    // 切换分页
    handleCurrentChange(page) {
      this.page = page;
      console.log("获取列表数据");
      this.getGameSpreadLinks();
    },
    // 获取短连接
    async getShortLink(obj) {
      if (obj.gameContract && obj.gameContract == "待签署") {
        if (this.isBoss) {
          this.signContractDialog = true;
          this.gameImg = obj.iconFileUrl;
          this.gameName = obj.gameName;
          this.status = obj.status;
          this.gameContractId = obj.gameContractId || "";
          return;
        } else {
          this.dialogObj = obj;
          this.dialogVisibleContract = true;
          return;
        }
      }
      if (!/^http|^https/.test(obj.downloadUrl)) {
        this.$message.error("需要更新才能提取链接");
        return;
      }
      this.clipboardDialog.visible = true;
      this.clipboardDialog.link = obj.downloadUrl;
      // const fullLoading = this.$loading({
      //   lock: true,
      //   text: "正在获取中",
      //   spinner: "el-icon-loading",
      //   background: "rgba(0, 0, 0, 0.7)"
      // });

      // try {
      //   let data = {
      //     url: encodeURIComponent(link),
      //     platformId: platformId
      //   };
      //   const result = await getShortLink(data);
      //   console.log(result);

      //   fullLoading.close();
      //   if (result.state === "ok") {
      //     console.log("result.shortUrl =>>", result.shortUrl);
      //     this.clipboardDialog.visible = true;
      //     this.clipboardDialog.link =
      //       result.data.shortUrl || "获取的短连接为空，请重试";
      //   } else if (result.state === "fail") {
      //     this.$message.error(res.message || "获取失败，请重新获取");
      //   }
      // } catch (error) {
      //   fullLoading.close();
      //   this.$message.error("获取失败，请重新获取");
      // }
    },
    // 获取h5连接
    async generatorH5Link(row) {
      const fullLoading = this.$loading({
        lock: true,
        text: "正在获取中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      try {
        let data = {
          platformId: row.platformId,
          gameId: row.gameId,
          mcId: row.mcId,
          scId: row.scId
        };
        const result = await generatorH5Link(data);
        fullLoading.close();
        if (result.state === "ok") {
          this.clipboardDialog.visible = true;
          this.clipboardDialog.link =
            result.message || "获取的h5链接为空，请重试";
        } else if (result.state === "fail") {
          this.$message.error(res.message || "该游戏未设置H5游戏");
        }
      } catch (error) {
        console.log(error);
        fullLoading.close();
        this.$message.error("获取失败，请重新获取");
      }
    },
    // 获取pc分包连接
    async getPcLink(link, platformId) {
      if (!/^http|^https/.test(link)) {
        this.$message.error("需要更新才能提取链接");
        return;
      }

      const fullLoading = this.$loading({
        lock: true,
        text: "正在获取中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });

      try {
        let data = {
          url: encodeURIComponent(link),
          platformId: platformId
        };
        const result = await getShortLink(data);
        console.log(result);

        fullLoading.close();
        if (result.state === "ok") {
          console.log("result.shortUrl =>>", result.shortUrl);
          this.clipboardDialog.visible = true;
          this.clipboardDialog.link =
            result.data.shortUrl || "获取的pc分包连接为空，请重试";
        } else if (result.state === "fail") {
          this.$message.error(res.message || "获取失败，请重新获取");
        }
      } catch (error) {
        fullLoading.close();
        this.$message.error("获取失败，请重新获取");
      }
    },
    // 复制成功提示
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
.el-tag {
  background-color: transparent;
  border-color: transparent;
}
.merge {
  display: flex;

  .el-select {
    display: inline-block;
  }
  .el-input {
    flex: 1;
    display: inline-block;
  }
}
.action-button {
  color: #007fff;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
}
</style>

<style lang="scss">
.mobile {
  .el-dialog {
    width: 90%;
  }
}

.hl-disabled {
  input {
    color: #808080 !important;
  }
}
</style>
