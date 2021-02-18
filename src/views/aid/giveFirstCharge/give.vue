<!-- 赠送首充-->
<template>
  <div>
    <div class="page-crumbs">
      <div class="crumbs">
        <breadcrumb />
      </div>
      <!-- <div class="extra">
        <el-button size="small" type="primary">保存</el-button>
      </div> -->
    </div>

    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <h3>赠送首充</h3>
      </div>
      <div class="body">
        <el-form
          :model="form"
          :rules="rules"
          ref="businessForm"
          class="form-business"
          label-position="top"
        >
          <el-form-item label="玩家：" prop="userIdStrTemp">
            <el-input
              v-model="form.userIdStrTemp"
              type="textarea"
              :rows="4"
              placeholder="账号,每行一个"
            ></el-input>
            <span v-show="userIdStrTempLenFlag"
              >共计{{ userIdStrTempLen }}条</span
            >
          </el-form-item>
          <el-form-item label="游戏分区：" prop="">
            <div class="merge" v-if="false">
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
            <!-- 去除平台后的游戏 -->
            <div class="merge" v-if="false">
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
            <!-- 返利盒子的 -->
            <div class="merge">
              <BoxGame
                ref="BoxGame"
                @change="handleGamesChange"
                :defaultPlatformId="filters.queryPlatformid"
                :defaultGame="filters.gameId"
              >
              </BoxGame>
            </div>
          </el-form-item>
          <div class="clearfix">
            <el-button
              size="mini"
              style="float: right; color: #409eff"
              @click="handleNextClick"
              >下一步</el-button
            >
          </div>
          <el-form-item
            label="请选择赠送的角色："
            prop="userRole"
            v-show="submitFormFlag"
          >
            <div class="user-role">
              <div
                style=""
                class="user-role-item"
                v-for="(item, index) in userRoleGroup"
                :key="item.vvId"
              >
                <el-button @click="handleUserRoleClick(item.vvId)">{{
                  item.vvId
                }}</el-button>
                <el-select
                  v-model="item.roleId"
                  placeholder="请选择"
                  v-if="item.roleList.length > 0"
                >
                  <el-option
                    v-for="role in item.roleList"
                    :key="role.roleId"
                    :label="role.roleName"
                    :value="role.roleId"
                  >
                  </el-option>
                </el-select>
                <span v-else>
                  {{ item.message }}
                </span>
              </div>
            </div>
          </el-form-item>
          <el-form-item v-show="submitFormFlag">
            <el-button
              type="primary"
              @click="submitForm('businessForm')"
              :loading="submitting"
              >保存
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
import { arrayTreeAddLevel } from "@/utils/formatTree";
import { getBusinesses, submitBusinesses } from "@/api/businesses";
import {
  getSupportAccountListApi,
  getPlatformListApi,
  getPlatformGameListApi,
  getPlatformGameZoneListApi,
  giveFirstRechargeApi,
  getFirstRechargeUserRole,
  sendSiveFirstRechargeApi
} from "@/api/gameSupport";
import dataCenterService, {
  PLATFORM_ALL,
  GAME_ALL,
  ZONE_ALL
} from "@/service/dataCenterService";
import { getUserGameList, getZonesList } from "@/api/aid";
import BoxGame from "@/components/Games/boxGame";

PLATFORM_ALL.value = "";
GAME_ALL.value = "";
ZONE_ALL.value = "";
const ok = "ok";
export default {
  name: "BusinessIndex",
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
      defaultData,
      filters: {
        queryPlatformid: "",
        queryGameid: "",
        queryGame: "",
        queryGameList: [],
        queryZone: "",
        queryZoneList: []
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

      submitting: false,
      userIdStrTempLen: 0,
      userIdStrTempLenFlag: false,
      form: {
        platformId: "",
        gameId: "",
        zoneId: "",
        userIdStr: "",
        userIdStrTemp: ""
      },
      rules: {
        userIdStrTemp: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        userRole: [{ required: true, message: "请选择角色", trigger: "click" }]
      },
      //显示提交按钮
      submitFormFlag: false,
      userRoleGroup: [],
      vvId: 0
    };
  },
  mounted() {
    // this.getPlatformList();
    this.requestGameConditions();
    this.getUserGameList();
  },
  methods: {
    handleGamesChange(data) {
      this.filters.platformType = data.platformType;
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
    // handleQueryGameChangenew(option) {
    //   const arrPlat = option.split(",");
    //   this.filters.queryPlatformid = arrPlat[0];
    //   this.filters.queryGameid = arrPlat[1];
    //   this.filters.queryZone = "";
    //   this.getZonesList();
    // },
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
     * 显示错误提示
     * @param apiRes 服务端返回的JSON
     */
    showErrorMessage(message) {
      if (message) {
        this.$message.error(message);
      }
    },
    submitForm(formName) {
      for (let i = 0, len = this.userRoleGroup.length; i < len; i++) {
        if (
          this.userRoleGroup[i].roleId == "" &&
          this.userRoleGroup[i].roleList.length > 0
        ) {
          this.$message.error("请选择角色");
          return;
        }
      }
      let roleIds = this.userRoleGroup
        .map(item => {
          return item.vvId + "|" + item.roleId;
        })
        .join(",");
      let siveFirst = {
        // platformId: this.form.platformId,
        // gameId: this.form.gameId,
        // zoneId: this.form.zoneId,

        platformId: this.filters.queryPlatformid,
        gameId: this.filters.queryGameid,
        zoneId: this.filters.queryZone,

        roleIds: roleIds
      };
      this.submitting = true;

      sendSiveFirstRechargeApi(siveFirst)
        .then(res => {
          if (res.state === "ok") {
            this.$message({
              showClose: true,
              message: res.data,
              duration: 5000,
              type: "success"
            });
            // this.showSuccessMessage(res.data.resultCount, () => {
            //   // 重定向回列表页
            //   // this.$router.replace('/giveFirstCharge/index');
            //
            // });
          } else {
            this.$message.warning(
              res.message || res.data.resultCount || "赠送失败;未知错误"
            );
          }
          this.submitting = false;
        })
        .catch(() => {
          this.submitting = false;
          this.$message.error("异常");
        });
    },
    linkTo(location, action = "push") {
      this.$router[action](location);
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
    // //新加赠送需求
    // handleTextareaChange(msg) {
    //   let len = this.form.userIdStrTemp.split("\n").length;
    //   if (len === 0) {
    //     return;
    //   }
    //   this.userIdStrTempLen = len;
    //   this.userIdStrTempLenFlag = true;
    // },
    handleUserRoleClick(id) {
      this.vvId = id;
    },
    handleRoleClick(index, roleId) {
      this.userRoleGroup[index].roleId = roleId;
    },
    //点击下一步
    handleNextClick() {
      console.log(this.form.userIdStrTemp);

      // if (this.form.userIdStrTemp == "") {
      //   this.$message.error("请输入玩家账号");
      //   return false;
      // }
      // this.form.platformId = this.filters2.queryPlatform;
      // this.form.gameId = this.filters2.queryGame;
      // this.form.zoneId = this.filters2.queryZone;

      this.form.platformId = this.filters.queryPlatformid;
      this.form.gameId = this.filters.queryGameid;
      this.form.zoneId = this.filters.queryZone;

      this.form.userIdStr = this.form.userIdStrTemp
        .split("\n")
        .filter(item => item)
        .join(",");
      // console.log(this.form.userIdStr);
      // console.log(this.form.userIdStrTemp);
      // console.log(typeof(this.form.userIdStrTemp));
      let form = {
        // platformId: this.filters2.queryPlatform,
        // gameId: this.filters2.queryGame,
        // zoneId: this.filters2.queryZone,

        platformId: this.filters.queryPlatformid,
        gameId: this.filters.queryGameid,
        zoneId: this.filters.queryZone,

        userIdStr: this.form.userIdStr
      };
      const errMsg = [];
      if (this.form.userIdStr.trim() == "") {
        errMsg.push("请输入账号");
      }

      if (!this.form.platformId) {
        errMsg.push("请选择游戏平台");
      } else if (!this.form.gameId) {
        errMsg.push("请选择游戏");
      } else if (!this.form.zoneId) {
        errMsg.push("请选择区服");
      }
      if (errMsg.length > 0) {
        this.$message.error(errMsg[0]);
        return;
      }

      getFirstRechargeUserRole(form).then(res => {
        if (res.state == ok) {
          let userRoleGroup = [];
          userRoleGroup = res.data;
          userRoleGroup = userRoleGroup.map((item, index) => {
            if (item.roleList.length == 1) {
              return {
                ...item,
                roleId: item.roleList[0].roleId,
                roleName: item.roleList[0].roleName
              };
            }
            return { ...item, roleId: "", roleName: "" };
          });
          this.userRoleGroup = this.roleSort(userRoleGroup);
        } else {
          this.$message.error(res.message);
        }
      });
      form = null;
      // let userRoleGroup = [25462,548525,4756];

      // this.userRoleGroup = userRoleGroupMap.slice(0);
      // userRoleGroupMap = null;
      // console.log(userRoleGroupMap);
      this.submitFormFlag = true;
    },
    roleSort(data) {
      for (let i = 0, len = data.length; i < len; i++) {
        for (let j = 0, len = data.length; j < len - i - 1; j++) {
          if (data[j].roleList.length < data[j + 1].roleList.length) {
            let tem = null;
            tem = data[j];
            data[j] = data[j + 1];
            data[j + 1] = tem;
          }
        }
      }
      return data;
    }
  }
};
</script>

<style lang="scss" scoped>
.form-business {
  max-width: 500px;
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
.userId-strTemp {
  position: relative;
  span {
    position: absolute;
    right: 15px;
    bottom: 0;
  }
}
.user-role {
  display: flex;
  flex-direction: column;
  .user-role-item {
    display: flex;
    flex-direction: row;
    align-content: center;
    .el-button {
      margin-left: 0;
      margin-right: 10px;
    }
  }
}
</style>
