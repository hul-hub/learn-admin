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
              <!-- <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
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
              </el-col> -->
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
        <h3>用户账号数据汇总</h3>
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
            prop="userID"
            label="vv号"
            align="center"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="mcChannelName"
            label="所属主渠道"
            align="center"
            width="200"
          >
            <template slot-scope="scope">{{
              scope.row.mcChannelName ? scope.row.mcChannelName : "-"
            }}</template>
          </el-table-column>
          <el-table-column
            prop="loginName"
            label="所属子渠道"
            align="center"
            width="200"
          >
            <template slot-scope="scope">{{
              scope.row.loginName ? scope.row.loginName : "-"
            }}</template>
          </el-table-column>
          <el-table-column
            label="财富等级"
            width="200"
            prop="funLevel"
            align="center"
          >
            <!-- <template slot-scope="scope">{{ scope.row.mobile || '-' }}</template> -->
          </el-table-column>
          <el-table-column
            prop="followsCount"
            label="关注数量"
            width="200"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="newFriends"
            label="好友数量"
            width="200"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="friendsCount"
            label="粉丝数量"
            width="200"
            align="center"
          ></el-table-column>
          <el-table-column prop="isVip" label="VIP会员" align="center">
            <template slot-scope="scope">{{
              scope.row.isVip === 0 ? "否" : "是"
            }}</template>
          </el-table-column>
          <!-- <el-table-column
            prop="level"
            label="宠物等级"
            width="160"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="petVIPLevel"
            label="宠物VIP等级"
            align="center"
          ></el-table-column> -->
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
import { getAccountListApi } from "@/api/vvVoice";

export default {
  name: "DataSearchRegister",
  components: {
    Breadcrumb
  },
  data() {
    return {
      filters: {
        queryType: "1",
        queryTypes: [
          {
            label: "VV号",
            value: "1"
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
        queryValue: ""

        // date: [],
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
    this.getAccountList();
  },
  methods: {
    getAccountList() {
      const query = {
        pageNo: this.page,
        pageSize: this.size,
        queryType: this.filters.queryType,
        queryValue: this.filters.queryValue
      };

      if (this.loading) {
        return;
      }

      console.log("-------------------------");
      console.log("page: ", this.page);
      console.log("filters.queryType: ", this.filters.queryType);
      console.log("filters.queryValue: ", this.filters.queryValue);
      // console.log('filters.date: ', this.filters.date);

      this.loading = true;

      getAccountListApi(query)
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
      this.getAccountList();
    },
    // 查询类型 select change
    handleQueryTypeChange(option) {
      this.filters.queryType = option;
    },
    // 日期选择
    // handleDatepicker(date) {
    //   if (!date) {
    //     this.filters.date = '';
    //     return;
    //   }
    //   this.filters.date = [...date];
    // },
    // 切换分页
    handleCurrentChange(page) {
      this.page = page;
      console.log("获取列表数据");
      this.getAccountList();
    },
    // 重置
    resetFilter() {
      this.filters.queryType = "1";
      this.filters.queryValue = "";
      // this.filters.date = '';

      this.page = 1;
      this.getAccountList();
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
