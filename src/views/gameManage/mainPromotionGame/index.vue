<template>
  <div>
    <div class="page-crumbs">
      <div class="crumbs">
        <breadcrumb />
      </div>
    </div>
    <el-card>
      <div slot="header"><h3>查询条件</h3></div>
      <div class="body flex mid">
        <div class="mr10">关键字查询：</div>
        <div class="mr3">
          <el-select v-model="filter.queryType">
            <el-option label="子渠道账号" value="1"></el-option>
            <el-option label="子渠道备注" value="2"></el-option>
          </el-select>
        </div>
        <div class="mr30">
          <el-input v-model="filter.queryValue"></el-input>
        </div>
        <div class="mr10">主推游戏：</div>
        <div class="mr20">
          <el-select v-model="filter.gameId">
            <el-option
              v-for="(item, index) in gameList"
              :key="index"
              :label="item.text"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <el-button @click="search" type="primary">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </el-card>
    <el-card>
      <div slot="header">
        <div class="flex between mid">
          <h3>主推游戏设置</h3>
          <div>
            <el-button @click="editmcRecommendGame" type="primary"
              >设置主渠道主推游戏</el-button
            >
          </div>
        </div>
      </div>
      <div class="mt10 mb20">
        <strong>主渠道当前主推游戏：{{ mcRecommendGame }}</strong>
      </div>
      <el-table border :data="tableData" v-loading="tableLoading">
        <el-table-column align="center" label="ID" prop="id"></el-table-column>
        <el-table-column align="center" label="子渠道">
          <template slot-scope="scope">
            <div class="flex col center">
              <div>子渠道备注：{{ scope.row.name }}</div>
              <div>子渠道账号：{{ scope.row.account }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="主推游戏"
          prop="gameName"
        ></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              @click="
                editscRecommendGame({
                  scId: scope.row.scid,
                  name: scope.row.name,
                  account: scope.row.account
                })
              "
              type="text"
              >修改</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="flex end mt15">
        <el-pagination
          background
          layout="prev,pager,next,total"
          :current-page="pagination.pageNo"
          :total="pagination.total"
          @current-change="searchByPage"
        ></el-pagination>
      </div>
    </el-card>
    <el-dialog
      width="600px"
      title="设置主渠道主推游戏"
      :visible.sync="mcDialogVisible"
    >
      <div class="flex mid">
        <div class="mr10">设置主推游戏：</div>
        <el-select v-model="mcEditData.gameId">
          <el-option
            v-for="(item, index) in mcGameList"
            :key="index"
            :label="item.text"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="flex center mt40">
        <el-button @click="mcSave" type="primary">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="600px"
      title="修改子渠道主推游戏"
      :visible.sync="scDialogVisible"
    >
      <div class="mb10">
        <strong>子渠道账号：{{ scEditData.account }}</strong>
      </div>
      <div class="mb30">
        <strong>子渠道备注：{{ scEditData.name }}</strong>
      </div>
      <div class="flex mid">
        <div class="mr10">设置主推游戏：</div>
        <el-select v-model="scEditData.gameId">
          <el-option
            v-for="(item, index) in scGameList"
            :key="index"
            :label="item.text"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="flex center mt40">
        <el-button @click="scSave" type="primary">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as API from "../../../api/gameManage";

export default {
  data() {
    return {
      tableLoading: false,
      mcDialogVisible: false,
      scDialogVisible: false,
      mcEditData: {
        gameId: ""
      },
      scEditData: {
        name: "",
        account: "",
        gameId: "",
        scid: ""
      },
      tableData: [],
      gameList: [],
      mcGameList: [],
      scGameList: [],
      mcRecommendGame: "",
      filter: {
        queryType: "1",
        queryValue: "",
        gameId: ""
      },
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  created() {
    this.search();
    this.getGameList({}).then(res => (this.gameList = res.data));
    this.getMcRecommendGame();
  },
  methods: {
    async mcSave() {
      try {
        const game = this.mcGameList.filter(
          item => item.value === this.mcEditData.gameId
        );
        const body = {
          gameId: this.mcEditData.gameId,
          platformId: game.length > 0 ? game[0].parentValue : undefined
        };
        const res = await API.setRecommendGame(body);
        if (res.state === "ok") {
          this.$message.success("保存成功");
          this.getMcRecommendGame();
          this.search();
        } else {
          this.$message.warning(res.message || "保存失败");
        }
      } catch (e) {
        console.error(e);
        this.$message.error("异常");
      } finally {
        this.mcDialogVisible = false;
      }
    },
    async scSave() {
      try {
        const game = this.scGameList.filter(
          item => item.value === this.scEditData.gameId
        );
        const body = {
          gameId: this.scEditData.gameId,
          platformId: game.length > 0 ? game[0].parentValue : undefined,
          scid: this.scEditData.scid
        };
        const res = await API.setRecommendGame(body);
        if (res.state === "ok") {
          this.$message.success("保存成功");
          this.search();
        } else {
          this.$message.warning(res.message || "保存失败");
        }
      } catch (e) {
        this.$message.error("异常");
        console.error(e);
      } finally {
        this.scDialogVisible = false;
      }
    },
    async getMcRecommendGame() {
      try {
        const res = await API.getMcRecommendGame();
        if (res.state === "ok") {
          this.mcRecommendGame = res.data.value;
        } else {
          this.$message.warn(
            res.message || "获取主渠道当前主推游戏失败；未知错误"
          );
        }
      } catch (e) {
        this.$message.error("异常");
        console.error(e);
      }
    },
    async editmcRecommendGame() {
      try {
        const res = await this.getGameList({});
        this.mcGameList = res.data;
        this.mcDialogVisible = true;
      } catch (e) {
        console.error(e);
        this.$message.error("异常");
      }
    },
    async editscRecommendGame({ scId, name, account }) {
      try {
        this.scEditData.name = name;
        this.scEditData.account = account;
        this.scEditData.scid = scId;
        const res = await this.getGameList({ scId });
        this.scGameList = res.data;
        this.scDialogVisible = true;
      } catch (e) {
        console.error(e);
        this.$message.error("异常");
      }
    },
    searchByPage(page) {
      this.pagination.pageNo = page;
      this.search();
    },
    async search() {
      try {
        const body = {
          gameId: this.filter.gameId,
          scAccount:
            this.filter.queryType === "1" ? this.filter.queryValue : undefined,
          scName:
            this.filter.queryType === "2" ? this.filter.queryValue : undefined,
          pagination: {
            pageNo: this.pagination.pageNo,
            pageSize: this.pagination.pageSize
          }
        };
        this.tableLoading = true;
        const res = await API.findRecommendGame(body);
        if (res.state === "ok") {
          this.tableData = res.data;
          this.pagination.total = res.pagination.count;
        } else {
          this.$message.warning(res.message || "获取列表失败；未知错误");
        }
      } catch (e) {
        this.$message.error("异常");
        console.error(e);
      } finally {
        this.tableLoading = false;
      }
    },
    getGameList({ scId }) {
      return new Promise(async (resolve, reject) => {
        try {
          const query = {
            scId
          };
          const res = await API.getGameInfo(query);
          if (res.state === "ok") {
            resolve(res);
          } else {
            reject();
            this.$message.warning(
              res.message || "获取主推游戏列表失败；未知错误"
            );
          }
        } catch (e) {
          reject();
          this.$message.error("异常");
          console.error(e);
        }
      });
    },
    reset() {
      this.pagination.pageNo = 1;
      this.filter.queryType = "1";
      this.filter.queryValue = "";
      this.filter.gameId = "";
      this.search();
    }
  }
};
</script>

<style scoped></style>
