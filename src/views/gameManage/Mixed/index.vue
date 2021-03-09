<template>
  <div class="games">
    <div class="page-crumbs">
      <div class="crumbs">
        <breadcrumb />
      </div>
    </div>
    <el-card>
      <div slot="header">
        <h3>查询条件</h3>
      </div>
      <div class="body">
        <div class="flex mid">
          <!-- <div class="mr10">游戏：</div> -->
          <games
            ref="games"
            :hasZoom="false"
            :defaultPlatform="filters.platformId"
            :defaultGame="filters.gameId"
            @change="handleGamesChange"
          ></games>
          <div>
            <el-button @click="search" type="primary">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </div>
        </div>
      </div>
    </el-card>
    <el-card>
      <div slot="header">
        <h3>通服游戏列表</h3>
      </div>
      <div class="body">
        <el-table border :data="tableList">
          <el-table-column
            width="150"
            align="center"
            prop="gameIcon"
            label="游戏图标"
          >
            <template slot-scope="scope">
              <img class="w80 h80" :src="scope.row.gameIcon" alt />
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="platformId"
            label="平台名称"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="gameName"
            label="游戏名称"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="gameType"
            label="游戏类型"
          ></el-table-column>
          <el-table-column align="center" prop="zoneType" label="区服类型">
            <template slot-scope="scope">
              <div v-if="scope.row.zoneType == '1'">通服</div>
              <div v-else>包服</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="point"
            label="分成点位"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="settleInStatus"
            label="入驻状态"
          ></el-table-column>
        </el-table>
        <div class="table-footer">
          <div class="actions"></div>
          <div class="pages">
            <el-pagination
              background
              layout="prev, pager, next, total, sizes"
              :current-page="filters.pageNo"
              :page-size="filters.pageSize"
              :total="filters.total"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            ></el-pagination>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import Games from "@/components/Games/mixed";
import http from "@/utils/http";

export default {
  name: "gameManageMixedIndex",
  components: {
    Games
  },
  data() {
    return {
      tableList: [],
      filters: {
        platformId: "",
        gameId: "",
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  async created() {
    this.search();
  },
  methods: {
    handleGamesChange(games) {
      console.log(games);
      this.filters.platformId = games.platformId;
      this.filters.gameId = games.gameId;
    },

    async search() {
      try {
        const data = {
          platformId: this.filters.platformId,
          gameId: this.filters.gameId,
          "Pagination.pageNo": this.filters.pageNo,
          "Pagination.pageSize": this.filters.pageSize
        };
        const res = await http.get2("/mixedServicePoint.list.do", data);
        if (res.state === "ok") {
          this.tableList = res.data;
          this.filters.total = res.pagination.count;
        } else {
          this.$message.warning(res.message);
        }
      } catch (e) {
        this.$message.error("异常");
      }
    },
    handleCurrentChange(page) {
      this.filters.pageNo = page;
      this.search();
    },
    handleSizeChange(val) {
      this.filters.pageSize = val;
      this.search();
    },
    reset() {
      this.filters.platformId = "";
      this.filters.gameId = "";
      this.$refs.games.handleChangeGame();
      this.$refs.games.handleChangePlatform();
      this.filters.pageNo = 1;
      this.search();
    }
  }
};
</script>

<style lang="scss" scoped>
.lineHeight {
  margin-bottom: 10px;
}
</style>
