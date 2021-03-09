<template>
  <div>
    <el-card>
      <div slot="header">
        <h3>查询条件</h3>
      </div>
      <div class="body flex mid">
        <div class="mr30">
          <el-date-picker
            v-model="filter.dataRange"
            :picker-options="pickerOptions"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </div>
        <div class="mr10">
          <el-button type="primary" @click="search">查询</el-button>
        </div>
        <div>
          <el-button @click="resetFilter">重置</el-button>
        </div>
        <div style="margin-left: 10px">
          <el-button type="primary" @click="handleExport">导出</el-button>
        </div>
      </div>
    </el-card>
    <el-card>
      <div slot="header">
        <h3>基础营收表</h3>
      </div>
      <div>
        <el-table border :data="tableData" v-loading="tableLoading">
          <el-table-column
            align="center"
            label="日期"
            prop="recorddate"
          ></el-table-column>
          <el-table-column
            align="center"
            label="付费总金额"
            prop="diamond"
          ></el-table-column>
          <el-table-column
            align="center"
            label="付费用户数"
            prop="diamonduser"
          ></el-table-column>
          <el-table-column
            align="center"
            label="收礼用户数"
            prop="recivegiftanchor"
          ></el-table-column>
          <el-table-column
            align="center"
            label="送礼用户数"
            prop="sendgiftuser"
          ></el-table-column>
          <el-table-column
            align="center"
            label="守护购买用户数"
            prop="deamonbuyuser"
          ></el-table-column>
          <el-table-column
            align="center"
            label="守护付费占比"
            prop="deamonpayproportion"
          ></el-table-column>
        </el-table>
        <div class="mt15 flex end">
          <el-pagination
            background
            layout="prev, pager, next, total"
            :current-page="filter.pageNo"
            :total="total"
            @current-change="searchByPage"
          ></el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as API from "../../../api/guildData";
import moment from "moment";

export default {
  name: "deductionsRecord",
  data() {
    return {
      tableData: [{}],
      tableLoading: false,
      gameList: [],
      filter: {
        pageNo: 1,
        pageSize: 10,
        dataRange: []
      },
      total: 0,
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", [
                moment({ h: 0, m: 0, s: 0 }),
                moment({ h: 23, m: 59, s: 59 })
              ]);
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              picker.$emit("pick", [
                moment({ h: 0, m: 0, s: 0 }).subtract(1, "days"),
                moment({ h: 23, m: 59, s: 59 })
              ]);
            }
          },
          {
            text: "最近7天",
            onClick(picker) {
              picker.$emit("pick", [
                moment({ h: 0, m: 0, s: 0 }).subtract(7, "days"),
                moment({ h: 23, m: 59, s: 59 })
              ]);
            }
          },
          {
            text: "最近30天",
            onClick(picker) {
              picker.$emit("pick", [
                moment({ h: 0, m: 0, s: 0 }).subtract(30, "days"),
                moment({ h: 23, m: 59, s: 59 })
              ]);
            }
          }
        ]
      }
    };
  },
  created() {
    this.search();
  },
  methods: {
    searchByPage(page) {
      this.filter.pageNo = page;
      this.search();
    },
    async search() {
      try {
        this.tableLoading = true;
        const res = await API.basicRevenuelist({
          "pagination.pageNo": this.filter.pageNo,
          "pagination.pageSize": this.filter.pageSize,
          startTime:
            this.filter.dataRange && this.filter.dataRange[0]
              ? moment(this.filter.dataRange[0]).format("YYYY-MM-DD HH:mm:ss")
              : "",
          endTime:
            this.filter.dataRange && this.filter.dataRange[1]
              ? moment(this.filter.dataRange[1]).format("YYYY-MM-DD HH:mm:ss")
              : ""
        });
        if (res.state === "ok") {
          this.tableData = res.data;
          this.total = res.pagination.count;
        } else {
          this.$message.warning(res.message || "查询失败");
        }
      } catch (e) {
        console.error(e);
        this.$message.error("查询异常");
      } finally {
        this.tableLoading = false;
      }
    },
    resetFilter() {
      this.filter.pageNo = 1;
      this.filter.pageSize = 10;
      this.filter.dataRange = [];
      this.search();
    },
    async handleExport() {
      const res = await API.basicRevenueexport({
        "pagination.pageNo": this.filter.pageNo,
        "pagination.pageSize": this.filter.pageSize,
        startTime:
          this.filter.dataRange && this.filter.dataRange[0]
            ? moment(this.filter.dataRange[0]).format("YYYY-MM-DD HH:mm:ss")
            : "",
        endTime:
          this.filter.dataRange && this.filter.dataRange[1]
            ? moment(this.filter.dataRange[1]).format("YYYY-MM-DD HH:mm:ss")
            : ""
      });
      if (res.state === "ok") {
        let a = document.createElement("a");
        a.href = res.message;
        a.click();
        a = null;
      } else {
        this.$message.warning(res.message || "导出失败");
      }
    }
  }
};
</script>

<style scoped></style>
