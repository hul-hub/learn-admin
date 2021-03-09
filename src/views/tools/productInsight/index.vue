<template>
  <div>
    <div class="page-crumbs">
      <div class="crumbs">
        <breadcrumb />
      </div>
    </div>

    <el-card class="box-card" shadow="never">
      <div class="body">
        <div class="flex">
          <span class="w60">分类：</span>
          <el-radio-group
            size="small"
            class="radioWidth"
            :class="{ classTag: filters.isShowCatmore }"
            v-model="filters.catId"
            @change="catChange"
          >
            <el-radio-button
              class="mr20 radioStyle"
              v-for="item in filters.catList"
              :key="item.catid"
              :label="item.catid"
              >{{ item.catname }}</el-radio-button
            >
          </el-radio-group>
          <el-button
            @click="filters.isShowCatmore = !filters.isShowCatmore"
            class="h30"
            v-if="filters.catList.length > 7 ? true : false"
            size="mini"
            >更多<i class="el-icon-arrow-down"></i
          ></el-button>
        </div>
        <div class="mt30 flex">
          <span class="w60">题材：</span>
          <el-radio-group
            size="small"
            class="radioWidth"
            :class="{ classTag: filters.isShowTagmore }"
            v-model="filters.tagId"
            @change="tagChange"
          >
            <el-radio-button
              class="mr20 radioStyle"
              v-for="item in filters.tagList"
              :key="item.tagid"
              :label="item.tagid"
              >{{ item.tagname }}</el-radio-button
            >
          </el-radio-group>
          <el-button
            @click="filters.isShowTagmore = !filters.isShowTagmore"
            class="h30"
            v-if="filters.tagList.length > 7 ? true : false"
            size="mini"
            >更多<i class="el-icon-arrow-down"></i
          ></el-button>
        </div>
        <div class="mt30 flex">
          <span class="w60">设备：</span>
          <el-radio-group
            size="small"
            v-model="filters.equValue"
            @change="radioChange"
          >
            <el-radio-button
              class="mr20 radioStyle"
              v-for="item in filters.equList"
              :key="item.id"
              :label="item.id"
              >{{ item.name }}</el-radio-button
            >
          </el-radio-group>
        </div>
        <div class="mt20">
          <!-- <el-select
            v-model="filters.date"
            placeholder="操作人"
            filterable
            class="w100"
          >
            <el-option
              v-for="item in filters.dateList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select> -->
          <el-date-picker
            v-model="filters3.date"
            :clearable="false"
            type="daterange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleDatepicker"
            :default-time="['00:00:00', '23:59:59']"
          >
          </el-date-picker>
          <el-input
            style="width:240px;margin-left:10px"
            v-model="filters.queryValue"
            placeholder="请输入游戏名称"
            @keyup.enter.native="submitSearch"
          ></el-input>
          <el-button @click="submitSearch" type="primary" class="ml10"
            >查询</el-button
          >
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>
    </el-card>

    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <h3>产品洞察</h3>
        <div class="extra">
          <el-button
            v-if="isGuildBoss === 1"
            size="medium"
            type="primary"
            @click="linkTo('/tools/seoerAuthorization')"
            >子渠道授权</el-button
          >
        </div>
      </div>
      <div class="body">
        <div class="filter-data">
          <el-radio-group
            size="small"
            v-model="filters3.queryDateValue"
            @change="handleDaysChange"
          >
            <el-radio-button
              v-for="item in filters3.queryDateTypes"
              :key="item.id"
              :label="item.id"
              >{{ item.name }}
            </el-radio-button>
          </el-radio-group>
        </div>
        <el-table
          :data="list"
          tooltip-effect="dark"
          style="width: 100%"
          border
          v-loading="loading"
          :default-sort="{ prop: 'creativeNum', order: 'descending' }"
          @sort-change="sortChangeCreat"
        >
          <el-table-column
            prop="productId"
            label="产品ID"
            width="80"
          ></el-table-column>
          <el-table-column label="游戏信息" min-width="160">
            <template slot-scope="scope">
              <div class="flex">
                <img
                  :src="scope.row.productIcon"
                  alt=""
                  width="80"
                  height="80"
                />
                <div class="flex col around ml10">
                  <span>{{ scope.row.productName }}</span
                  ><span>{{ scope.row.companyName }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="所属类别" min-width="80">
            <template slot-scope="scope">
              <div class="flex col">
                <span>{{ scope.row.catName }}</span>
                <span>{{ scope.row.tagName }}</span>
                <span
                  >{{ scope.row.isAndroid === "1" ? "安卓" : "" }}
                  {{ scope.row.isIOS === "1" ? "IOS" : "" }}</span
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="materialNum"
            label="投放素材"
            width="110"
            sortable="custom"
          ></el-table-column>
          <el-table-column
            prop="creativeNum"
            label="投放创意组"
            width="120"
            sortable="custom"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.creativeNum }}</span>
              <span class="ml10"
                ><el-button @click="handleBatch(scope.row)" type="text"
                  >[查看]</el-button
                ></span
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="findDay"
            label="投放天数"
            width="110"
            sortable="custom"
          ></el-table-column>
          <el-table-column label="生命周期" width="100">
            <template slot-scope="scope">
              <div class="flex col">
                <span>{{ scope.row.lifeStartDate }}</span>
                <span>~</span>
                <span>{{ scope.row.lifeEndDate }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="30日创意组趋势" min-width="200">
            <template slot-scope="scope">
              <div :id="scope.row.productId + 'minchart'" class="h300"></div>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-footer">
          <div class="actions"></div>
          <div class="pages">
            <el-pagination
              background
              layout="total,prev, pager, next, sizes"
              :current-page="pageNation.pageNo"
              :page-size="pageNation.pageSize"
              :page-sizes="[10, 20, 30, 40]"
              @size-change="handleSizeChange"
              :total="pageNation.total"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </div>

        <el-dialog
          :title="'【' + dialogTable.tittle + '】 投放创意组'"
          :visible.sync="dialogTableVisible"
          :before-close="handleClose"
        >
          <el-table
            ref="dialogTable"
            :data="tableData"
            @filter-change="antAddictionStateFilterMethod"
          >
            <el-table-column
              property="creativeid"
              label="创意组ID"
              width="110"
            ></el-table-column>
            <el-table-column
              property="creative"
              label="文案"
              min-width="80"
            ></el-table-column>
            <el-table-column
              prop="ua"
              label="设备"
              width="80"
              :filters="[{ text: '安卓', value: 1 }, { text: 'IOS', value: 2 }]"
              :filter-multiple="false"
              column-key="ua"
              filter-placement="bottom-end"
            >
              <template slot-scope="scope">
                {{ scope.row.ua === 1 ? "安卓" : "IOS" }}
              </template>
            </el-table-column>
            <el-table-column label="投放周期" min-width="80">
              <template slot-scope="scope">
                {{ scope.row.lifeStartDate }}~{{ scope.row.lifeEndDate }}
              </template>
            </el-table-column>
            <el-table-column
              property="discovernum"
              label="发现次数"
              width="80"
            ></el-table-column>
            <el-table-column
              property="discoverday"
              label="发现天数"
              width="80"
            ></el-table-column>
            <el-table-column property="lp" label="链接" width="80">
              <template slot-scope="scope">
                <span><a :href="scope.row.lp" target="_blank">预览</a></span>
              </template>
            </el-table-column>
          </el-table>
          <div class="table-footer">
            <div class="actions"></div>
            <div class="pages">
              <el-pagination
                background
                layout="total,prev, pager, next, sizes"
                :current-page="dialogTable.pageNo"
                :page-size="dialogTable.pageSize"
                :page-sizes="[10, 20, 30, 40]"
                @size-change="handleSizeChangeDialogTable"
                :total="dialogTable.total"
                @current-change="handleCurrentChangeDialogTable"
              ></el-pagination>
            </div>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>
<script>
// 引入 ECharts 主模块
let echarts = require("echarts/lib/echarts");
// 按需引入类型组件
require("echarts/lib/chart/line"); //线型
// require("echarts/lib/chart/bar"); //柱型
// 引入提示框和标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/legend");
import moment from "moment";
import {
  getCatAndTagApi,
  getProductListApi,
  getCreativeListApi
} from "@/api/tools";

export default {
  name: "toolsChangeBindIndex",
  data() {
    const defaultData = { queryDateValue: 1 }; //天数id
    const queryDateTypes = [
      { id: 0, name: "全部", days: 0 },
      { id: 1, name: "3天", days: 3 },
      { id: 2, name: "7天", days: 7 },
      { id: 3, name: "15天", days: 15 },
      { id: 4, name: "30天", days: 30 }
    ];

    return {
      isGuildBoss: "",
      filters: {
        queryValue: "",
        // date: "3",
        // dateList: [
        //   { value: "", label: "全部" },
        //   { value: "3", label: "3天" },
        //   { value: "7", label: "7天" },
        //   { value: "15", label: "15天" },
        //   { value: "30", label: "30天" }
        // ],
        catId: "",
        catList: [], //分类
        tagId: "",
        tagList: [], //题材
        equValue: "0",
        equList: [
          { id: "0", name: "全部" },
          { id: "1", name: "安卓" },
          { id: "2", name: "IOS" }
        ], //设备
        isShowCatmore: false,
        isShowTagmore: false,
        materialOrder: "",
        creativeOrder: "1",
        findDayOrder: ""
      },
      filters3: {
        queryDateTypes: queryDateTypes,
        queryDateValue: defaultData.queryDateValue,
        date: this.getDatePickDate(queryDateTypes, defaultData.queryDateValue)
      },
      list: [],
      loading: false,
      dialogTable: {
        productId: "",
        tittle: "",
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      dialogTableVisible: false,
      pageNation: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  created() {
    this.getCatAndTagApi();
    this.submitSearch();
    this.isGuildBoss = this.$store.getters.account.isGuildBoss;
  },
  methods: {
    minChart(val, opt) {
      // 基于准备好的dom，初始化echarts实例
      let minChart1 = echarts.init(document.getElementById(val + "minchart"));
      minChart1.clear();
      minChart1.setOption(opt);
    },
    async getCatAndTagApi() {
      try {
        const res = await getCatAndTagApi();
        if (res.state === "fail") {
          console.log(res.message || "获取洞察分类失败");
        } else if (res.state === "ok") {
          res.data.catList.unshift({ catid: "", catname: "全部" });
          this.filters.catList = res.data.catList;
          res.data.tagList.unshift({ tagid: "", tagname: "全部" });
          this.filters.tagList = res.data.tagList;
        }
      } catch (error) {
        console.log("获取洞察类型异常", error);
      }
    },
    submitSearch() {
      this.pageNation.pageNo = 1;
      this.getLimits();
    },
    async getLimits() {
      try {
        this.loading = true;
        const data = {
          catId: this.filters.catId,
          tagId: this.filters.tagId,
          ua: this.filters.equValue,
          // amount: this.filters.date,
          startDate: this.filters3.date[0] || "",
          endDate: this.filters3.date[1] || "",
          productName: this.filters.queryValue,
          materialOrder: this.filters.materialOrder,
          creativeOrder: this.filters.creativeOrder,
          findDayOrder: this.filters.findDayOrder,
          pageNo: this.pageNation.pageNo,
          pageSize: this.pageNation.pageSize
        };
        const res = await getProductListApi(data);
        if (res.state === "fail") {
          this.$message.error(res.message || "获取数据失败");
          this.loading = false;
        } else if (res.state === "ok") {
          res.data.forEach(element => {
            element.option = {
              tooltip: {
                trigger: "axis"
                // axisPointer: {
                //   type: "cross",
                //   crossStyle: {
                //     color: "#999"
                //   }
                // }
              },
              // toolbox: {
              //   feature: {
              //     dataView: { show: true, readOnly: false },
              //     magicType: { show: true, type: ["line", "bar"] },
              //     restore: { show: true },
              //     saveAsImage: { show: true }
              //   }
              // },
              //   legend: {
              //     data: ["创意组数"]
              //   },
              xAxis: {
                show: false,
                type: "category",
                data: element.recordList.map(item => item.addTimeDesc).reverse()
              },
              yAxis: [
                {
                  show: false,
                  type: "value",
                  name: "",
                  min: 0,
                  axisLabel: {
                    formatter: "{value}"
                  }
                }
              ],
              series: [
                {
                  name: "创意组数",
                  type: "line",
                  yAxisIndex: 0,
                  data: element.recordList.map(item => item.crenum).reverse(),
                  itemStyle: {
                    normal: {
                      color: "#ff8a3a",
                      lineStyle: {
                        color: "#ff8a3a"
                      }
                    }
                  }
                }
              ]
            };
          });
          this.list = res.data;
          this.pageNation.total = res.pagination.count;
          this.loading = false;
          this.list.forEach(element => {
            this.$nextTick(() => {
              this.minChart(element.productId, element.option);
            });
          });
        }
      } catch (error) {
        console.log("获取洞察数据异常", error);
        this.loading = false;
      }
    },
    // 查看投放创意组
    handleBatch(row) {
      this.dialogTable.pageNo = 1;
      this.dialogTable.pageSize = 10;
      this.dialogTableVisible = true;
      this.dialogTable.productId = row.productId;
      this.dialogTable.tittle = row.productName;
      this.getCreativeListApi();
    },
    async getCreativeListApi() {
      try {
        const data = {
          productId: this.dialogTable.productId,
          ua: this.filters.equValue,
          // amount: this.filters.date,
          startDate: this.filters3.date[0] || "",
          endDate: this.filters3.date[1] || "",
          pageNo: this.dialogTable.pageNo,
          pageSize: this.dialogTable.pageSize
        };
        const res = await getCreativeListApi(data);
        if (res.state === "fail") {
          this.$message.error(res.message || "获取数据失败");
        } else if (res.state === "ok") {
          this.tableData = res.data;
          this.dialogTable.total = res.pagination.count;
        }
      } catch (error) {
        console.log("获取投放创意组数据异常", error);
      }
    },
    antAddictionStateFilterMethod(filters) {
      this.filters.equValue = filters.ua[0] == undefined ? 0 : filters.ua[0];
      this.dialogTable.pageNo = 1;
      this.dialogTable.pageSize = 10;
      this.getCreativeListApi();
    },
    handleClose(done) {
      this.dialogTableVisible = false;
      this.filters.equValue = 0;
      this.$refs.dialogTable.clearFilter();
    },
    sortChangeCreat(column) {
      if ((column.prop === "materialNum") & (column.order !== null)) {
        this.filters.materialOrder = column.order === "ascending" ? "0" : "1";
      } else {
        this.filters.materialOrder = "";
      }
      if ((column.prop === "creativeNum") & (column.order !== null)) {
        this.filters.creativeOrder = column.order === "ascending" ? "0" : "1";
      } else {
        this.filters.creativeOrder = "";
      }
      if ((column.prop === "findDay") & (column.order !== null)) {
        this.filters.findDayOrder = column.order === "ascending" ? "0" : "1";
      } else {
        this.filters.findDayOrder = "";
      }
      this.submitSearch();
    },
    catChange(ite) {
      this.filters.catId = ite;
      this.submitSearch();
    },
    tagChange(ite) {
      this.filters.tagId = ite;
      this.submitSearch();
    },
    radioChange(ite) {
      this.filters.equValue = ite;
      this.submitSearch();
    },
    handleDatepicker() {
      this.filters3.queryDateValue = 0;
    },
    handleDaysChange() {
      this.filters3.date = this.getDatePickDate(
        this.filters3.queryDateTypes,
        this.filters3.queryDateValue,
        this.filters3.date
      );
      this.submitSearch();
    },
    getDatePickDate(queryDateTypes, queryDateValue, def = []) {
      const dateFilter = queryDateTypes[queryDateValue];
      if (0 === dateFilter.id) {
        // 全部, 返回空数组
        return [];
      }

      const startDate = moment()
        .hours(0)
        .minutes(0)
        .seconds(0)
        .subtract(dateFilter.days - 1, "days")
        .format("YYYY-MM-DD HH:mm:ss");
      const endDate = moment()
        .hours(23)
        .minutes(59)
        .seconds(59)
        .format("YYYY-MM-DD HH:mm:ss");
      return [startDate, endDate];
    },
    // 切换分页
    handleCurrentChange(pageNo) {
      this.pageNation.pageNo = pageNo;
      this.getLimits();
    },
    handleSizeChange(option) {
      this.pageNation.pageNo = 1;
      this.pageNation.pageSize = option;
      this.getLimits();
    },
    handleCurrentChangeDialogTable(pageNo) {
      this.dialogTable.pageNo = pageNo;
      this.getCreativeListApi();
    },
    handleSizeChangeDialogTable(option) {
      this.dialogTable.pageNo = 1;
      this.dialogTable.pageSize = option;
      this.getCreativeListApi();
    },
    // 重置
    resetSearch() {
      this.pageNation.pageNo = 1;
      this.pageNation.pageSize = 10;
      this.filters.queryValue = "";

      this.filters3.queryDateValue = 1;
      this.filters3.date = this.getDatePickDate(
        this.filters3.queryDateTypes,
        this.filters3.queryDateValue
      );

      this.filters.catId = "";
      this.filters.tagId = "";
      this.filters.equValue = "0";
      // this.filters.date = "3";
      this.list = [];
      this.getLimits();
    },
    linkTo(location, action = "push") {
      this.$router[action](location);
    }
  }
};
</script>
<style lang="scss" scoped>
.iconSearch:hover {
  border: 1px solid #66b1ff;
}
</style>
<style>
.radioStyle span {
  border: none !important;
  width: 78px;
}
.radioStyle:first-child span {
  border: none !important;
}
.radioStyle input:checked + span {
  border-radius: 4px 4px 4px 4px;
}
.radioStyle:first-child input:checked + span {
  border-radius: 4px 4px 4px 4px;
}
.radioStyle:last-child input:checked + span {
  border-radius: 4px 4px 4px 4px;
}
/* .radioStyle:first-child span{border-radius:0;}
.radioStyle:last-child span{border-radius:0;} */
.radioWidth {
  width: 700px;
  height: 30px;
  overflow: hidden;
  /* transition: 1s height; */
}
.classTag {
  height: auto;
  /* transition: 1s height; */
}
</style>
