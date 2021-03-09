<template>
  <div>
    <el-card>
      <div slot="header">
        <h3>查询条件</h3>
      </div>
      <div class="body flex mid">
        <div class="mr10">游戏：</div>
        <div class="mr40" v-if="false">
          <el-select @change="getPlatformGameList" v-model="filter.platformId">
            <el-option
              v-for="item in platformList"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select v-model="filter.gameId">
            <el-option
              v-for="item in platformGameList"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="mr40">
          <el-select
            v-model="filters.queryGame"
            placeholder="请选择"
            style="width: 150px"
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
        <!-- 返利盒子的 -->
        <!-- <BoxGame
          ref="BoxGame"
          @change="handleGamesChange"
          :defaultPlatformId="filters.queryPlatformid"
          :defaultGame="filters.gameId"
          :hasZoom="false"
        >
        </BoxGame>-->
        <div>
          <el-button @click="search(1)" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </div>
    </el-card>
    <el-card>
      <div class="header">
        <h3>游戏列表</h3>
      </div>
      <div class="body">
        <el-table
          :row-class-name="tableRowClassName"
          border
          :data="tableList"
          v-loading="tableLoading"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          ></el-table-column>
          <el-table-column width="300" align="center" label="游戏信息">
            <template slot-scope="scope">
              <div class="flex">
                <img class="w80 h80" :src="scope.row.gameIcon" alt />
                <div class="flex col ml10" style="text-align: left">
                  <span>{{ scope.row.gameName }}</span>
                  <span class="mt20">{{ scope.row.gameType }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column
            align="center"
            prop="gameName"
            label="游戏名称"
          ></el-table-column>-->
          <el-table-column align="center" label="安卓包">
            <template slot-scope="scope">
              <div v-if="!scope.row.newVersion" class="flex start">
                【暂无渠道包】
              </div>
              <div
                v-if="
                  scope.row.version &&
                    scope.row.newVersion &&
                    scope.row.version !== scope.row.newVersion
                "
              >
                <div class="flex col top">
                  <span>版本：{{ scope.row.newVersion }}【可更新】</span>
                  <span>大小：{{ scope.row.newPackageSize }}</span>
                </div>
                <!-- (有更新，{{ scope.row.newVersion }} |
                {{ scope.row.newPackageSize }})-->
              </div>
              <div
                v-if="
                  scope.row.version &&
                    scope.row.newVersion &&
                    scope.row.version === scope.row.newVersion
                "
              >
                <div class="flex col top">
                  <span>版本：{{ scope.row.newVersion }}</span>
                  <span>大小：{{ scope.row.newPackageSize }}</span>
                </div>
                <!-- ({{ scope.row.newVersion }} | {{ scope.row.newPackageSize }}) -->
              </div>
              <div v-if="!scope.row.version && scope.row.newVersion">
                <div class="flex col top">
                  <span>版本：{{ scope.row.newVersion }}【可打包】</span>
                  <span>大小：{{ scope.row.newPackageSize }}</span>
                </div>
                <!-- (可打包，{{ scope.row.newVersion }} |
                {{ scope.row.newPackageSize }})-->
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="IOS包">
            <template slot-scope="scope">
              <div v-if="!scope.row.newIosVersion" class="flex start">
                【暂无渠道包】
              </div>
              <div
                v-if="
                  scope.row.iosVersion &&
                    scope.row.newIosVersion &&
                    scope.row.iosVersion !== scope.row.newIosVersion
                "
              >
                <div class="flex col top">
                  <span>版本：{{ scope.row.newIosVersion }}【可更新】</span>
                  <span>大小：{{ scope.row.newIosPackageSize }}</span>
                </div>
                <!-- (有更新，{{ scope.row.newIosVersion }} |
                {{ scope.row.newIosPackageSize }})-->
              </div>
              <div
                v-if="
                  scope.row.iosVersion &&
                    scope.row.newIosVersion &&
                    scope.row.iosVersion === scope.row.newIosVersion
                "
              >
                <div class="flex col top">
                  <span>版本：{{ scope.row.newIosVersion }}</span>
                  <span>大小：{{ scope.row.newIosPackageSize }}</span>
                </div>
                <!-- ({{ scope.row.newIosVersion }} |
                {{ scope.row.newIosPackageSize }})-->
              </div>
              <div v-if="!scope.row.iosVersion && scope.row.newIosVersion">
                <div class="flex col top">
                  <span>版本：{{ scope.row.newIosVersion }}【可打包】</span>
                  <span>大小：{{ scope.row.newIosPackageSize }}</span>
                </div>
                <!-- (可打包，{{ scope.row.newIosVersion }} |
                {{ scope.row.newIosPackageSize }})-->
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="300">
            <template slot-scope="scope">
              <div
                style="margin-bottom: 5px"
                v-if="
                  scope.row.gameId == '76sy001' &&
                    scope.row.version == scope.row.newVersion &&
                    scope.row.iosVersion == scope.row.newIosVersion
                "
              >
                <el-button
                  type="primary"
                  @click.prevent.native="copyurl(scope.row, $event)"
                  >复制短链</el-button
                >
              </div>
              <div
                v-if="
                  scope.row.gameId == '76sy001' &&
                    (scope.row.version != scope.row.newVersion ||
                      scope.row.iosVersion != scope.row.newIosVersion)
                "
              >
                <el-button type="text" @click="upurl(scope.row)"
                  >[更新链接]</el-button
                >
              </div>
              <div v-if="isBoss && scope.row.gameId == '76sy001'">
                <el-button
                  @click="promotionSet"
                  style="background: rgb(255, 153, 0); color: #fff"
                  >推广设置</el-button
                >
              </div>
              <div
                v-if="
                  scope.row.iosVersion &&
                    scope.row.gameId != '76sy001' &&
                    scope.row.newIosVersion &&
                    scope.row.iosVersion !== scope.row.newIosVersion
                "
              >
                <el-button @click="unpackIos(scope.row)" type="text"
                  >[IOS打包或更新]</el-button
                >
              </div>
              <div
                v-if="
                  !scope.row.iosVersion &&
                    scope.row.gameId != '76sy001' &&
                    scope.row.newIosVersion
                "
              >
                <el-button @click="unpackIos(scope.row)" type="text"
                  >[IOS打包或更新]</el-button
                >
              </div>

              <div
                v-if="
                  scope.row.version &&
                    scope.row.gameId != '76sy001' &&
                    scope.row.newVersion &&
                    scope.row.version != scope.row.newVersion
                "
              >
                <el-button @click="unpackAndroid(scope.row)" type="text"
                  >[Android打包或更新]</el-button
                >
              </div>
              <!-- <div v-if="scope.$index === 0 && filter.pageNo === 1">
                <div>
                  当前绑定主播ID:<span>{{ bindID }}</span>
                </div>
                <div>
                  <el-input
                    v-model="achID"
                    placeholder="请输入主播ID"
                    style="width:110px"
                    size="small"
                  ></el-input>
                  <el-button
                    type="primary"
                    size="small"
                    @click="save(scope.row)"
                    >确定</el-button
                  >
                </div>
              </div>-->
              <div
                v-if="
                  scope.row.pcVersion &&
                    scope.row.gameId != '76sy001' &&
                    scope.row.newPcVersion &&
                    scope.row.pcVersion != scope.row.newPcVersion
                "
              >
                <el-button @click="unpackPc(scope.row)" type="text"
                  >[PC打包或更新]</el-button
                >
              </div>
              <div
                v-if="
                  !scope.row.version &&
                    scope.row.gameId != '76sy001' &&
                    scope.row.newVersion
                "
              >
                <el-button @click="unpackAndroid(scope.row)" type="text"
                  >[Android打包或更新]</el-button
                >
              </div>
              <div>
                <el-button
                  type="text"
                  @click.prevent.native="getH5Link(scope.row, $event)"
                  >[复制h5链接]</el-button
                >
              </div>
              <!-- <el-button
                v-if="scope.$index === 0 && filter.pageNo === 1"
                v-clipboard:copy="clipboardDialog.link"
                v-clipboard:success="clipboardSuccess"
                type="text"
                >[复制VV语音推广链接]</el-button
              >-->
              <!-- <el-button
                v-else-if="scope.$index === 1 && filter.pageNo === 1"
                @click="getVVDownload(scope.row, $event)"
                type="text"
                >[复制VV语音推广链接]</el-button
              >-->
              <el-button
                v-if="scope.row.gameId != '76sy001'"
                @click.prevent.native="getDownloadUrl(scope.row, $event)"
                type="text"
                >[复制短链]</el-button
              >
              <!-- <div v-if="scope.row.platformId === 'VV'">
                <el-button
                  type="text"
                  @click="handleDownload(scope.row, $event)"
                  >下载二维码图片</el-button
                >
              </div>-->
            </template>
          </el-table-column>
        </el-table>
        <div class="flex between">
          <div class="flex mid mt15">
            批量操作：
            <template>
              <el-button
                style="margin-left: 10px"
                :disabled="multipleSelection.length === 0"
                size="small"
                type="primary"
                @click="allCheckModifySupportAccountStatus(1)"
                >更新安卓包</el-button
              >
              <el-button
                style="margin-left: 10px"
                :disabled="multipleSelection.length === 0"
                size="small"
                type="primary"
                @click="allCheckModifySupportAccountStatus(2)"
                >更新iOS包</el-button
              >
            </template>
          </div>
          <div class="flex end mt15">
            <el-pagination
              background
              layout="total,prev,pager,next,sizes"
              :current-page="filter.pageNo"
              :page-sizes="[10, 20, 30]"
              :page-size="filter.pageSize"
              :total="total"
              @current-change="searchByPage"
              @size-change="handleSizeChange"
            ></el-pagination>
          </div>
        </div>
      </div>
    </el-card>
    <el-dialog title="推广设置" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label-width="110px">
          <div style="display: flex">
            <div style="margin-top: 10px">主推游戏：</div>
            <el-table :data="tableData" stripe style="width: 100%">
              <el-table-column
                prop="mcChannelName"
                label="小组名称"
                width="180"
              ></el-table-column>
              <el-table-column label="主推游戏" width="180">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.gameId"
                    placeholder="请选择"
                    @change="handlegameid"
                  >
                    <el-option
                      v-for="item in tableData2"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- <span style="margin-left:60px">小组名称</span>
          <span style="margin-left:120px">主推游戏</span>-->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfirm">确 定</el-button>
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
          <img class="w80 h80" :src="dialogObj.gameIcon" alt />
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
      <div class="lineHeight" style="color: red">
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
      style="height: 800px"
    >
      <iframe
        :src="RealNameVerifiyUrl"
        width="100%"
        style="height: 800px"
      ></iframe>
    </el-dialog>
  </div>
</template>

<script>
import clipboard from "../../../utils/clipboard";
import http from "@/utils/http";
import { mapGetters } from "vuex";
import { getPlatformList, getGameList } from "../../../api/aid";
import {
  mygameGetNewDownloadUrl,
  mygameSubpackage,
  mygameSubiospackage,
  mygameGetMyGamesInfo,
  mygameSubPcpackage,
  batchAndroidPackage,
  batchsubIosPackage,
  generatorH5Link
} from "../../../api/gameProm";
import { directAnchor, downloadQRCodeExpandPage } from "@/api/gameManage";
import { getUserGameList } from "@/api/aid";
import BoxGame from "@/components/Games/boxGame";

export default {
  name: "index",
  components: {
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
      gameid: "",
      tableData: [],
      tableData2: [],
      gamelists: [],
      form: {
        name: "name"
      },
      dialogFormVisible: false,
      achID: "",
      bindID: "",
      clipboardDialog: {
        link: ""
      },
      tableLoading: false,
      tableList: [],
      platformList: [],
      platformGameList: [],
      filter: {
        isDiscountGame: 0,
        platformId: "",
        gameId: "",
        pageNo: 1,
        pageSize: 10
      },
      filters: {
        queryPlatformid: "",
        queryGameid: "",
        queryGame: "",
        queryGameList: []
      },
      multipleSelection: [],
      total: 0
    };
  },
  async created() {
    this.getUserGameList();
    const res = await getPlatformList();
    res.data.unshift({ value: "", text: "全部平台" });
    this.platformList = res.data;
    this.getrecomGame();
    this.getDiscountGame();
    this.search();
  },
  computed: {
    ...mapGetters(["roles"]),
    isBoss() {
      return this.roles.includes("boss");
    }
  },

  methods: {
    //复制h5链接
    async getH5Link(row, event) {
      const data = {
        platformId: row.platformId,
        gameId: row.gameId,
        mcId: row.mcId,
        scId: row.scId
      };
      const res = await generatorH5Link(data);
      if (res.state == "ok") {
        clipboard(res.message, event);
      } else if (res.state === "fail") {
        this.$message.error(res.message);
      }
    },

    //签署合同
    async confirmSignContract() {
      const { code, msg } = await this.$store.dispatch("checkAdmin");
      if (code === 1 || code === 4) return;
      if (code === 3) {
        this.$router.push("/personal/password");
        return;
      }
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
    getrecomGame() {
      http.get("/recomGame/getList.do").then(res => {
        if (res.state == "ok") {
          this.tableData = res.data;
        }
      });
    },
    handlegameid(option) {
      console.log(this.tableData);
    },
    getDiscountGame() {
      http.get("/guild/common/getDiscountGame.do").then(res => {
        if (res.state == "ok") {
          this.tableData2 = res.data;
        }
      });
    },
    comfirm() {
      console.log();
      let form = new FormData();
      this.tableData.forEach((item, index) => {
        form.append("recommendGames[" + index + "]" + ".guildid", item.guildId);
        form.append("recommendGames[" + index + "]" + ".mcid", item.mcId);
        form.append("recommendGames[" + index + "]" + ".gameid", item.gameId);
        form.append("recommendGames[" + index + "]" + ".platformid", "76box");
        if (item.id) {
          form.append("recommendGames[" + index + "]" + ".id", item.id);
        }
      });
      // recommendGames;
      http.post("/recomGame/save.do", form).then(res => {
        if (res.state == "ok") {
          this.dialogFormVisible = false;
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    promotionSet() {
      this.dialogFormVisible = true;
    },
    // handleGamesChange(data) {
    //   this.filters.platformType = data.platformType;
    //   if (this.filters.platformType == "0") {
    //     this.filters.isDiscountGame = 0;
    //   } else {
    //     this.filters.isDiscountGame = 1;
    //   }
    //   this.filters.queryPlatformid = data.platformId;
    //   this.filters.queryGameid = data.gameId;
    //   this.filters.queryZone = data.zoomId;
    // },
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
    tableRowClassName({ rowIndex }) {
      if (rowIndex === 0) {
        return "first-row";
      }
      return "";
    },
    async unpackIos(obj) {
      if (obj.gameContract && obj.gameContract == "待签署") {
        if (this.isBoss) {
          this.signContractDialog = true;
          this.gameImg = obj.gameIcon;
          this.gameName = obj.gameName;
          this.status = obj.status || 0;
          this.gameContractId = obj.gameContractId || "";
          return;
        } else {
          this.dialogObj = obj;
          this.dialogVisibleContract = true;
          return;
        }
      }
      try {
        const query = {
          gameId: obj.gameId,
          scId: obj.scId,
          url: obj.url,
          gameName: obj.gameName
        };
        const res = await mygameSubiospackage(query);
        if (res.state === "ok") {
          this.$message.success("正在打包，请耐心等待");
          this.search();
        } else {
          this.$message.warning(res.message);
        }
      } catch (e) {
        this.$message.error("异常");
      }
    },
    //更新链接
    async upurl(row) {
      try {
        const query = {
          gameId: row.gameId,
          scId: row.scId,
          url: row.url,
          gameName: row.gameName
        };
        const res = await mygameSubiospackage(query);
        if (res.state === "ok") {
          this.search();
        } else {
          this.$message.warning(res.message);
        }
      } catch (e) {
        this.$message.error("异常");
      }
      try {
        const query = {
          gameId: row.gameId,
          scId: row.scId,
          url: row.url
        };
        const res = await mygameSubpackage(query);
        if (res.state === "ok") {
          console.log("111", res);
          this.$message.success("正在打包，请耐心等待");
          this.search();
        } else {
          this.$message.warning(res.message);
        }
      } catch (e) {
        this.$message.error("异常");
      }
    },
    //复制推广链接
    async copyurl(obj, event, num) {
      if (obj.gameContract && obj.gameContract == "待签署") {
        if (this.isBoss) {
          this.signContractDialog = true;
          this.gameImg = obj.gameIcon;
          this.gameName = obj.gameName;
          this.status = obj.status || 0;
          this.gameContractId = obj.gameContractId || "";
          return;
        } else {
          this.dialogObj = obj;
          this.dialogVisibleContract = true;
          return;
        }
      }
      try {
        const query = {
          platformId: obj.platformId,
          guildId: obj.guildId,
          gameId: obj.gameId,
          mcId: obj.mcId,
          scId: obj.scId
        };
        const res = await mygameGetNewDownloadUrl(query);
        if (res.state == "ok") {
          clipboard(res.data.short, event);
        } else {
          this.$message.warning(res.message);
        }
      } catch (e) {
        this.$message.error("异常");
      }
    },
    async unpackAndroid(obj) {
      if (obj.gameContract && obj.gameContract == "待签署") {
        if (this.isBoss) {
          this.signContractDialog = true;
          this.gameImg = obj.gameIcon;
          this.gameName = obj.gameName;
          this.status = obj.status || 0;
          this.gameContractId = obj.gameContractId || "";
          return;
        } else {
          this.dialogObj = obj;
          this.dialogVisibleContract = true;
          return;
        }
      }
      try {
        const query = {
          gameId: obj.gameId,
          scId: obj.scId,
          url: obj.url
        };
        const res = await mygameSubpackage(query);
        if (res.state === "ok") {
          this.$message.success("正在打包，请耐心等待");
          this.search();
        } else {
          this.$message.warning(res.message);
        }
      } catch (e) {
        this.$message.error("异常");
      }
    },
    async unpackPc(obj) {
      try {
        const query = {
          gameId: obj.gameId,
          scId: obj.scId,
          url: obj.url
        };
        const res = await mygameSubPcpackage(query);
        if (res.state === "ok") {
          this.$message.success("正在打包，请耐心等待");
          this.search();
        } else {
          this.$message.warning(res.message);
        }
      } catch (e) {
        this.$message.error("异常");
      }
    },
    async save(obj) {
      try {
        const data = {
          scId: obj.scId,
          anchorId: this.achID
        };
        const res = await directAnchor(data);
        if (res.state === "ok") {
          this.$message.success(res.message);
          this.search();
          this.achID = "";
        } else {
          this.$message.warning(res.message);
        }
      } catch (e) {
        this.$message.error("异常");
      }
    },
    async getDownloadUrl(obj, event) {
      if (obj.gameContract && obj.gameContract == "待签署") {
        if (this.isBoss) {
          this.signContractDialog = true;
          this.gameImg = obj.gameIcon;
          this.gameName = obj.gameName;
          this.status = obj.status || 0;
          this.gameContractId = obj.gameContractId || "";
          return;
        } else {
          this.dialogObj = obj;
          this.dialogVisibleContract = true;
          return;
        }
      }
      if (obj.newIosVersion && obj.newVersion) {
        if (
          obj.iosVersion !== obj.newIosVersion ||
          obj.version !== obj.newVersion
        ) {
          this.$message.warning("需要更新才能提取链接");
          return;
        }
      }
      try {
        const query = {
          platformId: obj.platformId,
          guildId: obj.guildId,
          gameId: obj.gameId,
          mcId: obj.mcId,
          scId: obj.scId
        };
        const res = await mygameGetNewDownloadUrl(query);
        if (res.state == "ok") {
          clipboard(res.data.short, event);
        } else {
          this.$message.warning(res.message);
        }
      } catch (e) {
        this.$message.error("异常");
      }
    },
    async getVVDownload(obj, event) {
      if (obj.newIosVersion && obj.newVersion) {
        if (
          obj.iosVersion !== obj.newIosVersion ||
          obj.version !== obj.newVersion
        ) {
          this.$message.warning("需要更新才能提取链接");
          return;
        }
      }

      try {
        const query = {
          gameId: obj.gameId,
          mcId: obj.mcId,
          scId: obj.scId
        };
        const res = await mygameGetNewDownloadUrl(query);
        if (res.state === "ok") {
          this.clipboardDialog.link = res.message;
          clipboard(res.message, event);
        } else {
          this.$message.warning(res.message);
        }
      } catch (e) {
        console.log(e);
        this.$message.error("异常");
      }
    },
    getVVDownload2(obj, event) {
      if (obj.newIosVersion && obj.newVersion) {
        if (
          obj.iosVersion !== obj.newIosVersion ||
          obj.version !== obj.newVersion
        ) {
          this.$message.warning("需要更新才能提取链接");
          return;
        }
      }

      try {
        const query = {
          gameId: obj.gameId,
          mcId: obj.mcId,
          scId: obj.scId
        };
        mygameGetNewDownloadUrl(query).then(res => {
          if (res.state === "ok") {
            this.clipboardDialog.link = res.message;
          } else {
            this.$message.warning(res.message);
          }
        });
      } catch (e) {
        console.log(e);
        this.$message.error("异常");
      }
    },
    updatePackage() {},
    async getPlatformGameList() {
      try {
        const query = {
          platformId: this.filter.platformId
        };
        const res = await getGameList(query);
        res.data.unshift({ value: "", text: "全部游戏" });
        this.platformGameList = res.data;
      } catch (e) {
        this.$message.error("异常");
      }
    },
    searchByPage(page) {
      this.filter.pageNo = page;
      this.search();
    },

    handleSizeChange(size) {
      this.filter.pageSize = size;
      this.filter.pageNo = 1;
      this.search();
    },
    async search(type) {
      if (type == 1) {
        this.filter.pageNo = 1;
      }

      try {
        const query = {
          // guildId,
          // platformId: this.filter.platformId,
          // gameId: this.filter.gameId,
          platFormId: this.filters.queryPlatformid,
          gameId: this.filters.queryGameid,
          pageNo: this.filter.pageNo,
          pageSize: this.filter.pageSize
        };
        this.tableLoading = true;
        const res = await mygameGetMyGamesInfo(query);
        this.tableLoading = false;
        if (res.state === "ok") {
          this.tableList = res.data;
          this.clipboardDialog.link = res.data[0].downloadUrl;
          this.bindID = res.data[0].anchorId;
          this.total = res.pagination.count;
        } else {
          this.tableList = [];
          this.total = 0;
          this.$message.warning(res.message);
        }
      } catch (e) {
        this.$message.error("异常");
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    allCheckModifySupportAccountStatus(newStatus) {
      let gameIds = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        gameIds.push(this.multipleSelection[i].gameId);
      }
      gameIds = gameIds.join(",");
      if (newStatus === 1) {
        const query = {
          gameIds: gameIds
        };
        batchAndroidPackage(query)
          .then(res => {
            if (res.state === "ok") {
              this.$message.success("正在批量更新打包，请耐心等待");
              //更新被操作的数据的状态
              this.$nextTick(() => this.search());
            } else {
              this.$message.error(res.message || "批量修改失败");
            }
          })
          .catch(() => {
            this.$message.error(res.message || "批量修改失败");
          });
      } else if (newStatus === 2) {
        const query = {
          gameIds: gameIds
        };
        batchsubIosPackage(query)
          .then(res => {
            if (res.state === "ok") {
              this.$message.success("正在批量更新打包，请耐心等待");
              //更新被操作的数据的状态
              this.$nextTick(() => this.search());
            } else {
              this.$message.error(res.message || "批量修改失败");
            }
          })
          .catch(() => {
            this.$message.error(res.message || "批量修改失败");
          });
      }
    },
    reset() {
      this.filter.platformId = "";
      this.filter.gameId = "";
      this.filter.pageNo = 1;
      this.filter.pageSize = 10;

      this.filters.queryGame = "";
      this.filters.queryPlatformid = "";
      this.filters.queryGameid = "";
      this.multipleSelection = [];
      // //专服/折扣
      // this.$refs.BoxGame.handleChangePlatform("0");
      // this.$refs.BoxGame.handleChangeGame("");

      this.search();
    },
    // 复制成功提示
    // clipboardSuccess() {
    //   this.$message({
    //     message: "复制成功",
    //     type: "success"
    //   });
    // },
    handleDownload(row, ev) {
      this.clipboardDialog.link = "";
      if (!row.downloadUrl) {
        this.getVVDownload2(row, ev);
      }
      let data = {
        downloadUrl: row.downloadUrl
          ? row.downloadUrl
          : this.clipboardDialog.link,
        platformId: row.platformId,
        gameId: row.gameId
      };
      downloadQRCodeExpandPage(data).then(res => {
        if (res.type != "application/octet-stream") {
          this.$message.warning("二维码生成失败，请查看模板配置");
          return;
        }
        var blob = new Blob([res], {
          type: "application/vnd.ms-excel;charset=UTF-8"
        });
        var downloadElement = document.createElement("a");
        var href = window.URL.createObjectURL(blob);
        downloadElement.href = href;
        downloadElement.download = "二维码.png";
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
        window.URL.revokeObjectURL(href);
      });
      this.clipboardDialog.link = "";
    }
  }
};
</script>

<style>
.el-table .first-row {
  background: #f0f9eb;
}
</style>
