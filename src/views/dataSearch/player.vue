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
              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="6">
                <div class="merge">
                  关键词查询：
                  <el-select
                    v-model="filters.queryType"
                    placeholder="请选择"
                    style="width: 150px"
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
                    placeholder="关键词"
                  ></el-input>
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="8" v-if="false">
                <div class="merge">
                  游戏：
                  <el-select
                    v-model="filters2.queryPlatform"
                    placeholder="请选择"
                    style="width: 150px"
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
                    style="width: 150px"
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
                    style="width: 150px"
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
              <el-col :xs="24" :sm="12" :md="12" :lg="10" :xl="8" v-if="false">
                <div class="flex flex-align-center">
                  游戏：
                  <el-select
                    v-model="filters.queryGame"
                    placeholder="请选择"
                    style="width: 150px"
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
                    style="width: 150px"
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
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="8">
                <BoxGame
                  ref="BoxGame"
                  @change="handleGamesChange"
                  :defaultPlatformId="filters.queryPlatformid"
                  :defaultGame="filters.gameId"
                ></BoxGame>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="8">
                <div class="flex flex-align-center">
                  创建时间：
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
              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="8">
                <div class="flex flex-align-center">
                  等级范围：
                  <div class="input-box">
                    <el-input
                      v-model="filters.startGrade"
                      placeholder="最低"
                    ></el-input>
                    <span>至</span>
                    <el-input
                      v-model="filters.endGrade"
                      placeholder="最高"
                    ></el-input>
                  </div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="8">
                <div class="flex flex-align-center">
                  消费金额：
                  <div class="input-box">
                    <el-input
                      v-model="filters.startAmount"
                      placeholder="最低"
                    ></el-input>
                    <span>至</span>
                    <el-input
                      v-model="filters.endAmount"
                      placeholder="最高"
                    ></el-input>
                  </div>
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
        <h3>帐号列表</h3>
        <!-- <div class="extra">
          <el-button size="medium" type="primary" @click="exportDatas">导出</el-button>
        </div>-->
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
          :data="players"
          tooltip-effect="dark"
          style="width: 100%"
          border
          v-loading="loading"
          @sort-change="sortChange"
        >
          <el-table-column
            prop="userid"
            label="账号"
            align="center"
            min-width="80"
          ></el-table-column>
          <el-table-column
            prop="userName"
            label="注册账号"
            align="center"
            min-width="80"
            v-if="isShowName"
          ></el-table-column>
          <!--<el-table-column-->
          <!--label="手机号码"-->
          <!--width="100"-->
          <!--prop="mobile"-->
          <!--align="center"-->
          <!--&gt;-->
          <!--<template slot-scope="scope">{{ scope.row.mobile || '-'}}</template>-->
          <!--</el-table-column>-->
          <el-table-column
            label="所属主渠道 / 子渠道"
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              {{ `${scope.row.scRealName || "-"}` }}
            </template>
          </el-table-column>

          <el-table-column label="设备类型" min-width="80" align="center">
            <template slot-scope="scope">
              {{ `${scope.row.devicetype}` }}
            </template>
          </el-table-column>
          <el-table-column label="游戏" min-width="80" align="center">
            <template slot-scope="scope">{{ `${scope.row.appname}` }}</template>
          </el-table-column>
          <el-table-column
            prop="zonename"
            label="区服名称"
            min-width="80"
            align="center"
          ></el-table-column>
          <el-table-column label="角色信息" min-width="80" align="center">
            <template slot-scope="scope">
              <span style="display: block">{{ scope.row.roleName }}</span>
              <span style="display: block">
                {{ `${scope.row.roleLevel}级 | ${scope.row.roleId}` }}
              </span>
            </template>
          </el-table-column>

          <el-table-column
            prop="identity"
            label="身份"
            min-width="80"
            align="center"
          ></el-table-column>

          <el-table-column
            v-if="isShowGuildConsumeMoney == 1"
            prop="consumetimes"
            label="消费次数"
            align="center"
            min-width="80"
          ></el-table-column>
          <el-table-column
            v-if="isShowGuildConsumeMoney == 1"
            sortable="custom"
            prop="consumetotal"
            label="消费总额（元）"
            min-width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="adddatetime"
            label="角色创建时间"
            min-width="90"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="lastlogouttime"
            label="最后登录时间"
            min-width="90"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="/^1970/.test(scope.row.lastlogouttime)">-</span>
              <span v-else>{{ scope.row.lastlogouttime }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="daysnotlogin"
            label="未登录天数"
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="/^1970/.test(scope.row.lastlogouttime)">-</span>
              <span v-else>{{ scope.row.daysnotlogin }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="daysNotRecharge"
            label="未充值天数"
            min-width="80"
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
import dataCenterService, {
  PLATFORM_ALL,
  GAME_ALL,
  ZONE_ALL
} from "@/service/dataCenterService";
import { getPlayers } from "@/api/dataSearch";
import { getUserGameList, getZonesList } from "@/api/aid";
import BoxGame from "@/components/Games/boxGame";
export default {
  name: "DataSearchPlayer",
  components: {
    Breadcrumb,
    BoxGame
  },
  data() {
    const defaultData = {
      queryKey: 1,

      queryPlatform: PLATFORM_ALL,
      queryGame: GAME_ALL,
      queryZone: ZONE_ALL,

      queryDateValue: 1
    };

    return {
      isShowGuildConsumeMoney: "",
      showStatus: "",
      isShowName: true,
      defaultData,
      filters: {
        isDiscountGame: 0,
        queryPlatformid: "",
        queryGameid: "",
        queryGame: "",
        queryGameList: [],
        queryZone: "",
        queryZoneList: [],

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
            label: "游戏角色",
            value: "6"
          },
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
        orderByComsume: "", //升序降序
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
        ],
        startGrade: null,
        endGrade: null,

        startAmount: null,
        endAmount: null
      },
      // orderByComsume: '',//升序降序
      // 游戏联动
      filters2: {
        queryPlatformTypes: [defaultData.queryPlatform],
        queryPlatform: defaultData.queryPlatform.value,

        queryGameList: [defaultData.queryGame],
        queryGame: defaultData.queryGame.value,

        queryZoneList: [defaultData.queryZone],
        queryZone: defaultData.queryZone.value
      },
      radios: [
        { name: "全部", value: "" },
        { name: "3天未登录", value: 3 },
        { name: "7天未登录", value: 7 },
        { name: "30天未登录", value: 30 }
      ],
      labelFilter: "",

      players: [],
      loading: false,
      page: 1,
      pageCount: 0,
      size: 10,
      total: 0
    };
  },
  created() {
    this.isShowGuildConsumeMoney = JSON.parse(
      window.sessionStorage.getItem("Admin-Account-Union")
    ).isShowGuildConsumeMoney;
    this.filters.queryValue = this.$route.query.userId;
    if (
      this.$route.query.userId &&
      this.$route.query.platformid &&
      this.$route.query.gameId
    ) {
      this.filters.queryValue = this.$route.query.userId;
      this.filters2.queryPlatform = this.$route.query.platformid;
      this.filters2.queryGame = this.$route.query.gameId;
    } else {
      this.getPlayList();
      this.requestGameConditions();
    }
    this.getPlayList();
    this.requestGameConditions();
    // this.getUserGameList();
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
    showName() {
      if (this.showStatus === 0) {
        this.isShowName = false;
      } else {
        this.isShowName = true;
      }
    },
    //升序降序改变
    sortChange: function(column, prop, order) {
      // console.log(column + '-' + column.prop + '-' + column.order)
      if (column.order === "descending") {
        this.filters.orderByComsume = "0";
      } else if (column.order === "ascending") {
        this.filters.orderByComsume = "1";
      } else {
        this.filters.orderByComsume = "";
      }
      // console.log(this.orderByComsume)
      this.getPlayList();
    },
    // addClass(row,rowIndex,columnIndex){
    //   console.log(row,rowIndex,columnIndex)
    //     if(rowIndex === '0' && columnIndex === '8'){
    //       console.log(1111)
    //     }
    // },

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
    async getPlayList() {
      const startGrade = this.filters.startGrade
        ? Number(this.filters.startGrade)
        : "";
      const endGrade = this.filters.endGrade
        ? Number(this.filters.endGrade)
        : "";
      const startAmount = this.filters.startAmount
        ? Number(this.filters.startAmount)
        : "";
      const endAmount = this.filters.endAmount
        ? Number(this.filters.endAmount)
        : "";
      const platformId =
        this.filters2.queryPlatform == PLATFORM_ALL.value
          ? ""
          : this.filters2.queryPlatform;
      const gameId =
        this.filters2.queryGame == GAME_ALL.value
          ? ""
          : this.filters2.queryGame;
      const zoneId =
        this.filters2.queryZone == ZONE_ALL.value
          ? ""
          : this.filters2.queryZone;

      console.log("-------------------------");
      console.log("page: ", this.page);
      console.log("filters.queryType: ", this.filters.queryType);
      console.log("filters.queryValue: ", this.filters.queryValue);
      console.log("filters.date: ", this.filters.date);
      console.log("filters.startGrade: ", startGrade);
      console.log("filters.endGrade: ", endGrade);
      console.log("labelFilter: ", this.labelFilter);
      console.log("platformId: ", platformId);
      console.log("gameId: ", platformId);
      console.log("zoneId: ", zoneId);

      if (isNaN(startGrade) || isNaN(endGrade)) {
        this.$message.error("等级范围必须是数字");
        return;
      }

      if (isNaN(startAmount) || isNaN(endAmount)) {
        this.$message.error("充值金额必须是数字");
        return;
      }

      let startTime = "";
      let endTime = "";
      if (this.filters.date && this.filters.date.length > 1) {
        startTime = this.filters.date[0];
        endTime = this.filters.date[1];
      }

      const query = {
        pageNo: this.page,
        pageSize: this.size,
        queryType: this.filters.queryType,
        queryValue:
          this.filters.queryValue === undefined ? "" : this.filters.queryValue,
        startDate: startTime,
        endDate: endTime,
        minLevel: startGrade, // 最小等级
        maxLevel: endGrade, // 最高等级
        minComsume: startAmount, // 最小充值金额
        maxComsume: endAmount, // 最高充值金额
        notLoginDay: this.labelFilter, // 未登录时间
        // platformId, // 平台 ID
        // gameId, // 游戏 ID
        // zoneId, // 区服 ID
        platformId: this.filters.queryPlatformid,
        gameId: this.filters.queryGameid,

        zoneId: this.filters.queryZone,
        orderByComsume: this.filters.orderByComsume, //1-升序 0-降序  不传默认排序
        isDiscountGame: this.filters.isDiscountGame
      };

      if (this.loading) {
        return;
      }

      this.loading = true;

      try {
        const result = await getPlayers(query);
        this.loading = false;
        console.log("result---------", result);
        if (result.state === "fail") {
          this.$message.error(result.message || "查询时间跨度不应大于一个月");
        } else if (result.state === "ok") {
          const { data, pagination } = result;
          this.players = data;
          this.pageCount = Math.ceil(pagination.count / pagination.pageSize);
          this.total = pagination.count;
          this.showStatus = result.showStatus;
          this.showName();
        }
      } catch (err) {
        this.loading = false;
        this.$message.error("暂无数据加载");
      }
    },
    // 提交筛选查询
    submitFilter() {
      this.page = 1;
      this.getPlayList();
    },
    // 查询类型 select change
    handleQueryTypeChange(option) {
      this.filters.queryType = option;
    },
    // 日期选择
    handleDatepicker(date) {
      console.log(date);
      if (!date) {
        this.filters.date = "";
        return;
      }
      this.filters.date = [...date];
    },
    // 切换分页
    handleCurrentChange(page) {
      this.page = page;
      this.getPlayList();
    },
    // 重置
    resetFilter() {
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
      this.filters.startGrade = null;
      this.filters.endGrade = null;
      this.filters.startAmount = null;
      this.filters.endAmount = null;
      this.page = 1;
      this.filters2.queryPlatform = "";
      this.filters2.queryGame = "";
      // this.filters.orderByComsume = '';

      this.filters.queryGame = "";
      this.filters.queryZone = "";
      this.filters.queryZoneList = [];
      this.filters.queryPlatformid = "";
      this.filters.queryGameid = "";
      //专服/折扣
      this.$refs.BoxGame.handleChangePlatform("0");
      this.$refs.BoxGame.handleChangeGame("");
      this.getPlayList();
      // this.addClass();
    },
    // 切换 radio 筛选条件
    radioChange(tag) {
      (this.page = 1),
        (this.pageCount = 0),
        (this.size = 10),
        (this.labelFilter = tag);
      this.getPlayList();
    },
    // 导出数据
    exportDatas() {
      const url = "http://www.91vv.com/export.zip";

      const oA = document.createElement("a");
      oA.href = url;
      oA.target = "_blank";
      oA.click();
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

<style lang="scss">
.input-box {
  display: flex;
  align-items: center;

  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 5px;

  input::-ms-input-placeholder {
    text-align: center;
  }
  input::-webkit-input-placeholder {
    text-align: center;
  }

  .el-input {
    position: relative;
    top: -1px;
    width: auto;

    input {
      text-align: center;
    }
  }

  > span,
  > div {
    flex: 1;
    width: auto;
  }

  > span {
    padding: 0 15px;
  }

  .el-input__inner {
    border: none !important;
    padding: 0 !important;
    height: 38px !important;
    line-height: 38px !important;
  }
}
</style>
