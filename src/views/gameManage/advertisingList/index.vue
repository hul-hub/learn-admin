<template>
  <div>
    <el-card>
      <div slot="header">
        <h3>查询条件</h3>
      </div>
      <div class="body flex mid">
        <el-select v-model="queryType" placeholder="请选择">
          <el-option
            v-for="item in queryTypeList"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input
          placeholder="请输入内容"
          v-model="queryValue"
          style="width: 200px"
        ></el-input>
        <div class="mr40">
          <el-select
            v-model="filters.queryGame"
            placeholder="请选择游戏"
            style="width: 150px"
            filterable
            @change="handleQueryGameChangenew"
          >
            <el-option
              v-for="item in filters.queryGameList"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            />
          </el-select>
        </div>
        <div>
          <el-button @click="search(1)" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </div>
    </el-card>
    <el-card>
      <div slot="header">
        <h3>广告投放列表</h3>
        <div class="extra">
          <el-button size="medium" type="primary" @click="add"
            >添加广告投放</el-button
          >
        </div>
      </div>
      <div class="body">
        <el-table border :data="tableList" v-loading="tableLoading">
          <el-table-column prop="posterId" label="广告ID"></el-table-column>
          <el-table-column prop="gameName" label="游戏名称">
            <template slot-scope="scope">
              <div>
                <img :src="scope.row.gameImageUrl" alt width="30px" />
                <span>{{ scope.row.gameName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="channelName" label="归属渠道">
            <template slot-scope="scope">
              <div>{{ scope.row.channelName }}</div>
              <div>{{ scope.row.scId }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="adWordsName"
            label="投放平台"
          ></el-table-column>
          <el-table-column prop="remark" label="备注信息"></el-table-column>
          <el-table-column prop="createTime" label="创建时间"></el-table-column>
          <el-table-column prop label="安卓包">
            <template slot-scope="scope">
              <div v-if="scope.row.androidStatus == 0">
                <el-button
                  type="text"
                  ref="copyBtn"
                  v-clipboard:copy="url"
                  v-clipboard:success="clipboardSuccess"
                  @mouseenter="copyUrl(scope.row.id, 1)"
                  @click="copyUrl(scope.row.id, 1)"
                  >复制链接</el-button
                >
              </div>
              <div v-if="scope.row.androidStatus == 2">无母包</div>
              <div v-if="scope.row.androidStatus == 1">
                <el-button
                  type="text"
                  style="color: red"
                  @click="pack(scope.row.id, 1)"
                  >打包/更新</el-button
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column prop label="IOS包">
            <template slot-scope="scope">
              <div v-if="scope.row.iosStatus == 0">
                <el-button
                  type="text"
                  ref="copyBtn"
                  v-clipboard:copy="url"
                  v-clipboard:success="clipboardSuccess"
                  @mouseenter="copyUrl2(scope.row.id, 2)"
                  @click="copyUrl2(scope.row.id, 2)"
                  >复制链接</el-button
                >
              </div>
              <div v-if="scope.row.iosStatus == 2">无母包</div>
              <div v-if="scope.row.iosStatus == 1">
                <el-button
                  type="text"
                  style="color: red"
                  @click="pack(scope.row.id, 2)"
                  >打包/更新</el-button
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column prop label="监测链接">
            <template slot-scope="scope">
              <div>
                <el-button
                  type="text"
                  ref="copyBtn"
                  v-clipboard:copy="MonitorUrl"
                  v-clipboard:success="clipboardSuccess"
                  @mouseenter="copyMonitorUrl(scope.row.id)"
                  @click="copyMonitorUrl(scope.row.id)"
                  >复制链接</el-button
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column prop label="操作">
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="edit(scope.row.id)"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  @click="
                    $router.push(
                      `/gameManage/monitoringList/monitoringList/index?posterId=${
                        scope.row.posterId
                      }`
                    )
                  "
                  >投放效果</el-button
                >
              </div>
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
            ></el-pagination>
          </div>
        </div>
      </div>
    </el-card>
    <el-dialog
      title="添加广告投放"
      :visible.sync="dialogFormVisible"
      @close="close"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item
          label="选择游戏："
          :label-width="formLabelWidth"
          prop="queryGame2"
        >
          <el-select
            v-model="form.queryGame2"
            placeholder="请选择游戏"
            style="width: 150px"
            filterable
            @change="handleQueryGameChangenew2"
          >
            <el-option
              v-for="item in form.queryGameList2"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="归属渠道："
          :label-width="formLabelWidth"
          prop="channel"
        >
          <el-select
            v-model="form.channel"
            value-key="scName"
            placeholder="请选择渠道"
            @change="handleChannel"
          >
            <el-option
              v-for="item in form.channelList"
              :key="item.scId"
              :label="item.scName"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="投放平台："
          :label-width="formLabelWidth"
          prop="platForm"
        >
          <el-radio v-model="form.platForm" label="1">今日头条</el-radio>
        </el-form-item>
        <el-form-item label="备注：" :label-width="formLabelWidth" prop="mark">
          <el-input
            type="textarea"
            placeholder="建议填写广告相关说明"
            v-model="form.mark"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-button
            @click="comfirmAdd('form')"
            type="primary"
            size="medium"
            style="width: 200px"
            >添加</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="编辑备注"
      :visible.sync="dialogFormVisible2"
      @close="close2"
    >
      <el-form :model="form2" ref="form2" :rules="rules">
        <el-form-item label="备注：" :label-width="formLabelWidth" prop="mark">
          <el-input
            type="textarea"
            placeholder="建议填写广告相关说明"
            v-model="form2.mark"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-button
            @click="submit('form')"
            type="primary"
            size="medium"
            style="width: 200px"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import clipboard from "../../../utils/clipboard";
import http from "@/utils/http";
import { getPlatformList, getGameList } from "../../../api/aid";
import { mygameGetMyGamesInfo } from "../../../api/gameProm";
import { getUserGameList } from "@/api/aid";

export default {
  name: "advertisingListIndex",
  data() {
    return {
      url: "", //安卓ios链接
      MonitorUrl: "", //监测链接
      formLabelWidth: "120px",
      form: {
        mark: "",
        channel: "",
        platForm: "1",
        channelList: [],
        queryGameList2: [],
        queryGame2: "",
        queryGameid: "",
        mcId: "",
        scId: ""
      },
      form2: {
        mark: "",
        id: ""
      },
      rules: {
        platForm: [{ required: true, trigger: "blur" }],
        queryGame2: [
          { required: true, message: "请选择游戏", trigger: "change" }
        ],
        channel: [
          { required: true, message: "请选择归属渠道", trigger: "change" }
        ]
      },
      dialogFormVisible: false,
      dialogFormVisible2: false,
      queryType: "4",
      queryValue: "",
      queryTypeList: [
        {
          value: "4",
          text: "主渠道账号"
        },
        {
          value: "3",
          text: "主渠道名称"
        },
        {
          value: "5",
          text: "主渠道ID"
        },
        {
          value: "6",
          text: "子渠道账号"
        },
        {
          value: "7",
          text: "子渠道ID"
        },
        {
          value: "1",
          text: "广告ID"
        }
      ],
      tableLoading: false,
      tableList: [],
      filter: {
        platformId: "",
        gameId: ""
      },
      filters: {
        queryGameid: "",
        queryGame: "",
        queryGameList: []
      },
      page: 1,
      size: 10,
      total: 0
    };
  },
  async created() {
    this.getUserGameList();
    this.search();
  },
  methods: {
    handleCurrentChange(page) {
      this.page = page;
      this.search();
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
          this.form.queryGameList2 = arr;
        }
      } catch (error) {
        console.error(error);
        return;
      }
    },
    handleQueryGameChangenew(option) {
      const arrPlat = option.split(",");
      this.filters.queryGameid = arrPlat[1];
    },
    handleQueryGameChangenew2(option) {
      const arrPlat = option.split(",");
      this.form.queryGameid = arrPlat[1];
    },
    async search(type) {
      if (type == 1) {
        this.page = 1;
      }
      try {
        const query = {
          queryType: this.queryType,
          queryValue: this.queryValue,
          gameId: this.filters.queryGameid,
          pageNo: this.page,
          pageSize: this.size
        };
        this.tableLoading = true;
        const res = await http.get2("/guild/poster/page.do", query);
        this.tableLoading = false;
        if (res.state === "ok") {
          this.tableList = res.data;
          // this.clipboardDialog.link = res.data[0].downloadUrl;
          this.total = res.pagination.count;
        } else {
          this.tableList = [];
          this.total = 0;
          this.$message.warning(res.message);
        }
      } catch (e) {
        console.log(e);
        this.$message.error("异常");
      }
    },
    //打包或更新
    async pack(id, type) {
      try {
        const query = {
          id: id,
          type: type
        };
        const res = await http.get2("/guild/poster/subpackage.do", query);
        if (res.state === "ok") {
          this.$message.success(res.message || "打包成功");
          this.search();
        } else {
          this.$message.warning(res.message || "打包失败");
        }
      } catch (e) {
        console.log(e);
        this.$message.error("异常");
      }
    },
    //复制安卓链接
    async copyUrl(id, type) {
      try {
        const query = {
          id: id,
          type: type
        };
        const res = await http.get2("/guild/poster/posterPackLink.do", query);
        if (res.state === "ok") {
          this.url = res.message;
        } else {
          this.$message.warning("复制失败");
        }
      } catch (e) {
        console.log(e);
        this.$message.error("异常");
      }
    },
    //复制ios链接
    async copyUrl2(id, type) {
      try {
        const query = {
          id: id,
          type: type
        };
        const res = await http.get2("/guild/poster/posterPackLink.do", query);
        if (res.state === "ok") {
          this.url = res.message;
        } else {
          this.$message.warning("复制失败");
        }
      } catch (e) {
        console.log(e);
        this.$message.error("异常");
      }
    },
    //获取监测链接
    async copyMonitorUrl(id) {
      try {
        const query = {
          id: id
        };
        const res = await http.get2("/guild/poster/posterLink.do", query);
        if (res.state === "ok") {
          this.MonitorUrl = res.message;
        } else {
          this.$message.warning("复制失败");
        }
      } catch (e) {
        console.log(e);
        this.$message.error("异常");
      }
    },
    //添加广告投放
    add() {
      this.packageAboutVisible = true;
      this.dialogFormVisible = true;
      this.getListScId();
    },
    handleChannel(option) {
      this.form.scId = option.scId;
      this.form.mcId = option.mcId;
    },
    //获取子渠道信息
    async getListScId() {
      try {
        const res = await http.get2("/guild/poster/listScId.do");
        if (res.state === "ok") {
          this.form.channelList = res.data;
        } else {
          this.$message.warning(res.message);
        }
      } catch (e) {
        console.log(e);
        this.$message.error("异常");
      }
    },

    comfirmAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          try {
            const query = {
              gameId: this.form.queryGameid,
              scId: this.form.scId,
              mcId: this.form.mcId,
              remark: this.form.mark,
              adWordsId: "1"
            };
            const url = `/guild/poster/add.do`;
            http.post2(url, query).then(res => {
              if (res.state == "ok") {
                this.$message.success(res.message);
                this.dialogFormVisible = false;
                this.search();
                this.form.queryGame2 = "";
                this.form.channel = "";
                this.form.platForm = "1";
                this.form.mark = "";
              } else {
                this.$message.warning(res.message);
              }
            });
          } catch (e) {
            console.log(e);
            that.$message.error("异常");
          }
        } else {
          return false;
        }
      });
    },
    close() {
      this.$nextTick(() => {
        this.$refs["form"].resetFields(); // this.$refs.adduserform.resetFields();
      });
    },
    close2() {
      this.$nextTick(() => {
        this.$refs["form2"].resetFields(); // this.$refs.adduserform.resetFields();
      });
    },
    //编辑
    edit(id) {
      this.dialogFormVisible2 = true;
      this.form2.id = id;
    },
    //编辑提交
    async submit() {
      try {
        const res = await http.put(
          `/guild/poster/edit.do?id=${this.form2.id}&remark=${this.form2.mark}`
        );
        if (res.state === "ok") {
          this.dialogFormVisible2 = false;
          this.$message.success(res.message || "编辑成功");
          this.form2.mark = "";
          this.search();
        } else {
          this.$message.warning(res.message || "编辑失败");
        }
      } catch (e) {
        console.log(e);
        this.$message.error("异常");
      }
    },
    reset() {
      this.queryType = "4";
      this.page = 1;
      this.filters.queryGame = "";
      this.filters.queryGameid = "";
      this.queryValue = "";
      this.search();
    },
    //复制成功提示
    clipboardSuccess() {
      this.$message({
        message: "复制成功",
        type: "success"
      });
    }
  }
};
</script>

<style>
.el-table .first-row {
  background: #f0f9eb;
}
</style>
