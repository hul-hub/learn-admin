<template>
  <div>
    <el-card>
      <div slot="header">
        <h3>查询条件</h3>
      </div>
      <div class="body flex mid">
        <div class="mr10">游戏：</div>
        <div class="mr20">
          <el-select v-model="filter.gameId">
            <el-option
              v-for="(item, index) in gameList"
              :label="item.gameName"
              :value="item.gameId"
              :key="index"
            ></el-option>
          </el-select>
        </div>
        <div class="mr10">创建时间：</div>
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
      </div>
    </el-card>
    <el-card>
      <div slot="header">
        <h3>补款扣款记录</h3>
      </div>
      <div class="body">
        <div class="mb15">
          <el-radio-group size="medium" v-model="filter.extensionType">
            <el-radio-button label="1">补款</el-radio-button>
            <el-radio-button label="2">扣款</el-radio-button>
          </el-radio-group>
        </div>
        <el-table
          border
          :data="tableData"
          v-loading="tableLoading"
          show-summary
          :summary-method="getSummaries"
        >
          <el-table-column
            align="center"
            label="时间"
            prop="createTime"
          ></el-table-column>
          <el-table-column
            align="center"
            label="游戏名称"
            prop="gameName"
          ></el-table-column>
          <el-table-column
            align="center"
            label="原因"
            prop="remark"
          ></el-table-column>
          <el-table-column
            align="center"
            label="变动金额（元）"
            prop="logMoney"
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
import * as API from "../../api/finance";
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
        gameId: "",
        extensionType: "",
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
    this.getGameList();
    this.search();
  },
  watch: {
    "filter.extensionType"() {
      this.search();
    }
  },
  methods: {
    getSummaries({ columns, data }) {
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "汇总";
          return;
        }
        if (column.property === "remark") {
          sums[index] = "";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        } else {
          sums[index] = "";
        }
      });
      return sums;
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
    searchByPage(page) {
      this.filter.pageNo = page;
      this.search();
    },
    async search() {
      try {
        this.tableLoading = true;
        const res = await API.extensionMoney({
          pageNo: this.filter.pageNo,
          pageSize: this.filter.pageSize,
          gameId: this.filter.gameId,
          extensionType: this.filter.extensionType,
          startDate:
            this.filter.dataRange[0] &&
            moment(this.filter.dataRange[0]).format("YYYY-MM-DD HH:mm:ss"),
          endDate:
            this.filter.dataRange[1] &&
            moment(this.filter.dataRange[1]).format("YYYY-MM-DD HH:mm:ss")
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
      this.filter.gameId = "";
      this.filter.extensionType = "";
      this.filter.dataRange = [];
      this.search();
    }
  }
};
</script>

<style scoped></style>
