<template>
  <div>
    <div class="page-crumbs">
      <div class="crumbs">
        <breadcrumb />
      </div>
    </div>
    <el-card>
      <div slot="header"><h3>子渠道列表</h3></div>
      <div class="body pt30 pb30 pl30">
        <div class="flex mid">
          <div class="mr10">
            <el-select @change="getGameMangerScListByMc" v-model="currentGroup">
              <el-option
                v-for="item in groupList"
                :key="item.mcid"
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
          <!--<div class="mr10">-->
          <!--<el-select v-model="currentPerson">-->
          <!--<el-option v-for="item in personList" :key="item.scid" :label="item.realName"-->
          <!--:value="JSON.stringify(item)"></el-option>-->
          <!--</el-select>-->
          <!--</div>-->
          <!--<div class="mr70">-->
          <!--<el-button @click="addsc" type="primary">添加子渠道</el-button>-->
          <!--</div>-->
        </div>
        <div class="mt50">
          <el-table :data="tableList">
            <el-table-column prop="group" label="已添加主渠道">
              <template slot-scope="scope">
                <el-checkbox-group v-model="mcIds" size="small">
                  <el-checkbox :label="scope.row.mcid">{{
                    scope.row.channelName
                  }}</el-checkbox>
                </el-checkbox-group>
              </template>
            </el-table-column>
            <!--<el-table-column prop="person" label="已添加子渠道">-->
            <!--<template slot-scope="scope">-->
            <!--<el-checkbox-group v-model="scIds" size="small">-->
            <!--<el-checkbox :label="item.scid" v-for="item in scope.row.scids" :key="item.scid">-->
            <!--{{item.realName}}-->
            <!--</el-checkbox>-->
            <!--</el-checkbox-group>-->
            <!--</template>-->
            <!--</el-table-column>-->
          </el-table>
        </div>
        <div class="mt20">
          <el-button @click="save" type="primary">保存</el-button>
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

export default {
  name: "edit",
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
      delScIds: []
    };
  },
  created() {
    this.gameMangerGameScList();
    this.getGameMangerMcListByBoss();
  },
  watch: {
    currentGroup() {
      this.currentPerson = "";
    },
    mcIds: {
      handler() {
        this.mcIds.forEach(mcid => {
          this.tableList.forEach(tableItem => {
            if (mcid === tableItem.mcid) {
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
        const addScIds = this.scIds.filter(
          item => !this.savedScIds.includes(item) && item
        );
        const delScIds = this.savedScIds.filter(
          item => !this.scIds.includes(item) && item
        );
        const addMcIds = this.mcIds.filter(
          item => !this.savedMcIds.includes(item) && item
        );
        const delMcIds = this.savedMcIds.filter(
          item => !this.mcIds.includes(item) && item
        );

        const body = {
          planId: Number(this.$route.query.planId),
          mcIds: addMcIds.join(","),
          scIds: addScIds.join(","),
          delMcIds: delMcIds.join(","),
          delScIds: delScIds.join(",")
        };
        const res = await gameMangerAddScGameList(body);
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
        const res = await gameMangerMcListByBoss();
        if (res.state === "ok") {
          this.groupList = res.data;
        } else {
          this.$message.warning(res.message);
        }
      } catch (e) {
        this.$message.error("异常");
      }
    },
    async getGameMangerScListByMc() {
      try {
        const query = {
          mcId: JSON.parse(this.currentGroup).mcid
        };
        const res = await gameMangerScListByMc(query);
        if (res.state === "ok") {
          this.personList = res.data;
        } else {
          this.$message.warning(res.message);
        }
      } catch (e) {
        this.$message.error("异常");
      }
    },
    async gameMangerGameScList() {
      try {
        const query = {
          gameId: this.$route.query.gameId
        };
        const res = await gameMangerGameScList(query);
        if (res.state === "ok") {
          res.data.forEach(item1 => {
            if (!item1.scid) {
              item1.scids = [];
              res.data.forEach(item2 => {
                if (item2.scid && item2.mcid === item1.mcid) {
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
            if (tableItem.scids.length > 0) {
              scIds = [...scIds, ...tableItem.scids.map(scids => scids.scid)];
            } else {
              mcIds.push(tableItem.mcid);
            }
          });
          this.tableList = res.data;
          this.mcIds = mcIds;
          this.scIds = scIds;
          this.savedMcIds = JSON.parse(JSON.stringify(mcIds));
          this.savedScIds = JSON.parse(JSON.stringify(scIds));
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
      const tableListMcIds = this.tableList.map(item => item.mcid);
      if (!tableListMcIds.includes(currentGroupObj.mcid)) {
        this.currentGroup &&
          this.tableList.push({
            mcid: currentGroupObj.mcid,
            channelName: currentGroupObj.channelName,
            scids: []
          });
        checked && this.mcIds.push(currentGroupObj.mcid);
      }
    },
    addsc() {
      if (!this.currentPerson) return;
      const currentGroupObj = JSON.parse(this.currentGroup);
      const currentPersonObj = JSON.parse(this.currentPerson);
      this.addmc(false);
      this.tableList.forEach(item => {
        if (item.mcid === currentGroupObj.mcid) {
          const tableScids = item.scids.map(item => item.scid);
          if (!tableScids.includes(currentPersonObj.scid)) {
            item.scids.push(currentPersonObj);
            this.scIds.push(currentPersonObj.scid);
            this.mcIds = this.mcIds.filter(item => {
              return item !== currentGroupObj.mcid;
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
