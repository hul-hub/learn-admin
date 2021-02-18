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
        <el-row :gutter="10">
          <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="10">
            <div class="merge">
              关键词查询：
              <el-select
                v-model="filters.queryType"
                placeholder="请选择"
                style="width: 150px;margin-right: 15px"
                @change="handleQueryTypeChange"
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
                @keyup.enter.native="submitFilter"
                v-model="filters.queryValue"
                placeholder="输入查询关键词"
              ></el-input>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="10" v-if="false">
            <div class="merge">
              游戏：
              <el-select
                v-model="filters.platform"
                filterable
                placeholder="请选择平台"
                style="width: 150px;margin-right:5px"
                @change="platformChose(filters.platform)"
              >
                <el-option
                  v-for="item in filters.platformOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-select
                v-model="filters.game"
                placeholder="请选择游戏"
                filterable
                style="width: 150px;margin-right:5px"
                @change="gameChose(filters.game)"
              >
                <el-option
                  v-for="item in filters.gameListOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-select
                v-model="filters.zone"
                placeholder="请选择区服"
                filterable
                style="width: 150px;margin-right: 15px"
              >
                <el-option
                  v-for="item in filters.zonesListOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </el-col>
          <!-- 去除平台后的 -->
          <el-col :xs="24" :sm="12" :md="12" :lg="10" :xl="10" v-if="false">
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
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="8">
            <BoxGame
              ref="BoxGame"
              @change="handleGamesChange"
              :defaultPlatformId="filters.queryPlatformid"
              :defaultGame="filters.gameId"
            >
            </BoxGame>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="4" :xl="4">
            <el-button @click="submitFilter" type="primary">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <h3>资源角色列表</h3>
        <div class="extra">
          <el-button size="medium" type="primary" @click="newRuleApply"
            >新建角色建帮资源</el-button
          >
        </div>
      </div>
      <div class="body">
        <div class="flex mid mb10">
          账号状态
          <el-radio-group
            v-model="filters.state"
            @change="radioChange"
            size="small"
            class="ml5"
          >
            <el-radio-button label="全部状态"></el-radio-button>
            <el-radio-button label="正常"></el-radio-button>
            <el-radio-button label="封停"></el-radio-button>
            <el-radio-button label="冻结"></el-radio-button>
            <el-radio-button label="注销"></el-radio-button>
          </el-radio-group>
          <div class="flex mid ml10">
            申请资源状态
            <el-radio-group
              v-model="filters.applyAuth"
              @change="radioChangeApplyAuth"
              size="small"
              class="ml5"
            >
              <el-radio-button label="">全部</el-radio-button>
              <el-radio-button :label="1">正常</el-radio-button>
              <el-radio-button :label="2">停用</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <el-table
          :data="registers"
          tooltip-effect="dark"
          style="width: 100%"
          border
          v-loading="loading"
        >
          <el-table-column
            prop="vvId"
            label="账号"
            align="center"
          ></el-table-column>
          <el-table-column label="所属主渠道 / 子渠道" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.mcName }}/{{ scope.row.scLoginName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="产品信息" align="center">
            <template slot-scope="scope">
              <!-- <span>{{ scope.row.platformId }} - {{ scope.row.gameName }}</span> -->
              <span>{{ scope.row.gameName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="zoneName"
            label="区服名称"
            width="150"
            align="center"
          ></el-table-column>
          <el-table-column label="角色信息" align="center">
            <template slot-scope="scope">
              <div
                style="display: flex;flex-direction: column;align-items: center"
              >
                <span>{{ scope.row.roleName }}</span>
                <span
                  >{{ scope.row.roleLevel }}级 | {{ scope.row.roleId }}</span
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column label="渠道金额总计" align="center" width="180">
            <template slot="header">
              渠道金额总计
              <el-tooltip class="item" effect="dark" placement="top">
                <div slot="content">
                  消费总计：归属该渠道的资源号的消费总额（不分游戏）
                  <br />资源总计：归属该渠道的资源号申请的资源总额（不分游戏）
                </div>
                <i class="el-icon-question"></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <div style="display: flex;flex-direction: column;">
                <span>消费总计：{{ scope.row.channelConsumeTotal }}</span>
                <span>资源总计：{{ scope.row.channelSupportTotal }}</span>
                <span>资源比例：{{ scope.row.supportRatio }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="consumeTotal"
            label="消费总额（元）"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="supportTotal"
            label="已发放资源（元）"
            align="center"
          ></el-table-column>
          <el-table-column prop="statusStr" label="账号状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.statusStr">{{ scope.row.statusStr }}</span>
              <span v-else>{{ scope.row.status | getStatus }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="applyAuthStr"
            label="申请资源状态"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" align="center" width="120">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="applySupportNextDialog(scope.row)"
                :disabled="scope.row.applyAuthStr == '停用'"
                >[申请资源]</el-button
              >
            </template>
          </el-table-column>
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
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 新建角色资源弹窗 -->
    <el-dialog :visible.sync="newRuleDialog" width="50%" class="full-dialog">
      <ApplySupportDialog />
    </el-dialog>

    <!-- 申请资源弹窗 -->
    <el-dialog :visible.sync="applySupportNext" width="50%" class="full-dialog">
      <el-form :model="ruleForm" ref="ruleForm" label-width="150px">
        <el-form-item label="资源号" prop="userId">
          <el-input
            v-model="ruleForm.userId"
            disabled
            placeholder="平台ID"
          ></el-input>
        </el-form-item>
        <el-form-item label="平台" prop="platform" v-if="false">
          <el-select v-model="ruleForm.platform" disabled></el-select>
        </el-form-item>
        <el-form-item label="游戏" prop="game">
          <el-select v-model="ruleForm.game" disabled> </el-select>
        </el-form-item>
        <el-form-item label="区服" prop="district">
          <el-select v-model="ruleForm.district" disabled> </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="ruleForm.role" disabled> </el-select>
        </el-form-item>
        <el-form-item label="资源类型" prop="supportType">
          <el-select
            v-model="ruleForm.supportType"
            @change="getSupportTypeTipMoney"
          >
            <el-option label="建帮资源" value="2"></el-option>
            <!-- 这次版本先不上 -->
            <!-- <el-option label="生活费" value="3"></el-option> -->
            <el-option label="首次资源" value="4"></el-option>
            <el-option label="后续资源" value="5"></el-option>
            <el-option
              label="预支资源"
              value="6"
              v-if="ruleForm.gameId != 'C01' && ruleForm.gameId != 'ToyouL1'"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发放资源（元）" prop="money">
          <!--<el-select-->
          <!--v-if="ruleForm.supportType == 2"-->
          <!--v-model="ruleForm.money"-->
          <!--@change="handlerMoney"-->
          <!--&gt;-->
          <!--<el-option-->
          <!--v-for="(item, index) in ruleForm.moneyOption2"-->
          <!--:key="index"-->
          <!--:label="item.rankDesc"-->
          <!--:value="item.rankValue + ',' + item.rankType"-->
          <!--&gt;-->
          <!--</el-option>-->
          <!--</el-select>-->
          <el-select
            v-if="
              ruleForm.supportType == 2 ||
                ruleForm.supportType == 5 ||
                ruleForm.supportType == 6
            "
            v-model="ruleForm.money2"
            @change="handlerMoney"
          >
            <el-option
              v-for="(item, index) in ruleForm.moneyOption"
              :key="index"
              :label="item.rankDesc"
              :value="item.rankValue + ',' + item.rankType"
            >
            </el-option>
          </el-select>
          <el-input
            v-if="ruleForm.supportType == 4"
            v-model="ruleForm.firstSuppportMoney"
            disabled
          ></el-input>
        </el-form-item>

        <div
          style="font-size: 12px; color: #f30; margin-left: 150px; margin-bottom: 10px;"
        >
          <span v-if="ruleForm.supportType == 2"
            >建帮资源可多次申请，但有总额度上限，剩余可申请额度：{{
              tipMoney
            }}元</span
          >
          <span
            v-if="
              isGuildBoss === 1
                ? ruleForm.supportType == 4
                : ruleForm.supportType == 4 || ruleForm.supportType == 5
            "
            >元宝池剩余金额：{{ Number(tipMoney).toFixed(2) }}</span
          >
        </div>
        <el-form-item
          label="选择元宝池"
          prop="vcoinPool"
          v-if="isGuildBoss === 1 && ruleForm.supportType === '5'"
        >
          <el-select v-model="ruleForm.vcoinPool" @change="changeVcoinPool">
            <el-option
              v-for="item in ruleForm.vcoinPoolOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="常用地址" prop="address">
          <el-input v-model="ruleForm.address" disabled></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="ruleForm.remark"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="$store.getters.timer"
            style="width: 180px"
            type="primary"
            @click="submitForm('ruleForm')"
            >提交申请</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- S 提示修改密码弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="samePasswordDialogVisible"
      center
      width="65%"
      class="full-dialog-min"
    >
      <p style="text-align: center;">
        您尚未修改资源号初始密码，<br />请前往修改，否则无法继续申请资源哦。
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="samePasswordDialogVisible = false">知道了</el-button>
        <el-button type="primary" @click="linkTo('/aid/accountManage/index')"
          >修改密码</el-button
        >
      </span>
    </el-dialog>
    <!-- E 提示修改密码弹窗 -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import ApplySupportDialog from "@/components/ApplySupportDialog";
import {
  getApplyRoleList,
  applySupport,
  getSupportInfo,
  getUsableMoney,
  checkPassword,
  bossUsableMoney
} from "@/api/aid";
import { previewPool } from "@/api/gameSupport";
import { getUserDetailsInfo } from "@/api/account";
import store from "@/store";
import aidService from "../../../service/aidService";
import { getUserGameList, getZonesList } from "@/api/aid";
import BoxGame from "@/components/Games/boxGame";
export default {
  name: "AidApplyList",
  components: {
    Breadcrumb,
    ApplySupportDialog,
    BoxGame
  },
  computed: {
    ...mapGetters(["account", "platformList"])
  },
  data() {
    return {
      isGuildBoss: "",
      samePasswordDialogVisible: false,
      newRuleDialog: false,
      applySupportNext: false,
      ruleForm: {
        userId: "",
        platform: "",
        game: "",
        district: "",
        role: "",
        money: "",
        moneyOption: [],
        moneyOption2: [],
        supportType: "2",
        address: "",
        remark: "",
        supportId: "",
        firstSuppportMoney: 0,

        vcoinPool: "",
        vcoinPoolOption: [],
        platformId: "",
        gameId: "",
        zoneId: "",
        mcId: "",
        money2: "",
        money3: ""
      },

      tipMoney: 0,
      currentPlatformId: "",
      currentGameId: "",
      currentZoneId: "",
      currentMcId: "",
      currentRoleId: "",
      currentVVId: "",

      filters: {
        isDiscountGame: 0,
        queryPlatformid: "",
        queryGameid: "",
        queryGame: "",
        queryGameList: [],
        queryZone: "",
        queryZoneList: [],

        platformOptions: this.platformList,
        gameListOptions: [],
        zonesListOptions: [],
        platform: "",
        game: "",
        zone: "",
        queryType: "4",
        queryTypes: [
          {
            label: "账号",
            value: "4"
          },
          {
            label: "用户帐号",
            value: "24"
          },
          {
            label: "主渠道名称",
            value: "2"
          },
          {
            label: "主渠道ID",
            value: "9"
          },
          {
            label: "主渠道账号",
            value: "1"
          },
          {
            label: "子渠道账号",
            value: "3"
          },
          {
            label: "子渠道ID",
            value: "10"
          }
        ],
        queryValue: "",
        date: [],
        state: "全部状态",
        applyAuth: ""
      },
      registers: [],
      loading: false,
      page: 1,
      pageCount: 0,
      size: 10,
      total: 0
    };
  },
  filters: {
    getStatus: function(value) {
      switch (value) {
        case 1:
          return "正常";
        case 2:
          return "封停";
        case 3:
          return "异地登录";
        case 4:
          return "冻结";
      }
      return "";
    }
  },
  created() {
    this.getApplyRoleList();
    store.dispatch("getPlatformList").then(() => {
      this.getPlatformList();
    });
    this.getUserDetailsInfo();
    // this.getUserGameList();
  },
  methods: {
    handlerMoney(val) {
      console.log(val);
      let arr = [];
      arr = val.split(",");
      console.log(arr);
      this.ruleForm.money3 = arr[0];
      this.rankType = arr[1];
      console.log(this.rankType);
    },
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

    //获取身份信息是否为boss
    getUserDetailsInfo() {
      getUserDetailsInfo()
        .then(res => {
          // console.log(res, 'ssssssssssssss');
          if (res.state === "ok") {
            console.log("成功");
            if (res.data.isGuildBoss === 1) {
              this.isGuildBoss = 1;
              // console.log(this.isGuildBoss,'qqqqqqqqqqqqqqqqqqqq')
            }
          }
        })
        .catch(() => {
          this.loading = false;
          this.$message.error("网络链接失败，请刷新重试");
        });
    },
    getApplyRoleList() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      getApplyRoleList({
        queryType: this.filters.queryType,
        queryValue: this.filters.queryValue,
        // platformId: this.filters.platform,
        // gameId: this.filters.game,
        // zoneId: this.filters.zone,
        platformId: this.filters.queryPlatformid,
        gameId: this.filters.queryGameid,
        zoneId: this.filters.queryZone,
        isDiscountGame: this.filters.isDiscountGame,
        applyAuth: this.filters.applyAuth,

        status: this.getState(),
        pagination: {
          pageNo: this.page,
          pageSize: this.size
        }
      })
        .then(res => {
          console.log(res, "---------------------------- res");
          this.loading = false;
          if (res.state === "ok") {
            console.log("成功");
            const { data, pagination } = res;
            this.registers = data;
            this.pageCount = Math.ceil(pagination.count / pagination.pageSize);
            this.total = pagination.count;
          } else if (res.state === "fail") {
            this.$message.error(res.message || "网络链接失败，请刷新重试");
          }
        })
        .catch(() => {
          this.loading = false;
          this.$message.error("网络链接失败，请刷新重试");
        });
    },
    // 提交筛选查询
    submitFilter() {
      this.page = 1;
      this.getApplyRoleList();
    },
    // 查询类型 select change
    handleQueryTypeChange(option) {
      this.filters.queryType = option;
    },
    // 切换分页
    handleCurrentChange(page) {
      this.page = page;
      console.log("获取列表数据");
      this.getApplyRoleList();
    },
    radioChange() {
      this.page = 1;
      this.getApplyRoleList();
    },
    radioChangeApplyAuth() {
      this.page = 1;
      this.getApplyRoleList();
    },
    // 倒出数据
    exportDatas() {},
    getState() {
      switch (this.filters.state) {
        case "正常":
          return 1;
        case "封停":
          return 2;
        case "异地登录":
          return 3;
        case "冻结":
          return 4;
        case "注销":
          return 6;
        default:
          return "";
      }
    },
    reset() {
      this.filters.gameListOptions = [];
      this.filters.zonesListOptions = [];
      this.filters.platform = "";
      this.filters.game = "";
      this.filters.zone = "";
      this.filters.queryType = "1";
      this.filters.queryValue = "";
      this.filters.state = "全部状态";
      this.filters.applyAuth = "";

      this.filters.queryGame = "";
      this.filters.queryZone = "";
      this.filters.queryZoneList = [];
      this.filters.queryPlatformid = "";
      this.filters.queryGameid = "";
      //专服/折扣
      this.$refs.BoxGame.handleChangePlatform("0");
      this.$refs.BoxGame.handleChangeGame("");
      this.getApplyRoleList();
    },
    getPlatformList() {
      this.filters.platformOptions = [];
      for (let i = 0; i < this.platformList.length; i++) {
        this.filters.platformOptions.push({
          value: this.platformList[i].value,
          label: this.platformList[i].text
        });
      }
    },
    platformChose(platfrom) {
      this.filters.game = "";
      this.filters.district = "";
      this.filters.gameListOptions = [];
      this.filters.zonesListOptions = [];
      aidService.getGameList(platfrom, data => {
        this.filters.gameListOptions = data;
      });
    },
    gameChose(game) {
      this.filters.zonesListOptions = [];
      this.filters.zone = "";
      aidService.getZonesList(this.filters.platform, game, data => {
        this.filters.zonesListOptions = data;
      });
    },
    newRuleApply() {
      this.newRuleDialog = true;
    },
    async applySupportNextDialog(rowData) {
      this.ruleForm.moneyOption2 = [];
      if (rowData && rowData.vvId !== "") {
        // 校验资源号密码是否与原密码一致
        // 是: 跳转帐号管理页面; 否: 显示弹窗
        try {
          const resCheck = await checkPassword({ vvid: rowData.vvId });
          console.log(resCheck);
          if (resCheck.state === "fail") {
            this.message.error(resCheck.message || "申请失败，请重试");
          } else if (resCheck.state === "ok") {
            if (resCheck.message === "same") {
              this.samePasswordDialogVisible = true;
            } else {
              console.log("发起申请，显示弹窗");
              this.getSupportInfo(rowData);
            }
          }
        } catch (error) {
          console.log("error =>>", error);
          this.message.error("申请失败，请重试");
        }
      } else {
        console.log("发起申请，显示弹窗");
        this.getSupportInfo(rowData);
      }

      this.ruleForm.platformId = rowData.platformId;
      this.ruleForm.gameId = rowData.gameId;
      this.ruleForm.zoneId = rowData.zoneId;
      this.ruleForm.mcId = rowData.mcId;
    },
    getSupportInfo(rowData) {
      // 资源当前主渠道号/主渠道号
      getSupportInfo({
        supportId: rowData.supportId
      })
        .then(res => {
          if (res.state === "ok") {
            this.ruleForm.supportId = rowData.supportId;
            this.ruleForm.userId = res.data.vvId;
            this.ruleForm.platform = res.data.platformId;
            this.ruleForm.game = rowData.gameName;
            this.ruleForm.district = rowData.zoneName;
            this.ruleForm.role = rowData.roleName;
            this.ruleForm.address = res.data.address;
            this.ruleForm.money = "";
            this.ruleForm.moneyOption = [];
            this.ruleForm.firstSuppportMoney = res.data.firstSuppportMoney;
            console.log(this.ruleForm.firstSuppportMoney, "hhh");

            this.currentPlatformId = rowData.platformId;
            this.currentGameId = rowData.gameId;
            this.currentZoneId = rowData.zoneId;
            this.currentMcId = rowData.mcId;
            this.currentRoleId = rowData.roleId;
            this.currentVVId = rowData.vvId;

            for (let i = 0; i < res.data.rank.length; i++) {
              this.ruleForm.moneyOption.push({
                rankValue: res.data.rank[i].rankValue,
                rankDesc: res.data.rank[i].rankDesc,
                rankType: res.data.rank[i].rankType
              });
              if (res.data.rank[i].rankType == 1) {
                this.ruleForm.moneyOption2.push({
                  rankValue: res.data.rank[i].rankValue,
                  rankDesc: res.data.rank[i].rankDesc,
                  rankType: res.data.rank[i].rankType
                });
              }
            }
            this.applySupportNext = true;
            // this.$message.success('申请成功');

            // 获取可申请资源的金额. 默认加载建帮资源
            this.ruleForm.supportType = "2";
            this.getSupportTypeTipMoney(this.ruleForm.supportType);
            console.log("获取可申请资源的金额. 默认加载建帮资源");
          } else {
            this.$message.error("网络链接失败，请刷新重试");
          }
        })
        .catch(err => {
          console.log("applySupportNextDialog err =>>", err);
        });
    },
    submitForm(ruleForm) {
      this.$store.state.app.timer = 1;
      console.log(this.ruleForm, "form");
      console.log(this.ruleForm.money, "money");
      // if (this.ruleForm.supportType == 4) {
      //   this.ruleForm.money3 = this.ruleForm.firstSuppportMoney;
      // }
      applySupport({
        userId: this.ruleForm.userId,
        mcId: this.ruleForm.mcId,
        remark: this.ruleForm.remark,
        supportId: this.ruleForm.supportId,
        supportContent:
          this.ruleForm.supportType == 4
            ? this.ruleForm.firstSuppportMoney
            : this.ruleForm.money3,
        supportType: this.ruleForm.supportType,
        rankType: this.rankType
      })
        .then(res => {
          const { message } = res;
          if (res.state === "ok") {
            this.$alert(message || "提交成功", "成功", {
              confirmButtonText: "确定",
              callback: action => {
                this.applySupportNext = false;
                this.ruleForm.moneyOption2 = [];
                this.ruleForm.moneyOption = [];
              }
            });
          } else {
            this.$message.error(message || "提交失败，请重试");
          }
          this.$store.state.app.timer = 0;
        })
        .catch(e => {
          console.error(e);
          this.$store.state.app.timer = 0;
        });
    },
    // 获取可申请资源的金额
    getSupportTypeTipMoney(val) {
      console.log("切换资源类型 =>>", val);
      this.tipMoney = 0;
      if (val == 2) {
        console.log("建帮资源, 获取资源申请额度");
        this.getUsableMoney(2);
      } else if (val == 4 || val == 5) {
        console.log("首次资源 & 后续资源, 获取元宝池");
        this.getPool();
        this.bossUsableMoney();
        this.ruleForm.vcoinPool = "";
      }
    },
    async getUsableMoney(type) {
      try {
        const query = {
          supportType: Number(type),
          platformId: this.currentPlatformId,
          gameId: this.currentGameId,
          zoneId: this.currentZoneId,
          // mcId: this.currentMcId,
          roleId: this.currentRoleId,
          vvId: this.currentVVId
        };

        const result = await getUsableMoney(query);
        console.log(result);
        if (result.state === "ok") {
          this.tipMoney = result.data;
        }
      } catch (error) {
        console.log("getUsableMoney =>>", error);
      }
    },
    /**
     * 查看元宝池
     */
    async getPool() {
      try {
        const platformId = this.currentPlatformId;
        const gameId = this.currentGameId;
        const zoneId = this.currentZoneId;
        const mcId = this.currentMcId;

        const result = await previewPool({
          platformId: platformId,
          gameId: gameId,
          zoneId: zoneId,
          mcId: mcId
        });
        console.log(result);
        if (result.state === "ok") {
          this.tipMoney = result.data;
        }
      } catch (error) {
        console.log("getPool =>>", error);
      }
    },

    //获取在boss身份时小组元宝池信息显示在下拉框相对应的mcid
    changeVcoinPool(val) {
      this.ruleForm.mcId = val;
    },

    //获取在boss身份时小组元宝池信息显示在下拉框中(只能在首次资源和后续资源中使用，请注意)
    async bossUsableMoney() {
      try {
        const platformId = this.ruleForm.platformId;
        const gameId = this.ruleForm.gameId;
        const zoneId = this.ruleForm.zoneId;
        let data = {
          platformId: platformId,
          gameId: gameId,
          zoneId: zoneId
        };
        const result = await bossUsableMoney(data);
        if (result.state === "ok") {
          const arr = [];
          result.data.forEach(function(element) {
            arr.push({
              label: element.mcName + "：" + element.vcoinPool,
              value: element.mcId
            });
          });
          this.ruleForm.vcoinPoolOption = arr;
        }
      } catch (error) {
        console.log("getPool =>>", error);
      }
    },

    linkTo(location, action = "push") {
      this.$router[action](location);
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
  flex-direction: row;
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
.full-dialog-min {
  .el-dialog {
    max-width: 540px;
  }
}
</style>
