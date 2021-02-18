<!--我的扶持申请记录-->
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
              <div class="merge">
                <p>关键字查询:</p>
                <el-select
                  v-model="filters.curQueryType"
                  placeholder="请选择"
                  style="width: 110px;"
                  @change="onQueryTypeChange"
                >
                  <el-option
                    v-for="item in filters.queryTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <el-input
                  @keyup.enter.native="submitFilter"
                  v-model="filters.curQueryValue"
                  placeholder="请输入关键词"
                ></el-input>
              </div>
            </el-col>

            <el-col :xs="24" :sm="12" :md="12" :lg="7" :xl="8" v-if="false">
              <div class="merge">
                <p>游戏:</p>
                <!--平台选择-->
                <el-select
                  v-model="filters.curPlatformSelected"
                  :placeholder="
                    filters.isLoadingPlatformList ? '加载中' : '加载完成'
                  "
                  filterable
                  style="width: 110px;"
                  @change="onPlatformChange"
                >
                  <el-option
                    v-for="item in filters.platformList"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <!--游戏选择-->
                <el-select
                  v-model="filters.curGameSelected"
                  :loading="filters.isLoadingGameList"
                  :placeholder="
                    filters.isLoadingGameList
                      ? '加载中'
                      : filters.curPlatformGameList.length > 0
                      ? '加载完成'
                      : '无数据'
                  "
                  filterable
                  style="width: 110px;"
                  @change="onGameChange"
                >
                  <el-option
                    v-for="item in filters.curPlatformGameList"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <!--区服选择-->
                <el-select
                  v-model="filters.curZoneSelected"
                  :placeholder="
                    filters.isLoadingGameZoneList
                      ? '加载中'
                      : filters.curGameZoneList.length > 0
                      ? '加载完成'
                      : '无数据'
                  "
                  filterable
                  style="width: 110px;"
                  @change="onZoneChange"
                >
                  <el-option
                    v-for="item in filters.curGameZoneList"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </el-col>

            <el-col :xs="20" :sm="10" :md="10" :lg="6" :xl="6">
              <el-button @click="submitFilter" type="primary">查询</el-button>
              <el-button @click="resetFilter">重置</el-button>
              <el-button
                v-show="false"
                @click="linkTo('/gameSupport/grant/autoAuditSetting')"
                type="primary"
                >资源自动审核设置
              </el-button>
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
        <div class="filter-data">
          <!--扶持类型Tab-->
          <el-radio-group
            size="small"
            v-model="filters.curSupportType"
            @change="onSupportTypeChange"
          >
            <el-radio-button
              v-for="item in this.filters.supportTypeListAtTab"
              :key="item.value"
              :label="item.value"
            >
              {{ item.name }}
            </el-radio-button>
            <!-- <el-radio-button label="effective">有效</el-radio-button> -->
            <!-- <el-radio-button label="invalid">无效</el-radio-button> -->
          </el-radio-group>

          <!--状态Tab-->
          <el-radio-group
            size="small"
            v-model="filters.curStatusSelected"
            @change="onStatusChange"
          >
            <el-radio-button
              v-for="item in this.filters.statusListAtTab"
              :key="item.value"
              :label="item.value"
            >
              {{ item.name }}
            </el-radio-button>
            <!-- <el-radio-button label="effective">有效</el-radio-button> -->
            <!-- <el-radio-button label="invalid">无效</el-radio-button> -->
          </el-radio-group>
        </div>
        <el-table
          :data="tableDataVisible"
          ref="multipleTable"
          tooltip-effect="dark"
          style="width: 100%"
          border
          v-loading="isTableDataLoading"
        >
          <el-table-column
            prop="userId"
            label="账号"
            align="center"
          ></el-table-column>
          <el-table-column prop="gameInfo" label="产品信息" align="center">
            <template slot-scope="scope">
              <!-- {{ scope.row.platformId }} - {{ scope.row.gameName }} -->
              {{ scope.row.gameName }}
            </template>
          </el-table-column>
          <el-table-column label="区服名称" prop="zoneName" align="center">
          </el-table-column>
          <el-table-column prop="roleInfo" label="角色信息" align="center">
            <template slot-scope="scope">
              {{ scope.row.roleName }} <br />
              {{ scope.row.roleId }} | {{ scope.row.roleLevel }}级
            </template>
          </el-table-column>
          <el-table-column
            prop="supportTypeStr"
            label="资源类型"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="supportMoney"
            label="申请金额(元)"
            align="center"
          >
          </el-table-column>

          <el-table-column prop="applyNote" label="申请备注" align="center">
          </el-table-column>

          <el-table-column prop="addTime" label="申请时间" align="center">
            <!--  <template slot-scope="scope">
              {{  new Date(scope.row.applyTime).format('yyyy-MM-dd hh:mm')}}
            </template>-->
          </el-table-column>
          <!-- <el-table-column
            prop="consumeTotal"
            label="消费总额（元）"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="advanceTotal"
            label="已预支金额（元）"
            align="center"
          ></el-table-column>-->
          <el-table-column
            prop="inspectTypeStr"
            label="审核状态"
            align="center"
          >
          </el-table-column>
          <!--<el-table-column align="center" label="操作">-->
          <!--<template slot-scope="scope">-->
          <!--<el-popover-->
          <!--v-if="false"-->
          <!--placement="left-start"-->
          <!--width="200"-->
          <!--trigger="hover"-->
          <!--&gt;-->
          <!--<qr-code :text="`static/support_order/index.html`"></qr-code>-->
          <!--<el-button slot="reference" type="text">生成订单截图</el-button>-->
          <!--</el-popover>-->
          <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
          <!--fixed="right"-->
          <!--label="相关操作"-->
          <!--align="center"-->
          <!--v-if="false"-->
          <!--&gt;-->

          <!--<template slot-scope="scope">-->
          <!--&lt;!&ndash; 1: 待审核&ndash;&gt;-->
          <!--<el-button-->
          <!--@click="-->
          <!--dialogConfirm.callbackConfirm = ()=>{-->
          <!--setGrantAgree(scope.row);-->
          <!--dialogConfirm.resetConent();-->
          <!--dialogConfirm.visible = false;-->
          <!--};-->
          <!--dialogConfirm.content = '确定发放吗?';-->
          <!--dialogConfirm.visible = true;"-->
          <!--type="text" size="small"-->
          <!--v-if="scope.row.status === this.filters.STATUS_WAIT_GRANT"-->
          <!--&gt;[发放]-->
          <!--</el-button>-->
          <!--<el-button-->
          <!--@click="-->
          <!--dialogConfirm.callbackConfirm = ()=>{-->
          <!--setGrantReject(scope.row);-->
          <!--dialogConfirm.resetConent();-->
          <!--dialogConfirm.visible = false;-->
          <!--};-->
          <!--dialogConfirm.content = '确定拒绝吗?';-->
          <!--dialogConfirm.visible = true;"-->
          <!--type="text" size="small"-->
          <!--v-if="scope.row.status === this.filters.STATUS_WAIT_GRANT"-->
          <!--&gt;[拒绝]-->
          <!--</el-button>-->
          <!--</template>-->
          <!--</el-table-column>-->
        </el-table>
        <div class="table-footer">
          <div class="actions"></div>
          <div class="pages" style="float:right">
            <el-pagination
              background
              layout="prev, pager, next, total"
              :current-page="filters.page.pageNo"
              :total="filters.page.count"
              @current-change="onPageChange"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </el-card>

    <!--操作确定对话框-->
    <el-dialog title="操作" :visible.sync="dialogConfirm.visible">
      <template>
        {{ dialogConfirm.content }}
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogConfirm.callbackCancel()">取 消</el-button>
        <el-button type="primary" @click="dialogConfirm.callbackConfirm()"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qrCode from "../../../components/QRCode/qrCode";
import Breadcrumb from "@/components/Breadcrumb";
import {
  getSupportGrantListApi,
  getPlatformListApi,
  getPlatformGameListApi,
  getPlatformGameZoneListApi,
  setGrantAgreeApi,
  setGrantRejectApi,
  getSupportAccountApplyRecordListApi
} from "@/api/gameSupport";

export default {
  name: "GameSupportIndex",
  components: {
    Breadcrumb,
    qrCode
  },
  data() {
    return {
      filters: {
        /*========================关键字查询=====================*/
        /* 关键字 */
        curQueryValue: "",
        /* 当前查询类型 */
        curQueryType: "4",
        /* 查询类型列表 */
        queryTypeList: [
          {
            label: "账号",
            value: "4"
          }
        ],
        /*==================================平台列表=========================*/
        isLoadingPlatformList: false,
        /*查询平台*/
        curPlatformSelected: "",
        platformList: [],

        /*==================================游戏列表=========================*/
        isLoadingGameList: false,
        curGameSelected: "",
        /*当前平台游戏列表*/
        curPlatformGameList: [],
        allGamedData: { value: "", text: "全部游戏" },
        /*游戏数据缓存*/
        mapGameDataCache: new Map(), // platform.value : [platform.game...]
        /*==================================区服列表=========================*/
        isLoadingGameZoneList: false,
        curZoneSelected: "",
        curGameZoneList: [],
        allZoneData: { value: "", text: "全部区服" },
        /*区服数据缓存*/
        mapZoneDataCache: new Map(), // game.value : [game.zone...]
        /*===========================扶持类型==================================*/
        /* 多选Tab 扶持类型 */
        curSupportType: "",
        supportTypeListAtTab: [
          { name: "全部资源", value: "" },
          { name: "建帮资源", value: 2 },
          // {name: '生活费', value: 3},
          { name: "首次资源", value: 4 },
          { name: "后续资源", value: 5 },
          { name: "预支资源", value: 6 }
        ],
        supportTypeList: [
          //扶持类型1:首冲扶持2:建帮扶持;3:生活费:4:首次扶持;5:后续扶持;6:预支扶持
          { name: "全部资源", value: "" },
          { name: "首次资源", value: 4 },
          { name: "后续资源", value: 5 },
          { name: "预支资源", value: 6 },
          { name: "首冲资源", value: 1 },
          { name: "建帮资源", value: 2 }
          // {name: '生活费', value: 3},
        ],
        /*===============================扶持账号状态类型==================*/
        curStatusSelected: "",
        statusListAtTab: [
          { name: "全部申请", value: "" },
          { name: "待审核", value: 0 },
          { name: "待发放", value: 10 },
          { name: "发放成功", value: 11 },
          { name: "发放失败", value: 12 },
          { name: "已拒绝", value: 20 },
          { name: "已取消", value: -11 }
        ],
        STATUS_WAIT_GRANT: 0,
        statusList: [
          //审核状态 0:待审核(待发放)1:发放成功;2:发放失败:3:已拒绝
          { name: "全部申请", value: "" },
          { name: "待发放", value: 0 },
          { name: "发放成功", value: 1 },
          { name: "发放失败", value: 2 },
          { name: "已拒绝", value: 3 }
        ],
        /*==============================页数=====================*/
        page: {
          //当前页
          count: 0, //总数
          pageNo: 1, //页
          pageSize: 10 //页大小
        },
        defaultPage: {
          //重置条件时的页的数据
          count: 0, //总数
          pageNo: 1, //页
          pageSize: 10 //页大小
        }
      },

      isTableDataLoading: false,
      tableDataVisible: [], //显示的表格数据

      dialogConfirm: {
        visible: false, //可见控制
        content: "", //显示的文本
        callbackConfirm: () => {
          this.dialogConfirm.resetConent();
          this.dialogConfirm.visible = false;
        }, //确定的回调
        callbackCancel: () => {
          this.dialogConfirm.resetConent();
          this.dialogConfirm.visible = false;
        }, //取消的回调
        resetConent: () => {
          this.dialogConfirm.content = "";
        }
      }
    };
  },
  created() {
    // this.getPlatformList();
    this.getSupportAccountApplyRecordList();
  },
  methods: {
    /**
     * 获取平台列表
     */
    getPlatformList() {
      this.filters.isLoadingPlatformList = true;
      getPlatformListApi()
        .then(res => {
          console.log(res);
          if (res.state === "ok") {
            this.filters.platformList = res.data;
            //默认选择第一项
            if (res.data.length > 0) {
              this.onPlatformChange(res.data[0].value);
            }
          } else {
            this.showErrorMessage(res.message);
          }
          this.filters.isLoadingPlatformList = false;
        })
        .catch(() => {
          this.filters.isLoadingPlatformList = false;
          this.showErrorMessage();
        });
    },
    /**
     * 平台变化时回调
     * @param platformValue
     */
    onPlatformChange(platformValue) {
      this.filters.curPlatformSelected = platformValue;
      //清除旧的游戏列表,区服及选中
      this.filters.curGameSelected = "";
      this.filters.curPlatformGameList = [];
      this.filters.curZoneSelected = "";
      this.filters.curGameZoneList = [];
      //加载对应游戏列表
      this.filters.isLoadingGameList = true;
      this.filters.isLoadingGameZoneList = true;
      if (!this.filters.mapGameDataCache.has(platformValue)) {
        //判断缓存
        // console.log(platformValue + '平台没有游戏数据缓存,获取...');
        getPlatformGameListApi(this.filters.curPlatformSelected)
          .then(res => {
            if (res.state === "ok") {
              let gameData = res.data;
              //添加"全部游戏"选项在第一项
              gameData.unshift(this.filters.allGamedData);
              //保存缓存
              this.filters.mapGameDataCache.set(platformValue, gameData);
              //更新游戏列表
              this.filters.curPlatformGameList = gameData;
              //默认选中第一项
              if (gameData.length > 0) {
                this.onGameChange(gameData[0].value);
              }
            } else {
              this.showErrorMessage(res.message);
            }
            this.filters.isLoadingGameList = false;
          })
          .catch(() => {
            this.filters.isLoadingGameList = false;
            this.showErrorMessage();
          });
      } else {
        // console.log(platformValue + '平台已有游戏数据,获取...');
        let gameData = this.filters.mapGameDataCache.get(platformValue);
        this.filters.curPlatformGameList = gameData;
        this.filters.isLoadingGameList = false;
        if (gameData.length > 0) {
          //默认选中第一项
          this.onGameChange(gameData[0].value);
        }
      }
    },
    /**
     * 游戏变化时回调
     * @param gameValue
     */
    onGameChange(gameValue) {
      console.log("选择了游戏:" + gameValue);
      this.filters.curGameSelected = gameValue;

      if (!gameValue) {
        // 选了"全部游戏" 不加载区服列表并显示"全部区服"
        this.filters.curGameZoneList = [this.filters.allZoneData];
        this.filters.curZoneSelected = "";
        return;
      }
      //清除旧的选择
      this.filters.curZoneSelected = "";
      this.filters.curGameZoneList = [];

      //获取区服列表
      this.filters.isLoadingGameZoneList = true;
      if (!this.filters.mapZoneDataCache.has(gameValue)) {
        //判断缓存
        getPlatformGameZoneListApi(
          this.filters.curPlatformSelected,
          this.filters.curGameSelected
        )
          .then(res => {
            if (res.state === "ok") {
              let zoneData = res.data;
              //添加"全部区服"选项在第一项
              zoneData.unshift(this.filters.allZoneData);
              //保存缓存
              this.filters.mapZoneDataCache.set(gameValue, zoneData);

              //更新游戏列表
              this.filters.curGameZoneList = zoneData;
              //默认选中第一项
              if (zoneData.length > 0) {
                this.onZoneChange(zoneData[0].value);
              }
            } else {
              this.showErrorMessage(res.message);
            }
            this.filters.isLoadingGameZoneList = false;
          })
          .catch(() => {
            this.filters.isLoadingGameZoneList = false;
            this.showErrorMessage();
          });
      } else {
        // console.log(gameValue + '游戏已有区服缓存数据');
        let zoneData = this.filters.mapZoneDataCache.get(gameValue);
        this.filters.curGameZoneList = zoneData;
        this.filters.isLoadingGameZoneList = false;
        //默认选中第一项
        if (zoneData.length > 0) {
          this.onZoneChange(zoneData[0].value);
        }
      }
    },

    /**
     * 获取扶持审核列表
     */
    getSupportAccountApplyRecordList() {
      if (this.isTableDataLoading) {
        return;
      }
      // if (!this.filters.curPlatformSelected) {
      //   this.$message.error('必须选择一个平台');
      //   return;
      // }

      this.isTableDataLoading = true;
      const data = {
        // platformId: this.filters.curPlatformSelected,
        // gameId: this.filters.curGameSelected,
        // zoneId: this.filters.curZoneSelected,
        queryType: this.filters.curQueryType,
        queryValue: this.filters.curQueryValue,
        inspectType: this.filters.curStatusSelected,
        supportType: this.filters.curSupportType,
        // pagination: this.filters.page,
        pagination: {
          pageNo: this.filters.page.pageNo,
          pageSize: this.filters.page.pageSize
        }
      };
      getSupportAccountApplyRecordListApi(data)
        .then(res => {
          if (res.state === "ok") {
            let serverData = res.data;

            this.tableDataVisible = serverData;
            this.filters.page = res.pagination;
          } else {
            this.showErrorMessage(res.message);
          }
          this.isTableDataLoading = false;
        })
        .catch(() => {
          this.isTableDataLoading = false;
          this.showErrorMessage();
        });
    },

    /**
     * 扶持审核 - 允许
     * @param item
     */
    setGrantAgree(item) {
      this.showFullLoading("操作中,请稍候");
      setGrantAgreeApi(item.id)
        .then(res => {
          if (res.state === "ok") {
            this.showSuccessMessage(res.message);
            //更新被操作的数据的状态
            this.getSupportAccountApplyRecordList();
          } else {
            this.showErrorMessage(res.message);
          }
          this.$loading().close();
        })
        .catch(() => {
          this.$loading().close();
          this.showErrorMessage();
        });
    },
    /**
     * 扶持审核 - 拒绝
     * @param item
     */
    setGrantReject(item) {
      this.showFullLoading("操作中,请稍候");
      setGrantRejectApi(item.id)
        .then(res => {
          if (res.state === "ok") {
            this.showSuccessMessage(res.message);
            //更新被操作的数据的状态
            this.getSupportAccountApplyRecordList();
          } else {
            this.showErrorMessage(res.message);
          }
          this.$loading().close();
        })
        .catch(() => {
          this.$loading().close();
          this.showErrorMessage();
        });
    },

    /**
     * 区服变化时回调
     * @param option
     */
    onZoneChange(option) {
      this.filters.curZoneSelected = option;
    },

    /**
     * 扶持类型变化时回调
     * @param supportValue
     */
    onSupportTypeChange(supportValue) {
      // console.log(supportValue);
      this.filters.curSupportType = supportValue;
      this.filters.page.pageNo = 1;
      this.getSupportAccountApplyRecordList();
    },

    /**
     *  状态类型变化时回调
     * @param statusValue
     */
    onStatusChange(statusValue) {
      // console.log(statusValue);
      this.filters.curStatusSelected = statusValue;
      this.filters.page.pageNo = 1;
      this.getSupportAccountApplyRecordList();
    },

    /**
     * 切换分页
     * @param page
     */
    onPageChange(page) {
      this.filters.page.pageNo = page;
      this.getSupportAccountApplyRecordList();
    },

    /**
     * 查询类型变化时回调
     * @param queryTypeValue
     */
    onQueryTypeChange(queryTypeValue) {
      this.filters.curQueryType = queryTypeValue;
    },

    submitFilter() {
      this.filters.page.pageNo = 1;
      this.getSupportAccountApplyRecordList();
    },

    /**
     * 重置条件
     */
    resetFilter() {
      // this.filters.curPlatformSelected = this.filters.platformList[0].value;
      // this.filters.curGameSelected = this.filters.allGamedData.value;
      // this.filters.curZoneSelected = this.filters.allZoneData.value;
      this.filters.page.pageNo = 1;
      this.filters.curQueryType = this.filters.queryTypeList[0].value;
      this.filters.curQueryValue = "";
      this.filters.curStatusSelected = this.filters.statusListAtTab[0].value;
      this.filters.curSupportType = this.filters.supportTypeListAtTab[0].value;

      this.getSupportAccountApplyRecordList();
    },

    linkTo(location, action = "push") {
      this.$router[action](location);
    },
    /**
     * 显示错误提示
     * @param message
     */
    showErrorMessage(message) {
      if (message) {
        this.$message.error(message);
      } else {
        this.$message.error("网络链接失败，请刷新重试");
      }
    },

    /**
     * 显示成功信息
     * @param message
     * @param callback 回调函数
     */
    showSuccessMessage(message, callback) {
      this.$message.success({
        message: message || "操作成功",
        duration: 2000,
        onClose: () => {
          callback();
        }
      });
    },

    /**
     * 显示 全屏loading
     * @param message 提示信息
     * @returns {ElLoadingComponent | *}
     */
    showFullLoading(message) {
      return this.$loading({
        lock: true,
        text: message,
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
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
