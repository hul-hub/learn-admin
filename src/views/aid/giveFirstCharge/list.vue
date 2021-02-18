<!-- 扶持统计-->
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
            <el-col :xs="24" :sm="24" :md="10" :lg="12" :xl="12">
              <div class="merge">
                <p>关键字查询：</p>
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
                  @keyup.enter.native="searchFilter"
                  v-model="filters.curQueryValue"
                  placeholder="请输入关键词"
                ></el-input>
              </div>
            </el-col>

            <!--<el-col :xs="24" :sm="24" :md="14" :lg="12" :xl="12">-->
            <!--<div class="flex flex-align-center">-->
            <!--<p>游戏：</p>-->
            <!--<games @change="handleChangeGames"></games>-->
            <!--</div>-->
            <!--</el-col>-->
            <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="10" v-if="false">
              <div class="flex flex-align-center">
                <p>游戏：</p>
                <el-select
                  v-model="filters2.queryPlatform"
                  placeholder="请选择"
                  style="width: 150px;"
                  @change="handleQueryPlatformChange"
                >
                  <el-option
                    v-for="item in filters2.queryPlatformTypes"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  />
                </el-select>

                <el-select
                  v-model="filters2.queryGame"
                  placeholder="请选择"
                  style="width: 150px;"
                  @change="handleQueryGameChange"
                >
                  <el-option
                    v-for="item in filters2.queryGameList"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  />
                </el-select>

                <el-select
                  v-model="filters2.queryZone"
                  placeholder="请选择"
                  style="width: 150px;"
                  @change="handleQueryZoneChange"
                >
                  <el-option
                    v-for="item in filters2.queryZoneList"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </el-col>
            <!-- 去除平台后的 -->
            <el-col :xs="24" :sm="12" :md="12" :lg="10" :xl="10" v-if="false">
              <div class="flex flex-align-center">
                <p>游戏：</p>
                <el-select
                  v-model="filters.queryGame"
                  placeholder="请选择"
                  style="width: 150px;"
                  @change="handleQueryGameChangenew"
                  filterable
                >
                  <el-option
                    v-for="item in filters.queryGameList"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  />
                </el-select>

                <el-select
                  v-model="filters.queryZone"
                  placeholder="请选择"
                  style="width: 150px;"
                  filterable
                >
                  <el-option
                    v-for="item in filters.queryZoneList"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </el-col>
            <!-- 返利盒子的 -->
            <el-col :xs="24" :sm="12" :md="12" :lg="10" :xl="10">
              <BoxGame
                ref="BoxGame"
                @change="handleGamesChange"
                :defaultPlatformId="filters.queryPlatformid"
                :defaultGame="filters.gameId"
              >
              </BoxGame>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="14">
              <div class="flex flex-align-center">
                <p>统计时间：</p>
                <el-date-picker
                  v-model="filters.date"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :default-time="['00:00:00', '23:59:59']"
                  @change="onDateChange"
                ></el-date-picker>
              </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="10" :lg="6" :xl="6">
              <el-button @click="searchFilter" type="primary">查询</el-button>
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
        <el-button
          @click="linkTo('/giveFirstCharge/give')"
          size="medium"
          type="primary"
          class="exports"
          >赠送首充
        </el-button>
      </div>
      <div class="body">
        <div class="filter-data">
          <!--扶持类型Tab-->
          <el-radio-group
            size="small"
            v-model="filters.curSupportType"
            @change="onSupportTypeChange"
            v-show="false"
          >
            <el-radio-button
              v-for="item in this.filters.supportTypeListAtTab"
              :key="item.value"
              :label="item.value"
            >
              {{ item.name }}
            </el-radio-button>
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
            prop="userid"
            label="账号"
            align="center"
          ></el-table-column>
          <el-table-column prop="gamename" label="游戏名称" align="center">
            <!--<template slot-scope="scope">-->
            <!--{{scope.row.platformId}} - {{scope.row.gameName}}级-->
            <!--</template>-->
          </el-table-column>
          <el-table-column
            label="所属平台"
            prop="platformid"
            align="center"
            v-if="false"
          >
          </el-table-column>
          <el-table-column label="区服名称" prop="zonename" align="center">
          </el-table-column>
          <el-table-column prop="roleInfo" label="角色信息" align="center">
            <template slot-scope="scope">
              {{ scope.row.rolename }}
            </template>
          </el-table-column>

          <el-table-column prop="statusName" label="赠送状态" align="center">
            <template slot-scope="scope">
              {{ scope.row.statusName || scope.row.status ? "成功" : "失败" }}
            </template>
          </el-table-column>

          <el-table-column prop="siveusername" label="操作人" align="center">
          </el-table-column>
          <el-table-column prop="adddatetime" label="赠送时间" align="center">
            <template slot-scope="scope">
              {{ new Date(scope.row.adddatetime).format("yyyy-MM-dd hh:mm") }}
            </template>
          </el-table-column>

          <el-table-column
            prop="note"
            label="备注"
            align="center"
          ></el-table-column>

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
import Breadcrumb from "@/components/Breadcrumb";
import Games from "@/components/Games";
import {
  getSupportGrantListApi,
  getPlatformListApi,
  getPlatformGameListApi,
  getPlatformGameZoneListApi,
  setGrantAgreeApi,
  setGrantRejectApi,
  getFirstRechargeListApi
} from "@/api/gameSupport";
import dataCenterService, {
  PLATFORM_ALL,
  GAME_ALL,
  ZONE_ALL
} from "@/service/dataCenterService";
import { getUserGameList, getZonesList } from "@/api/aid";
import BoxGame from "@/components/Games/boxGame";
export default {
  name: "GameSupportIndex",
  components: {
    Breadcrumb,
    Games,
    BoxGame
  },
  data() {
    const defaultData = {
      queryPlatform: PLATFORM_ALL,
      queryGame: GAME_ALL,
      queryZone: ZONE_ALL
    };

    return {
      defaultData,
      filters: {
        isDiscountGame: 0,
        queryPlatformid: "",
        queryGameid: "",
        queryGame: "",
        queryGameList: [],
        queryZone: "",
        queryZoneList: [],
        /*========================关键字查询=====================*/
        /* 关键字 */
        curQueryValue: "",
        /* 当前查询类型 */
        curQueryType: "",
        /* 查询类型列表 */
        queryTypeList: [
          //1-账号 2-游戏角色名称
          {
            label: "不限",
            value: ""
          },
          {
            label: "账号",
            value: "1"
          },
          {
            label: "游戏角色名称",
            value: "2"
          }
        ],
        /*==================================平台列表=========================*/
        curPlatformSelected: "",
        curGameSelected: "",
        curZoneSelected: "",
        /*===========================扶持类型==================================*/
        /* 多选Tab 扶持类型 */
        curSupportType: "",
        supportTypeListAtTab: [
          { name: "全部资源", value: "" },
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
          { name: "全部", value: "" },
          { name: "赠送成功", value: 1 },
          { name: "赠送失败", value: 0 }
        ],
        STATUS_WAIT_GRANT: 0,
        statusList: [
          //赠送状态1-成功 0-失败
          { name: "成功", value: 1 },
          { name: "失败", value: 0 }
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
        },

        /*==============================日期=====================*/
        date: []
      },

      filters2: {
        queryPlatformTypes: [defaultData.queryPlatform],
        queryPlatform: defaultData.queryPlatform.value,

        queryGameList: [defaultData.queryGame],
        queryGame: defaultData.queryGame.value,

        queryZoneList: [defaultData.queryZone],
        queryZone: defaultData.queryZone.value
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
  mounted() {
    this.getFirstRechargeList();
  },
  created() {
    this.requestGameConditions();
    // this.getUserGameList();

    //为Date原型添加格式化方法
    Date.prototype.format = function(fmt) {
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
        }
      }
      return fmt;
    };
  },
  methods: {
    handleGamesChange(data) {
      this.filters.platformType = data.platformType;
      if (this.filters.platformType == "0") {
        this.filters.isDiscountGame = 0;
      } else {
        this.filters.isDiscountGame = 1;
      }
      this.filters.queryPlatformid = data.platformId;
      this.filters.queryGameid = data.gameId;
      this.filters.queryZone = data.zoomId;
    },
    //去除平台后的游戏区服列表
    async getUserGameList() {
      try {
        const res = await getUserGameList();
        if (res.state === "ok") {
          const arr = [];
          res.data.forEach(function(val, idx) {
            arr.push({
              value: val.platformId + "," + val.gameId,
              text: val.gameName
            });
          });
          this.filters.queryGameList = arr;
        }
      } catch (error) {
        console.error(error);
        return;
      }
    },
    handleQueryGameChangenew(option) {
      const arrPlat = option.split(",");
      this.filters.queryPlatformid = arrPlat[0];
      this.filters.queryGameid = arrPlat[1];
      this.filters.queryZone = "";
      this.getZonesList();
    },
    async getZonesList() {
      try {
        const data = {
          gameId: this.filters.queryGameid,
          platformId: this.filters.queryPlatformid
        };
        const res = await getZonesList(data);
        if (res.state === "ok") {
          this.filters.queryZoneList = res.data;
        }
      } catch (error) {
        console.error(error);
        return;
      }
    },
    getGameConditions() {
      dataCenterService.getGameConditions(
        this.filters2.queryPlatform,
        this.filters2.queryGame,
        (platformList, gameList, zoneList) => {
          this.filters2.queryPlatformTypes = platformList;
          this.filters2.queryGameList = gameList;
          this.filters2.queryZoneList = zoneList;
        },
        null
      );
    },
    requestGameConditions() {
      dataCenterService.getGameConditions(
        this.filters2.queryPlatform,
        this.filters2.queryGame,
        (platformList, gameList, zoneList) => {
          this.filters2.queryPlatformTypes = platformList;
          this.filters2.queryGameList = gameList;
          this.filters2.queryZoneList = zoneList;
        },
        () => {
          this.getGameConditions();
        }
      );
    },
    handleQueryPlatformChange(option) {
      this.filters2.queryGame = this.defaultData.queryGame.value;
      this.requestGameConditions();
    },
    handleQueryGameChange(option) {
      this.filters2.queryZone = this.defaultData.queryZone.value;
      this.requestGameConditions();
    },
    handleQueryZoneChange(option) {},

    /**
     * 获取首充列表
     */
    getFirstRechargeList() {
      if (this.isTableDataLoading) {
        return;
      }

      let startTime;
      let endTime;
      if (this.filters.date && this.filters.date.length > 1) {
        startTime = this.filters.date[0];
        endTime = this.filters.date[1];
      } else {
        startTime = "";
        endTime = "";
      }
      this.isTableDataLoading = true;
      const data = {
        // platformId:
        //   this.filters2.queryPlatform == PLATFORM_ALL.value
        //     ? ""
        //     : this.filters2.queryPlatform,
        // gameId:
        //   this.filters2.queryGame == GAME_ALL.value
        //     ? ""
        //     : this.filters2.queryGame,
        // zoneId:
        //   this.filters2.queryZone == ZONE_ALL.value
        //     ? ""
        //     : this.filters2.queryZone,

        platformId: this.filters.queryPlatformid,
        gameId: this.filters.queryGameid,
        zoneId: this.filters.queryZone,

        queryType: this.filters.curQueryType,
        queryValue: this.filters.curQueryValue,
        status: this.filters.curStatusSelected,
        startTime: startTime,
        endTime: endTime,
        // supportType: this.filters.curSupportType,
        // pagination: this.filters.page,
        pageNo: this.filters.page.pageNo,
        pageSize: this.filters.page.pageSize,
        isDiscountGame: this.filters.isDiscountGame
      };
      getFirstRechargeListApi(data)
        .then(res => {
          if (res.state === "ok") {
            let serverData = res.data;
            for (let i = 0; i < serverData.length; i++) {
              //添加状态名字段
              let statusName;
              let status = this.filters.statusList.filter(status => {
                return status.value === serverData[i].status;
              });
              if (status.length > 0) {
                statusName = status[0].name;
              } else {
                statusName = serverData[i].status;
              }
              serverData[i].statusName = statusName;
            }
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
            this.getFirstRechargeList();
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
            this.getFirstRechargeList();
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

    // handleChangeGames(res) {
    //   this.filters.curPlatformSelected = res.platformId;
    //   this.filters.curGameSelected = res.gameId;
    //   this.filters.curZoneSelected = res.zoomId;
    // },

    /**
     * 日期变化时 回调
     * @param dateValue
     */
    onDateChange(dateValue) {
      // console.log(dateValue);  ["2018-06-14 12:00:00", "2018-06-29 12:00:00"]
      if (dateValue) {
        this.filters.date = dateValue;
      } else {
        this.filters.date = [];
      }
    },

    /**
     * 扶持类型变化时回调
     * @param supportValue
     */
    onSupportTypeChange(supportValue) {
      // console.log(supportValue);
      this.filters.curSupportType = supportValue;
      this.getFirstRechargeList();
    },

    /**
     *  状态类型变化时回调
     * @param statusValue
     */
    onStatusChange(statusValue) {
      // console.log(statusValue);
      this.filters.curStatusSelected = statusValue;
      this.getFirstRechargeList();
    },

    /**
     * 切换分页
     * @param page
     */
    onPageChange(page) {
      this.filters.page.pageNo = page;
      this.getFirstRechargeList();
    },

    /**
     * 查询类型变化时回调
     * @param queryTypeValue
     */
    onQueryTypeChange(queryTypeValue) {
      this.filters.curQueryType = queryTypeValue;
    },

    searchFilter() {
      this.filters.page.pageNo = 1;
      this.getFirstRechargeList();
    },

    /**
     * 重置条件
     */
    resetFilter() {
      // this.filters.curPlatformSelected = this.filters.platformList[0].value; //TODO 越界问题
      // this.filters.curGameSelected = this.filters.allGamedData.value;
      // this.filters.curZoneSelected = this.filters.allZoneData.value;
      // this.filters.page = this.filters.defaultPage;
      // this.filters.curQueryType = this.filters.queryTypeList[0].value;
      // this.filters.curQueryValue = '';
      // this.filters.curStatusSelected = this.filters.statusListAtTab[0].value;
      // this.filters.date = [];

      // this.filters.curSupportType = this.filters.supportTypeListAtTab[0].value;

      this.filters2.queryPlatform = this.defaultData.queryPlatform.value;
      this.filters2.queryGame = this.defaultData.queryGame.value;
      this.filters2.queryZone = this.defaultData.queryZone.value;
      this.filters.curQueryValue = "";
      this.filters.curQueryType = "";
      this.filters.curSupportType = "";
      this.filters.curStatusSelected = "";
      this.filters.page = this.filters.defaultPage;
      this.filters.date = [];

      this.filters.queryGame = "";
      this.filters.queryZone = "";
      this.filters.queryZoneList = [];
      this.filters.queryPlatformid = "";
      this.filters.queryGameid = "";
      //专服/折扣
      this.$refs.BoxGame.handleChangePlatform("0");
      this.$refs.BoxGame.handleChangeGame("");
      this.getFirstRechargeList();
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
