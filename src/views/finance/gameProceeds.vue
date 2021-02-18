<template>
  <div>
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
        <div class="flex mid mb20">
          <div class="mr10">搜索条件：</div>
          <div class="mr3 w145">
            <el-select v-model="filter.queryType">
              <el-option label="主渠道名称" value="2"></el-option>
              <el-option label="主渠道账号" value="1"></el-option>
              <el-option label="子渠道备注" value="14"></el-option>
              <el-option label="子渠道账号" value="3"></el-option>
              <el-option label="订单号" value="7"></el-option>
            </el-select>
          </div>
          <div class="mr20">
            <el-input v-model="filter.queryValue"></el-input>
          </div>
          <!-- <div class="mr10" v-if="false">选择游戏：</div>
          <div class="mr20" v-if="false">
            <el-select v-model="filter.gameId">
              <el-option
                v-for="(item, index) in gameList"
                :label="item.gameName"
                :value="item.gameId"
                :key="index"
              ></el-option>
            </el-select>
          </div>-->
          <!-- 返利盒子的 -->
          <!--<div class="mr20">-->
          <!--<BoxGame-->
          <!--ref="BoxGame"-->
          <!--@change="handleGamesChange"-->
          <!--:defaultPlatformId="filter.queryPlatformid"-->
          <!--:defaultGame="filter.gameId"-->
          <!--:hasZoom="false"-->
          <!--&gt;</BoxGame>-->
          <!--</div>-->
          <div class="mr10">
            <el-button type="primary" @click="search(1)">查询</el-button>
          </div>
          <div>
            <el-button @click="resetFilter">重置</el-button>
          </div>
        </div>
        <div class="flex mid">
          <div class="mr10">结算日：</div>
          <div>
            <el-date-picker
              type="dates"
              v-model="filter.billDates"
              placeholder="请选择结算日"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </div>
        </div>
      </div>
    </el-card>
    <el-card>
      <el-tabs v-model="activeTabName" @tab-click="changeTab()">
        <el-tab-pane label="游戏收入汇总" name="gameRevenueSummary">
          <div class="flex mid between mb15">
            <el-radio-group
              v-model="gameRevenueSummary.filter.balanceType"
              size="medium"
            >
              <el-radio-button
                v-for="(item, index) in balanceTypeList"
                :label="item.balanceType"
                :key="index"
                >{{ item.balanceDesc }}</el-radio-button
              >
            </el-radio-group>
            <el-button
              type="primary"
              size="medium"
              @click="exportGameRevenueSummaryExcel"
              >导出</el-button
            >
          </div>
          <el-table
            border
            :data="gameRevenueSummary.tableData"
            v-loading="gameRevenueSummary.tableLoading"
            @select-all="selectAll"
            @select="select"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column
              align="center"
              label="结算周期"
              prop="billDate"
            ></el-table-column>
            <el-table-column
              align="center"
              label="游戏名称"
              prop="gameName"
            ></el-table-column>
            <el-table-column
              align="center"
              label="当期玩家消费总额（元）"
              prop="consumeMoneyTotal"
            ></el-table-column>
            <el-table-column
              align="center"
              label="分成比例"
              prop="planRatio"
              v-if="roles === 'boss' && account === 1"
            >
              <template slot-scope="scope">
                <el-popover placement="left" width="400" trigger="click">
                  <el-table :data="scope.row.planRatio">
                    <el-table-column
                      align="center"
                      prop="ratio"
                      label="分成比例"
                    >
                      <template slot-scope="scope"
                        >{{ scope.row.ratio }}%</template
                      >
                    </el-table-column>
                    <el-table-column
                      align="center"
                      prop="startDate"
                      label="生效时间"
                    ></el-table-column>
                  </el-table>
                  <span
                    v-if="scope.row.planRatio.length === 1"
                    slot="reference"
                  >
                    {{
                      scope.row.planRatio[scope.row.planRatio.length - 1].ratio
                    }}%
                  </span>
                  <el-button
                    v-if="scope.row.planRatio.length > 1"
                    type="text"
                    slot="reference"
                  >
                    {{
                      scope.row.planRatio[scope.row.planRatio.length - 1].ratio
                    }}%
                  </el-button>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="分成收益（元）"
              prop="devideMoney"
              v-if="roles === 'boss' && account === 1"
            ></el-table-column>
            <el-table-column align="center" label="确认金额" prop="confirm">
              <div slot="header">
                <span style="margin-right: 20px">确认金额</span>
                <el-tooltip
                  content="温馨提示：如您对本期账单有疑问，请勿确认本账单，并尽快与拓展专员联系。"
                  placement="top"
                  effect="light"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </div>
              <template slot-scope="scope">
                <div
                  v-if="scope.row.confirmCode == 0 && scope.row.stateCode == 1"
                >
                  <el-button
                    type="text"
                    @click="confirmMoney(scope.row.id, scope.row.gameName)"
                    >请您确认金额</el-button
                  >
                </div>
                <div
                  v-if="scope.row.confirmCode == 0 && scope.row.stateCode != 1"
                >
                  未满足本期结算条件，累计到下期结算。
                </div>
                <div v-if="scope.row.confirmCode != 0" style="color: green">
                  {{ scope.row.confirm }}
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="flex mid end mt20">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="count2"
              :current-page="pageNo2"
              @current-change="handelPageChange2"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="游戏收入明细" name="gameRevenueDetails">
          <div class="add-up flex mid mb15">
            <div class="item flex col ml30 mr60">
              <span>订单金额</span>
              <span>{{ realMoney }}元</span>
            </div>
            <div class="item flex col" v-if="roles === 'boss' && account === 1">
              <span>分成金额</span>
              <span style="color: #339966">{{ devide }}元</span>
            </div>
          </div>
          <el-table
            border
            :data="gameRevenueDetails.tableData"
            v-loading="gameRevenueDetails.tableLoading"
          >
            <el-table-column
              align="center"
              label="订单号"
              prop="orderId"
            ></el-table-column>
            <el-table-column
              align="center"
              label="游戏"
              prop="appName"
            ></el-table-column>
            <el-table-column
              align="center"
              label="角色名"
              prop="roleName"
            ></el-table-column>
            <el-table-column
              align="center"
              label="主渠道"
              prop="mcName"
            ></el-table-column>
            <el-table-column
              align="center"
              label="子渠道"
              prop="scName"
            ></el-table-column>
            <el-table-column
              align="center"
              label="消耗平台币"
              prop="blackBean"
            ></el-table-column>
            <el-table-column
              align="center"
              label="订单金额（元）"
              prop="realMoney"
            ></el-table-column>
            <el-table-column
              align="center"
              label="分成比例"
              prop="orderRatio"
              v-if="roles === 'boss' && account === 1"
            >
              <template slot-scope="scope"
                >{{ scope.row.orderRatio }}%</template
              >
            </el-table-column>
            <el-table-column
              align="center"
              label="分成款（元）"
              prop="devide"
              v-if="roles === 'boss' && account === 1"
            ></el-table-column>
            <el-table-column
              align="center"
              label="订单完成时间"
              prop="completeTime"
            ></el-table-column>
          </el-table>
          <div class="flex mid end mt20">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="count"
              :current-page="pageNo"
              @current-change="handelPageChange"
            ></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="flex mid mt10" v-if="optShow">
        <div class="mr30">批量操作:</div>
        <el-button @click="confirmMoney()" :disabled="clickDisabled"
          >确认金额</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<script>
import * as API from "../../api/finance";
import moment from "moment";
import { mapState } from "vuex";
import BoxGame from "@/components/Games/boxGame";
import http from "@/utils/http";
export default {
  name: "gameProceeds",
  components: { BoxGame },
  data() {
    return {
      activeTabName: "gameRevenueSummary",
      balanceTypeList: [],
      gameList: [],
      filter: {
        isDiscountGame: 0,
        queryType: "2",
        queryValue: "",
        billDates: [],
        gameId: ""
      },
      realMoney: "",
      devide: "",
      gameRevenueSummary: {
        tableData: [],
        tableLoading: false,
        filter: {
          balanceType: ""
        },
        total: 0
      },
      gameRevenueDetails: {
        tableData: [],
        tableLoading: false
      },
      pickerOptions: {
        disabledDate: pickTime => {
          return !this.billDatesList.includes(
            moment(pickTime).format("YYYY-MM-DD")
          );
        }
      },
      checked: false,
      //选中的数据
      selectionData: [],
      count: 0,
      pageNo: 1,
      pageSize: 10,
      count2: 0,
      pageNo2: 1,
      pageSize2: 10
    };
  },
  watch: {
    "gameRevenueSummary.filter.balanceType"() {
      this.search();
    }
  },
  computed: mapState({
    roles: state => state.user.roles[0],
    account: state => state.user.account.isShowProportion,
    clickDisabled() {
      if (this.selectionData.length > 0) {
        return false;
      } else {
        return true;
      }
    },
    optShow() {
      if (this.activeTabName == "gameRevenueSummary") {
        return true;
      } else {
        return false;
      }
    }
  }),
  created() {
    this.$route.query.billDate &&
      this.filter.billDates.push(
        moment(this.$route.query.billDate, "YYYY-MM-DD 23:59:59")
      );
    //this.getGameList();
    this.getBalanceType();
    this.getbillDatesList(this.search);
    // this.search();
  },
  methods: {
    handleGamesChange(data) {
      if (data.platformType == "0") {
        this.filter.isDiscountGame = 0;
      } else {
        this.filter.isDiscountGame = 1;
      }
      this.filter.gameId = data.gameId;
    },
    handelPageChange(pageNo) {
      this.pageNo = pageNo;
      this.getGameBillOrder();
    },
    handelPageChange2(pageNo) {
      this.pageNo2 = pageNo;
      this.search();
    },
    async getbillDatesList(callback) {
      try {
        const res = await API.getBillCycleByMonth();
        if (res.state === "ok") {
          this.billDatesList = res.data || [];
          if (this.billDatesList.length > 0) {
            this.filter.billDates = [
              this.billDatesList[this.billDatesList.length - 1]
            ];
            console.log(this.filter.billDates);
          }
          callback();
        } else {
          this.$message.warning(res.message || "获取结算日失败");
        }
      } catch (e) {
        console.error(e);
        this.$message.error("获取结算日异常");
      }
    },
    changeTab() {
      if (this.activeTabName == "gameRevenueDetails") {
        this.getGameBillOrder();
      }
    },
    async getGameBillOrder() {
      this.gameRevenueDetails.tableLoading = true;
      try {
        let data = {
          queryType: this.filter.queryType,
          queryValue: this.filter.queryValue,
          isDiscountGame: this.filter.isDiscountGame,
          billDates:
            (this.filter.billDates &&
              this.filter.billDates
                .map(item => moment(item).format("YYYY-MM-DD 23:59:59"))
                .join(",")) ||
            "",
          balanceType: this.gameRevenueSummary.filter.balanceType,
          gameId: this.filter.gameId,
          pageNo: this.pageNo,
          pageSize: 10
        };
        const res = await http.get2("/guildBill/getGameBillOrder.do", data);
        if (res.state === "ok") {
          this.gameRevenueDetails.tableData = res.data.orderRatioList || [];
          this.realMoney = res.data.realMoney;
          this.devide = res.data.devide;
          this.count = res.pagination.count;
          this.gameRevenueDetails.tableLoading = false;
        } else {
          this.$message.warning(res.message || "查询失败");
          this.gameRevenueDetails.tableLoading = false;
        }
      } catch (e) {
        this.$message.error(e || "获取异常列表");
        this.gameRevenueDetails.tableLoading = false;
      }
    },
    async search(type) {
      if (type) {
        this.pageNo = 1;
        this.pageNo2 = 1;
      }
      this.activeTabName = "gameRevenueSummary";
      try {
        this.gameRevenueSummary.tableLoading = true;
        const res = await API.getGameBill({
          queryType: this.filter.queryType,
          queryValue: this.filter.queryValue,
          isDiscountGame: this.filter.isDiscountGame,
          billDates:
            (this.filter.billDates &&
              this.filter.billDates
                .map(item => moment(item).format("YYYY-MM-DD 23:59:59"))
                .join(",")) ||
            "",
          balanceType: this.gameRevenueSummary.filter.balanceType,
          gameId: this.filter.gameId,
          pageNo: this.pageNo2,
          pageSize: 10
        });
        if (res.state === "ok") {
          console.log(JSON.stringify(res.data) == "{}");
          this.gameRevenueSummary.tableData =
            JSON.stringify(res.data) == "{}" ? [] : res.data.gameBills;
          this.count2 =
            JSON.stringify(res.data) == "{}" ? 0 : res.pagination.count;
        } else {
          this.$message.warning(res.message || "查询失败");
        }
      } catch (e) {
        console.error(e);
        this.$message.error("查询异常");
      } finally {
        this.gameRevenueSummary.tableLoading = false;
      }
    },
    exportGameRevenueSummaryExcel() {
      if (this.gameRevenueSummary.tableData.length === 0) {
        this.$message.warning("请先查询所需数据再导出");
        return;
      }
      let data = {
        mainMenu: "财务结算表",
        oneMenu: "游戏收入对账表",
        queryType: this.filter.queryType,
        queryValue: this.filter.queryValue,
        billDates:
          (this.filter.billDates &&
            this.filter.billDates
              .map(item => moment(item).format("YYYY-MM-DD 23:59:59"))
              .join(",")) ||
          "",
        gameId: this.filter.gameId,
        balanceType: this.gameRevenueSummary.filter.balanceType || ""
      };
      http.get2("/guildBill/exGameBill.do", data).then(res => {
        if (res.state === "ok") {
          this.$message.success(res.message || "导出成功");
          // const a = document.createElement("a");
          // a.href = res.message;
          // a.click();
        } else {
          this.$message.error(res.message || "导出失败");
        }
      });
    },
    async getBalanceType() {
      try {
        const res = await API.guildBalanceType();
        if (res.state === "ok") {
          this.balanceTypeList = res.data;
        } else {
          this.$message.warning(res.message || "获取账单类型失败");
        }
      } catch (e) {
        console.error(e);
        this.$message.error("获取账单类型异常");
      }
    },
    async getGameList() {
      try {
        const res = await API.gameList();
        if (res.state === "ok") {
          this.gameList = res.data;
        } else {
          this.$message.warning(res.message || "获取入驻游戏列表失败");
        }
      } catch (e) {
        console.error(e);
        this.$message.error("获取入驻游戏列表异常");
      }
    },
    resetFilter() {
      this.filter.queryType = "2";
      this.filter.queryValue = "";
      this.filter.billDates = [];
      this.filter.gameId = "";
      this.gameRevenueSummary.filter.balanceType = "";
      //专服/折扣
      this.$refs.BoxGame.handleChangePlatform("0");
      this.$refs.BoxGame.handleChangeGame("");
      this.pageNo = 1;
      this.pageNo2 = 1;
      this.search();
    },
    //当用户手动勾选全选 Checkbox 时触发的事件
    selectAll(selection) {
      this.selectionData = selection;
      if (selection.length > 0) {
        this.checked = true;
        return;
      }
      this.checked = false;
    },
    //当用户手动勾选数据行的 Checkbox 时触发的事件
    select(selection, row) {
      this.selectionData = selection;
    },
    async confirmMoney(id, gameName) {
      try {
        let data = [];
        if (id) {
          data.push({ id: id });
        } else {
          this.selectionData.forEach(item => {
            data.push({ id: item.id });
          });
        }
        const res = await http.post("/guildBill/confirmGameBill.do", data);
        if (res.state == "ok") {
          if (gameName) {
            this.$message.success("已确认《" + gameName + "》结算金额");
          } else {
            this.$message.success(res.message || "操作成功");
          }
          this.search();
        } else {
          this.$message.error(res.message || "操作失败");
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.add-up {
  width: 100%;
  height: 100px;
  border: 1px dashed #bfc1c7;
  color: #464646;
  span {
    &:nth-child(1) {
      font-size: 14px;
      font-weight: bold;
    }
    &:nth-child(2) {
      font-size: 24px;
    }
  }
}
</style>
