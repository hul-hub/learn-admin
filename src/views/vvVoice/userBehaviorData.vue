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
        <h3>用户行为数据</h3>
        <!-- <div class="extra">
          <el-button size="medium" type="primary" @click="handleDownload" :loading="downloadLoading">导出</el-button>
        </div> -->
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
            width="220"
          ></el-table-column>
          <el-table-column
            prop="userID"
            label="vv号"
            align="center"
            width="220"
          ></el-table-column>
          <el-table-column
            label="vv语音在线时长"
            width="220"
            prop="onlineTime"
            align="center"
          >
            <!-- <template slot-scope="scope">{{ scope.row.mobile || '-' }}</template> -->
          </el-table-column>
          <el-table-column
            prop="entryLiveTime"
            label="观看直播时长"
            width="220"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="openLiveTime"
            label="个人直播时长"
            width="220"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="followsNum"
            label="新增关注数"
            width="220"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="friendsNum"
            label="新增粉丝数"
            align="center"
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
import { getUserBehaviorListApi } from "@/api/vvVoice";

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
    this.getUserBehaviorList();
  },
  methods: {
    getUserBehaviorList() {
      const query = {
        pageNo: this.page,
        pageSize: this.size,
        vvID: this.filters.queryValue,
        startTime: this.filters.date[0] ? this.filters.date[0] : "",
        endTime: this.filters.date[1] ? this.filters.date[1] : ""
      };

      if (this.loading) {
        return;
      }

      console.log("-------------------------");
      console.log("page: ", this.page);
      console.log("filters.queryType: ", this.filters.queryType);
      console.log("filters.queryValue: ", this.filters.queryValue);
      console.log("filters.date: ", this.filters.date);

      this.loading = true;

      getUserBehaviorListApi(query)
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
      this.getUserBehaviorList();
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
      this.getUserBehaviorList();
    },
    // 重置
    resetFilter() {
      this.filters.queryType = "4";
      this.filters.queryValue = "";
      this.filters.date = "";
      this.page = 1;
      this.getUserBehaviorList();
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
