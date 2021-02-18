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
          <el-form :model="filters" ref="filters">
            <el-row :gutter="10">
              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <div class="merge">
                  关键字查询：
                  <el-select
                    v-model="filters.queryKey"
                    placeholder="请选择"
                    style="width: 150px"
                    @change="handleQueryKeyChange"
                  >
                    <el-option
                      v-for="item in filters.queryKeyTypes"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                  <el-input
                    @keyup.enter.native="submitFilter"
                    v-model="filters.queryValue"
                    placeholder="输入查询关键词"
                  />
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" v-if="false">
                <div class="flex flex-align-center">
                  游戏：
                  <el-select
                    v-model="filters2.queryPlatform"
                    placeholder="请选择"
                    style="width: 150px"
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
                    style="width: 150px"
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
                    style="width: 150px"
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
              <el-col :xs="24" :sm="12" :md="12" :lg="10" :xl="10" v-if="false">
                <div class="flex flex-align-center">
                  游戏：
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

                  <el-select
                    v-model="filters.queryZone"
                    placeholder="请选择"
                    style="width: 150px"
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
              <el-col :xs="24" :sm="12" :md="12" :lg="10" :xl="10">
                <BoxGame
                  ref="BoxGame"
                  @change="handleGamesChange"
                  :defaultPlatformId="filters.queryPlatformid"
                  :defaultGame="filters.gameId"
                ></BoxGame>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <div class="flex flex-align-center">
                  统计时间：
                  <el-date-picker
                    v-model="filters3.date"
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
              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <el-button
                  @click="submitFilter(1)"
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
        <h3>主渠道业绩</h3>
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
      <div>
        <el-radio-group
          v-model="filters3.queryDateValue"
          style="margin-bottom: 20px"
          @change="handleDaysChange"
        >
          <el-radio-button
            v-for="item in filters3.queryDateTypes"
            :key="item.id"
            :label="item.id"
            >{{ item.name }}</el-radio-button
          >
        </el-radio-group>
      </div>
      <div class="body">
        <el-table
          :data="dataList"
          tooltip-effect="dark"
          style="width: 100%"
          border
          v-loading="loading"
        >
          <el-table-column prop="mcChannelName" label="主渠道" align="center">
            <template slot-scope="scope">
              {{ scope.row.mcChannelName }}
            </template>
          </el-table-column>
          <el-table-column
            prop="dayNewDeviceRegNum"
            label="新增用户数"
            min-width="90"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="downLoadNum"
            label="下载数"
            width="100"
            align="center"
          >
            <template slot-scope="scope">{{ scope.row.downLoadNum }}</template>
          </el-table-column>
          <el-table-column
            prop="dayInstallTotal"
            label="有效安装数"
            width="150"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.dayInstallTotal }}
            </template>
          </el-table-column>
          <el-table-column
            prop="openNum"
            label="启动数"
            width="150"
            align="center"
          >
            <template slot-scope="scope">{{ scope.row.openNum }}</template>
          </el-table-column>
          <el-table-column
            prop="newUserNum"
            label="注册数"
            width="150"
            align="center"
          >
            <template slot-scope="scope">{{ scope.row.newUserNum }}</template>
          </el-table-column>
          <el-table-column
            prop="dayRegisterIpNum"
            label="注册IP数"
            width="150"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.dayRegisterIpNum }}
            </template>
          </el-table-column>
          <el-table-column
            prop="loginCount"
            label="登录数"
            width="200"
            align="center"
          >
            <template slot-scope="scope">{{ scope.row.loginCount }}</template>
          </el-table-column>
          <el-table-column
            v-if="isShowGuildConsumeMoney == 1"
            prop="consumeMoneyTotal"
            label="玩家消费总额（元）"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.consumeMoneyTotal / 100 }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180">
            <!-- <template slot-scope="scope">
              <span
                v-if="canShowRow(scope.row)"
                class="action-button"
                @click="lookupTotal(scope.row)"
                >[查看子渠道数据汇总]</span
              >
            </template>-->
            <template
              slot-scope="scope"
              v-if="scope.row.mcChannelName !== '汇总'"
            >
              <span class="action-button" @click="lookupTotal(scope.row)"
                >[查看子渠道数据汇总]</span
              >
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
  </div>
</template>

<script>
import moment from "moment";
import Breadcrumb from "@/components/Breadcrumb";
import dataCenterService, {
  PLATFORM_ALL,
  GAME_ALL,
  ZONE_ALL
} from "@/service/dataCenterService";
import { mcstatistics } from "@/api/datacenter";
import { getUserGameList, getZonesList } from "@/api/aid";
import * as API from "@/api/tools";
import BoxGame from "@/components/Games/boxGame";
import http from "@/utils/http";

export default {
  name: "Daily",
  components: {
    Breadcrumb,
    BoxGame
  },
  data() {
    const defaultData = {
      queryKey: 2,
      queryValue: "",

      queryPlatform: PLATFORM_ALL,
      queryGame: GAME_ALL,
      queryZone: ZONE_ALL,

      queryDateValue: 0
    };

    const queryDateTypes = [
      { id: 0, name: "全部", days: 0 },
      { id: 1, name: "今天", days: 1 },
      { id: 2, name: "7天内", days: 7 },
      { id: 3, name: "30天内", days: 30 },
      { id: 4, name: "60天内", days: 60 }
    ];

    return {
      isShowGuildConsumeMoney: "",
      defaultData,

      filters: {
        isDiscountGame: "",
        queryPlatformid: "",
        queryGameid: "",
        queryGame: "",
        queryGameList: [],
        queryZone: "",
        queryZoneList: [],
        queryKeyTypes: [
          { id: 2, name: "主渠道名称" },
          { id: 1, name: "主渠道账号" }
        ],
        queryKey: defaultData.queryKey,
        queryValue: defaultData.queryValue
      },

      filters2: {
        queryPlatformTypes: [defaultData.queryPlatform],
        queryPlatform: defaultData.queryPlatform.value,

        queryGameList: [defaultData.queryGame],
        queryGame: defaultData.queryGame.value,

        queryZoneList: [defaultData.queryZone],
        queryZone: defaultData.queryZone.value
      },

      filters3: {
        queryDateTypes: queryDateTypes,
        queryDateValue: defaultData.queryDateValue,

        date: this.getDatePickDate(queryDateTypes, defaultData.queryDateValue)
      },

      loading: false,
      downloadLoading: false,

      page: 1,
      pageCount: 0,
      size: 10,
      total: 0,
      dataList: []
    };
  },
  created() {
    this.isShowGuildConsumeMoney = JSON.parse(
      window.sessionStorage.getItem("Admin-Account-Union")
    ).isShowGuildConsumeMoney;
    this.requestGameConditions();
    setTimeout(() => {
      this.submitFilter(1);
    }, 300);

    // this.getUserGameList();
    // this.getUserGameList();
  },
  methods: {
    handleGamesChange(data) {
      console.log(data.platformType);

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
    handleQueryKeyChange(option) {},
    handleQueryPlatformChange(option) {
      this.filters2.queryGame = this.defaultData.queryGame.value;
      this.requestGameConditions();
    },
    handleQueryGameChange(option) {
      this.filters2.queryZone = this.defaultData.queryZone.value;
      this.requestGameConditions();
    },
    handleQueryZoneChange(option) {},
    handleDaysChange() {
      this.filters3.date = this.getDatePickDate(
        this.filters3.queryDateTypes,
        this.filters3.queryDateValue,
        this.filters3.date
      );
      this.submitFilter(1);
    },
    async submitFilter(type) {
      if (type === 1) {
        this.page = 1;
      }
      let res;
      this.loading = true;
      const days = this.filters3.queryDateTypes[this.filters3.queryDateValue]
        .days;
      const data = {
        "requestParam.isDiscountGame": this.filters.isDiscountGame,
        "requestParam.queryType": this.filters.queryKey,
        "requestParam.queryValue": this.filters.queryValue,
        "requestParam.platformId": this.filters.queryPlatformid,
        "requestParam.appId": this.filters.queryGameid,
        "requestParam.zoneId": this.filters.queryZone,
        "requestParam.startDate": this.filters3.date[0] || "",
        "requestParam.endDate": this.filters3.date[1] || "",
        "requestParam.pageNo": this.page,
        "requestParam.pageSize": this.size
      };
      http.get2("/datacenter/mcstatistics.do", data).then(res => {
        const len = res.data.length;
        if (len === 0) {
          this.dataList = [];
          this.page = res.pagination.pageNo;
          this.total = res.pagination.count;
          return;
        }
        if (res.state === "fail") {
          this.$message.error(res.message || "加载失败，请重试");
          this.dataList = [];
          this.loading = false;
        } else {
          let data = [];
          res.data.map(item => {
            const vo = item;
            let time = "-";
            if (item.timeRange) {
              time = moment(parseInt(item.timeRange)).format("YYYY-MM-DD");
            } else {
              item.guildName = "汇总";
              item.mcChannelName = "汇总";
            }
            var totalData = {
              timeRange: time,
              consumeMoneyTotal: vo.consumeMoneyTotal,
              consumeMoneyTotal: vo.consumeMoneyTotal,
              downLoadNum: vo.downLoadNum,
              loginCount: vo.loginCount,
              guildName: vo.guildName,
              mcChannelName: vo.mcChannelName,
              mcId: vo.mcId,
              dayNewRoleNum: vo.dayNewRoleNum,
              newUserNum: vo.newUserNum,
              openNum: vo.openNum,
              dayNewDeviceRegNum: vo.dayNewDeviceRegNum,
              //有效安装数字段
              dayInstallTotal: vo.dayInstallTotal,
              dayRegisterIpNum: vo.dayRegisterIpNum
            };
            data.push(totalData);
          });
          this.dataList = data;
          this.loading = false;
        }
        this.page = res.pagination.pageNo;
        this.total = res.pagination.count;
      });
    },
    resetFilter() {
      this.filters.queryKey = this.defaultData.queryKey;
      this.filters.queryValue = this.defaultData.queryValue;

      this.filters2.queryPlatform = this.defaultData.queryPlatform.value;
      this.filters2.queryGame = this.defaultData.queryGame.value;
      this.filters2.queryZone = this.defaultData.queryZone.value;

      this.filters.queryGame = "";
      this.filters.queryZone = "";
      this.filters.queryZoneList = [];
      this.filters.queryPlatformid = "";
      this.filters.queryGameid = "";

      this.filters3.queryDateValue = this.defaultData.queryDateValue;
      this.filters3.date = this.getDatePickDate(
        this.filters3.queryDateTypes,
        this.filters3.queryDateValue
      );
      this.page = 1;
      this.total = 0;
      //专服/折扣
      this.$refs.BoxGame.handleChangePlatform("0");
      this.$refs.BoxGame.handleChangeGame("");
      this.submitFilter();
    },
    //新增导出操作记录
    operLogSetExportLog() {
      try {
        const data = {
          logType: 208,
          exportType: "主渠道数据汇总导出",
          queryType: this.filters.queryKey,
          queryValue: this.filters.queryValue,
          platformId: this.filters.queryPlatformid,
          gameId: this.filters.queryGameid,
          zoneId: this.filters.queryZone,
          startDate: this.filters3.date[0] || "",
          endDate: this.filters3.date[1] || ""
        };
        API.operLogSetExportLog(data);
      } catch (e) {
        console.error(e);
        this.$message.error("导出异常");
      }
    },
    exportDatas() {
      if (this.dataList.length === 0) {
        this.$message.warning("请先查询所需数据再导出");
        return;
      }
      this.downloadLoading = true;
      const data = {
        "requestParam.isDiscountGame": this.filters.isDiscountGame,
        "requestParam.queryType": this.filters.queryKey,
        "requestParam.queryValue": this.filters.queryValue,
        "requestParam.platformId": this.filters.queryPlatformid,
        "requestParam.appId": this.filters.queryGameid,
        "requestParam.zoneId": this.filters.queryZone,
        "requestParam.startDate": this.filters3.date[0] || "",
        "requestParam.endDate": this.filters3.date[1] || "",
        "requestParam.pageNo": this.page,
        "requestParam.pageSize": this.size,
        mainMenu: "数据中心",
        oneMenu: "主渠道数据汇总",
        isExport: 1
      };
      http.get2("/datacenter/mcstatistics.do", data).then(res => {
        if (res.state === "fail") {
          this.$message.error(res.message || "导出失败！");
          this.downloadLoading = false;
        } else {
          this.$message.success(res.message || "导出成功");
          this.downloadLoading = false;
        }
      });
      this.operLogSetExportLog();
    },
    /*
     * 格式化数组单项对象为数组
     * @maprams {arrry} 需要过来的字段
     * @maprams {arrry} 原数组
     */
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "consumeMoneyTotal") {
            const formatMoney = Number(v[j]);
            if (isNaN(formatMoney)) {
              return 0;
            }
            return formatMoney / 100;
          } else {
            return v[j];
          }
        })
      );
    },
    //切换分页
    handleCurrentChange(page) {
      this.page = page;
      this.submitFilter(2);
    },
    lookupTotal(vo) {
      this.$router.push(
        `/datas/seoer?mcChannelName=${vo.mcChannelName}&mcId=${vo.mcId}`
      );
    },
    canShowRow(vo) {
      return this.dataList[this.dataList.length - 1] != vo;
    },
    // 日期选择
    handleDatepicker(date) {
      // this.filters3.date = [...date];
      this.filters3.queryDateValue = 0;
    },
    getDatePickDate(queryDateTypes, queryDateValue, def = []) {
      const dateFilter = queryDateTypes[queryDateValue];
      if (0 === dateFilter.id) {
        // {id: 0, name: '', days: 0,},
        // 全部, 返回空数组
        return [];
      } else if (1 === dateFilter.id) {
        const startDate = moment()
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss");
        const endDate = moment()
          .add(1, "days")
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss");
        return [startDate, endDate];
      }

      const startDate = moment()
        .hours(0)
        .minutes(0)
        .seconds(0)
        .subtract(dateFilter.days, "days")
        .format("YYYY-MM-DD HH:mm:ss");
      const endDate = moment()
        .hours(23)
        .minutes(59)
        .seconds(59)
        .format("YYYY-MM-DD HH:mm:ss");
      console.log(startDate, endDate);
      return [startDate, endDate];
    }
  }
};
</script>

<style lang="scss" scoped>
.action-button {
  color: #007fff;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
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
</style>
