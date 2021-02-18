<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="150px"
    class="dialog-form"
  >
    <el-form-item label="资源号" prop="userId">
      <el-input v-model="ruleForm.userId" placeholder="资源号"></el-input>
    </el-form-item>
    <el-form-item label="平台" prop="platform" v-if="false">
      <el-select
        v-model="ruleForm.platform"
        filterable
        placeholder="请选择平台"
        @change="platformChose(ruleForm.platform)"
        style="width: 100%;"
      >
        <el-option
          v-for="item in platformOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="游戏" prop="game" v-if="false">
      <el-select
        v-model="ruleForm.game"
        placeholder="请选择游戏"
        @change="gameChose(ruleForm.game)"
        style="width: 100%;"
      >
        <el-option
          v-for="item in gameListOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="区服" prop="district" v-if="false">
      <el-select
        v-model="ruleForm.district"
        placeholder="请选择区服"
        @change="districtChose(ruleForm.district)"
        style="width: 100%;"
      >
        <el-option
          v-for="item in zonesListOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="游戏">
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
        @change="districtChose(filters.queryZone)"
        filterable
      >
        <el-option
          v-for="item in filters.queryZoneList"
          :key="item.value"
          :label="item.text"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="角色" prop="role">
      <el-select
        v-model="ruleForm.role"
        placeholder="请选择角色"
        @visible-change="ruleChange"
        @change="ruleChose()"
        style="width: 100%;"
      >
        <el-option
          v-for="item in roleListOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="开区资源金额（元）" prop="money">
      <el-select
        v-model="ruleForm.money"
        placeholder="请选择资源金额档位"
        style="width: 100%;"
      >
        <el-option
          v-for="item in moneyOption"
          :key="item.rankDesc"
          :label="item.rankDesc"
          :value="item.rankValue"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <div
      style="display:flex;flex-direction:column;margin-left:200px;margin-bottom: 10px"
    >
      <span>开区资源可多次申请，但有总额度上限</span>
      <span>剩余可申请额度：{{ ruleForm.remainMoney }}元</span>
    </div>
    <el-form-item label="常用地址" prop="address">
      <!-- <el-input v-model="ruleForm.address" placeholder="请输入常用地址"></el-input> -->
      <el-cascader
        clearable
        filterable
        v-model="selectOptions"
        @change="handleCityChange"
        :options="options"
        :props="{
          label: 'name',
          value: 'name'
        }"
        style="width: 100%"
      ></el-cascader>
    </el-form-item>
    <el-form-item>
      <el-button
        style="width: 180px"
        type="primary"
        @click="submitForm('ruleForm')"
        >提交</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
import {
  onekeyApplyAccount,
  getGameList,
  applySupportFirst,
  getUsableMoney,
  supportRank
} from "@/api/aid";
import { mapGetters } from "vuex";
import store from "@/store";
import pcCode from "@/datas/pc-code.json";
import aidService from "@/service/aidService";
import { getUserGameList, getZonesList } from "@/api/aid";

export default {
  name: "ApplySupportDialog",
  created() {
    store.dispatch("getPlatformList").then(() => {
      this.getPlatformList();
    });
  },
  computed: {
    ...mapGetters(["platformList"])
  },
  props: ["defaultAccount"],
  data() {
    return {
      account: "",
      options: pcCode,
      psw: "",
      platformChoseDisable: false,
      platformOptions: this.platformList,
      gameListOptions: [],
      zonesListOptions: [],
      roleListOptions: [],
      moneyOption: [],
      ruleForm: {
        userId: "",
        platform: "",
        game: "",
        district: "",
        role: "",
        money: "",
        remainMoney: "--",
        address: ""
      },
      filters: {
        queryPlatformid: "",
        queryGameid: "",
        queryGame: "",
        queryGameList: [],
        queryZone: "",
        queryZoneList: []
      },
      rules: {
        userId: [{ required: true, message: "请输入资源号", trigger: "blur" }],
        platform: [
          { required: true, message: "请选择平台", trigger: "change" }
        ],
        game: [{ required: true, message: "请选择游戏", trigger: "change" }],
        district: [
          { required: true, message: "请选择区服", trigger: "change" }
        ],
        role: [{ required: true, message: "请选择角色", trigger: "change" }],
        money: [
          { required: true, message: "请选择资源金额", trigger: "change" }
        ],
        address: [
          { required: true, message: "请填写常用地址", trigger: "change" }
        ]
      },
      selectOptions: ["44", "4401"]
    };
  },
  watch: {
    defaultAccount(val) {
      console.log("defaultAccount =>>", val);
      console.log("this.ruleForm.userId =>>", this.ruleForm.userId);
      this.ruleForm.userId = val;
      console.log("this.ruleForm.userId =>>", this.ruleForm.userId);
    }
  },
  mounted() {
    console.log("mounted this.defaultAccount =>>", this.defaultAccount);
    this.ruleForm.userId = this.defaultAccount;
    this.getUserGameList();
  },
  methods: {
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
      this.supportRank();
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

    handleCityChange(value) {
      const filterValue = value
        .filter(item => item !== "市辖区")
        .join(",")
        .replace(/,/g, "/");
      this.ruleForm.address = filterValue;
      console.log(filterValue);
    },
    getPlatformList() {
      console.log("this.platformList =>>", this.platformList);
      this.platformOptions = [];
      for (let i = 0; i < this.platformList.length; i++) {
        this.platformOptions.push({
          value: this.platformList[i].value,
          label: this.platformList[i].text
        });
      }
    },
    platformChose(platfrom) {
      this.ruleForm.game = "";
      this.ruleForm.district = "";
      this.ruleForm.role = "";
      this.gameListOptions = [];
      this.zonesListOptions = [];
      this.roleListOptions = [];
      aidService.getGameList(platfrom, data => {
        this.gameListOptions = data;
      });
    },
    gameChose(game) {
      this.zonesListOptions = [];
      this.roleListOptions = [];
      this.ruleForm.district = "";
      this.ruleForm.role = "";
      aidService.getZonesList(this.ruleForm.platform, game, data => {
        this.zonesListOptions = data;
      });
      this.supportRank();
    },
    districtChose(district) {
      this.roleListOptions = [];
      this.ruleForm.role = "";
      aidService.getRolesList(
        // this.ruleForm.platform,
        // this.ruleForm.game,

        this.filters.queryPlatformid,
        this.filters.queryGameid,
        district,

        this.ruleForm.userId,
        data => {
          this.roleListOptions = data;
        }
      );
    },
    ruleChange(change) {
      if (change && !this.ruleForm.userId) {
        this.$message.error("请填写资源号");
      } else if (
        change &&
        this.roleListOptions.length === 0 &&
        this.ruleForm.district
      ) {
        aidService.getRolesList(
          this.ruleForm.platform,
          this.ruleForm.game,
          this.ruleForm.district,
          this.ruleForm.userId,
          data => {
            this.roleListOptions = data;
          }
        );
      }
    },
    //获取可用余额
    ruleChose() {
      getUsableMoney({
        supportType: 2,
        // platformId: this.ruleForm.platform,
        // gameId: this.ruleForm.game,
        // zoneId: this.ruleForm.district,
        platformId: this.filters.queryPlatformid,
        gameId: this.filters.queryGameid,
        zoneId: this.filters.queryZone,

        roleId: this.ruleForm.role,
        vvId: this.ruleForm.userId
      })
        .then(res => {
          const { message } = res;
          if (res.state === "ok") {
            this.ruleForm.remainMoney = res.data;
          } else {
            this.$message.error(message || "提交失败，请重试");
          }
        })
        .catch(() => {});
    },
    clear() {
      this.ruleForm.address = "";
      this.ruleForm.game = "";
      this.ruleForm.platform = "";
      this.ruleForm.role = "";
      this.ruleForm.money = "";
      this.ruleForm.userId = "";
      this.ruleForm.district = "";
      this.gameListOptions = [];
      this.zonesListOptions = [];
      this.roleListOptions = [];

      this.filters.queryGame = "";
      this.filters.queryZone = "";
      this.filters.queryZoneList = [];
      this.filters.queryPlatformid = "";
      this.filters.queryGameid = "";
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let rankType = this.moneyOption.filter(item => {
            if (item.rankValue == this.ruleForm.money) {
              return item;
            }
          });
          const data = {
            address: this.ruleForm.address,
            // gameId: this.ruleForm.game,
            // platformId: this.ruleForm.platform,
            roleId: this.ruleForm.role,
            supportMoney: this.ruleForm.money,
            vvId: this.ruleForm.userId,
            // zoneId: this.ruleForm.district

            platformId: this.filters.queryPlatformid,
            gameId: this.filters.queryGameid,
            zoneId: this.filters.queryZone,
            rankType: rankType[0].rankType
          };
          applySupportFirst(data)
            .then(res => {
              const { message } = res;
              if (res.state === "ok") {
                this.clear();
                this.$message.success({
                  message: message || "提交成功",
                  duration: 2000,
                  onClose: () => {
                    // this.$router.push('@/views/aid/account/index')
                    location.reload();
                  }
                });
              } else {
                this.$message.error(message || "提交失败，请重试");
              }
            })
            .catch(() => {
              this.$message.error("提交失败，请重试");
            });
        }
      });
    },
    supportRank() {
      supportRank({
        // platformId: this.ruleForm.platform,
        // gameId: this.ruleForm.game
        platformId: this.filters.queryPlatformid,
        gameId: this.filters.queryGameid
      })
        .then(res => {
          console.log(res, "------------------this.moneyOption");
          const { message } = res;
          if (res.state === "ok") {
            this.moneyOption = [];
            this.ruleForm.money = "";
            for (let i = 0; i < res.data.length; i++) {
              this.moneyOption.push({
                rankValue: res.data[i].rankValue,
                rankDesc: res.data[i].rankDesc,
                rankType: res.data[i].rankType
              });
            }
          } else {
            this.ruleForm.money = "";
            this.$message.error(message || "提交失败，请重试");
          }
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss">
.mobile {
  .full-dialog {
    .el-dialog {
      width: 95% !important;
    }
  }
}
</style>
