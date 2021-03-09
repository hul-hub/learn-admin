<template>
  <div>
    <div class="page-crumbs">
      <div class="crumbs">
        <breadcrumb />
      </div>
    </div>
    <div>
      <h3>操作说明：</h3>
      <p>1.搜索对应账号，针对账号所在的游戏进行游戏归属改绑；</p>
      <p>2.改绑必须填写业务分割时间、新归属的主渠道ID、新归属的子渠道ID；</p>
      <p>3.改绑会影响主渠道业绩汇总，请谨慎操作！</p>
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
                <el-select
                  v-model="filters.queryType"
                  placeholder="请选择"
                  style="width: 150px;"
                  @change="handleQueryKeyChange"
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
                  @keyup.enter.native="submitSearch"
                  v-model="filters.queryValue"
                  placeholder="请输入关键词"
                ></el-input>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="4" :xl="4">
              <el-button @click="submitSearch" type="primary">查询</el-button>
              <el-button @click="resetFilter">重置</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>

    <el-card class="box-card" shadow="never" v-if="false">
      <div slot="header" class="clearfix head">
        <h3>VV</h3>
      </div>
      <div class="body">
        <el-table
          :data="list.filter(item => item.gameName === 'VV语音')"
          tooltip-effect="dark"
          style="width: 100%"
          border
          v-loading="loading"
        >
          <el-table-column label="vv账号" align="center">
            <template slot-scope="scope">{{
              scope.row.gameName || "-"
            }}</template>
          </el-table-column>
          <el-table-column label="所属主渠道" width="500" align="center">
            <template slot-scope="scope"
              >ID：{{ scope.row.mcId || "-" }}<br />名称：{{
                scope.row.mcIdName || "-"
              }}<br />账号：{{ scope.row.mcIdLoginName || "-" }}</template
            >
          </el-table-column>
          <el-table-column label="所属子渠道" width="500" align="center">
            <template slot-scope="scope"
              >ID：{{ scope.row.scId || "-" }}<br />名称：{{
                scope.row.scIdName || "-"
              }}<br />账号：{{ scope.row.scIdLoginName || "-" }}</template
            >
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="
                  dialogConfirm.userId = `${scope.row.vvId}`;
                  dialogConfirm.gameName = `${scope.row.gameName}`;
                  dialogConfirm.gameId = `${scope.row.gameId}`;
                  dialogConfirm.platformId = `${scope.row.platformId}`;
                  dialogConfirm.mcId = `${scope.row.mcId}`;
                  dialogConfirm.scId = `${scope.row.scId}`;
                  dialogConfirm.visible = true;
                "
                >改绑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix head">
        <h3>游戏角色列表</h3>
      </div>
      <div class="body">
        <el-table
          :data="list.filter(item => item.gameName !== 'VV语音')"
          tooltip-effect="dark"
          style="width: 100%"
          border
          v-loading="loading"
        >
          <el-table-column label="游戏名称" width="260" align="center">
            <template slot-scope="scope">{{
              scope.row.gameName || "-"
            }}</template>
          </el-table-column>
          <el-table-column label="所属主渠道" width="300" align="center">
            <template slot-scope="scope"
              >ID：{{ scope.row.mcId || "-" }}<br />名称：{{
                scope.row.mcIdName || "-"
              }}<br />账号：{{ scope.row.mcIdLoginName || "-" }}</template
            >
          </el-table-column>
          <el-table-column label="所属子渠道" width="300" align="center">
            <template slot-scope="scope"
              >ID：{{ scope.row.scId || "-" }}<br />名称：{{
                scope.row.scIdName || "-"
              }}<br />账号：{{ scope.row.scIdLoginName || "-" }}</template
            >
          </el-table-column>
          <el-table-column label="区名" width="210" align="center">
            <template slot-scope="scope">
              <div
                style=" margin: 0 -10px"
                v-for="(item, index) in scope.row.roleInfoViewList"
                :key="index"
              >
                {{ scope.row.roleInfoViewList[index].zoneName || "-" }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="角色名" min-width="220" align="center">
            <template slot-scope="scope">
              <div
                style=" margin: 0 -10px"
                v-for="(item, index) in scope.row.roleInfoViewList"
                :key="index"
              >
                {{ scope.row.roleInfoViewList[index].roleName || "-" }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="充值数" min-width="133" align="center">
            <template slot-scope="scope">
              <div
                style=" margin:0 -10px"
                v-for="(item, index) in scope.row.roleInfoViewList"
                :key="index"
              >
                {{ scope.row.roleInfoViewList[index].consumeTotal / 100 }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="
                  dialogConfirm.userId = `${scope.row.vvId}`;
                  dialogConfirm.gameName = `${scope.row.gameName}`;
                  dialogConfirm.gameId = `${scope.row.gameId}`;
                  dialogConfirm.platformId = `${scope.row.platformId}`;
                  dialogConfirm.mcId = `${scope.row.mcId}`;
                  dialogConfirm.scId = `${scope.row.scId}`;
                  dialogConfirm.visible = true;
                "
                >改绑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <!--<div class="table-footer">-->
        <!--<div class="actions">-->
        <!--</div>-->
        <!--<div class="pages" style="float:right">-->
        <!--<el-pagination-->
        <!--background-->
        <!--layout="prev, pager, next,total"-->
        <!--:current-page="pageNo"-->
        <!--:total="total"-->
        <!--@current-change="handleCurrentChange"-->
        <!--&gt;-->
        <!--</el-pagination>-->
        <!--</div>-->
        <!--</div>-->

        <!--改绑玩家弹窗-->
        <el-dialog
          @close="dialogClose"
          title="改绑玩家"
          :visible.sync="dialogConfirm.visible"
        >
          <el-form
            :label-position="labelPosition"
            label-width="120px"
            :model="form"
            :rules="rules"
            ref="form"
          >
            <el-form-item label="账号：">
              <template>
                {{ dialogConfirm.userId }}
              </template>
            </el-form-item>
            <el-form-item label="游戏名称：">
              <template>
                {{ dialogConfirm.gameName }}
              </template>
            </el-form-item>
            <el-form-item label="原主渠道ID：" prop="mcId">
              <template>
                {{ dialogConfirm.mcId }}
              </template>
            </el-form-item>
            <el-form-item label="原子渠道ID：">
              <template>
                {{ dialogConfirm.scId }}
              </template>
            </el-form-item>
            <el-form-item label="切割时间：" prop="date">
              <el-date-picker
                type="datetime"
                placeholder="年-月-日："
                v-model="form.date"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="form.currentTime"
                :picker-options="expireTimeOption"
                style="width: 300px;"
                @focus="handleDateFocus"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="新主渠道ID：" prop="channel">
              <el-input
                class="w300"
                v-model.trim="form.channel"
                @blur="delBlank"
              ></el-input>
            </el-form-item>
            <el-form-item label="新子渠道ID：" prop="subchannel">
              <el-input
                class="w300"
                v-model.trim="form.subchannel"
                @blur="delBlank2"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                :loading="submitting"
                @click="submitForm('form')"
                type="primary"
                >保存</el-button
              >
            </el-form-item>
            <div
              style="color: #fff; position: absolute; right: 125px; bottom: 157px; background: #36a9ce; padding: 0 8px; box-shadow: 6px 6px 5px #888888;"
            >
              <p>1.业绩分割线之后，改绑玩家归属于新的主渠道/子渠道。</p>
              <p>2.新主渠道和子渠道应当填写对应渠道号。</p>
              <p>3.改绑会影响对账，请谨慎操作！</p>
            </div>
          </el-form>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
import { getNewGamePlayers, changeBindNewGamePlayer } from "@/api/tools";

export default {
  name: "toolsChangeBind",
  components: {
    Breadcrumb
  },
  data() {
    return {
      expireTimeOption: {
        disabledDate(date) {
          //分割时间只能选今天及之前
          return date.getTime() >= Date.now();
        }
      },
      filters: {
        queryType: "1",
        queryTypes: [
          {
            label: "账号",
            value: "1"
          }
          // {
          //   label: "用户账号",
          //   value: "2"
          // },
        ],
        queryValue: ""
      },
      loading: false,
      submitting: false,

      list: [],
      labelPosition: "right",
      form: {
        date: "",
        currentTime: [],
        channel: "",
        subchannel: ""
      },

      rules: {
        date: [{ required: true, message: "业绩分割线不能为空" }],
        channel: [{ required: true, message: "新主渠道不能为空" }],
        subchannel: [{ required: true, message: "新子渠道不能为空" }]
      },
      dialogConfirm: {
        visible: false,
        userId: "",
        platformId: "",
        nowMcId: "",
        nowScId: "",
        splitDate: "",
        gameName: "",
        mcId: "",
        scId: "",
        gameId: ""
      }
    };
  },
  created() {},
  methods: {
    delBlank() {
      this.form.channel = this.form.channel.replace(/\s*/g, "");
    },
    delBlank2() {
      this.form.subchannel = this.form.subchannel.replace(/\s*/g, "");
    },
    //清空表单
    dialogClose() {
      this.form.date = "";
      this.form.channel = "";
      this.form.subchannel = "";
    },
    async submitSearch() {
      if (this.filters.queryValue === "") {
        this.$message.error("账号不能为空");
        return;
      }
      this.loading = true;
      try {
        const query = {
          queryType: this.filters.queryType,
          queryValue: this.filters.queryValue
        };
        const res = await getNewGamePlayers(query);
        this.loading = false;
        if (res.state === "fail") {
          this.$message.error(res.message || "查询失败，请重试");
        } else if (res.state === "ok") {
          this.list = res.data;
        }
      } catch (error) {
        console.log("changeBind submitSearch", error);
        this.loading = false;
        this.$message.error("查询失败，请重试");
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.submitting = true;
          try {
            const query = {
              userId: this.dialogConfirm.userId,
              platformId: this.dialogConfirm.platformId,
              nowMcId: this.dialogConfirm.mcId,
              nowScId: this.dialogConfirm.scId,
              splitDate: this.form.date,
              mcId: this.form.channel,
              scId: this.form.subchannel,
              gameId: this.dialogConfirm.gameId
            };
            const res = await changeBindNewGamePlayer(query);
            console.log(res);
            this.submitting = false;
            if (res.state === "fail") {
              this.$message.error(res.message || "玩家改绑失败，请重试");
            } else if (res.state === "ok") {
              this.$message.success("玩家改绑成功");
              this.dialogConfirm.visible = false;
            }
          } catch (error) {
            console.error("changeBind submitForm error =>>", error);
            this.submitting = false;
            this.$message.error("玩家改绑失败，请重试");
          }
        }
      });
    },
    // 设置默认时分秒
    handleDateFocus() {
      const nowDate = new Date();
      const hours = nowDate.getHours();
      const minutes = nowDate.getMinutes();
      const seconds = nowDate.getSeconds();
      this.form.currentTime = `${hours}:${minutes}:${seconds}`;
    },

    // 搜索关键词的 query key
    handleQueryKeyChange(option) {
      this.filters.queryType = option;
    },
    // 重置条件
    resetFilter() {
      this.filters.queryType = "1";
      this.filters.queryValue = "";
      // this.filters.platformId = "";
      // this.submitSearch();
      this.list = [];
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
