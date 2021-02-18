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
          style="width:100px"
          @keyup.enter.native="submitFilter"
          v-model="filters.queryValue"
          placeholder="输入查询关键词"
        ></el-input>
        <div style="flex:1" />
        <el-button
          style="margin-right:30px;width:100px"
          @click="submitFilter"
          type="primary"
          >查询</el-button
        >
      </div>
    </el-card>

    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <h3>帐号列表</h3>
        <div class="extra">
          <el-button
            class="w200 mb30"
            type="primary"
            :loading="applying"
            :disabled="disabled"
            size="medium"
            @click="oneKeyApply()"
          >
            {{ buttonText }}
          </el-button>
        </div>
      </div>
      <div class="body">
        <el-radio-group
          style="margin-bottom: 10px"
          size="small"
          v-model="filters.state"
          @change="radioChange"
        >
          <el-radio-button label="全部帐号"></el-radio-button>
          <el-radio-button label="正常帐号"></el-radio-button>
          <el-radio-button label="已冻结帐号"></el-radio-button>
          <el-radio-button label="已封停帐号"></el-radio-button>
          <el-radio-button label="异地登录帐号"></el-radio-button>
          <el-radio-button label="已注销"></el-radio-button>
        </el-radio-group>
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
          ></el-table-column>
          <el-table-column
            prop="channelName"
            label="所属主渠道"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="roleNumber"
            label="申请资源角色数"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="rechargeMoney"
            label="消费金额（元）"
            width="150"
            align="center"
          ></el-table-column>
          <!--<el-table-column-->
          <!--label="操作记录"-->
          <!--align="center"-->
          <!--&gt;-->
          <!--<template slot-scope="scope">-->
          <!--<span class="action-button" @click="checkRecode(scope.row.userId)">[查看]</span>-->
          <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column prop="statusStr" label="帐号状态" align="center">
          </el-table-column>
          <el-table-column prop="remark" label="状态说明" align="center">
          </el-table-column>
          <el-table-column
            prop="applyAuthStr"
            label="申请资源状态"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="帐号创建时间"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" align="center" width="180">
            <template slot-scope="scope">
              <span
                v-if="scope.row.status !== 6"
                class="action-button"
                @click="
                  operatingAccountDialog(scope.row.userId, scope.row.status)
                "
                >{{ scope.row.status | formatStatus }}
              </span>
              <span
                v-if="scope.row.status !== 6"
                class="action-button"
                @click="changePswDialog(scope.row.userId)"
                >[重置密码]</span
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
    <el-dialog
      class="full-dialog"
      :visible.sync="operationDialogVisible"
      width="20%"
    >
      <div style="display: flex;flex-direction: column;align-items: center">
        <span style="margin-bottom: 20px">{{ title }}</span>
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5 }"
          placeholder="操作备注信息（选填）"
          v-model="remark"
        >
        </el-input>
        <el-row style="margin-top: 20px">
          <el-button
            style="width: 100px;margin-right: 20px"
            @click="operationDialogVisible = false"
            >取消</el-button
          >
          <el-button
            style="width: 100px"
            type="primary"
            @click="operatingAccount"
            >{{ userState | formatStatus2 }}
          </el-button>
        </el-row>
      </div>
    </el-dialog>

    <el-dialog class="full-dialog" :visible.sync="pswDialogVisible" width="50%">
      <el-form
        :rules="rules"
        ref="passwordForm"
        label-width="160px"
        class="form-password"
      >
        <el-form-item label="账号：">
          <el-input disabled v-model="userId"></el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="newPsw">
          <el-input
            type="password"
            placeholder="6-15个字符，至少含数字、字母、符号中的2种"
            v-model="newPsw"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="changePsw()"
            :loading="submitting"
            style="width: 100%"
            >修改
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="您已成功申请资源号"
      :visible.sync="dialogVisible"
      width="50%"
      class="full-dialog"
    >
      <div
        style="display: flex;flex-direction: column;align-items: center;justify-content: center"
      >
        <span>资源号：{{ account }}</span>
        <span style="margin-top: 3px">密码：{{ psw }}</span>
        <span style="margin-top: 10px"
          >注：请申请人在申请资源号7天内创建角色，并尽快修改密码哦。</span
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">知道了</el-button>
        <el-button type="primary" @click="firstApply()">申请资源号</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="firstDialogVisible"
      width="50%"
      class="full-dialog"
    >
      <ApplySupportDialog :defaultAccount="account" />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import ApplySupportDialog from "@/components/ApplySupportDialog";
import {
  getSupportAccountList,
  changeAccountState,
  updatePassword,
  onekeyApplyAccount
} from "@/api/aid";

export default {
  name: "AidAccountManageIndex",
  components: {
    Breadcrumb,
    ApplySupportDialog
  },
  computed: {
    // ...mapGetters(["account"])
  },
  data() {
    return {
      title: "",
      operationDialogVisible: false,
      pswDialogVisible: false,
      remark: "",
      userState: "",
      userId: "",
      newPsw: "",
      rules: {
        newPsw: [{ required: true, message: "请输入新密码" }]
      },
      filters: {
        queryType: "1",
        queryTypes: [
          {
            label: "账号",
            value: "1"
          }
        ],
        queryValue: "",
        date: [],
        state: "全部帐号"
      },
      registers: [],
      loading: false,
      page: 1,
      pageCount: 0,
      size: 10,
      total: 0,
      submitting: false,
      firstDialogVisible: false,
      dialogVisible: false,
      account: "",
      psw: "",
      applying: false,
      buttonText: "一键申请资源号",
      disabled: false,
      countDownKey: ""
    };
  },
  filters: {
    formatStatus: function(value) {
      switch (value) {
        case 4:
          return "[激活]";
      }
      return "[冻结]";
    },
    formatStatus2: function(value) {
      switch (value) {
        case 4:
          return "激活";
      }
      return "冻结";
    }
    // getStatus: function (value) {
    //   switch (value) {
    //     case 1:
    //       return "正常"
    //     case 2:
    //       return "封停"
    //     case 3:
    //       return "异地登录"
    //     case 4:
    //       return "冻结"
    //   }
    //   return "";
    // },
  },
  created() {
    this.getSupportAccountList();
    const { userId } = this.$store.getters.account;
    this.countDownKey = `aid-account-coundown-${userId}`;
    console.log(this.countDownKey);

    const counDownTime = window.sessionStorage.getItem(this.countDownKey);
    if (counDownTime && counDownTime > 0) {
      this.setCountDown(Number(counDownTime));
    }
  },
  methods: {
    getSupportAccountList() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      getSupportAccountList({
        //queryType: this.filters.queryType,
        queryValue: this.filters.queryValue,
        status: this.getState(),
        pagination: {
          pageNo: this.page,
          pageSize: this.size
        }
      })
        .then(res => {
          this.loading = false;
          if (res.state === "ok") {
            console.log("成功");
            const { data, pagination } = res;
            this.registers = data;
            console.log(pagination.count);
            console.log(pagination.pageSize);
            console.log(Math.ceil(pagination.count / pagination.pageSize));
            this.pageCount = Math.ceil(pagination.count / pagination.pageSize);
            this.total = pagination.count;
          } else if (res.state === "fail") {
            this.$message.error("网络链接失败，请刷新重试");
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
      this.getSupportAccountList();
    },
    // 查询类型 select change
    handleQueryTypeChange(option) {
      this.filters.queryType = option;
    },
    // 切换分页
    handleCurrentChange(page) {
      this.page = page;
      console.log("获取列表数据");
      this.getSupportAccountList();
    },
    // 重置
    radioChange() {
      this.page = 1;
      this.getSupportAccountList();
    },
    // 倒出数据
    exportDatas() {},
    getState() {
      switch (this.filters.state) {
        case "正常帐号":
          return "1";
        case "已封停帐号":
          return "2";
        case "异地登录帐号":
          return "3";
        case "已冻结帐号":
          return "4";
        case "已注销":
          return "6";
        default:
          return "";
      }
    },
    checkRecode(userId) {
      console.log(userId);
    },
    //冻结激活Dialog
    operatingAccountDialog(userId, state) {
      this.operationDialogVisible = true;
      this.userId = userId;
      this.userState = state;
      if (state === 4) {
        this.title = "帐号" + userId + "将被激活";
      } else {
        this.title = "帐号" + userId + "将被冻结";
      }
    },
    //冻结激活操作
    operatingAccount() {
      changeAccountState({
        remark: this.remark,
        status: this.userState !== 4 ? 4 : 1,
        vvid: this.userId
      })
        .then(res => {
          const { message } = res;
          this.remark = "";
          if (res.state === "ok") {
            this.operationDialogVisible = false;
            this.$message.success({
              message: message || "修改成功",
              duration: 700,
              onClose: () => {}
            });
            this.remark = "";
            this.getSupportAccountList();
          } else {
            this.$message.error(res.message || "操作失败");
          }
        })
        .catch(() => {});
    },
    changePswDialog(userId) {
      this.pswDialogVisible = true;
      this.userId = userId;
      this.newPsw = "";
    },
    changePsw() {
      if (this.newPsw.length < 6) {
        this.$message.error("密码不能少于6位");
        return;
      }
      if (this.newPsw.length > 15) {
        this.$message.error("密码不能多于15位");
        return;
      }
      if (!this.txtPassword_check(this.newPsw)) {
        this.$message.error("密码至少含数字、字母、符号中的2种");
        return;
      }
      const data = {
        vvid: this.userId,
        password: this.newPsw
      };

      this.submitting = true;
      updatePassword(data)
        .then(res => {
          console.log("success");
          console.log(res);
          this.submitting = false;
          const { message } = res;
          if (res.state === "ok") {
            this.pswDialogVisible = false;
            this.$message.success({
              message: message || "修改成功",
              duration: 700,
              onClose: () => {}
            });
          } else {
            this.$message.error(message || "提交失败，请重试");
          }
        })
        .catch(() => {
          console.log("catch");
          this.submitting = false;
          this.$message.error("提交失败，请重试");
        });
    },
    txtPassword_check(strPassword) {
      let num = 0;
      if (strPassword.search(/[A-Z]/) != -1) {
        num += 1;
      }
      if (strPassword.search(/[0-9]/) != -1) {
        num += 1;
      }
      if (strPassword.search(/[a-z]/) != -1) {
        num += 1;
      }
      if (strPassword.search(/[^A-Za-z0-9]/) != -1) {
        num += 1;
      }
      if (num >= 2 && (strPassword.length >= 6 && strPassword.length <= 16)) {
        return true;
      } else {
        return false;
      }
    },
    setCountDown(time = 1 * 60) {
      let buttonText = this.buttonText;
      let counDownTime = time;
      let timer = null;

      const countDown = () => {
        window.sessionStorage.setItem(this.countDownKey, counDownTime);
        if (counDownTime > 0) {
          this.disabled = true;
          this.buttonText = `${counDownTime}秒后重新申请`;
          counDownTime -= 1;
          timer = setTimeout(() => {
            countDown();
          }, 1000);
        } else {
          this.disabled = false;
          this.buttonText = buttonText;
          clearTimeout(timer);
          timer = null;
        }
      };

      countDown();
    },
    oneKeyApply() {
      this.applying = true;
      onekeyApplyAccount()
        .then(res => {
          this.applying = false;
          if (res.state === "ok") {
            this.account = res.data.userId;
            this.psw = res.data.password;
            this.dialogVisible = true;
            // 5 分钟禁用
            this.setCountDown();
          } else if (res.state === "fail") {
            const { message } = res;
            this.$message.error(message || "申请失败");
          }
        })
        .catch(err => {
          console.log(err);
          this.applying = false;
          this.$message.error("提交失败，请重试");
        });
    },
    firstApply() {
      this.dialogVisible = false;
      this.firstDialogVisible = true;
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
.mobile {
  .full-dialog {
    .el-dialog {
      width: 95% !important;
    }
  }
}
</style>
