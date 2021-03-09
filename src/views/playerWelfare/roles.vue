<template>
  <div>
    <div class="page-crumbs">
      <div class="crumbs">
        <breadcrumb />
      </div>
    </div>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix head">
        <h3>员工授权</h3>
      </div>
      <div class="body">
        <el-tree
          :data="channelInfoList"
          show-checkbox
          node-key="id"
          ref="tree"
          class="elTree mb10"
          highlight-current
          :default-expanded-keys="['全选']"
          :default-checked-keys="selectArr"
          :props="defaultProps"
        >
        </el-tree>
        <el-button
          type="primary"
          size="small"
          class="mt10"
          @click="saveChannelInfoAuth"
          >保存</el-button
        >
      </div>
    </el-card>
  </div>
</template>
<script>
import Breadcrumb from "@/components/Breadcrumb";
import http from "@/utils/http";
import moment from "moment";

export default {
  name: "playerWelfareCumulative",
  components: {
    Breadcrumb
  },
  data() {
    return {
      channelInfoList: [],
      selectArr: [],
      defaultProps: {
        children: "children",
        label: "channelName"
      }
    };
  },
  created() {
    this.getChannelInfoAuth();
  },
  methods: {
    // 保存
    saveChannelInfoAuth() {
      console.log(
        this.$refs.tree
          .getCheckedNodes()
          .filter(item => {
            return !item.parent;
          })
          .map(item => {
            return item.id;
          }),
        "this.$refs.tree.getCheckedNodes()"
      );
      const arr = this.$refs.tree
        .getCheckedNodes()
        .filter(item => {
          return !item.parent;
        })
        .map(item => {
          return item.id;
        });
      let arrList = [];
      this.resData.forEach((item, index) => {
        if (arr.includes(item.scId)) {
          item.selectState = 1;
          arrList.push(item);
        } else {
          if (item.id) {
            arrList.push(item);
          }
          item.selectState = 0;
        }
      });
      const data = arrList;
      http
        .post("/guild/getChannelInfoAuth.update.do", data)
        .then(res => {
          if (res.state == "ok") {
            this.$message.success(res.message || "保存成功");
            this.dialogVisibleRoles = false;
          } else {
            this.$message.error(res.message || "保存失败");
          }
        })
        .catch(error => {
          console.log(error);
          return;
        });
    },
    // 获取列表数据
    getChannelInfoAuth() {
      http
        .get2("/guild/getChannelInfoAuth.list.do")
        .then(res => {
          this.selectArr = [];
          this.resData = JSON.parse(JSON.stringify(res.data));
          let listArr = [];
          if (res.state == "ok") {
            res.data.forEach(item => {
              if (item.selectState == 1) {
                this.selectArr.push(item.scId);
              }
            });
            res.data.forEach(el => {
              for (var i = 0; i < listArr.length; i++) {
                if (listArr[i].id == el.mcId && el.userType == 3) {
                  listArr[i].children.push({
                    channelName: el.scName,
                    id: el.scId,
                    parent: false
                  });
                  return;
                }
              }
              listArr.push({
                channelName: el.channelName,
                id: el.mcId,
                parent: true,
                children: [
                  {
                    channelName:
                      el.userType == 2 ? el.scName + "【组长】" : el.scName,
                    id: el.scId,
                    parent: false
                  }
                ]
              });
            });
            this.channelInfoList = [
              { id: "全选", channelName: "全选", children: listArr }
            ];
          } else {
            this.$message.error(res.message || "获取失败");
          }
        })
        .catch(error => {
          console.log(error);
          return;
        });
    }
  }
};
</script>
<style lang="scss" scoped></style>
