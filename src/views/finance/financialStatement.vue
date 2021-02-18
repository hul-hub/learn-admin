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
      <div class="body flex mid">
        <div class="mr10">结算周期：</div>
        <div class="mr20">
          <el-date-picker
            type="dates"
            v-model="filter.billDates"
            placeholder="请选择结算日"
            :picker-options="pickerOptions"
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
        <div class="flex between mid">
          <h3>财务结算单</h3>
          <el-button type="primary" size="medium" @click="exportExcel"
            >导出</el-button
          >
        </div>
      </div>
      <div class="body">
        <div class="mb10">
          <el-radio-group v-model="filter.balanceType" size="medium">
            <el-radio-button label="1">周账单</el-radio-button>
            <el-radio-button label="2">月账单</el-radio-button>
          </el-radio-group>
        </div>
        <el-table border :data="tableData" v-loading="tableLoading">
          <el-table-column
            align="center"
            label="结算周期"
            prop="billDate"
          ></el-table-column>
          <el-table-column
            align="center"
            label="当期玩家消费总额（元）"
            prop="consumeMoneyTotal"
          ></el-table-column>
          <el-table-column
            align="center"
            label="分成收益（元）"
            prop="devideMoney"
            v-if="roles === 'boss' && account === 1"
          ></el-table-column>
          <el-table-column
            align="center"
            label="当期扣款/补款总额（元）"
            prop="changeMoney"
          ></el-table-column>
          <el-table-column
            align="center"
            label="当期总收入（元）"
            prop="summaryMoney"
            v-if="roles === 'boss' && account === 1"
          ></el-table-column>
          <el-table-column align="center" label="备注" prop="record">
            <template slot-scope="scope">
              <div v-for="item in scope.row.record.split('\r\n')" :key="item">
                {{ item }}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="
                  $router.push(
                    `/finance/gameProceeds?billDate=${
                      scope.row.billDate.split('~')[1]
                    }`
                  )
                "
                >本周游戏收入汇总</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="flex end mid mt10">
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
import { mapState } from "vuex";
import http from "@/utils/http";

export default {
  name: "financialStatement",
  data() {
    return {
      tableData: [],
      tableLoading: false,
      filter: {
        pageNo: 1,
        pageSize: 10,
        billDates: [],
        balanceType: ""
      },
      total: 0,
      pickerOptions: {
        disabledDate: pickTime => {
          return !this.billDatesList.includes(
            moment(pickTime).format("YYYY-MM-DD")
          );
        }
      }
    };
  },
  computed: mapState({
    roles: state => state.user.roles[0],
    account: state => state.user.account.isShowProportion
  }),
  created() {
    this.getbillDatesList();
    this.search();
  },
  watch: {
    "filter.balanceType"() {
      this.search();
    }
  },
  methods: {
    async getbillDatesList() {
      try {
        const res = await API.getBillCycleByMonth();
        if (res.state === "ok") {
          this.billDatesList = res.data || [];
        } else {
          this.$message.warning(res.message || "获取结算日失败");
        }
      } catch (e) {
        console.error(e);
        this.$message.error("获取结算日异常");
      }
    },
    exportExcel() {
      if (this.tableData.length === 0) {
        this.$message.warning("请先查询所需数据再导出");
        return;
      }
      let data = {
        mainMenu: "财务结算表",
        oneMenu: "财务结算单",
        billDates:
          this.filter.billDates &&
          this.filter.billDates
            .map(item => moment(item).format("YYYY-MM-DD 23:59:59"))
            .join(",")
      };
      http.get2("/guildBill/exGuildBill.do", data).then(res => {
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
    searchByPage(page) {
      this.filter.pageNo = page;
      this.search();
    },
    async search() {
      try {
        this.tableLoading = true;
        const res = await API.guildBill({
          pageNo: this.filter.pageNo,
          pageSize: this.filter.pageSize,
          billDates:
            this.filter.billDates &&
            this.filter.billDates
              .map(item => moment(item).format("YYYY-MM-DD 23:59:59"))
              .join(","),
          balanceType: this.filter.balanceType
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
      this.filter.billDates = [];
      this.filter.balanceType = "";
      this.search();
    }
  }
};
</script>

<style scoped></style>
