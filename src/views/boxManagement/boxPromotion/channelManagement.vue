<template>
  <div>
    <div class="page-crumbs">
      <div class="crumbs">
        <breadcrumb />
      </div>
    </div>
    <el-card>
      <div slot="header">
        <span style="color: #999; font-size: 18px">新增渠道</span>
      </div>
      <div class="body pt30 pb30 pl30">
        <div class="flex mid">
          <div class="mr10">
            <el-select v-model="currentGroup" filterable>
              <el-option
                v-for="item in groupList"
                :key="item.mcId"
                :label="item.channelName"
                :value="JSON.stringify(item)"
              ></el-option>
            </el-select>
          </div>
          <div class="mr50">
            <el-button @click="addmc(true)" type="primary"
              >添加主渠道</el-button
            >
          </div>
        </div>
        <div class="mt50">
          <el-table :data="tableList">
            <el-table-column prop="group" label="已添加主渠道">
              <template slot-scope="scope">
                <el-checkbox-group v-model="mcIds" size="small">
                  <el-checkbox :label="scope.row.mcId"
                    >{{ scope.row.channelName }}-{{
                      scope.row.mcId
                    }}</el-checkbox
                  >
                </el-checkbox-group>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="mt20">
          <el-button @click="save" type="primary">保存</el-button>
          <el-button @click="cannal" type="primary" plain>取消</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  gameMangerMcListByBoss,
  gameMangerScListByMc,
  gameMangerGameScList,
  gameMangerAddScGameList
} from "../../../api/gameProm";
import http from "@/utils/http";
export default {
  name: "channelManagement",
  data() {
    return {
      groupList: [],
      personList: [],
      tableList: [],
      currentGroup: "",
      currentPerson: "",
      savedMcIds: [],
      savedScIds: [],
      mcIds: [],
      scIds: [],
      delMcIds: [],
      delScIds: [],
      adventStatus: "",
      isGuildBoss: null
    };
  },
  created() {
    this.gameMangerGameScList();
    this.getGameMangerMcListByBoss();
    this.adventStatus = JSON.parse(
      window.sessionStorage.getItem("Admin-Account-Union")
    ).adventStatus;
    this.isGuildBoss = JSON.parse(
      window.sessionStorage.getItem("Admin-Account-Union")
    ).isGuildBoss;
    console.log(this.adventStatus, this.isGuildBoss);
  },
  watch: {
    currentGroup() {
      this.currentPerson = "";
    },
    mcIds: {
      handler() {
        this.mcIds.forEach(mcId => {
          this.tableList.forEach(tableItem => {
            if (mcId === tableItem.mcId) {
              tableItem.scids.forEach(scidItem => {
                const index = this.scIds.indexOf(scidItem.scid);
                index > -1 && this.scIds.splice(index, 1);
              });
              tableItem.scids = [];
            }
          });
        });
      },
      deep: true
    }
  },
  methods: {
    async save() {
      try {
        // const addMcIds = this.mcIds.filter(
        //   (item) => !this.savedMcIds.includes(item) && item
        // );
        const delMcIds = this.savedMcIds.filter(
          item => !this.mcIds.includes(item) && item
        );
        // console.log(this.mcIds);
        // const body = {
        //   mcIds: this.mcIds.join(","),
        //   delMcIds: delMcIds.join(",")
        // };

        const res = await http.post(
          `/guild/addBoxScIdList.do?mcIds=${this.mcIds.join(
            ","
          )}&delMcIds=${delMcIds.join(",")}`
        );
        if (res.state === "ok") {
          this.$message.success("保存成功");
          this.gameMangerGameScList();
        } else {
          this.$message.warning(res.message);
        }
      } catch (e) {
        this.$message.error("异常");
      }
    },
    async getGameMangerMcListByBoss() {
      try {
        const res = await http.get2("/guild/boxMcListByBoss.do");
        if (res.state === "ok") {
          this.groupList = res.data;
        } else {
          this.$message.warning(res.message);
        }
      } catch (e) {
        this.$message.error("异常");
      }
    },
    // async getGameMangerScListByMc() {
    //   try {
    //     const query = {
    //       mcId: JSON.parse(this.currentGroup).mcId,
    //     };
    //     const res = await gameMangerScListByMc(query);
    //     if (res.state === "ok") {
    //       this.personList = res.data;
    //     } else {
    //       this.$message.warning(res.message);
    //     }
    //   } catch (e) {
    //     this.$message.error("异常");
    //   }
    // },
    async gameMangerGameScList() {
      try {
        const res = await http.get2("/guild/boxSelectMcListByBoss.do");
        if (res.state === "ok") {
          res.data.forEach(item1 => {
            if (!item1.scid) {
              item1.scids = [];
              res.data.forEach(item2 => {
                if (item2.scid && item2.mcId === item1.mcId) {
                  item1.scids.push({
                    realName: item2.realName,
                    scid: item2.scid
                  });
                }
              });
            }
          });
          res.data = res.data.filter(item => !item.scid);

          console.log(res.data);

          let mcIds = [];
          let scIds = [];
          res.data.forEach(tableItem => {
            mcIds.push(tableItem.mcId);
          });
          this.tableList = res.data;
          this.mcIds = mcIds;
          this.savedMcIds = JSON.parse(JSON.stringify(mcIds));
          // console.log(this.savedMcIds, "this.savedMcIds", this.mcIds);
        } else {
          this.$message.warning(res.message);
        }
      } catch (e) {
        this.$message.error("异常");
      }
    },
    addmc(checked) {
      if (!this.currentGroup) return;
      const currentGroupObj = JSON.parse(this.currentGroup);
      const tableListMcIds = this.tableList.map(item => item.mcId);
      if (!tableListMcIds.includes(currentGroupObj.mcId)) {
        this.currentGroup &&
          this.tableList.push({
            mcId: currentGroupObj.mcId,
            channelName: currentGroupObj.channelName,
            scids: []
          });
        checked && this.mcIds.push(currentGroupObj.mcId);
      }
    },
    cannal() {
      this.$router.push("/boxManagement/boxPromotion/boxPromotion");
    }
  }
};
</script>

<style lang="scss" scoped></style>
