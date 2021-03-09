<template>
  <div class="games">
    <div class="page-crumbs">
      <div class="crumbs">
        <breadcrumb />
      </div>
    </div>
    <el-card>
      <div slot="header">
        <h3>查询条件</h3>
      </div>
      <div class="body">
        <div class="flex mid">
          <!-- <div class="mr10">游戏：</div> -->
          <div class="mr40" v-if="false">
            <el-select
              @change="getPlatformGameList"
              v-model="filter.platformId"
              filterable
            >
              <el-option
                v-for="item in platformList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-select v-model="filter.gameId" filterable>
              <el-option
                multiple
                v-for="item in platformGameList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="mr40" v-if="false">
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
          <BoxGame
            ref="BoxGame"
            @change="handleGamesChange"
            :defaultPlatformId="filters.queryPlatformid"
            :defaultGame="filters.gameId"
            :hasZoom="false"
          ></BoxGame>
          <div>
            <el-button @click="search" type="primary">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </div>
        </div>
      </div>
    </el-card>
    <el-card>
      <div slot="header">
        <h3>产品列表</h3>
        <div class="extra">
          <el-button
            size="medium"
            type="primary"
            @click="exportDatas"
            :loading="downloadLoading"
            >导出</el-button
          >
        </div>
      </div>
      <div class="body">
        <el-radio-group
          @change="search"
          v-model="filter.status"
          size="small"
          class="mb20"
        >
          <el-radio-button label>全部</el-radio-button>
          <el-radio-button label="1">已入驻</el-radio-button>
          <el-radio-button label="0">申请入驻中</el-radio-button>
          <el-radio-button label="-1">未入驻</el-radio-button>
          <el-radio-button label="2">停止入驻</el-radio-button>
        </el-radio-group>
        <el-table border :data="tableList" v-loading="tableLoading">
          <el-table-column
            width="150"
            align="center"
            prop="gameImg"
            label="游戏图标"
          >
            <template slot-scope="scope">
              <img class="w80 h80" :src="scope.row.gameImg" alt />
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="gameName"
            label="游戏名称"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="gameType"
            label="游戏类型"
          ></el-table-column>
          <el-table-column align="center" prop="zoneType" label="区服类型">
            <template slot-scope="scope">
              {{
                scope.row.zoneType === "混服"
                  ? "通服"
                  : scope.row.zoneType === "专服"
                  ? "包服"
                  : scope.row.zoneType
              }}
            </template>
          </el-table-column>
          <el-table-column align="center" width="550" label="游戏简介">
            <template slot-scope="scope">
              <div
                style="
                  text-align: left;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 3;
                  -webkit-box-orient: vertical;
                "
              >
                {{ scope.row.gameDesc }}
              </div>
            </template>
          </el-table-column>
          <!--<el-table-column align="center" prop="ratio" label="分成比例">-->
          <!--<template slot-scope="scope">{{isNaN(Number(scope.row.ratio))?'数据异常':Number(scope.row.ratio).toFixed(1)}}</template>-->
          <!--</el-table-column>-->
          <el-table-column
            align="center"
            prop="statusStr"
            label="入驻状态"
          ></el-table-column>
          <el-table-column align="center" prop="gameContract" label="游戏合同">
            <template slot-scope="scope">
              <div>
                <el-button
                  type="text"
                  style="color: red"
                  v-if="scope.row.gameContract == '待签署'"
                  @click="signContract(scope.row)"
                  >待签署</el-button
                >
                <div v-if="scope.row.gameContract == '签署中'">签署中</div>
                <div v-if="scope.row.gameContract == '已归档'">已归档</div>
                <div v-if="scope.row.gameContract == '已取消'">已取消</div>
                <el-button
                  type="text"
                  v-if="scope.row.gameContract == '签署完成'"
                  @click="checkContract(scope.row.gameContractId)"
                  >查看合同</el-button
                >
                <div v-if="!scope.row.gameContract">-</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="
                  scope.row.status === -1 ||
                    scope.row.status === -2 ||
                    scope.row.status === 2 ||
                    scope.row.status === 3
                "
                @click="applyOrRevoke(scope.row.gameId, scope.row.planId, 0)"
                style="color: #67c23a"
                type="text"
                >[申请入驻]</el-button
              >
              <el-button
                style="color: red"
                v-if="scope.row.status === 0"
                @click="applyOrRevoke(scope.row.gameId, scope.row.planId, -1)"
                type="text"
                >[取消申请]</el-button
              >
              <el-button
                v-if="scope.row.status === 1"
                @click="applyOrRevoke(scope.row.gameId, scope.row.planId, 2)"
                style="color: #f56c6c"
                type="text"
                >[停止入驻]</el-button
              >
              <div v-if="scope.row.planStatus === 1">
                <router-link
                  v-if="scope.row.status === 1"
                  :to="
                    `/gameManage/admission/edit?gameId=${
                      scope.row.gameId
                    }&planId=${scope.row.planId}`
                  "
                  >[编辑子渠道]</router-link
                >
              </div>
              <div v-if="scope.row.planStatus !== 1">
                <span>{{ scope.row.planStatusStr }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-footer">
          <div class="actions"></div>
          <div class="pages" style="float: right">
            <el-pagination
              background
              layout="prev, pager, next, total"
              :current-page="filters.page.pageNo"
              :total="filters.page.count"
              @current-change="onPageChange"
            ></el-pagination>
          </div>
        </div>
        <!-- 待签署合同弹窗 -->
        <el-dialog
          title="签署合同"
          :visible.sync="signContractDialog"
          width="24%"
          center
          :append-to-body="true"
        >
          <div class="lineHeight">尊敬的用户，您好：</div>
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
        <!-- <el-dialog
          title="请输入权限密码确认操作"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="handleClose"
          @close="close">
          <span><el-input v-model="pwdValue"></el-input></span>
          <span class="setPwd"> <router-link :to="`/personal/password`">未设置密码请点击此处设置</router-link> </span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="deleteDialog">取 消</el-button>
            <el-button type="primary" @click="confirmDialog">确 定</el-button>
          </span>
        </el-dialog>-->

        <div class="flex end mt15"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  gameMangerGamePlanEdit,
  gameMangergamePlanList
} from "../../../api/gameProm";
import { getPlatformList, getGameList } from "../../../api/aid";
import { getUserGameList } from "@/api/aid";
import http from "@/utils/http";
import BoxGame from "@/components/Games/boxGame";

export default {
  name: "gameManageAdmissionIndex",
  components: {
    BoxGame
  },
  data() {
    return {
      signContractDialog: false,
      gameImg: "",
      gameName: "",
      tableLoading: false,
      platformList: [],
      platformGameList: [],
      tableList: [],
      pwdValue: "",
      state: "",
      dialogVisible: false,
      downloadLoading: false,
      flag: false,
      RealNameVerifiyDialog: false,
      RealNameVerifiyUrl: "",
      guildId: "",
      status: "",
      gameContractId: "",
      filter: {
        platformId: "",
        gameId: "",
        status: ""
      },
      filters: {
        page: {
          //当前页
          count: 0, //总数
          pageNo: 1, //页
          pageSize: 10 //页大小
        },
        isDiscountGame: 0,
        queryPlatformid: "",
        queryGameid: "",
        queryGame: "",
        queryGameList: []
      }
    };
  },
  async created() {
    this.search();
  },
  methods: {
    /**
     * 切换分页
     * @param page
     */
    onPageChange(page) {
      this.filters.page.pageNo = page;
      this.search();
    },
    exportDatas() {
      if (this.tableList.length === 0) {
        this.$message.warning("请先查询所需数据再导出");
        return;
      }
      this.downloadLoading = true;
      const data = {
        platFormId: this.filters.queryPlatformid,
        gameId: this.filters.queryGameid,
        isDiscountGame: this.filters.isDiscountGame,
        status: this.filter.status
      };
      http.get2("/guildEnter/apply/export.do", data).then(res => {
        if (res.state === "fail") {
          this.$message.error(res.message || "导出失败！");
          this.downloadLoading = false;
        } else {
          this.$message.success(res.message || "导出成功");
          this.downloadLoading = false;
        }
      });
    },
    //签署合同弹窗
    async signContract(row) {
      const { code, msg } = await this.$store.dispatch("checkAdmin");
      if (code === 1 || code === 4) return;
      if (code === 3) {
        this.$router.push("/personal/password");
        return;
      }
      if (code === 2) {
        this.signContractDialog = true;
        this.gameImg = row.gameImg;
        this.gameName = row.gameName;
        this.status = row.status;
        this.gameContractId = row.gameContractId || "";
      }
    },
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

    //查看合同
    checkContract(gameContractId) {
      const data = {
        contractId: gameContractId
      };
      http.get2("/guildEnter/contract/see.do", data).then(res => {
        if (res.state === "fail") {
          this.$message.error(res.message);
        } else {
          const a = document.createElement("a");
          a.href = res.message;
          a.target = "_blank";
          a.click();
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
    close() {
      this.pwdValue = "";
    },
    handleClose() {
      this.dialogVisible = false;
    },
    deleteDialog() {
      this.dialogVisible = false;
      this.flag = false;
    },
    confirmDialog() {
      this.dialogVisible = false;
      this.flag = true;
      this.gameMangerGamePlanEdits();
    },
    async search() {
      try {
        const query = {
          // platformId: this.filter.platformId,
          // gameId: this.filter.gameId,
          platFormId: this.filters.queryPlatformid,
          gameId: this.filters.queryGameid,
          isDiscountGame: this.filters.isDiscountGame,
          status: this.filter.status,
          pageNo: this.filters.page.pageNo,
          pageSize: this.filters.page.pageSize
        };
        this.tableLoading = true;
        const res = await http.get2("/guildEnter/apply/manage.do", query);
        this.tableLoading = false;
        if (res.state === "ok") {
          this.tableList = res.data.filter(item => item.planId !== 168);
          this.filters.page.count = res.pagination.count;
        } else {
          this.$message.warning(res.message);
        }
      } catch (e) {
        this.$message.error("异常");
      }
    },
    searchByPage(pageNo) {
      this.filter.pageNo = pageNo;
      this.search();
    },
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
    async applyOrRevoke(gameId, planId, status) {
      try {
        let prompt = {};
        let body = { gameId, planId, status };
        if (status === 0) {
          await this.$confirm("确认进驻该游戏？", {
            confirmButtonText: "确认",
            cancelButtonText: "再想想"
          });
        }
        if (status === -1) {
          await this.$confirm("确认撤销申请入驻该游戏？", {
            confirmButtonText: "确认",
            cancelButtonText: "再想想"
          });
        }
        if (status === 2) {
          const { code, msg } = await this.$store.dispatch("checkAdmin");
          if (code === 1 || code === 4) return;
          if (code === 3) {
            this.$router.push("/personal/password");
            return;
          }
        }
        const res = await gameMangerGamePlanEdit(body);
        if (res.state === "ok") {
          this.search();
        } else {
          this.$message.warning(res.message);
        }
      } catch (e) {
        console.log(e);
        // this.$message.error('异常')
      }
    },
    async gameMangerGamePlanEdits() {
      let body = this.state;
      const res = await gameMangerGamePlanEdit(body);
      if (res.state === "ok") {
        this.search();
      } else {
        this.$message.warning(res.message);
      }
    },
    reset() {
      this.filter.platformId = "";
      this.filter.gameId = "";
      this.filter.status = "";
      this.filters.page.pageNo = 1;

      this.filters.queryGame = "";
      this.filters.queryPlatformid = "";
      this.filters.queryGameid = "";
      //专服/折扣
      this.$refs.BoxGame.handleChangePlatform("0");
      this.$refs.BoxGame.handleChangeGame("");
      this.search();
    }
  }
};
</script>

<style lang="scss" scoped>
.setPwd {
  display: inline-block;
  font-size: 14px;
  float: right;
  margin-top: 10px;
  a {
    color: #00bfff;
  }
}
.lineHeight {
  margin-bottom: 10px;
}
</style>
