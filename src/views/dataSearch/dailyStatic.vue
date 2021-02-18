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
        <h3>每日直播收入统计</h3>
        <div class="extra">
          <el-button
            size="medium"
            type="primary"
            @click="handleDownload"
            :loading="downloadLoading"
            >导出</el-button
          >
        </div>
      </div>
      <div>
        <el-radio-group
          v-model="filters3.queryDateValue"
          style="margin-bottom: 20px;"
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
      <div style="margin-bottom: 20px;font-size:16px;">
        当前分成比例:<span style="color:red;">15%</span>
      </div>
      <div class="body">
        <el-table
          :data="dataList"
          tooltip-effect="dark"
          style="width: 100%"
          border
          v-loading="loading"
        >
          <el-table-column
            prop="consumeDate"
            label="日期"
            align="center"
            min-width="160"
          >
            <template slot-scope="scope">{{
              scope.row.consumeDate || "-"
            }}</template>
          </el-table-column>
          <el-table-column
            label="消费金额(钻石)"
            min-width="200"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.consumeDiamond || 0
            }}</template>
          </el-table-column>
          <el-table-column label="消费金额(元)" min-width="200" align="center">
            <template slot-scope="scope">{{
              scope.row.consumeMoney.toFixed(2) || 0
            }}</template>
          </el-table-column>
          <el-table-column label="分成金额(元)" min-width="200" align="center">
            <template slot-scope="scope">{{
              scope.row.divideMoney.toFixed(2) || 0
            }}</template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import moment from "moment";
import Breadcrumb from "@/components/Breadcrumb";
import { liveDayIncome } from "@/api/datacenter";

export default {
  name: "Daily",
  components: {
    Breadcrumb
  },
  data() {
    const defaultData = {
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
      defaultData,
      filters: {
        queryValue: "",
        date: ""
      },

      filters3: {
        queryDateTypes: queryDateTypes,
        queryDateValue: defaultData.queryDateValue,

        date: this.getDatePickDate(queryDateTypes, defaultData.queryDateValue)

        // 三天内的时间查询
        // date: [
        //   moment(new Date(new Date().getTime() -3 * 24 * 3600 * 1000)).format("YYYY-MM-DD HH:mm:ss"),
        //   moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
        // ],
      },

      loading: false,
      downloadLoading: false,

      dataList: []
    };
  },
  created() {
    this.submitFilter();
  },
  methods: {
    handleDaysChange() {
      this.filters3.date = this.getDatePickDate(
        this.filters3.queryDateTypes,
        this.filters3.queryDateValue,
        this.filters3.date
      );
      this.submitFilter();
    },

    async submitFilter() {
      try {
        const startDate =
          this.filters3.date.length > 0 ? this.filters3.date[0] : "";
        const endDate =
          this.filters3.date.length > 0 ? this.filters3.date[1] : "";
        console.log(startDate, endDate);

        const query = {
          startDate,
          endDate
        };

        this.loading = true;
        const res = await liveDayIncome(query);
        this.loading = false;
        console.log(res);
        if (res.state === "fail") {
          this.$message.error(res.message || "加载失败，请重试");
        } else if (res.state === "ok") {
          res.data.forEach((item, index) => {
            if (index === res.data.length - 1) {
              // 最后一项设置 '汇总'
              item.consumeDate = "汇总";
            } else {
              item.consumeDate = moment(item.consumeDate).format("YYYY-MM-DD");
            }
          });
          this.dataList = res.data;
        }
      } catch (error) {
        this.loading = false;
        this.$message.error("加载失败，请重试");
      }
    },
    resetFilter() {
      this.filters3.queryDateValue = this.defaultData.queryDateValue;
      this.filters3.date = this.getDatePickDate(
        this.filters3.queryDateTypes,
        this.filters3.queryDateValue
      );

      this.submitFilter();
    },
    // 日期选择
    handleDatepicker(date) {
      this.filters3.queryDateValue = 0;
    },
    getDatePickDate(queryDateTypes, queryDateValue, def = []) {
      const dateFilter = queryDateTypes[queryDateValue];
      if (0 === dateFilter.id) {
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
    },
    // 下载数据
    handleDownload() {
      if (this.dataList.length === 0) {
        this.$message.info("还没有数据");
        return;
      }

      let filename = "每日直播收入统计";
      if (this.filters3.date.length > 0) {
        const startDate = this.filters3.date[0].split(" ")[0];
        const endDate = this.filters3.date[1].split(" ")[0];
        filename = `每日直播收入统计 ${startDate} ~ ${endDate}`;
      }
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "日期",
          "消费金额(砖石)",
          "消费金额(元)",
          "分成金额(元)"
        ];
        const filterVal = [
          "consumeDate",
          "consumeDiamond",
          "consumeMoney",
          "divideMoney"
        ];
        const list = this.dataList;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename
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
          return v[j];
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
</style>
