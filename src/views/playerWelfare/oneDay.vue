<template>
  <div>
    <div class="page-crumbs">
      <div class="crumbs">
        <breadcrumb />
      </div>
    </div>
    <el-row :gutter="24">
      <el-col :xs="24" :sm="12" :md="12" :lg="4" :xl="4">
        <el-card class="box-card" shadow="never" style="min-height: 560px">
          <div slot="header">
            <h3>单日累充</h3>
          </div>
          <div class="body">
            <el-input
              placeholder="搜索游戏"
              v-model="filters.treeInput"
              @keyup.enter.native="getTargetMenu"
              clearable
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getTargetMenu"
              ></el-button>
            </el-input>
            <el-tree
              :data="treeData"
              :props="defaultProps"
              @current-change="currentChange"
            ></el-tree>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="20" :xl="20">
        <div class="ml10 box-cardMain">
          <el-card shadow="never">
            <div slot="header">
              <h3>查询条件</h3>
            </div>
            <div class="body">
              <el-row :gutter="20" class="mb10">
                <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                  <div class="flex mid">
                    <el-select v-model="filters.queryType" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                    <el-input
                      type="primary"
                      v-model="filters.queryValue"
                      placeholder="请输入关键词"
                    ></el-input>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                  <BoxGame
                    ref="BoxGame"
                    @change="handleGamesChange"
                    :defaultPlatformId="filters.platformId"
                    :defaultGame="filters.gameId"
                  ></BoxGame>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                  <el-date-picker
                    v-model="filters.date"
                    type="daterange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :clearable="false"
                  ></el-date-picker>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="4" :xl="4">
                  <el-button type="primary" @click="search">查询</el-button>
                  <el-button @click="resetFilter">重置</el-button>
                </el-col>
              </el-row>
            </div>
          </el-card>
          <el-card shadow="never">
            <div slot="header">
              <h3>玩家达成列表</h3>
            </div>
            <div class="body">
              <div class="mb10">
                <el-radio-group v-model="filters.radio" @change="radioChange">
                  <el-radio-button :label="-1">全部</el-radio-button>
                  <el-radio-button :label="1">已发放</el-radio-button>
                  <el-radio-button :label="2">未发放</el-radio-button>
                </el-radio-group>
              </div>
              <el-table
                :data="tableList"
                tooltip-effect="dark"
                style="width: 100%"
                border
                @selection-change="handleSelectionChange"
                :default-sort="{ prop: 'name', order: 'descending' }"
                @sort-change="sortChangeCreat"
              >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column
                  prop="userId"
                  label="账号"
                  width="100"
                ></el-table-column>
                <el-table-column prop="gameName" label="游戏"></el-table-column>
                <el-table-column prop="zoneName" label="区服"></el-table-column>
                <el-table-column
                  prop="roleName"
                  label="角色名"
                ></el-table-column>
                <el-table-column
                  prop="createRoleDateStr"
                  label="创角时间"
                  sortable="custom"
                ></el-table-column>
                <el-table-column
                  prop="channelName"
                  label="归属渠道"
                ></el-table-column>
                <el-table-column
                  prop="reachValue"
                  label="单日达成"
                  sortable="custom"
                >
                  <template slot-scope="scope">
                    <div style="color: red">{{ scope.row.reachValue }}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="reachDateStr"
                  label="达成时间"
                  sortable="custom"
                ></el-table-column>
                <el-table-column label="礼包名称">
                  <template slot-scope="scope">
                    <el-popover
                      ref="popover"
                      placement="top-start"
                      :title="scope.row.giftDetailView.giftName"
                      width="200"
                      trigger="hover"
                    >
                      <div>
                        <div>
                          <span>礼包描述：</span
                          ><span>{{ scope.row.giftDetailView.descs }}</span>
                        </div>
                        <div>
                          <span>使用说明：</span
                          ><span>{{
                            scope.row.giftDetailView.usageMethod
                          }}</span>
                        </div>
                      </div>
                    </el-popover>
                    <el-button
                      v-popover:popover
                      type="text"
                      style="
                        color: red;
                        width: 100%;
                        overflow: hidden;
                        text-align: left;
                      "
                      >{{ scope.row.giftDetailView.giftName }}</el-button
                    >
                  </template>
                </el-table-column>
                <el-table-column
                  prop="putOutStatusStr"
                  label="发放状态"
                ></el-table-column>
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <div>
                      <div>
                        <el-button type="text" @click="showMesg(scope.row)"
                          >详情</el-button
                        >
                      </div>
                      <div>
                        <el-button
                          type="text"
                          v-if="scope.row.putOutStatus === 2"
                          @click="sendGift(scope.row, 1)"
                          style="color: red"
                          >发放礼包</el-button
                        >
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <div class="table-footer">
                <div class="actions">
                  <el-button
                    type="primary"
                    plain
                    @click="allSendGift"
                    :disabled="multipleSelection.length === 0"
                    >批量发放</el-button
                  >
                </div>
                <div class="pages">
                  <el-pagination
                    background
                    layout="prev, pager, next, total"
                    :current-page="pageNo"
                    :page-size="pageSize"
                    :total="total"
                    @current-change="handleCurrentChange"
                  ></el-pagination>
                </div>
              </div>
            </div>
          </el-card>
          <!-- 详情弹窗 -->
          <el-dialog title="玩家达成详情" :visible.sync="dialogFormVisible">
            <div class="title el-icon-s-flag">玩家信息</div>
            <el-row>
              <el-col :span="4">
                <div class="bg-purple">VV号：</div>
              </el-col>
              <el-col :span="8">
                <div class="bg-purple-light">
                  {{ dialogForm.userId || "-" }}
                </div>
              </el-col>
              <el-col :span="4">
                <div class="bg-purple">归属渠道：</div>
              </el-col>
              <el-col :span="8">
                <div class="bg-purple-light">
                  {{ dialogForm.channelName || "-" }}
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                <div class="bg-purple">游戏：</div>
              </el-col>
              <el-col :span="8">
                <div class="bg-purple-light">
                  {{ dialogForm.gameName || "-" }}
                </div>
              </el-col>
              <el-col :span="4">
                <div class="bg-purple">单笔达成：</div>
              </el-col>
              <el-col :span="8">
                <div class="bg-purple-light">
                  {{ dialogForm.reachValue || "-" }}
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                <div class="bg-purple">区服：</div>
              </el-col>
              <el-col :span="8">
                <div class="bg-purple-light">
                  {{ dialogForm.zoneName || "-" }}
                </div>
              </el-col>
              <el-col :span="4">
                <div class="bg-purple">达成时间：</div>
              </el-col>
              <el-col :span="8">
                <div class="bg-purple-light">
                  {{ dialogForm.reachDateStr || "-" }}
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                <div class="bg-purple">角色名：</div>
              </el-col>
              <el-col :span="8">
                <div class="bg-purple-light">
                  {{ dialogForm.roleName || "-" }}
                </div>
              </el-col>
              <el-col :span="4">
                <div class="bg-purple">创角时间：</div>
              </el-col>
              <el-col :span="8">
                <div class="bg-purple-light">
                  {{ dialogForm.createRoleDateStr || "-" }}
                </div>
              </el-col>
            </el-row>
            <div class="title el-icon-s-flag">礼包信息</div>
            <el-row>
              <el-col :span="4">
                <div class="bg-purple">发放状态：</div>
              </el-col>
              <el-col :span="8">
                <div class="bg-purple-light">
                  {{ dialogForm.putOutStatusStr || "-" }}
                </div>
              </el-col>
              <el-col :span="4">
                <div class="bg-purple">礼包码：</div>
              </el-col>
              <el-col :span="8">
                <div class="bg-purple-light">
                  {{ giftDetailView.giftCode || "-" }}
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                <div class="bg-purple">礼包名称：</div>
              </el-col>
              <el-col :span="8">
                <div class="bg-purple-light">
                  {{ giftDetailView.giftName || "-" }}
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                <div class="bg-purple">礼包描述：</div>
              </el-col>
              <el-col :span="20">
                <div class="bg-purple-light">
                  {{ giftDetailView.descs || "-" }}
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                <div class="bg-purple">使用说明：</div>
              </el-col>
              <el-col :span="8">
                <div class="bg-purple-light">
                  {{ giftDetailView.usageMethod || "-" }}
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                <div class="bg-purple">发放人：</div>
              </el-col>
              <el-col :span="8">
                <div class="bg-purple-light">
                  {{ giftDetailView.putOutUserName || "-" }}
                </div>
              </el-col>
              <el-col :span="4">
                <div class="bg-purple">发放时间：</div>
              </el-col>
              <el-col :span="8">
                <div class="bg-purple-light">
                  {{ giftDetailView.putOutTimeStr || "-" }}
                </div>
              </el-col>
            </el-row>
          </el-dialog>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import BoxGame from "@/components/Games/boxGame";
import Breadcrumb from "@/components/Breadcrumb";
import http from "@/utils/http";
import moment from "moment";

export default {
  name: "playerWelfareOneDay",
  components: {
    Breadcrumb,
    BoxGame
  },
  data() {
    return {
      treeData: [
        { label: "全部游戏", platformId: "", gameId: "", children: [] }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      dialogFormVisible: false,
      dialogForm: {},
      giftDetailView: {},
      filters: {
        targetId: "",
        giftId: "",
        queryType: "1",
        queryValue: "",
        platformId: "",
        gameId: "",
        zoomId: "",
        slectGameId: "",
        date: [],
        radio: -1,
        treeInput: "",
        sort: "", //ASC=升序，DESC=降序
        sortField: "" //排序字段
      },
      options: [
        { value: "1", label: "账号" },
        { value: "7", label: "角色ID" },
        { value: "4", label: "渠道ID" },
        { value: "3", label: "主渠道ID" },
        { value: "5", label: "子渠道ID" },
        { value: "2", label: "发放人账号" }
      ],
      tableList: [],
      multipleSelection: [],
      pageNo: 1,
      pageSize: 10,
      total: 0
    };
  },
  created() {
    this.setDefaultDate();
    this.getTargetMenu();
    this.search();
  },
  methods: {
    // 设置默认时间
    setDefaultDate() {
      const startDate = moment(new Date())
        .subtract(2, "day")
        .hours(0)
        .minutes(0)
        .seconds(0)
        .format("YYYY-MM-DD HH:mm:ss");
      const endDate = moment(new Date())
        .subtract(0, "day")
        .hours(23)
        .minutes(59)
        .seconds(59)
        .format("YYYY-MM-DD HH:mm:ss");
      this.filters.date = [startDate, endDate];
    },
    // 平台游戏区服
    handleGamesChange(games) {
      this.filters.platformId = games.platformId;
      this.filters.gameId = games.gameId;
      this.filters.zoom = games.zoom;
      this.filters.targetId = "";
      this.filters.giftId = "";
    },
    // tree查询
    getTargetMenu() {
      const data = {
        periodReset: 2,
        gameName: this.filters.treeInput,
        targetCondition: 5
      };
      http.get2("/game/gameActivityTarget.getTargetMenu.do", data).then(res => {
        if (res.state == "ok") {
          this.treeData[0].children = res.data;
        } else {
          this.$message.error(res.message || "请求失败");
        }
      });
    },
    // 礼包游戏tree
    currentChange(data, obj) {
      this.filters.platformId =
        obj.level === 3 ? obj.parent.data.platformId : data.platformId;
      this.filters.targetId = obj.level === 3 ? data.targetId : "";
      this.filters.giftId = obj.level === 3 ? data.giftId : "";
      setTimeout(() => {
        this.filters.gameId =
          obj.level === 3 ? obj.parent.data.gameId : data.gameId;
      }, 200);
      this.search();
    },
    // tree全部游戏
    getCheckedAllGame() {
      this.filters.treeInput = "";
      this.getTargetMenu();
    },
    // 批量
    handleSelectionChange(val) {
      this.multipleSelection = [];
      val.forEach(item => {
        this.multipleSelection.push(item.id);
      });
    },
    // 详情
    showMesg(row) {
      this.dialogForm = row;
      this.giftDetailView = row.giftDetailView;
      this.dialogFormVisible = true;
    },
    // 发放礼包
    sendGift(row, num) {
      this.$confirm("此操作将发放礼包, 是否继续?", "提示", {
        confirmButtonText: "确定发放",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const data = {
            ids: num === 1 ? row.id : this.multipleSelection.join(",")
          };
          http
            .post2("/game/guildGift.do", data)
            .then(res => {
              if (res.state == "ok") {
                this.$message.success(res.message || "发放成功");
                this.getGuildGiftList();
              } else {
                this.$message.error(res.message || "操作失败");
              }
            })
            .catch(e => {
              console.log(e);
              this.$message.error("发放失败");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消发放"
          });
        });
    },
    // 批量发放礼包
    allSendGift() {
      this.sendGift("", 0);
    },
    // 获取列表数据
    getGuildGiftList() {
      const data = {
        TargetConditionType: 5, //1=每日福利，3=累计累充福利，4=单笔福利列表，5=单日累充福利，6=等级福利列表
        targetId: this.filters.targetId,
        giftId: this.filters.giftId,
        queryType: this.filters.queryType,
        queryValue: this.filters.queryValue,
        platformId: this.filters.platformId,
        appId: this.filters.gameId,
        zoneId: this.filters.zoomId,
        status: this.filters.radio,
        startDate: this.filters.date[0],
        endDate: this.filters.date[1],
        sort: this.filters.sort,
        sortField: this.filters.sortField,
        "pagination.pageNo": this.pageNo,
        "pagination.pageSize": this.pageSize
      };
      http.get2("/game/guildGift.list.do", data).then(res => {
        if (res.state == "ok") {
          this.tableList = res.data;
          this.total = res.pagination.count;
        } else {
          this.$message.error(res.message || "获取失败");
        }
      });
    },
    // 查询
    search() {
      this.pageNo = 1;
      this.getGuildGiftList();
    },
    radioChange() {
      this.search();
    },
    // 排序
    sortChangeCreat(column) {
      if (column.prop === "createRoleDateStr" && column.order !== null) {
        this.filters.sort = column.order === "ascending" ? "ASC" : "DESC";
        this.filters.sortField = "1";
      } else if (column.prop === "reachValue" && column.order !== null) {
        this.filters.sort = column.order === "ascending" ? "ASC" : "DESC";
        this.filters.sortField = "4"; // 1-创角时间  2-发放时间 3-达成时间  4-达成值
      } else if (column.prop === "reachDateStr" && column.order !== null) {
        this.filters.sort = column.order === "ascending" ? "ASC" : "DESC";
        this.filters.sortField = "3";
      } else {
        this.filters.sort = "";
        this.filters.sortField = "";
      }
      this.search();
    },
    // 分页
    handleCurrentChange(page) {
      this.pageNo = page;
      this.getGuildGiftList();
    },
    // 重置
    resetFilter() {
      this.filters.queryType = "1";
      this.filters.queryValue = "";
      this.filters.platformId = "";
      this.filters.gameId = "";
      this.filters.zoom = "";
      this.$refs.BoxGame.handleChangePlatform("0");
      this.$refs.BoxGame.handleChangeGame("");
      this.filters.radio = -1;
      this.setDefaultDate();
      this.search();
    }
  }
};
</script>
<style lang="scss" scoped>
.title {
  font-weight: bold;
  height: 40px;
  line-height: 40px;
}
.bg-purple {
  text-align: right;
}
.bg-purple-light {
  text-align: left;
}
</style>
