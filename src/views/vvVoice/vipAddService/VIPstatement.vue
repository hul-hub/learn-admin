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
        <div style="float:right">
          <span style="color:red">*</span>当日新增数据将于次日更新
        </div>
      </div>
      <div class="body">
        <div class="filters">
          <el-form :model="filters" ref="filters">
            <el-row :gutter="10">
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
              <el-col :xs="24" :sm="24" :md="24" :lg="10" :xl="10">
                <div class="merge">
                  搜索条件：
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
                    >
                    </el-option>
                  </el-select>
                  <el-input
                    @keyup.enter.native="submitFilter"
                    v-model="filters.queryValue"
                    placeholder="输入查询关键词"
                  ></el-input>
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
        <h3>增值服务消费记录</h3>
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
            label="消费时间"
            align="center"
            width="200"
          ></el-table-column>
          <el-table-column
            prop="userId"
            label="vv号"
            align="center"
            width="200"
          ></el-table-column>
          <el-table-column
            label="用户昵称"
            width="200"
            prop="nickName"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="channelName"
            label="所属主渠道"
            width="220"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="scLoginName"
            label="所属子渠道"
            width="200"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="consumeType"
            label="消费类型"
            width="200"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="consumeMoney"
            label="消费金额(元)"
            align="center"
          >
            <template
              slot-scope="scope"
              v-if="scope.row.consumeType === '开通VIP'"
            >
              {{ scope.row.consumeMoney.toFixed(2) }}
            </template>
            <template
              slot-scope="scope"
              v-if="scope.row.consumeType === '购买座驾'"
            >
              -
            </template>
          </el-table-column>

          <el-table-column label="消费钻石" width="220" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.consumeType === '开通VIP'">-</div>
              <div v-if="scope.row.consumeType === '购买座驾'">
                {{ scope.row.liveDiamond }}
              </div>
            </template>
            <!--<el-table-column-->
            <!--prop="liveDiamond"-->
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
            <!--<div v-if="scope.row.consumeType === '购买座驾'">{{scope.row.liveDiamond}}</div>-->
            <!--</template>-->
            <!--</el-table-column>-->
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
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import moment from "moment";
import Breadcrumb from "@/components/Breadcrumb";
import { getVIPConsumeApi } from "@/api/vvVoice";

export default {
  name: "DataSearchRegister",
  components: {
    Breadcrumb
  },
  data() {
    return {
      filters: {
        queryType: "4",
        queryTypes: [
          {
            label: "VV号",
            value: "4"
          },
          {
            label: "用户昵称",
            value: "14"
          },
          {
            label: "主渠道名称",
            value: "2"
          },
          {
            label: "子渠道账号",
            value: "3"
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
  created() {
    console.log(this.$route.query.recordDate);
    this.filters.date = [
      moment(new Date(this.$route.query.recordDate)).format(
        "YYYY-MM-DD 00:00:00"
      ),
      moment(new Date(this.$route.query.recordDate)).format(
        "YYYY-MM-DD 23:59:59"
      )
    ];
    console.log("this.filters.date", this.filters.date);
    this.getVIPConsumeList();
  },
  methods: {
    getVIPConsumeList() {
      const query = {
        pageNo: this.page,
        pageSize: this.size,
        queryType: this.filters.queryType,
        queryValue: this.filters.queryValue,
        // startTime: this.filters.date[0] ? this.filters.date[0] : '',
        startDate: this.filters.date[0],
        endDate: this.filters.date[1]
      };

      if (this.loading) {
        return;
      }

      this.loading = true;

      getVIPConsumeApi(query)
        .then(res => {
          this.loading = false;
          if (res.state === "ok") {
            const { data, pagination } = res;
            this.listData = data;
            this.pageCount = Math.ceil(pagination.count / pagination.pageSize);
            this.total = pagination.count;
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
    // 提交筛选查询
    submitFilter() {
      this.page = 1;
      console.log("获取列表数据");
      this.getVIPConsumeList();
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
      this.getVIPConsumeList();
    },
    // 重置
    resetFilter() {
      this.filters.queryType = "4";
      this.filters.queryValue = "";
      (this.filters.date = [
        moment(new Date(this.$route.query.recordDate)).format(
          "YYYY-MM-DD 00:00:00"
        ),
        moment(new Date(this.$route.query.recordDate)).format(
          "YYYY-MM-DD 23:59:59"
        )
      ]),
        (this.page = 1);
      this.getVIPConsumeList();
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
