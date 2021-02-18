<template>
  <div class="page-data-search-recharge">
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
          <el-form :model="filters" ref="filters">
            <el-row :gutter="10">
              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="6">
                <div class="merge">
                  关键词查询：
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
                    placeholder="关键词"
                  ></el-input>
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="8" v-if="false">
                <div class="merge">
                  游戏：
                  <el-select
                    v-model="filters2.queryPlatform"
                    placeholder="请选择"
                    style="width: 150px;"
                    @change="handleQueryPlatformChange"
                  >
                    <el-option
                      v-for="item in filters2.queryPlatformTypes"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    />
                  </el-select>
                  <el-select
                    v-model="filters2.queryGame"
                    placeholder="请选择"
                    style="width: 150px;"
                    @change="handleQueryGameChange"
                  >
                    <el-option
                      v-for="item in filters2.queryGameList"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    />
                  </el-select>
                  <el-select
                    v-model="filters2.queryZone"
                    placeholder="请选择"
                    style="width: 150px;"
                    @change="handleQueryZoneChange"
                  >
                    <el-option
                      v-for="item in filters2.queryZoneList"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </el-col>
              <!-- 去除平台后的 -->
              <el-col :xs="24" :sm="12" :md="12" :lg="10" :xl="8" v-if="false">
                <div class="flex flex-align-center">
                  游戏：
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

                  <el-select
                    v-model="filters.queryZone"
                    placeholder="请选择"
                    style="width: 150px;"
                    filterable
                  >
                    <el-option
                      v-for="item in filters.queryZoneList"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </el-col>
              <!-- 返利盒子的 -->
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="8">
                <BoxGame
                  ref="BoxGame"
                  @change="handleGamesChange"
                  :defaultPlatformId="filters.queryPlatformid"
                  :defaultGame="filters.gameId"
                ></BoxGame>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="7">
                <div class="flex flex-align-center">
                  消费时间：
                  <el-date-picker
                    v-model="filters.date"
                    type="daterange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="handleDatepicker"
                  ></el-date-picker>
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="3">
                <el-button
                  @click="submitFilter"
                  type="primary"
                  v-noMoreClick="5000"
                  >查询</el-button
                >
                <el-button @click="resetFilter('filters')">重置</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </el-card>

    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <h3>帐号列表</h3>
        <div class="extra">
          <el-button
            size="medium"
            type="primary"
            @click="exportDatas"
            :loading="downloadLoading"
            v-noMoreClick="10000"
            >导出</el-button
          >
        </div>
      </div>
      <div class="body">
        <div class="filter-data">
          <el-radio-group
            size="small"
            v-model="labelFilter"
            @change="radioChange"
          >
            <el-radio-button
              v-for="radio in radios"
              :key="radio.value"
              :label="radio.value"
              >{{ radio.name }}</el-radio-button
            >
          </el-radio-group>
        </div>
        <el-table
          :data="recharges"
          tooltip-effect="dark"
          style="width: 100%"
          border
          v-loading="loading"
        >
          <el-table-column
            label="订单号"
            width="100"
            prop="orderid"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="userId"
            label="账号"
            align="center"
            width="100"
          ></el-table-column>
          <el-table-column
            label="所属主渠道 /子渠道"
            width="180"
            align="center"
          >
            <template slot-scope="scope">
              {{ `${scope.row.scRealName || "-"}` }}
            </template>
          </el-table-column>
          <el-table-column label="游戏" width="150" align="center">
            <template slot-scope="scope">{{
              `${scope.row.gameName}`
            }}</template>
          </el-table-column>
          <el-table-column
            prop="zonename"
            label="区服名称"
            width="150"
            align="center"
          >
            <template slot-scope="scope">
              <span class="multiline">{{ scope.row.zonename || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="角色信息" width="180" align="center">
            <template slot-scope="scope">
              <span style="display: block;">{{ scope.row.roleName }}</span>
              <span style="display: block;">
                {{ `${scope.row.roleLevel}级 | ${scope.row.roleId || "-"}` }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="money"
            label="订单总额（元）"
            width="120"
            align="center"
          >
            <template slot-scope="scope">
              <span class="multiline">{{ scope.row.money || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="用券抵扣"
            width="100"
            prop="couponDiscounts"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="realMoney"
            label="实收金额（元）"
            width="120"
            align="center"
          >
            <template slot="header">
              实收信息
              <el-tooltip class="item" effect="dark" placement="top">
                <div slot="content">
                  NT$=台币 $=美元<br />
                  paypal结算金额=【用户充值金额（$）-渠道费用（$）-固定手续费（$）】*汇率<br />
                  paypal渠道费用=用户充值金额（$）*渠道费率<br />
                  paypal渠道费率=4.4%<br />
                  paypal固定手续费=0.3美金/每笔<br />
                  paypal结算金额=【用户充值金额（$）-用户充值金额（$）*4.4%-0.3美金（$）】*6.5<br />
                  mycard结算金额=【用户充值金额（NT$）-渠道费用（NT$）】*汇率<br />
                  mycard渠道费用=用户充值金额（NT$）*渠道费率<br />
                  mycard渠道费率=30%<br />
                  mycard结算金额=【用户充值金额（NT$）-用户充值金额（NT$）*30%】*0.2<br />
                  payssion实收金额（人民币）=实收外币金额*6.5<br />
                  payssion实收外币金额=用户充值金额-渠道费率
                </div>
                <i class="el-icon-question"></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <span class="multiline">{{ scope.row.realMoney || "0" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="productName"
            label="获得物品"
            width="120"
            align="center"
          >
            <template slot-scope="scope">
              <span class="multiline">{{ scope.row.productName || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="payType"
            label="付款方式"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.payType || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="state"
            label="订单状态"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.state || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="logTime"
            label="消费时间"
            width="180"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.logTime || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="80" align="center">
            <template slot-scope="scope">
              <span
                class="action-button"
                v-if="scope.row.payInside === 0 && scope.row.orderStatus === 3"
                @click="doSyncOA(scope.row.orderid)"
                >[同步OA]</span
              >
              <span
                class="action-button"
                v-else-if="
                  scope.row.gameName === 'VV' && scope.row.orderStatus === 3
                "
                @click="doSyncOAVV(scope.row.orderid)"
                >[vv语音同步OA]</span
              >
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-footer">
          <div class="actions">
            玩家充值总计：
            <span>{{ cumMoney }}</span
            >元
          </div>
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
  </div>
</template>

<script>
import moment from "moment";
import Breadcrumb from "@/components/Breadcrumb";
import { serialize } from "@/utils";
import http from "@/utils/http";
import dataCenterService, {
  PLATFORM_ALL,
  GAME_ALL,
  ZONE_ALL
} from "@/service/dataCenterService";
import {
  getRecharges,
  syncOA,
  orderRecordNum,
  orderRecordExport
} from "@/api/dataSearch";
import { getUserGameList, getZonesList } from "@/api/aid";
import axios from "axios";
import BoxGame from "@/components/Games/boxGame";
export default {
  name: "DataSearchRecharge",
  components: {
    Breadcrumb,
    BoxGame
  },
  data() {
    const defaultData = {
      queryKey: 1,

      queryPlatform: PLATFORM_ALL,
      queryGame: GAME_ALL,
      queryZone: ZONE_ALL,

      queryDateValue: 1
    };

    return {
      cumMoney: "",
      downloadLoading: false,
      defaultData,
      filters: {
        isDiscountGame: 0,
        queryPlatformid: "",
        queryGameid: "",
        queryGame: "",
        queryGameList: [],
        queryZone: "",
        queryZoneList: [],
        queryType: "7",
        queryTypes: [
          {
            label: "订单号",
            value: "7"
          },
          {
            label: "账号",
            value: "4"
          },
          {
            label: "手机号码",
            value: "5"
          },
          {
            label: "主渠道名称",
            value: "2"
          },
          {
            label: "主渠道账号",
            value: "1"
          },
          {
            label: "子渠道账号",
            value: "3"
          }
        ],
        queryValue: "",

        // date: [],
        date: [
          moment(
            new Date(
              new Date(new Date().setHours(0, 0, 0, 0)).getTime() -
                3 * 24 * 3600 * 1000
            )
          ).format("YYYY-MM-DD HH:mm:ss"),
          moment(new Date(new Date().setHours(23, 59, 59, 0))).format(
            "YYYY-MM-DD HH:mm:ss"
          )
        ]
      },
      // 游戏联动
      filters2: {
        queryPlatformTypes: [defaultData.queryPlatform],
        queryPlatform: defaultData.queryPlatform.value,

        queryGameList: [defaultData.queryGame],
        queryGame: defaultData.queryGame.value,

        queryZoneList: [defaultData.queryZone],
        queryZone: defaultData.queryZone.value
      },

      labelFilter: "3",
      noSend: 0, // 付款未发货

      recharges: [],
      loading: false,
      page: 1,
      pageCount: 0,
      size: 10,
      total: 0
    };
  },
  computed: {
    radios() {
      const radios = [
        { name: "已完成", value: 3 },
        // { name: `已付款但物品未到（${this.noSend}）`, value: 2 },
        { name: `已付款但物品未到`, value: 2 },
        { name: "未付款", value: 1 },
        { name: "全部订单", value: "" }
      ];

      return radios;
    }
  },
  filters: {
    // 支付类型
    formatPayType(val) {
      let typeText = "";
      switch (val) {
        case "0":
          typeText = "V币";
          break;
        case "1":
          typeText = "微信";
          break;
        case "2":
          typeText = "支付宝";
          break;
        default:
          typeText = "-";
          break;
      }

      return typeText;
    },
    // 订单类型
    formatOrderState(val) {
      let stateText = "";
      switch (val) {
        case "-1":
          stateText = "失败";
          break;
        case "1":
          stateText = "未付款";
          break;
        case "2":
          stateText = "已付款但物品未到";
          break;
        case "3":
          stateText = "已完成";
          break;
        default:
          stateText = "-";
          break;
      }

      return stateText;
    }
  },
  created() {
    this.getRechargeList();
    this.requestGameConditions();
    // this.getUserGameList();
  },
  methods: {
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
      this.filters.queryZone = "";
      this.getZonesList();
    },
    async getZonesList() {
      try {
        const data = {
          gameId: this.filters.queryGameid,
          platformId: this.filters.queryPlatformid
        };
        const res = await getZonesList(data);
        if (res.state === "ok") {
          this.filters.queryZoneList = res.data;
        }
      } catch (error) {
        console.error(error);
        return;
      }
    },
    //没有去除平台的
    getGameConditions() {
      dataCenterService.getGameConditions(
        this.filters2.queryPlatform,
        this.filters2.queryGame,
        (platformList, gameList, zoneList) => {
          this.filters2.queryPlatformTypes = platformList;
          this.filters2.queryGameList = gameList;
          this.filters2.queryZoneList = zoneList;
        },
        null
      );
    },
    requestGameConditions() {
      dataCenterService.getGameConditions(
        this.filters2.queryPlatform,
        this.filters2.queryGame,
        (platformList, gameList, zoneList) => {
          this.filters2.queryPlatformTypes = platformList;
          this.filters2.queryGameList = gameList;
          this.filters2.queryZoneList = zoneList;
        },
        () => {
          this.getGameConditions();
        }
      );
    },
    handleQueryPlatformChange(option) {
      this.filters2.queryGame = this.defaultData.queryGame.value;
      this.requestGameConditions();
    },
    handleQueryGameChange(option) {
      this.filters2.queryZone = this.defaultData.queryZone.value;
      this.requestGameConditions();
    },
    handleQueryZoneChange(option) {},
    async getRechargeList() {
      if (this.loading) {
        return;
      }

      const platformId =
        this.filters2.queryPlatform == PLATFORM_ALL.value
          ? ""
          : this.filters2.queryPlatform;
      const gameId =
        this.filters2.queryGame == GAME_ALL.value
          ? ""
          : this.filters2.queryGame;
      const zoneId =
        this.filters2.queryZone == ZONE_ALL.value
          ? ""
          : this.filters2.queryZone;

      console.log("-------------------------");
      console.log("page: ", this.page);
      console.log("filters.queryType: ", this.filters.queryType);
      console.log("filters.queryValue: ", this.filters.queryValue);
      console.log("filters.date: ", this.filters.date);
      console.log("filters.labelFilter: ", this.labelFilter);
      console.log("platformId: ", platformId);
      console.log("gameId: ", platformId);
      console.log("zoneId: ", zoneId);

      let startTime = "";
      let endTime = "";
      if (this.filters.date && this.filters.date.length > 1) {
        startTime = this.filters.date[0];
        endTime = this.filters.date[1];
      }
      this.loading = true;
      // const query = {
      //   pageNo: this.page,
      //   pageSize: this.size,
      //   queryType: this.filters.queryType,
      //   queryValue: this.filters.queryValue,
      //   startDate: startTime,
      //   endDate: endTime,
      //   orderStatus: this.labelFilter, // 订单状态
      //   // platformId, // 平台 ID
      //   // gameId, // 游戏 ID
      //   // zoneId // 区服 ID
      //   platformId: this.filters.queryPlatformid,
      //   gameId: this.filters.queryGameid,
      //   zoneId: this.filters.queryZone
      // };
      const query2 = {
        "pagination.pageNo": this.page,
        "pagination.pageSize": this.size,
        queryType: this.filters.queryType,
        queryValue: this.filters.queryValue,
        startDate: startTime,
        endDate: endTime,
        orderStatus: this.labelFilter, // 订单状态
        // platformId, // 平台 ID
        // gameId, // 游戏 ID
        // zoneId // 区服 ID
        platformId: this.filters.queryPlatformid,
        gameId: this.filters.queryGameid,
        zoneId: this.filters.queryZone,
        isDiscountGame: this.filters.isDiscountGame
      };
      try {
        const result = await getRecharges(query2);
        console.log(result);
        if (result.state === "fail") {
          this.$message.error("网络链接失败，请刷新重试");
        } else if (result.state === "ok") {
          const { data, pagination } = result;
          this.recharges = data;
          this.noSend = data.length > 0 ? data[0].noSend : 0;
          this.pageCount = Math.ceil(pagination.count / pagination.pageSize);
          this.total = pagination.count;
        }
        this.loading = false;
        //获取玩家充值总计数据
        const res = await orderRecordNum(query2);
        if (res.state === "fail") {
          this.$message.error("获取总计失败，请刷新重试");
        } else if (res.state === "ok") {
          this.cumMoney = res.message;
        }
      } catch (error) {
        console.log(error);
        this.$message.error("网络链接失败，请刷新重试");
        this.loading = false;
      }
    },
    // 提交筛选查询
    submitFilter() {
      this.page = 1;
      console.log("获取列表数据");
      this.getRechargeList();
    },
    // 查询类型 select change
    handleQueryTypeChange(option) {
      this.filters.queryType = option;
    },
    // 日期选择
    handleDatepicker(date) {
      if (!date) {
        this.filters.date = "";
        return;
      }
      this.filters.date = [...date];
    },
    // 切换分页
    handleCurrentChange(page) {
      this.page = page;
      console.log("获取列表数据");
      this.getRechargeList();
    },
    // 切换 radio 筛选条件
    radioChange(tag) {
      this.labelFilter = tag;
      this.getRechargeList();
    },
    // 重置
    resetFilter() {
      this.filters.queryType = "7";
      this.filters.queryValue = "";
      // this.filters.date = [];
      const date = [
        moment(
          new Date(
            new Date(new Date().setHours(0, 0, 0, 0)).getTime() -
              3 * 24 * 3600 * 1000
          )
        ).format("YYYY-MM-DD HH:mm:ss"),
        moment(new Date(new Date().setHours(23, 59, 59, 0))).format(
          "YYYY-MM-DD HH:mm:ss"
        )
      ];
      this.filters.date = date;
      this.filters2.queryPlatform = "";
      this.filters2.queryGame = "";
      this.filters2.queryZone = "";
      this.page = 1;
      this.labelFilter = "3";

      this.filters.queryGame = "";
      this.filters.queryZone = "";
      this.filters.queryZoneList = [];
      this.filters.queryPlatformid = "";
      this.filters.queryGameid = "";
      //专服/折扣
      this.$refs.BoxGame.handleChangePlatform("0");
      this.$refs.BoxGame.handleChangeGame("");
      this.getRechargeList();
    },
    // 同步 OA
    async doSyncOA(orderId) {
      try {
        const result = await syncOA(orderId);
        console.log(result);

        if (result.state === "fail") {
          this.$message.error(result.message || "发起同步失败，请重试");
        } else if (result.state === "ok") {
          this.$message.success("发起同步成功");
        }
      } catch (error) {
        this.$message.error("发起同步失败，请重试");
      }
    },
    // vv语音同步 OA
    async doSyncOAVV(orderId) {
      let env =
        process.env.VUE_APP_API_URL === "https://c.62wy.com"
          ? "http://api.1kyou.cn"
          : "http://test.api.app.91vv.com";
      axios
        .get(env + "/api/syncOrderToOA.do", {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Accept: "application/json",
            "Content-Type": "application/json; charset=UTF-8"
          },
          params: {
            orderId: orderId
          }
        })
        .then(res => {
          if (res.data.state == 1) {
            this.$message.success(res.data.desc || "vv订单数据同步成功");
          } else {
            this.$message.error(res.data.desc || "发起同步失败，请重试");
          }
        })
        .catch(err => {
          if (err.response) {
            console.log(err.response);
          }
        });
    },

    // 导出数据
    async exportDatas() {
      if (this.recharges.length === 0) {
        this.$message.warning("请先查询所需数据再导出");
        return;
      }
      let startTime = "";
      let endTime = "";
      if (this.filters.date && this.filters.date.length > 1) {
        startTime = this.filters.date[0];
        endTime = this.filters.date[1];
      }
      const platformId =
        this.filters2.queryPlatform == PLATFORM_ALL.value
          ? ""
          : this.filters2.queryPlatform;
      const gameId =
        this.filters2.queryGame == GAME_ALL.value
          ? ""
          : this.filters2.queryGame;
      const zoneId =
        this.filters2.queryZone == ZONE_ALL.value
          ? ""
          : this.filters2.queryZone;
      let query = {
        pageNo: this.page,
        pageSize: this.size,
        queryType: this.filters.queryType,
        queryValue: this.filters.queryValue,
        startDate: startTime,
        endDate: endTime,
        orderStatus: this.labelFilter, // 订单状态
        // platformId, // 平台 ID
        // gameId, // 游戏 ID
        // zoneId, // 区服 ID
        isDiscountGame: this.filters.isDiscountGame,
        platformId: "",
        gameId: this.filters.queryGameid,
        zoneId: this.filters.queryZone,
        isOut: 1,
        mainMenu: "数据查询",
        oneMenu: "玩家充值记录"
      };
      this.downloadLoading = true;
      const url = `/user/orderRecord.do?${serialize(query)}`;
      http.get(url).then(res => {
        if (res.state === "fail") {
          this.$message.error(res.message || "导出失败！");
          this.downloadLoading = false;
        } else {
          this.$message.success(res.message || "导出成功");
          // let a = document.createElement("a");
          // a.href = res.message;
          // a.click();
          this.downloadLoading = false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.page-data-search-recharge {
  .el-date-editor .el-range-separator {
    width: 8%;
  }

  .action-button {
    color: #007fff;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }

    &.disabled {
      color: #999;
      opacity: 0.8;
      cursor: default;
    }
  }

  .merge {
    display: flex;
    align-items: center;

    .el-select {
      display: inline-block;
    }
    .el-input {
      flex: 1;
      display: inline-block;
    }
  }
  .flex-align-center {
    align-items: center;
  }

  .multiline {
    line-height: 1.2;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }

  .actions span {
    font-weight: bold;
    color: #ebb563;
    margin-right: 10px;
  }
}
</style>
