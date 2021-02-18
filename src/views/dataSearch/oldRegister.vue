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
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
                <div class="merge">
                  关键词查询：
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
              <el-col :xs="24" :sm="12" :md="12" :lg="7" :xl="7">
                <div class="flex flex-align-center">
                  注册时间：
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
              <el-col :xs="24" :sm="12" :md="12" :lg="4" :xl="4" v-if="false">
                <div class="flex flex-align-center">
                  查询范围：
                  <!-- <el-radio-group v-model="filters.platform">
                    <el-radio-button label="1" border>游戏</el-radio-button>
                    <el-radio-button label="2" border>VV语音</el-radio-button>
                  </el-radio-group>-->
                  <el-select
                    v-model="filters.platform"
                    placeholder="请选择"
                    style="width: 130px;"
                  >
                    <el-option
                      v-for="item in filters.platformList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="4" :xl="4">
                <el-button
                  @click="submitFilter"
                  type="primary"
                  v-noMoreClick="5000"
                  >查询</el-button
                >
                <el-button @click="resetFilter('filters')">重置</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </el-card>

    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <h3 v-if="filters.platform === '1'">游戏信息</h3>
        <h3 v-if="filters.platform === '2'">VV语音信息</h3>
        <div class="extra">
          <el-button
            size="medium"
            type="primary"
            @click="handleDownload"
            v-noMoreClick="10000"
            >导出</el-button
          >
        </div>
      </div>
      <div class="body">
        <el-table
          :data="registers"
          tooltip-effect="dark"
          style="width: 100%"
          border
          v-loading="loading"
        >
          <el-table-column
            prop="userId"
            label="账号"
            align="center"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="deviceType"
            label="设备"
            align="center"
          ></el-table-column>
          <!-- <el-table-column
            label="手机号码"
            width="100"
            prop="mobile"
            align="center"
          >
            <template slot-scope="scope">{{ scope.row.mobile || '-' }}</template>
          </el-table-column>-->
          <el-table-column
            prop="scRealName"
            label="所属子渠道"
            width="150"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="channelName"
            label="所属主渠道"
            width="150"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="addDateTime"
            label="注册时间"
            width="200"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="loginNum"
            label="登录次数"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="deviceId"
            label="设备码"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="ip"
            label="IP"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="imeiCode"
            label="IMEI"
            align="center"
          ></el-table-column>
          <!-- <el-table-column
            prop="roleCount"
            label="角色创建数"
            width="120"
            align="center"
          ></el-table-column>-->
          <el-table-column label="操作" width="120" align="center">
            <template slot-scope="scope">
              <!-- <span class="action-button" @click="getShortLink(scope.row.downloadLink)">[查看游戏角色]</span> -->
              <router-link
                class="action-button"
                :to="{ path: `/dataSearch/player?userId=${scope.row.userId}` }"
                >[查看游戏角色]</router-link
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="table-footer">
          <div class="actions"></div>
          <div class="pages">
            <el-pagination
              @size-change="handleSizeChange"
              layout="sizes, prev, pager, next"
              :current-page="page"
              :page-size="size"
              :total="total"
              :page-sizes="[10, 20, 50, 100]"
              @current-change="handleCurrentChange"
            ></el-pagination>

            <!-- <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage2"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="100"
              layout="sizes, prev, pager, next"
              :total="1000">
            </el-pagination>-->
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import moment from "moment";
import Breadcrumb from "@/components/Breadcrumb";
import { oldRegisterRecord, oldRegisterExport } from "@/api/dataSearch";

export default {
  name: "oldDataSearchRegister",
  components: {
    Breadcrumb
  },
  data() {
    return {
      filters: {
        platform: "1",
        queryType: "4",
        queryTypes: [
          {
            label: "账号",
            value: "4"
          },
          // {
          //   label: '手机号码',
          //   value: '5',
          // },
          {
            label: "主渠道名称",
            value: "2"
          },
          {
            label: "主渠道账号",
            value: "1"
          },
          {
            label: "子渠道账号",
            value: "3"
          }
        ],
        queryValue: "",
        platform: "1",
        platformList: [
          { label: "游戏", value: "1" }
          // { label: "VV语音", value: "2" }
        ],

        // date: [],
        date: [
          moment(
            new Date(
              new Date(new Date().setHours(0, 0, 0, 0)).getTime() -
                3 * 24 * 3600 * 1000
            )
          ).format("YYYY-MM-DD HH:mm:ss"),
          moment(new Date(new Date().setHours(23, 59, 59, 0))).format(
            "YYYY-MM-DD HH:mm:ss"
          )
        ]
      },

      downloadLoading: false,
      registers: [],
      loading: false,
      page: 1,
      pageCount: 0,
      size: 10,
      total: 0
    };
  },
  created() {
    this.getRegisterList();
  },
  methods: {
    handleSizeChange(value) {
      console.log("vbbbbbb", value);
      this.size = value;
      this.getRegisterList();
    },
    getRegisterList() {
      let startTime = "";
      let endTime = "";
      if (this.filters.date && this.filters.date.length > 1) {
        startTime = this.filters.date[0];
        endTime = this.filters.date[1];
      }
      const query = {
        "pagination.pageNo": this.page,
        "pagination.pageSize": this.size,
        queryType: this.filters.queryType,
        queryValue: this.filters.queryValue,
        startDate: startTime,
        endDate: endTime,
        platform: this.filters.platform
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

      oldRegisterRecord(query)
        .then(res => {
          this.loading = false;
          if (res.state === "ok") {
            const { data, pagination } = res;
            this.registers = data;
            this.pageCount = Math.ceil(pagination.count / pagination.pageSize);
            this.total = pagination.count;
          } else if (res.state === "fail") {
            this.$message.error(res.message || "网络链接失败，请刷新重试");
          }
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
          this.$message.error("暂无数据加载");
        });
    },
    // 提交筛选查询
    submitFilter() {
      this.page = 1;
      console.log("获取列表数据");
      this.getRegisterList();
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
      this.getRegisterList();
    },
    // 重置
    resetFilter() {
      this.filters.platform = "1";
      this.filters.queryType = "4";
      this.filters.queryValue = "";
      // this.filters.date = '';
      const date = [
        moment(
          new Date(
            new Date(new Date().setHours(0, 0, 0, 0)).getTime() -
              3 * 24 * 3600 * 1000
          )
        ).format("YYYY-MM-DD HH:mm:ss"),
        moment(new Date(new Date().setHours(23, 59, 59, 0))).format(
          "YYYY-MM-DD HH:mm:ss"
        )
      ];
      this.filters.date = date;
      this.page = 1;
      this.getRegisterList();
    },
    // 导出数据
    exportDatas() {
      const url = "http://www.91vv.com/export.zip";

      const oA = document.createElement("a");
      oA.href = url;
      oA.target = "_blank";
      oA.click();
    },
    async handleDownload() {
      if (this.registers.length === 0) {
        this.$message.warning("请先查询所需数据再导出");
        return;
      }
      let startTime = "";
      let endTime = "";
      if (this.filters.date && this.filters.date.length > 1) {
        startTime = this.filters.date[0];
        endTime = this.filters.date[1];
      }
      // const startDate = this.filters.date[0] || '';
      // const endDate = this.filters.date[1] || '';
      const queryType = this.filters.queryType || "";
      const queryValue = this.filters.queryValue || "";
      const platform = this.filters.platform || "";
      let data = {
        queryType: queryType,
        queryValue: queryValue,
        platform: platform,
        startDate: startTime,
        endDate: endTime,
        mainMenu: "数据查询",
        oneMenu: "账号注册信息"
      };
      try {
        const res = await oldRegisterExport(data);
        if (res.state === "ok") {
          console.log(res);
          this.$message.success(res.message || "导出成功");
          // const a = document.createElement("a");
          // a.href = res.message;
          // //a.target = "_black";
          // a.click();
        } else {
          this.$message.error(res.message || "导出失败");
        }
      } catch (error) {
        console.error(error);
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
</style>
