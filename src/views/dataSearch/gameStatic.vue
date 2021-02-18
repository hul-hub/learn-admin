<template>
  <div class="page-data-search-recharge">
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
              <el-col :xs="24" :sm="24" :md="24" :lg="10" :xl="6">
                <div class="merge">
                  搜索条件：
                  <el-select
                    v-model="filters.queryType"
                    placeholder="请选择"
                    style="width: 150px"
                  >
                    <el-option
                      v-for="item in filters.queryKeyTypes"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                  <el-input
                    @keyup.enter.native="submitFilter"
                    v-model="filters.queryValue"
                    placeholder="输入查询关键词"
                  />
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="7">
                <div class="flex flex-align-center">
                  时间：
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
                >
                </BoxGame>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="3">
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
        <h3>游戏分区数据汇总</h3>
      </div>
      <div class="body">
        <el-table
          :data="recharges"
          tooltip-effect="dark"
          style="width: 100%"
          border
          v-loading="loading"
        >
          <el-table-column label="游戏名称" prop="gameName" align="center">
            <!-- <template slot-scope="scope">
              <span v-if="scope.row.zoneName !== '汇总'">{{ scope.row.gameName || '-' }}</span>
            </template> -->
          </el-table-column>
          <el-table-column
            prop="zoneName"
            label="区服名称"
            align="center"
          ></el-table-column>
          <el-table-column prop="dayNewRoleNum" label="创角数" align="center">
          </el-table-column>
          <el-table-column
            v-if="isShowGuildConsumeMoney == 1"
            prop="dayConsumeMoneyTotal"
            label="消费金额(元)"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.dayConsumeMoneyTotal / 100 || 0
            }}</template>
          </el-table-column>
        </el-table>
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
import { getList } from "@/api/dataSearch";
import { getUserGameList, getZonesList } from "@/api/aid";
import BoxGame from "@/components/Games/boxGame";
export default {
  name: "DataSearchRecharge",
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
      defaultData,
      filters: {
        isDiscountGame: 0,
        queryPlatformid: "",
        queryGameid: "",
        queryGame: "",
        queryGameList: [],
        queryZone: "",
        queryZoneList: [],
        queryValue: "",
        queryType: 2,
        queryKeyTypes: [
          { id: 2, name: "主渠道名称" },
          { id: 3, name: "子渠道账号" }
        ],
        date: [
          moment(new Date(new Date().getTime() - 3 * 24 * 3600 * 1000)).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
        ]
      },
      // 游戏联动
      filters2: {
        queryPlatformTypes: [defaultData.queryPlatform],
        queryPlatform: defaultData.queryPlatform.value,

        queryGameList: [defaultData.queryGame],
        queryGame: defaultData.queryGame.value,

        queryZoneList: [defaultData.queryZone],
        queryZone: defaultData.queryZone.value
      },

      labelFilter: "3",

      recharges: [],
      loading: false
    };
  },
  created() {
    this.isShowGuildConsumeMoney = JSON.parse(
      window.sessionStorage.getItem("Admin-Account-Union")
    ).isShowGuildConsumeMoney;
    this.getDataList();
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
    //没有去除平台的
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
    async getDataList() {
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
      console.log("filters.date: ", this.filters.date);
      console.log("filters.labelFilter: ", this.labelFilter);
      console.log("platformId: ", platformId);
      console.log("gameId: ", platformId);
      console.log("zoneId: ", zoneId);

      const query = {
        startDate: this.filters.date[0] ? this.filters.date[0] : "",
        endDate: this.filters.date[1] ? this.filters.date[1] : "",
        // platformId, // 平台 ID
        // gameId, // 游戏 ID
        // zoneId, // 区服 ID
        platformId: this.filters.queryPlatformid,
        gameId: this.filters.queryGameid,
        zoneId: this.filters.queryZone,
        queryType: this.filters.queryType,
        queryValue: this.filters.queryValue,
        isDiscountGame: this.filters.isDiscountGame
      };
      console.log(query);
      let res;
      if (this.loading) {
        return;
      }

      this.loading = true;
      try {
        res = await getList(query);
        this.loading = false;
      } catch (error) {
        console.log(error);
        this.$message.error("网络链接失败，请刷新重试");
        this.loading = false;
        return;
      }

      if (res.state === "fail") {
        this.$message.error(res.message);
        return;
      } else if (res.state === "ok") {
        if (
          !res.data.dataList ||
          (res.data.dataList && res.data.dataList.length === 0)
        ) {
          this.recharges = [];
          return;
        }

        let totalData = {
          dayConsumeMoneyTotal: 0,
          gameName: "",
          zoneName: "",
          dayNewRoleNum: 0,
          zoneName: "总计"
        };
        for (let i = 0; i < res.data.dataList.length; ++i) {
          const vo = res.data.dataList[i];
          totalData.dayConsumeMoneyTotal += vo.dayConsumeMoneyTotal;
          totalData.dayNewRoleNum += vo.dayNewRoleNum;
        }

        res.data.dataList.push(totalData);
        this.recharges = res.data.dataList;
      }
    },
    // 提交筛选查询
    submitFilter() {
      console.log("获取列表数据");
      this.getDataList();
    },
    // 日期选择
    handleDatepicker(date) {
      if (!date) {
        this.filters.date = "";
        return;
      }
      this.filters.date = [...date];
    },
    // 重置
    resetFilter() {
      this.filters.date = [];
      this.filters2.queryPlatform = "";
      this.filters2.queryGame = "";
      this.filters2.queryZone = "";
      this.filters.queryValue = "";
      this.filters.queryType = 2;

      this.filters.queryGame = "";
      this.filters.queryZone = "";
      this.filters.queryZoneList = [];
      this.filters.queryPlatformid = "";
      this.filters.queryGameid = "";
      //专服/折扣
      this.$refs.BoxGame.handleChangePlatform("0");
      this.$refs.BoxGame.handleChangeGame("");
      this.getDataList();
    }
  }
};
</script>

<style lang="scss">
.page-data-search-recharge {
  .el-date-editor .el-range-separator {
    width: 8%;
  }

  .action-button {
    color: #007fff;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }

    &.disabled {
      color: #999;
      opacity: 0.8;
      cursor: default;
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

  .multiline {
    line-height: 1.2;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
}
</style>
