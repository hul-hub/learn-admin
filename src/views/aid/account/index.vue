<template>
  <div>
    <div class="page-crumbs">
      <div class="crumbs">
        <breadcrumb />
      </div>
    </div>
    <div>
      <div class="flex col center mid h500">
        <el-button
          class="w200 mb30"
          type="primary"
          :loading="applying"
          :disabled="disabled"
          @click="oneKeyApply()"
        >
          {{ buttonText }}
        </el-button>
        <el-button
          class="w200"
          style="margin-left: 0;margin-top:20px"
          type="primary"
          @click="firstApply()"
          >新角色第一次申请资源</el-button
        >
      </div>
      <!--<el-card class="box-card">-->
      <!--<div class="text item">-->
      <!--1. 首次申请建帮扶持：点击上方“新角色第一次申请扶持”选择您刚创建的角色，选择扶持金额即可提交，无需审核游戏内会自动到账。<br><br>-->
      <!--2. 建帮扶持：为提升团长带团体验，现在建帮扶持可以多次申请，每个角色有总上限。<br>-->
      <!--&nbsp;&nbsp; a.-->
      <!--例如正常玩家进服消费6元、30元、50元，领取所有新区消费礼包。那么现在每个扶持号都可以按这个顺序依次申请建帮扶持，但不能超过总上限。更像一个真实玩家的消费行为，提升自己的带团体验。<br>-->
      <!--&nbsp;&nbsp; b. 申请后自动到账无需审核。<br><br>-->
      <!--3. 首次扶持：小组内有玩家单笔消费指定金额后可激活。每个内玩角色被激活首次扶持后可申请一次。首次扶持只消耗扶持金额一半的元宝池。<br><br>-->
      <!--4. 后续扶持：整个小组同一区服所有扶持角色共用一个元宝池。<br>-->
      <!--&nbsp;&nbsp; a. 元宝池=玩家消费金额*神起扶持比例<br>-->
      <!--&nbsp;&nbsp; b. 单个内玩角色后续扶持不能超过所属公会该区消费最多的玩家的消费金额*120%<br>-->
      <!--&nbsp;&nbsp; c. 申请后自动到账无需审核。<br><br>-->
      <!--5. 预支扶持：元宝池消耗完后也可以超额申请扶持。<br>-->
      <!--&nbsp;&nbsp; a. 运营人员审批后到账<br>-->
      <!--&nbsp;&nbsp; b. 每个内玩角色透支额度为2000元rmb。透支后需要玩家有后续消费填充元宝池后才可继续申请。否则预支扶持及后续扶持都会因元宝池为负数导致无法申请扶持。<br><br>-->
      <!--6.注册起超过7天没有创建过角色的新扶持账号自动注销。<br><br>-->
      <!--7.超过30天没有申请过扶持的账号自动封号，无法再登录扶持账号。<br><br>-->
      <!--8.游戏合服后，公会所在该游戏的元宝池数值，将变更为合并区服的元宝池总和，合并区服后每个内玩角色透支额度仍为2000元rmb。<br><br>-->
      <!--</div>-->
      <!--</el-card>-->
    </div>
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
        <el-button type="primary" @click="firstApply()">申请资源</el-button>
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
import Breadcrumb from "@/components/Breadcrumb";
import {
  onekeyApplyAccount,
  getGameList,
  applySupportFirst,
  getUsableMoney
} from "@/api/aid";
import ApplySupportDialog from "@/components/ApplySupportDialog";
import { mapGetters } from "vuex";
import store from "@/store";
import aidService from "../../../service/aidService";

export default {
  components: {
    Breadcrumb,
    ApplySupportDialog
  },
  computed: {
    ...mapGetters({
      // account: 'userAccount',
    })
  },
  data() {
    return {
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
  created() {
    const { userId } = this.$store.getters.account;
    this.countDownKey = `aid-account-coundown-${userId}`;
    console.log(this.countDownKey);

    const counDownTime = window.sessionStorage.getItem(this.countDownKey);
    if (counDownTime && counDownTime > 0) {
      this.setCountDown(Number(counDownTime));
    }
  },
  methods: {
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
<style lang="scss">
.button-layout {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.top-button {
  // width: 20%;
  margin-right: 60px;
  margin-left: 60px;
  margin-bottom: 40px;
}

.mobile .dialog {
  width: auto;
}
</style>
