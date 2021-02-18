<template>
  <div>
    <div class="page-crumbs">
      <div class="crumbs">
        <breadcrumb />
      </div>
    </div>
    <el-card>
      <div slot="header">
        <span style="color: #999; font-size: 18px">选择广告位</span>
      </div>
      <div style="font-size: 16px; margin-left: 20px">
        <span>广告位名称：</span>
        <el-select v-model="advertType" placeholder="请选择" filterable>
          <el-option
            v-for="item in options"
            :key="item.advertTypeId"
            :label="item.advertTypeName"
            :value="item.advertTypeId"
          >
          </el-option>
        </el-select>
        <el-button
          type="primary"
          style="margin-left: 15px; width: 90px"
          @click="search(1)"
          >查询</el-button
        >
      </div>
    </el-card>
    <el-card>
      <div slot="header">
        <span style="color: #999; font-size: 18px">广告内容</span>
      </div>
      <div style="color: #999; font-size: 16px">
        默认展示已入驻的游戏，可使用“编辑”功能修改推荐内容。
      </div>
      <el-table :data="tableData" style="width: 80%">
        <el-table-column prop="advertTypeId" label="广告ID" width="180">
        </el-table-column>
        <el-table-column prop="advertCode" label="广告编号" width="180">
        </el-table-column>
        <el-table-column prop="advertTypeName" label="广告位名称">
        </el-table-column>
        <el-table-column prop="gameName" label="配置游戏"> </el-table-column>
        <el-table-column prop="sort" label="APP展示顺序"> </el-table-column>
        <el-table-column prop="date" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="
                edit(
                  scope.row.advertBaseCode,
                  scope.row.sortHidden,
                  scope.row.gameId,
                  scope.row.id,
                  scope.row.advertId,
                  scope.row.menuId,
                  scope.row.advertTypeName
                )
              "
              >编辑</el-button
            >
            <el-button
              type="text"
              v-if="scope.row.id"
              @click="reset(scope.row.id)"
              >重置</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="table-footer">
        <div class="actions"></div> -->
      <div class="page">
        <el-pagination
          background
          layout="prev, pager, next, total"
          :current-page="page"
          :page-size="size"
          :total="total"
          @current-change="handleCurrentChange"
        ></el-pagination>
        <!-- </div> -->
      </div>
    </el-card>
    <el-dialog
      :title="
        title == 1 ? title1 : title == 2 ? title2 : title == 3 ? title3 : title4
      "
      :visible.sync="dialogFormVisible"
      width="28%"
    >
      <el-form :model="form" style="margin-left: 30px">
        <el-form-item>
          <div class="title">选择游戏</div>
          <el-select
            v-model="form.game"
            placeholder="请选择游戏"
            style="width: 90%"
            @change="handleGame"
            filterable
          >
            <el-option
              v-for="item in form.gamelist"
              :key="item.gameId"
              :label="item.gameName"
              :value="item.gameId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="title">广告内容预览</div>
          <img
            v-if="
              (title == 1 && editData.bannerUrl) ||
                (title == 2 && editData.bannerUrl)
            "
            :src="editData.bannerUrl"
            alt=""
            style="width: 95%; height: 30%"
          />
          <div v-if="title == 2 && this.form.game != '-'">
            <div class="title2">
              <img :src="editData.iconUrl" alt="" class="title2-img" />
              <div>
                <div class="desc desc1">
                  <span class="descs">{{ editData.gameName }}</span>
                  <div class="main" v-if="editData.discount">
                    <span class="circular"></span>
                    <span class="triangle"></span>
                    <span class="discount">{{ editData.discount }}折</span>
                  </div>
                </div>
                <div class="desc">
                  <span
                    v-for="(item, index) in editData.itemList"
                    :key="index"
                    class="descs"
                    >{{ item }}</span
                  >
                  <!-- <span class="descs">RPG</span> -->
                  <!-- <span class="blue strong">15:00新服</span> -->
                </div>
                <div class="desc strong">
                  <span
                    v-for="item2 in editData.columnList"
                    class="descs red"
                    >{{ item2 }}</span
                  >
                  <!-- <span class="descs red">优惠劵(5)</span
                  ><span class="vip">送VIP</span> -->
                </div>
              </div>
              <div class="download">下载</div>
            </div>
          </div>
          <div v-if="title == 3 && this.form.game != '-'">
            <div class="title2">
              <img :src="editData.iconUrl" alt="" class="title2-img" />
              <div>
                <div class="desc desc1">
                  <span class="descs">{{ editData.gameName }}</span>
                  <div class="main" v-if="editData.discount">
                    <span class="circular"></span>
                    <span class="triangle"></span>
                    <span class="discount">{{ editData.discount }}折</span>
                  </div>
                </div>
                <div class="desc">
                  <span
                    v-for="(item, index) in editData.itemList"
                    :key="index"
                    class="descs"
                    >{{ item }}</span
                  >
                </div>
                <div class="desc strong">
                  <span v-for="item2 in editData.columnList" class="descs">{{
                    item2
                  }}</span>
                </div>
              </div>
              <div class="download2">下载</div>
            </div>
          </div>
          <div v-if="title == 4 && this.form.game != '-'">
            <div class="title2">
              <div style="width: 70px; height: 70px; display: flex">
                <div class="line"></div>
                <div class="right">
                  <div>热门推荐</div>
                  <div style="font-weight: 700; color: #000">
                    {{ advertTypeName }}
                  </div>
                </div>
              </div>
              <img :src="editData.iconUrl" alt="" class="title3-img" />
              <div>
                <div class="desc desc1">
                  <span class="descs">{{ editData.gameName }}</span>
                  <div class="main" v-if="editData.discount">
                    <span class="circular"></span>
                    <span class="triangle"></span>
                    <span class="discount"
                      >{{ editData.discount }}<span>折</span></span
                    >
                  </div>
                </div>
                <div class="desc">
                  <span
                    v-for="(item, index) in editData.itemList"
                    :key="index"
                    class="descs"
                    >{{ item }}</span
                  >
                  <!-- <span class="blue strong">15:00新服</span> -->
                </div>
                <div class="desc strong">
                  <span
                    v-for="item2 in editData.columnList"
                    class="descs red"
                    >{{ item2 }}</span
                  >
                </div>
              </div>
              <!-- <div class="download">下载</div> -->
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" style="margin: 70px 0px 0px 80px">
        <el-button type="primary" round @click="save" style="margin-right: 20px"
          >确 定</el-button
        >
        <el-button @click="dialogFormVisible = false" round>取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" width="20%" center>
      <h3>确定重置广告？</h3>
      <h3>重置后将显示默认广告</h3>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import http from "@/utils/http";
export default {
  data() {
    return {
      title1: "(广告位：首页banner)",
      title2: "(广告位：首页精品推荐位-1)",
      title3: "(广告位：首页精品推荐位-2)",
      title4: "",
      title: null,
      dialogFormVisible: false,
      dialogVisible: false,
      form: {
        game: "",
        gamelist: [
          {
            label: "全部",
            value: ""
          }
        ]
      },
      options: [
        {
          advertTypeId: "",
          advertTypeName: "全部"
        }
      ],
      advertType: "",
      tableData: [],
      page: 1,
      size: 10,
      total: 0,
      dataid: "",
      editData: {
        bannerUrl: "",
        gameName: "",
        discount: ""
      },
      id: "",
      sortHidden: "",
      gameId: "",
      advertTypeId: "",
      menuId: "",
      advertTypeName: ""
    };
  },
  created() {
    this.search(1);
    this.GameListSearch(this.menuId);
  },
  mounted() {
    this.getAdvertSeatSearch();
  },
  methods: {
    //获取广告名称
    async getAdvertSeatSearch() {
      try {
        const res = await http.get2("/guild/boxAdvertSeatSearch.do");
        if (res.state === "ok") {
          this.options = this.options.concat(res.data);
        } else {
          this.$message.warning(res.message);
        }
      } catch (e) {
        // console.log(e);
        this.$message.error("异常");
      }
    },
    //重置
    reset(id) {
      this.dialogVisible = true;
      this.dataid = id;
    },
    //确认重置
    async confirm() {
      try {
        const res = await http.post(
          `/guild/boxAdvertResetting.do?id=${this.dataid}`
        );
        if (res.state === "ok") {
          this.$message.success(res.message);
          this.dialogVisible = false;
          this.search(this.page);
        } else {
          this.$message.warning(res.message);
        }
      } catch (e) {
        this.$message.error("异常");
      }
    },

    //查询
    async search(page) {
      this.page = page;
      try {
        const res = await http.get2(
          `/guild/boxAdvertList.do?advertTypeId=${this.advertType}&pageSize=${
            this.size
          }&pageNo=${page}`
        );
        if (res.state === "ok") {
          this.tableData = res.data;
          this.total = res.pagination.count;
        } else {
          this.$message.warning(res.message);
        }
      } catch (e) {
        this.$message.error("异常");
      }
    },
    //切换分页
    handleCurrentChange(page) {
      this.page = page;
      this.search(page);
    },
    //编辑弹窗
    edit(
      advertBaseCode,
      sortHidden,
      gameId,
      id,
      advertId,
      menuId,
      advertTypeName
    ) {
      this.form.game = gameId;
      this.advertTypeName = advertTypeName;
      this.menuId = menuId || "";
      this.GameListSearch(this.menuId);
      console.log(this.form.game);
      if (gameId == "-") {
        this.editData = {};
      }
      this.form.gamelist.forEach(item => {
        if (item.gameId == gameId) {
          this.editData = item;
        }
      });
      this.sortHidden = sortHidden || "";
      this.id = id || "";
      this.advertTypeId = advertId || "";
      if (advertBaseCode == "001") {
        this.title = 1;
        this.dialogFormVisible = true;
      }
      if (advertBaseCode == "002" && sortHidden == "1") {
        this.title = 2;
        this.dialogFormVisible = true;
      }
      if (advertBaseCode == "002" && sortHidden == "2") {
        this.title = 3;
        this.dialogFormVisible = true;
      }
      if (
        advertBaseCode == "003" ||
        advertBaseCode == "004" ||
        advertBaseCode == "005" ||
        advertBaseCode == "006" ||
        advertBaseCode == "007" ||
        advertBaseCode == "008" ||
        advertBaseCode == "009" ||
        advertBaseCode == "010"
      ) {
        this.title = 4;
        this.title4 =
          "(广告位：游戏栏目-" + advertTypeName + "-" + sortHidden + ")";
        this.dialogFormVisible = true;
      } else {
        this.title = 4;
        this.title4 =
          "(广告位：游戏栏目-" + advertTypeName + "-" + sortHidden + ")";
        this.dialogFormVisible = true;
      }
    },
    //获取游戏下拉框内容
    //查询
    async GameListSearch(menuId) {
      try {
        const res = await http.get2(
          `/guild/boxAdvertGameListSearch.do?menuId=${menuId}`
        );
        if (res.state === "ok") {
          this.form.gamelist = res.data;
        } else {
          this.$message.warning(res.message);
        }
      } catch (e) {
        this.$message.error("异常");
      }
    },
    //选择游戏
    handleGame(option) {
      this.gameId = option || "";
      this.form.gamelist.forEach(item => {
        if (item.gameId == option) {
          this.editData = item;
        }
      });
    },
    //编辑保存
    //  this.dialogFormVisible = false
    async save() {
      try {
        const data = {
          id: this.id,
          sortId: this.sortHidden,
          gameId: this.gameId,
          advertTypeId: this.advertTypeId
        };
        const res = await http.post("/guild/boxAdvertEdit.do", data);
        if (res.state === "ok") {
          this.$message.success(res.message);
          this.dialogFormVisible = false;
          this.search(1);
        } else {
          this.$message.warning(res.message);
        }
      } catch (e) {
        this.$message.error("异常");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.page {
  width: 80%;
  margin-left: 50%;
  transform: translateX(-30%);
  margin-top: 20px;
}
.title {
  font-size: 18px;
  font-weight: normal;
}
.title2 {
  display: flex;
  padding: 10px;
  .title2-img {
    width: 70px;
    height: 70px;
    margin-right: 15px;
  }
  .title3-img {
    width: 50px;
    height: 50px;
    margin: 10px 5px 0px 10px;
  }
  .line {
    height: 25px;
    width: 3px;
    background-color: #0094ff;
    margin: 47px 5px 0px 0px;
  }
  .desc {
    font-size: 14px;
    height: 20px;
  }
  .descs {
    margin-right: 15px;
  }
  .circular {
    margin-top: 20px;
    width: 3px;
    height: 3px;
    display: inline-block;
    background-color: #fff;
    border-radius: 50%;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    z-index: 2;
  }
  .main {
    position: relative;
    width: 90px;
  }
  .triangle {
    width: 0;
    height: 0;
    display: inline-block;
    border-width: 10px;
    border-style: solid dashed dashed dashed;
    border-color: transparent#FF7C4D transparent transparent;
    position: absolute;
    top: 10px;
    left: -17px;
    // margin-top: 10px;
  }
  .discount {
    font-size: 14px;
    font-weight: normal;
    display: inline-block;
    text-align: center;
    line-height: 20px;
    height: 20px;
    width: 45px;
    margin-top: 10px;
    background-color: rgb(255, 124, 77);
    color: #fff;
  }
  .blue {
    color: rgb(65, 188, 236);
  }
  .red {
    color: rgb(238, 153, 142);
  }
  .vip {
    color: rgb(172, 139, 89);
  }
  .strong {
    font-weight: 650;
  }
  .desc1 {
    display: flex;
    font-size: 16px;
    font-weight: 700;
    color: #000;
    position: relative;
  }
  .download {
    margin: 30px 0px 0px 5px;
    height: 30px;
    width: 60px;
    text-align: center;
    line-height: 30px;
    color: #fff;
    border: 1px solid #fff;
    border-radius: 6px;
    background: linear-gradient(
      to right,
      rgb(37, 183, 253) 0%,
      rgb(47, 141, 253) 100%
    );
  }
  .download2 {
    margin: 30px 0px 0px 5px;
    height: 30px;
    width: 60px;
    text-align: center;
    line-height: 30px;
    color: #0094ff;
    border: 1px solid#0094ff;
    border-radius: 20px;
  }
}
</style>
