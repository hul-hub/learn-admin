<template>
  <div class="datas-daily">
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
        <h3>vv日报</h3>
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
        <el-popover
          placement="top"
          title="说明"
          width="350"
          trigger="hover"
          class="popover"
        >
          设备首次启动APP，且登录的VV号为首次登录，算为一个导量数。
          <i slot="reference" class="el-icon-question"></i>
        </el-popover>
        <el-popover
          placement="top"
          title="说明"
          width="350"
          trigger="hover"
          class="popover2"
        >
          设备首次启动APP算为一个有效安装数。
          <i slot="reference" class="el-icon-question"></i>
        </el-popover>
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
            width="180"
          ></el-table-column>
          <el-table-column
            prop="conductNum"
            label="导量数"
            align="center"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="install"
            label="有效安装数"
            align="center"
            min-width="90"
          ></el-table-column>
          <el-table-column
            prop="newUserNum"
            label="新注册数"
            align="center"
            width="180"
          ></el-table-column>
          <el-table-column
            label="活跃数"
            width="180"
            prop="activeNum"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="consumeUserNum"
            label="消费人数"
            width="180"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="consumeNum"
            label="消费次数"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="consumeMoney"
            label="消费金额(元)"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.consumeMoney.toFixed(2)
            }}</template>
          </el-table-column>

          <el-table-column
            label="消费钻石"
            prop="liveDiamond"
            width="220"
            align="center"
            v-if="!(roles === 'leader' || roles === 'seoer')"
          >
            <!--<el-table-column-->
            <!--prop="liveDiamond"-->
            <!--label="分成部分"-->
            <!--align="center"-->
            <!--width="110"-->
            <!--&gt;-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
            <!--prop="bindLiveDiamond"-->
            <!--label="不分成部分"-->
            <!--align="center"-->
            <!--width="110"-->
            <!--&gt;-->
            <!--</el-table-column>-->
          </el-table-column>

          <el-table-column
            prop="divideMoney"
            label="分成金额(元)"
            align="center"
            v-if="!(roles === 'leader' || roles === 'seoer')"
          >
            <template slot-scope="scope">{{
              scope.row.divideMoney.toFixed(2)
            }}</template>
          </el-table-column>
        </el-table>
        <div class="table-footer">
          <div class="actions">
            合计：导量数： <span>{{ count.conductNum }}</span
            >新注册数： <span>{{ count.newUserNum }}</span
            >活跃数： <span>{{ count.activeNum }}</span
            >消费人数： <span>{{ count.consumeUserNum }}</span> 消费次数：
            <span>{{ count.consumeNum }}</span
            >消费金额（元）： <span>{{ count.consumeMoney }}</span
            >消费钻石： <span>{{ count.liveDiamond }}</span
            >分成金额（元）：
            <span>{{ count.divideMoney }}</span>
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
import Breadcrumb from "@/components/Breadcrumb";
import { getDailyListApi, exportDayTotal } from "@/api/vvVoice";
import { mapState } from "vuex";

export default {
  name: "DataSearchRegister",
  components: {
    Breadcrumb
  },
  data() {
    return {
      count: {},
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
            label: "子渠道备注",
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
    this.getDailyList();
  },
  methods: {
    getDailyList() {
      const query = {
        pageNo: this.page,
        pageSize: this.size,
        startDate: this.filters.date[0] ? this.filters.date[0] : "",
        endDate: this.filters.date[1] ? this.filters.date[1] : "",
        queryType: Number(this.filters.queryType),
        queryValue: this.filters.queryValue
      };

      if (this.loading) {
        return;
      }

      this.loading = true;

      getDailyListApi(query)
        .then(res => {
          this.loading = false;
          if (res.state === "ok") {
            const { data, pagination } = res;
            this.listData = data.list;
            console.log("this.listData", this.listData);
            this.pageCount = Math.ceil(pagination.count / pagination.pageSize);
            this.total = pagination.count;

            this.count = data.count; //合计数据
            this.count.consumeMoney = data.count.consumeMoney.toFixed(2);
            this.count.divideMoney = data.count.divideMoney.toFixed(2);
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
      this.getDailyList();
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
      this.getDailyList();
    },
    // 重置
    resetFilter() {
      this.filters.queryType = "1";
      this.filters.queryValue = "";
      this.filters.date = "";

      this.page = 1;
      this.getDailyList();
    },
    async handleDownload() {
      const query = {
        pageNo: this.page,
        pageSize: this.size,
        startDate: this.filters.date[0] ? this.filters.date[0] : "",
        endDate: this.filters.date[1] ? this.filters.date[1] : "",
        queryType: Number(this.filters.queryType),
        queryValue: this.filters.queryValue,
        isExport: 1 //1----导出
      };
      // exportExl(`/vvData/dayTotal.do?${serialize(query)}`)

      this.downloadLoading = true;
      try {
        const res = await exportDayTotal(query);
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

.actions span {
  font-weight: bold;
  color: #ebb563;
  margin-right: 10px;
}

.datas-daily {
  .body {
    position: relative;
  }
  .popover {
    top: 5px;
    left: 338px;
    position: absolute;
    z-index: 100;
  }
  .popover2 {
    top: 5px;
    left: 472px;
    position: absolute;
    z-index: 100;
  }
}
</style>
