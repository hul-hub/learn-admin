<template>
  <div class>
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
          <el-row :gutter="10">
            <el-col :xs="24" :sm="12" :md="12" :lg="7" :xl="8">
              <div class="merge">
                <el-select
                  v-model="filters.queryType"
                  placeholder="请选择"
                  style="width: 150px;"
                  @change="handleQueryKeyChange"
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
                  v-model="filters.key"
                  placeholder="请输入关键词"
                ></el-input>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="4" :xl="4">
              <el-button @click="submitFilter" type="primary">查询</el-button>
              <el-button @click="resetFilter">重置</el-button>
              <!-- <el-button @click="exportOut" type="primary">导出</el-button> -->
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>

    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix head">
        <h3>主渠道列表</h3>
        <el-button type="primary" class="exports" @click="addLeader"
          >新增主渠道</el-button
        >
      </div>
      <div class="body">
        <div class="filter-data">
          <el-radio-group
            size="small"
            v-model="labelFilter"
            @change="radioChange"
          >
            <el-radio-button
              v-for="radio in radios"
              :key="radio.value"
              :label="radio.value"
              >{{ radio.name }}</el-radio-button
            >
          </el-radio-group>
        </div>
        <el-table
          :data="memberVisible"
          ref="multipleTable"
          tooltip-effect="dark"
          style="width: 100%"
          border
          v-loading="loading"
        >
          <el-table-column
            prop="mcid"
            label="主渠道ID"
            width="220"
            align="center"
          >
            <template slot-scope="scope">{{ scope.row.mcid || "-" }}</template>
          </el-table-column>
          <el-table-column
            prop="channelName"
            label="主渠道名称"
            width="220"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.channelName || "-" }}
            </template>
          </el-table-column>
          <el-table-column
            label="主渠道账号"
            width="220"
            prop="loginName"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.loginName || "-" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="realName"
            label="主渠道备注"
            width="220"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.realName || "-" }}
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="phoneNum"
            label="手机号码"
            width="180"
            align="center"
          >
          <template slot-scope="scope">{{scope.row.phoneNum || '-'}}</template>
          </el-table-column>
          <el-table-column
            prop="qq"
            label="QQ"
            align="center"
            width="180"
          >
          <template slot-scope="scope">{{scope.row.qq || '-'}}</template>
          </el-table-column>-->
          <el-table-column
            label="创建时间"
            width="220"
            align="center"
            prop="alterTime"
          >
            <template slot-scope="scope">{{
              scope.row.alterTime | dataFormat
            }}</template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="账号状态"
            width="180"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status == 1" size="mini" type="info"
                >正常</el-tag
              >
              <el-tag v-if="scope.row.status == 3" size="mini" type="warning"
                >冻结</el-tag
              >
              <el-tag v-if="scope.row.status == 4" size="mini" type="warning"
                >封停</el-tag
              >
              <el-tag
                v-if="
                  scope.row.status != 1 &&
                    scope.row.status != 3 &&
                    scope.row.status != 4
                "
                size="mini"
                >-</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <router-link :to="`/member/leader/edit/${scope.row.userId}`"
                >[编辑]</router-link
              >
              <router-link :to="`/member/leader/password/${scope.row.userId}`"
                >[重置密码]</router-link
              >
              <router-link
                :to="`/member/promoters/index/?mcid=${scope.row.mcid}`"
                >[子渠道列表]</router-link
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="table-footer">
          <div class="actions"></div>
          <div class="pages" style="float:right">
            <el-pagination
              background
              layout="prev, pager, next,total"
              :current-page="pageNo"
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
// import { getLeaders } from "@/api/leader";
import { getLeaderTests } from "@/api/leader";
import http from "@/utils/http";

export default {
  name: "MemberIndex",
  components: {
    Breadcrumb
  },
  data() {
    return {
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
          }
        ],
        key: ""
      },
      radios: [
        { name: "全部状态", value: -1 },
        { name: "正常", value: 1 },
        { name: "冻结", value: 3 },
        { name: "封停", value: 4 }
      ],
      labelFilter: -1,
      loading: false,
      member: [],
      memberVisible: [],
      pageNo: 1,
      pageCount: 0,
      pageSize: 10,
      total: 0
    };
  },
  created() {
    this.getLeaderList();
  },
  methods: {
    // 获取主渠道列表
    getLeaderList() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      let pagination = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };
      let data = {
        pagination,
        queryType: Number(this.filters.queryType),
        queryValue: this.filters.key,
        status: this.labelFilter
      };
      getLeaderTests(data)
        .then(res => {
          console.log(res);
          if (res.state === "ok") {
            this.memberVisible = res.data;
            this.pageCount = Math.ceil(
              res.pagination.count / res.pagination.pageSize
            );
            this.total = res.pagination.count;
            this.pageNo = res.pagination.pageNo;
            this.loading = false;
          } else if (res.state === "fail") {
            this.$message.error("获取主渠道列表失败,传入值无效");
            this.loading = false;
            this.memberVisible = [];
          }
          //   if (!res.data || !res.pagination) {
          //     this.$message.error("获取主渠道列表失败，请刷新重试");
          //     setTimeout(() => {
          //       this.loading = false;
          //     }, 500);
          //     return;
          //   }
        })
        .catch(err => {
          this.loading = false;
          this.$message.error("网络链接失败，请刷新重试");
        });
    },
    // 添加主渠道
    addLeader() {
      this.$router.push("/member/leader/create");
    },
    // 切换筛选条件
    radioChange(tag) {
      this.labelFilter = tag;
      this.pageNo = 1;
      this.getLeaderList();
    },
    // 切换分页
    handleCurrentChange(page) {
      this.pageNo = page;
      this.getLeaderList();
    },
    // 搜索关键词的 query key
    handleQueryKeyChange(option) {
      this.filters.queryType = option;
    },
    // 提交筛选查询
    submitFilter() {
      this.pageNo = 1;
      this.getLeaderList();
    },
    // 重置条件
    resetFilter() {
      this.filters.queryType = "1";
      this.filters.key = "";
      this.pageNo = 1;
      this.labelFilter = -1;
      this.getLeaderList();
    },
    linkTo(location, action = "push") {
      this.$router[action](location);
    },
    // 导出功能
    exportOut() {
      const url = `/guild/exportleader.do?queryType=${
        this.filters.queryType
      }&&queryValue=${this.filters.key}
        &&status=${this.labelFilter}`;
      http.get(url).then(res => {
        if (res.state === "fail") {
          this.$message.error(res.message || "导出失败！");
        } else {
          let a = document.createElement("a");
          a.href = url;
          a.click();
        }
      });
    }
  },
  filters: {
    dataFormat: function(alterTime) {
      if (!alterTime) return "";
      return moment(new Date(alterTime)).format("YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>

<style lang="scss" scoped>
.el-tag {
  background-color: transparent;
  border-color: transparent;
}
.merge {
  display: flex;
  .el-select {
    display: inline-block;
  }
  .el-input {
    flex: 1;
    display: inline-block;
  }
}
.head {
  position: relative;
  .exports {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }
}
</style>
