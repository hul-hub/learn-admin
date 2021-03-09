<template>
  <div>
    <div class="page-crumbs">
      <div class="crumbs">
        <breadcrumb />
      </div>
    </div>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <h3>子渠道授权</h3>
        <div class="extra"></div>
      </div>
      <div class="body">
        <el-tree
          :data="listArr"
          show-checkbox
          node-key="id"
          ref="tree"
          highlight-current
          :default-checked-keys="selectArr"
          :props="defaultProps"
        >
        </el-tree>
        <div style="margin-top: 20px">
          <el-button type="primary" @click="editProductWatch">提交</el-button>
          <el-button @click="$router.push('/tools/productInsight/index')"
            >返回</el-button
          >
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import http from "@/utils/http";
export default {
  name: "seoerAuthorization",
  data() {
    return {
      listArr: [],
      selectArr: [],
      defaultProps: {
        children: "children",
        label: "channelName"
      }
    };
  },
  mounted() {
    this.getProductWatch();
  },
  methods: {
    getCheckedNodes() {
      console.log(this.$refs.tree.getCheckedNodes());
    },
    async editProductWatch() {
      let data = {
        scIds: this.$refs.tree
          .getCheckedNodes()
          .filter(item => {
            return !item.parent;
          })
          .map(item => {
            return item.id;
          })
          .join(",")
      };
      try {
        const res = await http.post("/guild/regular/editProductWatch.do", data);
        if (res.state == "ok") {
          this.$message.success(res.message || "保存成功");
          this.$router.push("/tools/productInsight/index");
        } else {
          this.$message.error(res.message || "保存失败");
        }
      } catch (e) {
        this.$message.error("保存异常");
      }
    },
    async getProductWatch() {
      try {
        const res = await http.post("/guild/regular/getProductWatch.do");
        let listArr = [];
        if (res.state == "ok") {
          res.data.forEach(item => {
            if (item.hadPower == 1) {
              this.selectArr.push(item.scId);
            }
          });
          res.data.forEach(el => {
            for (var i = 0; i < listArr.length; i++) {
              if (listArr[i].id == el.mcId) {
                listArr[i].children.push({
                  channelName: el.scRealName,
                  id: el.scId,
                  parent: false,
                  disabled: el.isBoss == 1
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
                  channelName: el.scRealName,
                  id: el.scId,
                  parent: false,
                  disabled: el.isBoss == 1
                }
              ]
            });
          });
          this.listArr = JSON.parse(JSON.stringify(listArr));
        } else {
          this.$message.error(res.message || "获取失败");
        }
      } catch (e) {
        this.$message.error("获取异常");
      }
    }
  }
};
</script>

<style scoped></style>
