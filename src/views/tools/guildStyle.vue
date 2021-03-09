<template>
  <div>
    <div class="page-crumbs">
      <div class="crumbs">
        <breadcrumb />
      </div>
    </div>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <h3>平台logo变更</h3>
        <div class="extra"></div>
      </div>
      <div class="body flex">
        <el-form ref="ruleForm" label-width="150px">
          <el-form-item label="当前平台图标：">
            <el-upload
              class="avatar-uploader"
              name="pictureFile"
              :action="actionUrl"
              list-type="picture"
              :data="{
                type: 4
              }"
              :show-file-list="false"
              :on-success="companyHandle"
              :disabled="!editsubmitting"
            >
              <img v-if="mediaUrl" :src="mediaUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon color"></i>
              <div class="el-upload__tip" slot="tip">
                请上传png格式，尺寸为33*30的图片！
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="平台名称：">
            <el-input
              v-model="filters.platName"
              style="width: 360px"
              placeholder="例如：游戏推广平台"
              :disabled="!editsubmitting"
            ></el-input>
          </el-form-item>
          <el-form-item label="自定义域名：">
            <el-input
              placeholder="请输入域名"
              v-model="filters.mark"
              style="width:360px"
              :disabled="!editsubmitting"
            >
              <template slot="prepend"
                >{{ origin }}/</template
              >
              <template slot="append"
                >?</template
              >
            </el-input>
            <el-button
              size="mini"
              v-show="!editsubmitting"
              style="margin-left:10px"
              class="tag-read"
              @click="copy"
              >复制</el-button
            >
          </el-form-item>
          <el-form-item label=" ">
            <span>1.请填写简短易记的域名后缀，以便更好推广您的网站；</span
            ><br />
            <span
              >2.首次更改自定义域名后，无法自行做二次修改，如需更改，请联系内部专员；</span
            >
          </el-form-item>
          <el-form-item label="">
            <el-button @click="editsubmit(true)" v-show="!editsubmitting"
              >编辑</el-button
            >
            <el-button
              type="primary"
              @click="submitForm"
              :loading="submitting"
              v-show="editsubmitting"
              >保存</el-button
            >
            <el-button @click="editsubmitdel(false)" v-show="editsubmitting"
              >取消</el-button
            >
            <el-button
              type="info"
              @click="editsubmitrest"
              v-show="editsubmitting"
              >恢复默认设置</el-button
            >
          </el-form-item>
        </el-form>
        操作说明
        <el-tooltip class="item h15" effect="dark" placement="top-start">
          <div slot="content">
            <h3>说明：</h3>
            <p>
              设置自定义平台Logo及平台名称后，将在以下位置显示。（红色方框圈出）
            </p>
            <p><img src="../../assets/images/guildStyle.png" alt="" /></p>
          </div>
          <i class="el-icon-question"></i>
        </el-tooltip>
      </div>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
const ACTION_URL = `/media/uploadImage.do`;
import { findPrivateLogo, editPrivatePage } from "@/api/tools";
import Clipboard from "clipboard";
import { constants } from "fs";

export default {
  name: "guildStyle",
  components: {
    Breadcrumb
  },
  data() {
    return {
      origin: "",
      mediaUrl: "",
      actionUrl: ACTION_URL,
      submitting: false,
      editsubmitting: false,
      filters: {
        platName: "",
        mark: "",
        rest: false
      },
      // 复制弹窗
      clipboardDialog: {
        visible: false,
        link: ""
      }
    };
  },
  created() {
    this.getCookies();
    this.origin = location.origin;
  },
  methods: {
    getCookies() {
      var c_param = "";
      if (document.cookie.length > 0) {
        var arr = document.cookie.split("; "); //这里显示的格式需要切割一下自己可输出看下
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split("="); //再次切割
          //判断查找相对应的值
          if (arr2[0] == "Admin-Token-platform") {
            c_param = arr2[1];
            //保存到保存数据的地方
          }
        }
        this.filters.mark = c_param;
        console.log(c_param, this.filters.mark, "c_param");
        this.findPrivateLogo();
      }
    },
    //恢复默认设置
    editsubmitrest() {
      this.filters.platName = "";
      this.mediaUrl = ""; //vv图片logo路径
      this.filters.rest = true;
      this.submitForm();
    },
    editsubmit(val) {
      this.editsubmitting = val;
    },
    editsubmitdel(val) {
      this.editsubmitting = val;
      this.findPrivateLogo();
    },
    findPrivateLogo() {
      const data = {
        postfixName: this.filters.mark
        //privateName:'',
        //logoImage:'',
      };
      findPrivateLogo(data)
        .then(res => {
          if (res.state === "fail") {
            this.$message.error(res.message || "获取失败，请重试");
            return;
          } else {
            this.filters.platName = res.data.privateName;
            this.filters.mark = res.data.postfixName;
            this.mediaUrl = res.data.logoImage;
          }
        })
        .catch(e => {
          this.$message.error("查询失败，请重试");
        });
    },
    companyHandle(res, file) {
      if (res.state === "ok") {
        this.mediaUrl = res.data.mediaUrl;
      } else if (res.state === "fail") {
        this.$message.error(res.message || "图片上传失败，请重试!");
      }
    },
    // 提交
    submitForm() {
      if (this.mediaUrl === "" && this.filters.rest === false) {
        this.$message.error("平台图标不能为空");
        return false;
      }
      if (this.filters.platName === "" && this.filters.rest === false) {
        this.$message.error("平台名称不能为空");
        return false;
      }
      if (this.filters.mark === "" && this.filters.rest === false) {
        this.$message.error("自定义域名不能为空");
        return false;
      }
      this.submitting = true;
      let data = {
        logoImage: this.filters.rest === true ? "" : this.mediaUrl,
        privateName: this.filters.rest === true ? "" : this.filters.platName,
        postfixName: this.filters.mark
      };
      editPrivatePage(data)
        .then(res => {
          console.log("editStaffInfo", res);
          this.submitting = false;
          if (res.state === "fail") {
            this.$message.error(res.message || "保存失败，请重试");
            return;
          } else {
            this.$message.success(res.message || "保存成功");
            this.filters.platName = res.data.privateName;
            this.filters.mark = res.data.postfixName;
            this.mediaUrl = res.data.logoImage;
            this.editsubmitting = false;
            //this.findPrivateLogo();
          }
        })
        .catch(e => {
          this.submitting = false;
          this.$message.error("提交失败，请重试");
        });
    },
    //复制自定义域名
    copy() {
      if (this.filters.mark === "") {
        this.$message.error("域名为空，不能复制");
        return;
      }
      let code = this.origin + "/" + this.filters.mark + "?";
      let clipboard = new Clipboard(".tag-read", {
        text: function() {
          return code;
        }
      });
      clipboard.on("success", e => {
        console.log("复制成功");
        this.$message.success("复制成功"); // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        // 不支持复制
        this.$message.error("复制失败"); // 释放内存
        clipboard.destroy();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed yellow;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.color {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}
.color:hover {
  border-color: #409eff;
}
.el-upload__tip {
  color: red;
}
</style>
