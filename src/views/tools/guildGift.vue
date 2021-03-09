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
          <el-row :gutter="10">
            <el-col :xs="24" :sm="12" :md="12" :lg="7" :xl="8">
              <div class="flex mid">
                <el-select
                  v-model="filters.queryType"
                  placeholder="请选择"
                  style="width: 150px;"
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
                  @keyup.enter.native="submitSearch"
                  v-model="filters.queryValue"
                  placeholder="请输入关键词"
                ></el-input>
              </div>
            </el-col>
            <!-- 返利盒子的 -->
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
              <div class="flex mid">
                <div>游戏：</div>
                <BoxGame
                  ref="BoxGame"
                  @change="handleGamesChange"
                  :defaultPlatformId="filters.platformId"
                  :defaultGame="filters.gameId"
                ></BoxGame>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="4" :xl="4">
              <el-button @click="submitSearch" type="primary">查询</el-button>
              <el-button @click="resetFilter">重置</el-button>
              <el-button @click="exportLogs" type="primary">导出</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>

    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix head">
        <h3>查询结果</h3>
      </div>
      <div class="body">
        <div class="flex mid between mb10">
          <el-radio-group
            v-model="filters.radio"
            size="medium"
            @change="radioChange"
          >
            <el-radio-button :label="-1">全部状态</el-radio-button>
            <el-radio-button :label="1">未发放</el-radio-button>
            <el-radio-button :label="2">未发完</el-radio-button>
            <el-radio-button :label="3">已发完</el-radio-button>
          </el-radio-group>
          <el-button
            v-if="isShowRolesBtn"
            @click="showRolesDialog"
            type="primary"
            size="medium"
            >礼包发放权限管理</el-button
          >
        </div>
        <el-table
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          border
        >
          <el-table-column label="VV账号" width="100">
            <template slot-scope="scope">{{
              scope.row.userId || "-"
            }}</template>
          </el-table-column>
          <el-table-column label="游戏名称" prop="gameName"></el-table-column>
          <el-table-column label="区服" prop="zoneName"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="归属主渠道">
            <template slot-scope="scope"
              >名称：{{ scope.row.mcName || "-" }}<br />ID：{{
                scope.row.mcId || "-"
              }}</template
            >
          </el-table-column>
          <el-table-column label="归属子渠道">
            <template slot-scope="scope"
              >名称：{{ scope.row.scName || "-" }}<br />ID：{{
                scope.row.scId || "-"
              }}</template
            >
          </el-table-column>
          <el-table-column label="消费总金额(元)" prop="consumeTotal">
            <template slot="header">
              消费总金额(元)
              <el-tooltip
                class="item"
                effect="dark"
                content="创角以来的角色消费总金额"
                placement="top"
              >
                <i class="el-icon-question"></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              {{ scope.row.consumeTotal }}
            </template>
          </el-table-column>
          <el-table-column label="单笔最高消费(元)" prop="singleConsumeMax">
            <template slot="header">
              单笔最高消费(元)
              <el-tooltip
                class="item"
                effect="dark"
                content="礼包周期内的角色单笔最高消费"
                placement="top"
              >
                <i class="el-icon-question"></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              {{ scope.row.singleConsumeMax }}
            </template>
          </el-table-column>
          <el-table-column label="礼包奖励" width="180">
            <template slot-scope="scope">
              <el-popover
                placement="top-start"
                :title="
                  '礼包信息-' +
                    scope.row.giftName +
                    '(ID:' +
                    scope.row.giftId +
                    ')'
                "
                width="360"
                trigger="hover"
              >
                <div>
                  条件：{{ scope.row.condition }}<br />
                  领取次数：{{ scope.row.receiveNum }}<br />
                  内容：{{ scope.row.content }}
                </div>
                <el-button class="buttonOverflow" type="text" slot="reference"
                  >{{ scope.row.giftName }}(ID：{{
                    scope.row.giftId
                  }})</el-button
                >
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="消费首次达成时间"
            prop="firstReachTime"
          ></el-table-column>
          <el-table-column
            label="礼包发放时间(最近一次)"
            prop="packageRewardTime"
          ></el-table-column>
          <el-table-column label="发放状态">
            <template slot-scope="scope">
              <div v-if="scope.row.rewardDoneNum == 0">未发放</div>
              <div
                v-if="
                  scope.row.rewardDoneNum > 0 &&
                    scope.row.rewardDoneNum < scope.row.rewardNum
                "
              >
                未发完
              </div>
              <div v-if="scope.row.rewardNum == scope.row.rewardDoneNum">
                已发完
              </div>
            </template>
          </el-table-column>
          <el-table-column label="发放情况" prop="zoneName">
            <template slot="header">
              发放情况
              <el-tooltip class="item" effect="dark" placement="top">
                <div slot="content">
                  总礼包数：满足礼包消费条件的总次数<br />
                  已发放数：已发放的礼包数量<br />
                  待发放数：当前剩余可发放的礼包数量<br />
                  已过期数：已超过发放时效的礼包数量<br />
                </div>
                <i class="el-icon-question"></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              总礼包数：{{ scope.row.rewardNum }}<br />
              已发放数：{{ scope.row.rewardDoneNum }}<br />
              待发放数：{{ scope.row.rewardWaitNum }}<br />
              已过期数：{{ scope.row.rewardTimeOutNum }}<br />
            </template>
          </el-table-column>
          <el-table-column
            label="发放人姓名"
            prop="rewardLoginNum"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                v-if="scope.row.rewardWaitNum !== 0"
                @click="editGift(scope.row)"
                >发放礼包</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <div class="table-footer">
          <div class="actions"></div>
          <div class="pages" style="float:right">
            <el-pagination
              background
              layout="prev, pager, next,total"
              :current-page="pageNo"
              :page-size="pageSize"
              :total="total"
              @current-change="handleCurrentChange"
            >
            </el-pagination>
          </div>
        </div>
      </div>
      <!-- 发放礼包 -->
      <el-dialog title="发放礼包" :visible.sync="dialogVisible" width="30%">
        <div class="headerTittle">礼包发放确认</div>
        <el-row :gutter="10" class="flex mid mb10">
          <el-col :span="4"><span class="flex end">VV号：</span></el-col>
          <el-col :span="12">{{ dialogGift.userId }}</el-col>
        </el-row>
        <el-row :gutter="10" class="flex mid mb10">
          <el-col :span="4"><span class="flex end">游戏：</span></el-col>
          <el-col :span="12"
            >{{ dialogGift.gameName }} - {{ dialogGift.zoneName }}
          </el-col>
        </el-row>
        <el-row :gutter="10" class="flex mid mb10">
          <el-col :span="4"><span class="flex end">角色：</span></el-col>
          <el-col :span="12">{{ dialogGift.roleName }}</el-col>
        </el-row>
        <el-row :gutter="10" class="flex mid mb10">
          <el-col :span="4"><span class="flex end">礼包：</span></el-col>
          <el-col :span="12">{{ dialogGift.giftName }}</el-col>
        </el-row>
        <el-row :gutter="10" class="flex mid mb10">
          <el-col :span="4"><span class="flex end">待发放数：</span></el-col>
          <el-col :span="12">{{ dialogGift.rewardWaitNum }}</el-col>
        </el-row>
        <el-row :gutter="10" class="flex mid mb10">
          <el-col :span="4"><span class="flex end">发放数量：</span></el-col>
          <el-col :span="12"
            ><el-input
              v-model="dialogGiftInput"
              placeholder="请输入数量"
            ></el-input
          ></el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisibleSave">发放</el-button>
        </span>
      </el-dialog>
      <!-- 发放权限 -->
      <el-dialog
        title="礼包发放权限管理"
        :visible.sync="dialogVisibleRoles"
        width="30%"
      >
        <div>
          <el-tree
            :data="channelInfoList"
            show-checkbox
            node-key="id"
            ref="tree"
            class="elTree"
            accordion
            highlight-current
            :default-checked-keys="selectArr"
            :props="defaultProps"
          >
          </el-tree>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleRoles = false">取 消</el-button>
          <el-button type="primary" @click="saveChannelInfoAuth"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
import BoxGame from "@/components/Games/boxGame";
import http from "@/utils/http";
import { mapState } from "vuex";

export default {
  name: "toolsGuildGift",
  components: {
    Breadcrumb,
    BoxGame
  },
  data() {
    return {
      isShowRolesBtn: false, //礼包发放权限管理
      dialogVisible: false,
      dialogGift: {},
      dialogGiftInput: "",
      dialogVisibleRoles: false,
      channelInfoList: [],
      selectArr: [],
      defaultProps: {
        children: "children",
        label: "channelName"
      },
      filters: {
        isDiscountGame: 0,
        queryType: 1,
        queryValue: "",
        queryTypes: [
          { label: "VV账号", value: 1 },
          // { label: "角色名称", value: 6 },
          { label: "角色ID", value: 7 },
          { label: "主渠道ID", value: 3 },
          { label: "子渠道ID", value: 5 }
        ],
        platformId: "",
        gameId: "",
        zoomId: "",
        radio: -1
      },
      tableData: [],
      resData: [],
      pageNo: 1,
      pageSize: 10,
      total: 0
    };
  },
  computed: mapState({
    account: state => state.user.account
  }),
  created() {
    //礼包发放权限管理
    if (this.account.isGuildBoss === 1) {
      this.isShowRolesBtn = true;
    }
  },
  methods: {
    getChannelInfoAuth() {
      http
        .get2("/guild/getChannelInfoAuth.list.do")
        .then(res => {
          this.selectArr = [];
          this.resData = JSON.parse(JSON.stringify(res.data));
          let listArr = [];
          if (res.state == "ok") {
            res.data.forEach(item => {
              if (item.selectState == 1) {
                this.selectArr.push(item.scId);
              }
            });
            res.data.forEach(el => {
              for (var i = 0; i < listArr.length; i++) {
                if (listArr[i].id == el.mcId && el.userType == 3) {
                  listArr[i].children.push({
                    channelName: el.scName,
                    id: el.scId,
                    parent: false
                  });
                  return;
                }
              }
              listArr.push({
                channelName: el.channelName,
                id: el.mcId,
                parent: true,
                children: [
                  {
                    channelName:
                      el.userType == 2 ? el.scName + "【组长】" : el.scName,
                    id: el.scId,
                    parent: false
                  }
                ]
              });
            });
            this.channelInfoList = listArr;
          } else {
            this.$message.error(res.message || "获取失败");
          }
        })
        .catch(error => {
          console.log(error);
          return;
        });
    },
    showRolesDialog() {
      this.dialogVisibleRoles = true;
      this.getChannelInfoAuth();
    },
    saveChannelInfoAuth() {
      console.log(
        this.$refs.tree
          .getCheckedNodes()
          .filter(item => {
            return !item.parent;
          })
          .map(item => {
            return item.id;
          }),
        "this.$refs.tree.getCheckedNodes()"
      );
      const arr = this.$refs.tree
        .getCheckedNodes()
        .filter(item => {
          return !item.parent;
        })
        .map(item => {
          return item.id;
        });
      let arrList = [];
      this.resData.forEach((item, index) => {
        if (arr.includes(item.scId)) {
          item.selectState = 1;
          arrList.push(item);
        } else {
          if (item.id) {
            arrList.push(item);
          }
          item.selectState = 0;
        }
      });
      const data = arrList;
      http
        .post("/guild/getChannelInfoAuth.update.do", data)
        .then(res => {
          if (res.state == "ok") {
            this.$message.success(res.message || "保存成功");
            this.dialogVisibleRoles = false;
          } else {
            this.$message.error(res.message || "保存失败");
          }
        })
        .catch(error => {
          console.log(error);
          return;
        });
    },
    handleGamesChange(data) {
      if (data.platformType == "0") {
        this.filters.isDiscountGame = 0;
      } else {
        this.filters.isDiscountGame = 1;
      }
      this.filters.platformId = data.platformId;
      this.filters.gameId = data.gameId;
      this.filters.zoomId = data.zoomId;
    },
    radioChange() {
      this.pageNo = 1;
      this.submitSearch();
    },
    editGift(row) {
      this.dialogVisible = true;
      this.dialogGift = row;
      this.dialogGiftInput = JSON.parse(JSON.stringify(row.rewardWaitNum));
    },
    dialogVisibleSave() {
      if (
        Number(this.dialogGiftInput) > Number(this.dialogGift.rewardWaitNum)
      ) {
        this.$message.warning("发放数量不能大于待发数量！");
        return;
      }
      if (Number(this.dialogGiftInput) == 0) {
        this.$message.warning("发放数量不能为0！");
        return;
      }
      const data = {
        id: this.dialogGift.id,
        putOutNum: this.dialogGiftInput
      };
      http
        .get2("/guild/actavityReach.putOut.do", data)
        .then(res => {
          if (res.state == "ok") {
            this.$message.success(res.message || "保存成功");
            this.dialogVisible = false;
            this.submitSearch();
          } else {
            this.$message.error(res.message || "保存失败");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    submitSearch() {
      const data = {
        status: this.filters.radio,
        queryType: this.filters.queryType,
        queryValue: this.filters.queryValue,
        platformId: this.filters.platformId,
        gameId: this.filters.gameId,
        zoneId: this.filters.zoomId,
        "pagination.pageNo": this.pageNo,
        "pagination.pageSize": this.pageSize
      };
      http
        .get2("/guild/actavityReach.list.do", data)
        .then(res => {
          if (res.state == "ok") {
            this.tableData = res.data;
            this.total = res.pagination.count;
          } else {
            this.$message.error(res.message || "查询失败");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 切换分页
    handleCurrentChange(page) {
      this.pageNo = page;
      this.submitSearch();
    },
    // 重置条件
    resetFilter() {
      this.tableData = [];
      this.filters.queryType = 1;
      this.filters.queryValue = "";
      this.filters.platformId = "";
      this.filters.gameId = "";
      this.filters.zoomId = "";
      this.filters.radio = -1;
      this.$refs.BoxGame.handleChangePlatform("0");
      this.$refs.BoxGame.handleChangeGame("");
      this.submitSearch();
    },
    exportLogs() {
      if (this.tableData.length == 0) {
        this.$message.warning("请先查询所需数据再导出");
        return;
      }
      const data = {
        status: this.filters.radio,
        queryType: this.filters.queryType,
        queryValue: this.filters.queryValue,
        platformId: this.filters.platformId,
        gameId: this.filters.gameId,
        zoneId: this.filters.zoomId,
        mainMenu: "常用工具",
        oneMenu: "发放福利礼包"
      };
      http
        .get2("/guild/actavityReach.export.do", data)
        .then(res => {
          if (res.state == "ok") {
            this.$message.success(res.message || "导出成功");
          } else {
            this.$message.error(res.message || "导出失败");
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.headerTittle {
  text-align: center;
  color: #31cb31;
  font-size: 18px;
}
.spanText {
  text-align: right;
  width: 140px;
}
</style>
<style>
/* 设置el-tree children的第一项【组长】高亮红色 */
.elTree
  .el-tree-node__children
  > .el-tree-node:first-child
  > .el-tree-node__content {
  color: red !important;
}
</style>
<style>
.buttonOverflow {
  width: 100%;
  overflow: hidden;
  text-align: left;
}
</style>
