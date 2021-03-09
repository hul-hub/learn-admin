<template>
  <div>
    <el-card>
      <div slot="header">
        <h3>查询条件</h3>
      </div>
      <div class="body flex mid">
        <el-select v-model="queryType" placeholder="请选择">
          <el-option
            v-for="item in queryTypeList"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input
          placeholder="请输入内容"
          v-model="queryValue"
          style="width: 200px"
        ></el-input>
        <div class="mr10 ml10">
          <el-select
            v-model="filters.queryGame"
            placeholder="请选择游戏"
            style="width: 150px"
            filterable
            @change="handleQueryGameChangenew"
          >
            <el-option
              v-for="item in filters.queryGameList"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            />
          </el-select>
        </div>
        <el-date-picker
          style="width: 400px"
          v-model="time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          @change="handleTime"
        ></el-date-picker>
        <div>
          <el-button @click="search(1)" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </div>
    </el-card>
    <el-card>
      <div slot="header">
        <h3>广告监测报表</h3>
        <div class="extra">
          <el-button size="medium" type="primary" @click="exportData"
            >导出报表</el-button
          >
        </div>
      </div>
      <div class="body">
        <el-table border :data="tableList" v-loading="tableLoading">
          <el-table-column prop="dateTime" label="日期"> </el-table-column>
          <el-table-column
            prop="adWordsName"
            label="投放平台"
          ></el-table-column>
          <el-table-column prop="gameName" label="游戏名称"></el-table-column>
          <el-table-column
            prop="channelName"
            label="归属渠道"
          ></el-table-column>
          <el-table-column prop="posterId" label="广告ID"></el-table-column>
          <el-table-column prop="clickNum" label="点击数"></el-table-column>
          <el-table-column
            prop="clickDeviceNum"
            label="点击设备数"
          ></el-table-column>
          <el-table-column
            prop="activityNum"
            label="激活设备数"
          ></el-table-column>
          <el-table-column
            prop="activityClickNum"
            label="激活点击率"
          ></el-table-column>
          <el-table-column
            prop="registerAccountNum"
            label="注册账号数"
          ></el-table-column>
          <el-table-column
            prop="registerDeviceNum"
            label="注册设备数"
          ></el-table-column>
          <el-table-column
            prop="registerActivityNum"
            label="注册激活率"
          ></el-table-column>
          <el-table-column
            prop="rechargeMoney"
            label="充值金额"
          ></el-table-column>
          <el-table-column
            prop="rechargeAllNOP"
            label="充值人数"
          ></el-table-column>
          <el-table-column
            prop="newRecharge"
            label="新增付费"
          ></el-table-column>
          <el-table-column
            prop="newRechargeAllNOP"
            label="新增付费人数"
          ></el-table-column>
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
import http from "@/utils/http";
import moment from "moment";
import { getPlatformList, getGameList } from "../../../api/aid";
import { getUserGameList } from "@/api/aid";
const end = new Date();
const start = new Date();
start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
const defaultTime = [start, end];
export default {
  name: "advertisingListIndex",
  data() {
    return {
      page: 1,
      size: 10,
      total: 0,
      queryType: "4",
      queryValue: "",
      queryTypeList: [
        {
          value: "4",
          text: "主渠道账号"
        },
        {
          value: "3",
          text: "主渠道名称"
        },
        {
          value: "5",
          text: "主渠道ID"
        },
        {
          value: "6",
          text: "子渠道账号"
        },
        {
          value: "7",
          text: "子渠道ID"
        },
        {
          value: "1",
          text: "广告ID"
        }
      ],
      tableLoading: false,
      time: defaultTime,
      tableList: [],
      filter: {
        platformId: "",
        gameId: ""
      },
      filters: {
        queryGameid: "",
        queryGame: "",
        queryGameList: []
      },
      total: 0
    };
  },
  async created() {
    if (this.$route.query.posterId) {
      this.queryType = "1";
      this.queryValue = this.$route.query.posterId;
    }
    this.getUserGameList();
    this.time = [
      moment(this.time[0]).format("YYYY-MM-DD 00:00:00"),
      moment(this.time[1]).format("YYYY-MM-DD 23:59:59")
    ];
    this.search();
  },
  methods: {
    handleCurrentChange(page) {
      this.page = page;
      this.search();
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

    async search(type) {
      if (type == 1) {
        this.page = 1;
      }
      try {
        this.tableLoading = true;
        const res = await http.get(
          `/guild/posterReport/page.do?queryType=${this.queryType}&queryValue=${
            this.queryValue
          }&gameId=${this.filters.queryGameid}&pageNo=${this.page}&pageSize=${
            this.size
          }&startTime=${this.time[0] ? this.time[0] : ""}&endTime=${
            this.time[1] ? this.time[1] : ""
          }`
        );
        this.tableLoading = false;
        if (res.state === "ok") {
          res.data.forEach(item => {
            if (item.dateTime != "汇总") {
              item.dateTime = moment(item.dateTime).format("YYYY-MM-DD");
            }
          });
          this.tableList = res.data;
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
    handleQueryGameChangenew(option) {
      const arrPlat = option.split(",");
      this.filters.queryGameid = arrPlat[1];
    },
    handleTime(option) {
      if (option) {
        this.time = [
          moment(option[0]).format("YYYY-MM-DD 00:00:00"),
          moment(option[1]).format("YYYY-MM-DD 23:59:59")
        ];
      } else {
        this.time = [];
      }
    },
    async exportData() {
      if (this.tableList.length == 0) {
        this.$message.warning("请先查询所需数据再导出");
        return;
      }
      try {
        const res = await http.get(
          `/guild/posterReport/export.do?queryType=${
            this.queryType
          }&queryValue=${this.queryValue}&gameId=${
            this.filters.queryGameid
          }&pageNo=${this.page}&pageSize=${this.page}&startTime=${
            this.time[0] ? this.time[0] : ""
          }&endTime=${
            this.time[1] ? this.time[1] : ""
          }&mainMenu=${"游戏管理"}&oneMenu=${"广告监测报表"}`
        );
        if (res.state === "ok") {
          this.$message.success(res.message || "导出成功");
        } else {
          this.$message.warning(res.message);
        }
      } catch (e) {
        this.$message.error("异常");
      }
    },
    reset() {
      this.queryType = "4";
      this.page = 1;
      this.filters.queryGame = "";
      this.filters.queryGameid = "";
      this.queryValue = "";
      this.search();
      this.time = [
        moment(defaultTime[0]).format("YYYY-MM-DD 00:00:00"),
        moment(defaultTime[1]).format("YYYY-MM-DD 23:59:59")
      ];
      // this.search();
    }
  }
};
</script>

<style>
.el-table .first-row {
  background: #f0f9eb;
}
</style>
