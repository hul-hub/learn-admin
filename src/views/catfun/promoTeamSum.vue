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
              <el-col :xs="24" :sm="12" :md="12" :lg="10" :xl="10">
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
              <el-col :xs="24" :sm="10" :md="10" :lg="10" :xl="10">
                <div class="merge">
                  <span style="width: 100px">统计时间：</span>
                  <el-date-picker
                    v-model="filters3.date"
                    type="daterange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="handleDatepicker"
                    style="width: 100%"
                    :default-time="['00:00:00', '23:59:59']"
                  >
                  </el-date-picker>
                </div>
              </el-col>
              <el-col :xs="24" :sm="6" :md="6" :lg="4" :xl="4">
                <el-button @click="submitFilter" type="primary">查询</el-button>
                <el-button @click="resetFilter('filters')">重置</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </el-card>

    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <h3>主渠道数据汇总</h3>
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
            >{{ item.name }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <div class="body">
        <el-table tooltip-effect="dark" style="width: 100%" border>
          <el-table-column
            prop=""
            label="时间"
            width="200"
            align="center"
          ></el-table-column>
          <el-table-column
            prop=""
            label="主渠道"
            width="200"
            align="center"
          ></el-table-column>

          <el-table-column
            prop=""
            label="新增用户数"
            width="200"
            align="center"
          ></el-table-column>

          <el-table-column
            prop=""
            label="日活跃数"
            width="160"
            align="center"
          ></el-table-column>

          <el-table-column
            prop=""
            label="消费次数"
            width="200"
            align="center"
          ></el-table-column>

          <el-table-column
            prop=""
            label="消费总金额（元）"
            width="200"
            align="center"
          >
            <!--<template slot-scope="scope">{{ scope.row.consumeMoneyTotal/100 }}</template>-->
          </el-table-column>

          <el-table-column
            prop=""
            label="佣金"
            width="200"
            align="center"
          ></el-table-column>

          <el-table-column label="操作" align="center" min-width="180">
            <template slot-scope="scope" v-if="scope.row.guildName !== '汇总'">
              <router-link
                :to="`/datas/leader?guildName=${scope.row.guildName}`"
                >[查看子渠道数据汇总]</router-link
              >
            </template>
          </el-table-column>
        </el-table>
        <!--<div class="table-footer">-->
        <!--<div class="actions">-->
        <!--</div>-->
        <!--<div class="pages" style="float:right">-->
        <!--<el-pagination-->
        <!--background-->
        <!--layout="prev, pager, next, total"-->
        <!--:current-page="dataPagination.pageNo"-->
        <!--:total="dataPagination.count"-->
        <!--@current-change=" "-->
        <!--&gt;-->
        <!--</el-pagination>-->
        <!--</div>-->
        <!--</div>-->
      </div>
    </el-card>
  </div>
</template>
<script>
import Breadcrumb from "@/components/Breadcrumb";
import dataCenterService, {
  PLATFORM_ALL,
  GAME_ALL,
  ZONE_ALL
} from "@/service/dataCenterService";
export default {
  name: "catfunPromoPromoTeamSum",
  components: {
    Breadcrumb
  },
  data() {
    const defaultData = {
      queryKey: 11,
      queryValue: "",

      queryPlatform: PLATFORM_ALL,
      queryGame: GAME_ALL,
      queryZone: ZONE_ALL,

      queryDateValue: 0
    };

    if (this.$route.query) {
      if (this.$route.query.scId) {
        defaultData.queryKey = 3;
        defaultData.queryValue = this.$route.query.scId || "";
      }
    }

    const queryDateTypes = [
      { id: 0, name: "全部", days: 0 },
      { id: 1, name: "今天", days: 1 },
      { id: 2, name: "7天内", days: 7 },
      { id: 3, name: "30天内", days: 30 },
      { id: 4, name: "60天内", days: 60 }
    ];

    return {
      defaultData,
      filters: {
        queryKeyTypes: [
          { id: 11, name: "子渠道账号" },
          { id: 12, name: "主渠道账号" },
          { id: 13, name: "主渠道名称" }
        ],
        queryKey: defaultData.queryKey,
        queryValue: defaultData.queryValue,
        registerDate: [],
        bsystemId: 1
      },

      filters3: {
        queryDateTypes: queryDateTypes,
        queryDateValue: defaultData.queryDateValue,
        date: this.getDatePickDate(queryDateTypes, defaultData.queryDateValue)
      },

      loading: false,
      downloadLoading: false,
      dataList: [],
      dataSource: []
    };
  },
  created() {},
  methods: {
    handleQueryKeyChange(option) {},
    handleQueryZoneChange(option) {},
    handleDaysChange() {
      console.log("handleDaysChange =>>", this.filters3.queryDateValue);
      this.filters3.date = this.getDatePickDate(
        this.filters3.queryDateTypes,
        this.filters3.queryDateValue,
        this.filters3.date
      );
      this.submitFilter();
    },
    async submitFilter() {
      if (this.loading) {
        return;
      }

      clearInterval(timer);
      const fullLoading = this.$loading({
        lock: true,
        text: "数据比较多，请稍等",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });

      let res;
      try {
        const queryType = this.filters.queryKey;
        const queryValue = this.filters.queryValue;
        const startDate = this.filters3.date[0] || "";
        const endDate = this.filters3.date[1] || "";
        const bsystemId = this.filters.bsystemId || 1;
        this.loading = true;
        console.log(
          queryType,
          queryValue,
          platformId,
          appId,
          zoneId,
          startDate,
          endDate,
          bsystemId
        );
        // 每次请求设空
        this.dataList = [];
        this.dataSource = [];
        res = await daystatistics(
          queryType,
          queryValue,
          platformId,
          appId,
          zoneId,
          startDate,
          endDate,
          bsystemId
        );
        console.log(res);
        this.loading = false;
      } catch (error) {
        this.loading = false;
        fullLoading0.close();
        console.error(error);
        return;
      }

      if (!res.data || (res.data && res.data.length === 0)) {
        this.loading = false;
        this.dataList = [];
        fullLoading.close();
        return;
      }

      this.dataSource = res.data;
      fullLoading.close();
    },
    // 日期选择
    handleDatepicker(date) {
      console.log("date===>", date);
      this.filters3.queryDateValue = 0;
    },
    getDatePickDate(queryDateTypes, queryDateValue, def = []) {
      const dateFilter = queryDateTypes[queryDateValue];
      if (0 === dateFilter.id) {
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
        console.log("getDatePickDate =>>>", startDate, endDate);
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
      console.log("getDatePickDate =>>>", startDate, endDate);
      return [startDate, endDate];
    },
    resetFilter() {
      this.filters.queryKey = this.defaultData.queryKey;
      this.filters.queryValue = this.defaultData.queryValue;
      this.filters.bsystemId = 1;

      this.filters3.queryDateValue = this.defaultData.queryDateValue;
      this.filters3.date = this.getDatePickDate(
        this.filters3.queryDateTypes,
        this.filters3.queryDateValue
      );

      this.submitFilter();
    },

    exportDatas() {
      if (this.dataSource.length == 0) {
        return;
      }
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "时间",
          "渠道名称",
          "新增用户数",
          "日活跃数",
          "消费次数",
          "消费总金额",
          "佣金"
        ];
        const filterVal = [" ", " ", " ", " ", " ", " ", " "];
        const list = this.dataSource;
        const data = this.formatJson(filterVal, list);
        console.log(data);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "渠道业绩汇总"
        });
        this.downloadLoading = false;
      });
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

.datas-daily {
  .body {
    position: relative;
  }
  .popover {
    top: 5px;
    right: 6px;
    position: absolute;
    z-index: 100;
  }
}
</style>
