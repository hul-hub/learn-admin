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
              <el-col :xs="24" :sm="24" :md="24" :lg="10" :xl="8">
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
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <div class="flex flex-align-center">
                  <!--注册时间：-->
                  <el-select
                    v-model="filters.queryRoleType"
                    placeholder="请选择"
                    style="width: 150px;"
                    @change="handleQueryRoleTypeChange"
                  >
                    <el-option
                      v-for="item in filters.queryRoleTypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <el-date-picker
                    v-model="filters.date"
                    type="daterange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="handleDatepicker"
                    :clearable="false"
                  ></el-date-picker>
                </div>
              </el-col>

              <!--<el-col :xs="24" :sm="24" :md="24" :lg="10" :xl="4">-->
              <!--<div class="merge">-->
              <!--游戏：-->
              <!--<el-select-->
              <!--v-model="filters.queryGameType"-->
              <!--placeholder="请选择游戏"-->
              <!--style="width: 150px;"-->
              <!--@change="handleQueryGameTypeChange"-->
              <!--&gt;-->
              <!--<el-option-->
              <!--v-for="(key, value) in filters.queryGameTypes"-->
              <!--:key="key"-->
              <!--:label="key"-->
              <!--:value="value"-->
              <!--&gt;-->
              <!--</el-option>-->
              <!--</el-select>-->
              <!--</div>-->
              <!--</el-col>-->
              <el-col :xs="24" :sm="12" :md="12" :lg="5" :xl="5" v-if="false">
                <div class="merge">
                  <p>游戏：</p>
                  <!--平台选择-->
                  <el-select
                    v-model="filters.curPlatformSelected"
                    :placeholderx="
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
                    ></el-option>
                  </el-select>
                  <!--游戏选择-->
                  <el-select
                    v-model="filters.curGameSelected"
                    :loadingx="filters.isLoadingGameList"
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
                    ></el-option>
                  </el-select>
                </div>
              </el-col>
              <!-- 去除平台后的 -->
              <el-col :xs="24" :sm="12" :md="12" :lg="10" :xl="5" v-if="false">
                <div class="flex flex-align-center">
                  游戏：
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
                </div>
              </el-col>
              <!-- 返利盒子的 -->
              <el-col :xs="24" :sm="12" :md="12" :lg="10" :xl="10">
                <BoxGame
                  ref="BoxGame"
                  @change="handleGamesChange"
                  :defaultPlatformId="filters.queryPlatformid"
                  :defaultGame="filters.gameId"
                  :hasZoom="false"
                ></BoxGame>
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
            prop="userName"
            label="注册账号"
            align="center"
            width="120"
            v-if="isShowName"
          ></el-table-column>

          <el-table-column
            prop="addDateTime"
            label="账号注册时间"
            width="200"
            align="center"
          ></el-table-column>
          <!--<el-table-column-->
          <!--label="游戏"-->
          <!--width="200"-->
          <!--align="center"-->
          <!--&gt;-->
          <!--<template slot-scope="scope">{{ scope.row.gamePlayInfo.gameName || '-'}}</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
          <!--label="所属主渠道"-->
          <!--align="center"-->
          <!--&gt;-->
          <!--<template slot-scope="scope">ID:{{ scope.row.gamePlayInfo.mcId || '-'}} <br>-->
          <!--名称:{{scope.row.gamePlayInfo.mcIdName || '-'}}<br>-->
          <!--账号:{{ scope.row.gamePlayInfo.mcIdAccount || '-'}}-->
          <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
          <!--label="所属子渠道"-->
          <!--align="center"-->
          <!--&gt;-->
          <!--<template slot-scope="scope">ID:{{ scope.row.gamePlayInfo.scId || '-'}} <br>-->
          <!--名称:{{scope.row.gamePlayInfo.scIdName || '-'}}<br>-->
          <!--账号:{{ scope.row.gamePlayInfo.scIdAccount || '-'}}-->
          <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
          <!--label="游戏角色创建时间"-->
          <!--width="200"-->
          <!--align="center"-->
          <!--&gt;-->
          <!--<template slot-scope="scope">{{ scope.row.gamePlayInfo.createDateTime || '-'}}</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
          <!--label="操作"-->
          <!--width="120"-->
          <!--align="center"-->
          <!--&gt;-->
          <!--<template slot-scope="scope">-->
          <!--&lt;!&ndash; <span class="action-button" @click="getShortLink(scope.row.downloadLink)">[查看游戏角色]</span> &ndash;&gt;-->
          <!--<router-link class="action-button" :to="{path: `/dataSearch/player?userId=${scope.row.userId}&platformid=${scope.row.gamePlayInfo.platformid}&gameId=${scope.row.gamePlayInfo.gameId}`}">-->
          <!--[查看游戏角色]-->
          <!--</router-link>-->
          <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column label="游戏" prop="game" align="center">
            <template slot-scope="scope">
              <div class="line" v-for="v in scope.row.gamePlayInfo">
                <div v-if="v.platformid">
                  <br />
                </div>
                <div v-if="v.gameName">
                  {{ v.gameName }}
                  <br />
                </div>
                <div v-if="!v.gameName">
                  -
                  <br />
                </div>
                <div style="visibility: hidden">1</div>
              </div>
              <div v-if="scope.row.gamePlayInfo.length === 0">
                -
                <br />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="所属主渠道" prop="mc" align="center">
            <template slot-scope="scope">
              <div class="line" v-for="v in scope.row.gamePlayInfo">
                <div v-if="v.mcId">
                  ID：{{ v.mcId }}
                  <br />
                </div>
                <div v-if="v.mcIdName">
                  名称：{{ v.mcIdName }}
                  <br />
                </div>
                <div v-if="!v.mcIdName">
                  名称：-
                  <br />
                </div>
                <div v-if="v.mcIdAccount">账号：{{ v.mcIdAccount }}</div>
                <div v-if="!v.mcId && !v.mcIdName && !v.mcIdAccount">-</div>
              </div>
              <div v-if="scope.row.gamePlayInfo.length === 0">
                -
                <br />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="所属子渠道" prop="sc" align="center">
            <template slot-scope="scope">
              <div class="line" v-for="v in scope.row.gamePlayInfo">
                <div v-if="v.scId">
                  ID：{{ v.scId }}
                  <br />
                </div>
                <div v-if="v.scIdName">
                  名称：{{ v.scIdName }}
                  <br />
                </div>
                <div v-if="!v.scIdName">
                  名称：-
                  <br />
                </div>
                <div v-if="v.scIdAccount">账号：{{ v.scIdAccount }}</div>
                <div v-if="!v.scId && !v.scIdName && !v.scIdAccount">-</div>
              </div>
              <div v-if="scope.row.gamePlayInfo.length === 0">
                -
                <br />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="游戏角色创建时间"
            prop="gameCreatTime"
            align="center"
          >
            <template slot-scope="scope">
              <div class="line" v-for="v in scope.row.gamePlayInfo">
                <div style="visibility: hidden">1</div>
                <div v-if="v.createDateTime">{{ v.createDateTime }}</div>
                <div v-if="scope.row.gamePlayInfo.length === 0">-</div>
                <div style="visibility: hidden">1</div>
              </div>
              <div v-if="scope.row.gamePlayInfo.length === 0">
                -
                <br />
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <div class="line" v-for="(v, key) in scope.row.gamePlayInfo">
                <div style="visibility: hidden">1</div>
                <router-link
                  class="action-button"
                  :to="{
                    path: `/dataSearch/player?userId=${
                      scope.row.userId
                    }&platformid=${
                      scope.row.gamePlayInfo[key].platformid
                    }&gameId=${scope.row.gamePlayInfo[key].gameId}`
                  }"
                  >[查看游戏角色]</router-link
                >
                <div style="visibility: hidden">1</div>
              </div>
              <div v-if="scope.row.gamePlayInfo.length === 0">-</div>
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
import { getRegisters, getMyGameList, registerExport } from "@/api/dataSearch";
import { mapState } from "vuex";

import { getPlatformListApi, getPlatformGameListApi } from "@/api/dataSearch";
import { getUserGameList } from "@/api/aid";
import BoxGame from "@/components/Games/boxGame";

const defaults = {
  platformList: [{ value: "", text: "全部平台" }],
  gameList: [{ value: "", text: "全部游戏" }],
  queryKey: 2,
  queryValue: ""
};

export default {
  name: "DataSearchRegister",
  components: {
    Breadcrumb,
    BoxGame
  },
  data() {
    return {
      showStatus: "",
      isShowName: true,
      filters: {
        isDiscountGame: 0,
        queryPlatformid: "",
        queryGameid: "",
        queryGame: "",
        queryGameList: [],

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
            label: "主渠道备注",
            value: "1"
          },
          {
            label: "子渠道账号",
            value: "3"
          },
          {
            label: "子渠道备注",
            value: "14"
          }
        ],
        queryValue: "",

        queryRoleType: 1,
        queryRoleTypes: [
          {
            label: "角色创建时间",
            value: 1
          }
        ],

        queryGameType: "",
        queryGameTypes: [],

        date: [],

        /*==================================平台列表=========================*/
        isLoadingPlatformList: false,
        /*查询平台*/
        curPlatformSelected: "",
        platformList: defaults.platformList,

        /*==================================游戏列表=========================*/
        isLoadingGameList: false,
        curGameSelected: "",
        /*当前平台游戏列表*/
        curPlatformGameList: defaults.gameList,
        allGamedData: { value: "", text: "全部游戏" },
        /*游戏数据缓存*/
        mapGameDataCache: new Map() // platform.value : [platform.game...]
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
  computed: mapState({
    account: state => state.user.account
  }),
  created() {
    setTimeout(() => {
      this.getRegisterList();
    }, 300);

    // this.getMyGameList();

    this.getPlatformList();
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
      // this.filters.queryZone = '';
      // this.getZonesList();
    },
    showName() {
      if (this.showStatus === 0) {
        this.isShowName = false;
      } else {
        this.isShowName = true;
      }
    },
    getPlatformList() {
      this.filters.isLoadingPlatformList = true;
      getPlatformListApi()
        .then(res => {
          console.log(res);
          if (res.state === "ok") {
            let serverData = res.data;
            //添加"全部平台"选项在第一项
            serverData.unshift(this.filters.allPlatformData);
            this.filters.platformList = serverData;
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
     * 获取平台列表
     */
    getPlatformList() {
      this.filters.isLoadingPlatformList = true;
      getPlatformListApi()
        .then(res => {
          console.log(res);
          if (res.state === "ok") {
            this.filters.platformList = defaults.platformList.concat(res.data);
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
        //默认选中第一项
        if (gameData.length > 0) {
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
    },

    getMyGameList() {
      const query = {
        userId: this.account.userId,
        loginName: this.account.loginName,
        realName: this.account.realName,
        userType: this.account.userType,
        roleGroupIds: this.account.roleGroupIds,
        isGuildBoss: this.account.isGuildBoss,
        isSupport: this.account.isSupport,
        // depId: this.account.depId,
        bsystemId: this.account.bsystemId,
        hadSubPwd: this.account.hadSubPwd
      };
      getMyGameList(query)
        .then(res => {
          if (res.state === "ok") {
            const { data } = res;
            this.filters.queryGameTypes = data;
          } else if (res.state === "fail") {
            this.$message.error(res.message);
          }
        })
        .catch(() => {
          // this.$message.error('网络链接失败，请刷新重试');
        });
    },

    handleSizeChange(value) {
      this.size = value;
      this.getRegisterList();
    },
    getRegisterList() {
      const query = {
        pageNo: this.page,
        pageSize: this.size,
        queryType: this.filters.queryType,
        queryValue: this.filters.queryValue,
        // timeQueryType: this.filters.queryRoleType,

        // gameId: this.filters.queryGameType,

        // platFormId: this.filters.curPlatformSelected,
        // gameId: this.filters.curGameSelected,
        isDiscountGame: this.filters.isDiscountGame,
        platFormId: this.filters.queryPlatformid,
        gameId: this.filters.queryGameid,

        startDate: this.filters.date[0] ? this.filters.date[0] : "",
        endDate: this.filters.date[1] ? this.filters.date[1] : ""
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

      getRegisters(query)
        .then(res => {
          this.loading = false;
          if (res.state === "ok") {
            const { data, pagination } = res;
            this.registers = data;
            this.pageCount = Math.ceil(pagination.count / pagination.pageSize);
            this.total = pagination.count;
            this.showStatus = res.showStatus;
            this.showName();
          } else if (res.state === "fail") {
            this.$message.error(res.message || "网络链接失败，请刷新重试");
          }
        })
        .catch(() => {
          this.loading = false;
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
    // 查询创建时间类型 select change
    handleQueryRoleTypeChange(option) {
      this.filters.queryRoleType = option;
    },
    // 查询游戏类型 select change
    handleQueryGameTypeChange(option) {
      this.filters.queryGameType = option;
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
      this.filters.curPlatformSelected = this.filters.platformList[0].value; //TODO 越界问题
      this.filters.curGameSelected = this.filters.allGamedData.value;

      this.filters.queryGame = "";
      this.filters.queryPlatformid = "";
      this.filters.queryGameid = "";

      this.filters.queryType = "4";
      this.filters.queryRoleType = 1;
      // this.filters.queryGameType = '';
      this.filters.queryValue = "";
      this.filters.date = "";
      this.size = 10;
      this.page = 1;
      //专服/折扣
      this.$refs.BoxGame.handleChangePlatform("0");
      this.$refs.BoxGame.handleChangeGame("");
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
      const startDate = this.filters.date[0] ? this.filters.date[0] : "";
      const endDate = this.filters.date[1] ? this.filters.date[1] : "";
      const queryType = this.filters.queryType;
      const queryValue = this.filters.queryValue;
      const isDiscountGame = this.filters.isDiscountGame;
      // const gameId = this.filters.queryGameType;

      // const platFormId = this.filters.curPlatformSelected;
      // const gameId = this.filters.curGameSelected;

      const platFormId = this.filters.queryPlatformid;
      const gameId = this.filters.queryGameid;

      // if(startDate === '' || endDate === ''){
      //   this.$message.error('因数据量大，请填写时间！');
      //   return
      // }
      this.loading = true;
      let data = {
        queryType: queryType,
        queryValue: queryValue,
        startDate: startDate,
        endDate: endDate,
        platFormId: platFormId,
        gameId: gameId,
        isDiscountGame: isDiscountGame,
        mainMenu: "数据查询",
        oneMenu: "玩家游戏信息"
      };
      try {
        const res = await registerExport(data);
        if (res.state === "ok") {
          console.log(res);
          this.$message.success(res.message || "导出成功");
          // const a = document.createElement("a");
          // a.href = res.message;
          //a.target = "_black";
          // a.click();
          this.loading = false;
        } else {
          this.$message.error(res.message || "导出失败");
        }
      } catch (error) {
        console.error(error);
        this.loading = false;
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

.el-table td div.line {
  border-bottom: 1px solid #ebeef5;
  margin-left: -10px;
  margin-right: -10px;
  padding-top: 15px;
  &:first-child {
    padding-top: 0;
    padding-bottom: 15px;
  }
  &:last-child {
    border: none;
    padding-bottom: 0;
  }
}
</style>
