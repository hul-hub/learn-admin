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
              <el-col
                :xs="24"
                :sm="24"
                :md="24"
                :lg="10"
                :xl="10"
                v-if="!(roles === 'seoer')"
              >
                <div class="merge">
                  查询条件：
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
                    placeholder="输入查询关键词"
                  ></el-input>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <div class="flex flex-align-center">
                  统计时间：
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
              <el-col :xs="24" :sm="12" :md="12" :lg="4" :xl="4">
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
        <h3>增值服务数据汇总</h3>
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
      <div class="body">
        <el-table
          :data="listData"
          tooltip-effect="dark"
          style="width: 100%"
          border
          v-loading="loading"
        >
          <el-table-column
            prop="recordDate"
            label="日期"
            align="center"
            width="250"
          ></el-table-column>
          <el-table-column
            prop="consumeType"
            label="增值服务内容"
            align="center"
            width="250"
          ></el-table-column>
          <el-table-column
            label="消费人数"
            width="250"
            prop="consumeUserNum"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="consumeMoney"
            label="消费金额(元)"
            width="250"
            align="center"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.consumeType === '开通VIP'">
                {{ scope.row.consumeMoney.toFixed(2) }}
              </div>
              <div v-if="scope.row.consumeType === '购买座驾'">-</div>
            </template>
          </el-table-column>

          <el-table-column
            label="消费钻石"
            width="220"
            align="center"
            v-if="!(roles === 'leader' || roles === 'seoer')"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.consumeType === '开通VIP'">-</div>
              <div v-if="scope.row.consumeType === '购买座驾'">
                {{ scope.row.liveDiamond }}
              </div>
            </template>
            <!--<el-table-column-->
            <!--label="分成部分"-->
            <!--align="center"-->
            <!--width="110"-->
            <!--&gt;-->
            <!--<template slot-scope="scope">-->
            <!--<div v-if="scope.row.consumeType === '开通VIP'">-</div>-->
            <!--<div v-if="scope.row.consumeType === '购买座驾'">{{scope.row.liveDiamond}}</div>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
            <!--prop="bindLiveDiamond"-->
            <!--label="不分成部分"-->
            <!--align="center"-->
            <!--width="110"-->
            <!--&gt;-->
            <!--<template slot-scope="scope">-->
            <!--<div v-if="scope.row.consumeType === '开通VIP'">-</div>-->
            <!--<div  v-if="scope.row.consumeType === '购买座驾'">{{scope.row.bindLiveDiamond}}</div>-->
            <!--</template>-->
            <!--</el-table-column>-->
          </el-table-column>

          <el-table-column
            prop="ratioMoney"
            label="分成金额(元)"
            width="250"
            align="center"
            v-if="!(roles === 'leader' || roles === 'seoer')"
          >
            <template slot-scope="scope">
              {{ scope.row.ratioMoney.toFixed(2) }}
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <router-link
                class="action-button"
                :to="{
                  path: `/vvVoice/vvDaily/VIPstatement?recordDate=${
                    scope.row.recordDate
                  }`
                }"
                >[消费明细]</router-link
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="table-footer">
          <div class="actions">
            合计：
            <p>
              VIP消费人数：
              <span>{{ countVip.consumeUserNum }}</span
              >VIP消费金额（元）： <span>{{ countVip.consumeMoney }}</span
              >VIP分成金额（元）：
              <span>{{ countVip.ratioMoney }}</span>
            </p>
            <p>
              座驾消费人数：
              <span>{{ count.consumeUserNum }}</span
              >座驾消费钻石： <span>{{ count.liveDiamond }}</span
              >座驾分成金额（元）：
              <span>{{ count.ratioMoney }}</span>
            </p>
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
import { getSummaryListApi, exportVipSummary } from "@/api/vvVoice";
import { mapState } from "vuex";
import { serialize } from "@/utils/";

export default {
  name: "DataSearchRegister",
  components: {
    Breadcrumb
  },
  data() {
    return {
      count: {},
      countVip: {},
      filters: {
        queryType: "1",
        queryTypes: [
          {
            label: "主渠道账号",
            value: "1"
          },
          {
            label: "主渠道名称",
            value: "2"
          },
          {
            label: "子渠道账号",
            value: "3"
          },
          {
            label: "子渠道名称",
            value: "14"
          }
        ],
        queryValue: "",

        date: []
      },
      downloadLoading: false,
      listData: [],
      loading: false,
      page: 1,
      pageCount: 0,
      size: 10,
      total: 0
    };
  },
  computed: mapState({
    roles: state => state.user.roles[0]
  }),
  created() {
    this.getSummaryList();
  },
  methods: {
    getSummaryList() {
      const query = {
        pageNo: this.page,
        pageSize: this.size,
        startDate: this.filters.date[0] ? this.filters.date[0] : "",
        endDate: this.filters.date[1] ? this.filters.date[1] : "",
        queryType: this.filters.queryType,
        queryValue: this.filters.queryValue
      };

      if (this.loading) {
        return;
      }

      this.loading = true;

      getSummaryListApi(query)
        .then(res => {
          this.loading = false;
          if (res.state === "ok") {
            const { data, pagination } = res;
            this.listData = data.list;
            if (this.listData.length == 0) {
              return false;
            }
            this.pageCount = Math.ceil(pagination.count / pagination.pageSize);
            this.total = pagination.count;

            if (
              data.count.length > 1 &&
              data.count[0].consumeType === "开通VIP"
            ) {
              this.countVip = data.count[0]; //合计数据
              this.count = data.count[1];
              this.countVip.ratioMoney = data.count[0].ratioMoney.toFixed(2);
              this.count.ratioMoney = data.count[1].ratioMoney.toFixed(2);
            } else if (
              data.count.length > 1 &&
              data.count[0].consumeType === "购买座驾"
            ) {
              this.countVip = data.count[1]; //合计数据
              this.count = data.count[0];
              this.countVip.ratioMoney = data.count[1].ratioMoney.toFixed(2);
              this.count.ratioMoney = data.count[0].ratioMoney.toFixed(2);
            } else if (
              data.count.length === 1 &&
              data.count[0].consumeType === "开通VIP"
            ) {
              this.countVip = data.count[0]; //合计数据
              this.count = {};
              this.countVip.ratioMoney = data.count[0].ratioMoney.toFixed(2);
            } else if (
              data.count.length === 1 &&
              data.count[0].consumeType === "购买座驾"
            ) {
              this.count = data.count[0]; //合计数据
              this.countVip = {};
              this.count.ratioMoney = data.count[0].ratioMoney.toFixed(2);
            }
          } else if (res.state === "fail") {
            console.log(11111);
            this.$message.error(res.message || "网络链接失败，请刷新重试");
          }
        })
        .catch(() => {
          console.log(22222);
          this.loading = false;
          this.$message.error("网络链接失败，请刷新重试");
        });
    },
    // 查询类型 select change
    handleQueryTypeChange(option) {
      this.filters.queryType = option;
    },
    // 提交筛选查询
    submitFilter() {
      this.page = 1;
      console.log("获取列表数据");
      this.getSummaryList();
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
      this.getSummaryList();
    },
    // 重置
    resetFilter() {
      this.filters.queryType = "1";
      this.filters.queryValue = "";
      this.filters.date = "";

      this.page = 1;
      this.getSummaryList();
    },
    async handleDownload() {
      const query = {
        pageNo: this.page,
        pageSize: this.size,
        startDate: this.filters.date[0] ? this.filters.date[0] : "",
        endDate: this.filters.date[1] ? this.filters.date[1] : "",
        queryType: this.filters.queryType,
        queryValue: this.filters.queryValue,
        isExport: 1 //1----导出
      };

      this.downloadLoading = true;
      try {
        const res = await exportVipSummary(query);
        if (res.state === "ok") {
          console.log(res);
          const a = document.createElement("a");
          a.href = res.message;
          //a.target = "_black";
          a.click();
          this.downloadLoading = false;
        } else {
          this.$message.error("导出失败");
        }
      } catch (error) {
        console.error(error);
        this.downloadLoading = false;
        return;
      }
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
.actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end !important;
}
.actions span {
  font-weight: bold;
  color: #ebb563;
  margin-right: 10px;
}
</style>
