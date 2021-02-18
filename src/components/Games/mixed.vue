<template>
  <div class="games-select">
    <span>{{ label }}</span>
    <el-select
      style="width: 150px;"
      :placeholder="platformPlaceholder"
      v-model="platform"
      filterable
      @change="handleChangePlatform"
      :disabled="disabledPlatform"
    >
      <el-option
        v-for="item in platforms"
        :key="item.value"
        :label="item.text"
        :value="item.value"
      ></el-option>
    </el-select>

    <el-select
      style="width: 150px;"
      :placeholder="gamePlaceholder"
      v-model="game"
      filterable
      remote
      :remote-method="remoteMethod"
      @change="handleChangeGame"
      :disabled="disabledGame"
    >
      <el-option
        v-for="item in games"
        :key="item.value"
        :label="item.text"
        :value="item.value"
      ></el-option>
    </el-select>

    <el-select
      v-if="hasZoom"
      style="width: 150px;"
      :placeholder="zoomPlaceholder"
      v-model="zoom"
      filterable
      @change="handleChangeZoom"
    >
      <el-option
        v-for="item in zooms"
        :key="item.value"
        :label="item.text"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
/**
 * Methods:
 *    change: 每下拉框 change 都会触发, 向外传值 =>> { platformId, gameId, zoomId }
 *
 */
import { getPlatforms2, getGamesByPlatform2, getZooms } from "@/api/global";
import { getGameLikeNameMixed } from "@/api/aid";
import http from "@/utils/http";
export default {
  name: "Games",
  props: {
    // 标题
    label: {
      type: String
    },
    // 是否显示区服选项
    hasZoom: {
      type: Boolean,
      default: true
    },
    // 平台列表选项占位说明
    platformPlaceholder: {
      type: String,
      default: "请选择平台"
    },
    // 默认平台
    defaultPlatform: {
      type: String,
      default: ""
    },
    // 默认平台列表
    defaultPlatforms: {
      type: Array,
      default: function() {
        return [
          {
            text: "全部平台",
            value: ""
          }
        ];
      }
    },
    disabledPlatform: {
      type: Boolean,
      default: false
    },
    // 游戏列表选项占位说明
    gamePlaceholder: {
      type: String,
      default: "请选择游戏"
    },
    // 默认游戏
    defaultGame: {
      type: String,
      default: ""
    },
    // 默认游戏列表
    defaultGames: {
      type: Array,
      default: function() {
        return [
          {
            text: "全部游戏",
            value: ""
          }
        ];
      }
    },
    disabledGame: {
      type: Boolean,
      default: false
    },
    // 区服列表选项占位说明
    zoomPlaceholder: {
      type: String,
      default: "请选择"
    },
    // 默认区服
    defaultZoom: {
      type: String,
      default: ""
    },
    // 默认区服列表
    defaultZooms: {
      type: Array,
      default: function() {
        return [
          {
            text: "全部区服",
            value: ""
          }
        ];
      }
    }
  },
  data() {
    return {
      platform: this.defaultPlatform,
      platforms: this.defaultPlatforms,
      game: this.defaultGame,
      games: this.defaultGames,
      zoom: this.defaultZoom,
      zooms: this.defaultZooms,
      arr: []
    };
  },
  created() {
    this.getPlatforms();
  },
  watch: {
    defaultPlatform: function(val) {
      this.platform = val;
      if (this.platform !== "") {
        this.getGames(this.platform);
      }
    },
    defaultGame: function(val) {
      this.game = val;
      if (this.game !== "" && this.hasZoom) {
        this.getGames(this.game);
      }
    }
  },
  methods: {
    async remoteMethod(query) {
      try {
        if (query !== "") {
          const data = {
            likeValue: query
            // gameSerieId: "",
            // platformId: this.platform
          };
          const res = await getGameLikeNameMixed(data);
          if (res.state === "ok") {
            this.arr = [];
            res.data.forEach(e => {
              this.arr.push({
                text: e.text,
                value: e.value,
                platForm: e.parentValue
              });
            });
            this.games = this.arr;
          } else {
            console.log(res.message, "获取对应游戏平台失败");
          }
        } else {
          this.games = this.defaultGames;
        }
      } catch (error) {
        console.log(error, "获取对应游戏平台异常");
      }
    },
    // 获取 平台列表
    async getPlatforms() {
      try {
        const res = await getPlatforms2();
        if (res.state === "ok") {
          this.platforms = this.defaultPlatforms.concat(res.data);
        } else if (res.state === "fail") {
          console.log("Games getPlatforms res.state fail");
        }
      } catch (error) {
        console.log("Games getPlatforms error =>>", error);
      }
    },
    // 获取 平台下的游戏列表
    async getGames(platformId) {
      const query = {
        platformId
      };

      try {
        const res = await getGamesByPlatform2(query);
        if (res.state === "ok") {
          this.games = this.defaultGames.concat(res.data);
        } else if (res.state === "fail") {
          console.log("Games games res.state fail");
        }
      } catch (error) {
        console.log("Games getGames error =>>", error);
      }
    },
    // 获取 游戏区服列表
    async getZooms(gameId) {
      const { platform: platformId } = this;
      const query = {
        platformId,
        gameId
      };

      try {
        const res = await getZooms(query);
        if (res.state === "ok") {
          this.zooms = this.defaultZooms.concat(res.data);
        } else if (res.state === "fail") {
          console.log("Games games res.state fail");
        }
      } catch (error) {
        console.log("Games getGames error =>>", error);
      }
    },
    // 触发 change 事件
    emitChange() {
      this.$emit("change", {
        platformId: this.platform,
        gameId: this.game,
        zoomId: this.zoom
      });
    },
    // 监听 平台更改
    handleChangePlatform(val) {
      console.log(111);
      this.game = "";
      this.platform = val;
      this.getGames(this.platform);
      this.emitChange();
    },
    // 监听 游戏更改
    async handleChangeGame(val) {
      console.log(val, "111", this.arr);
      this.zoom = "";
      // this.game = val;
      if (val) {
        this.arr.forEach(item => {
          if (item.value == val) {
            this.platform = item.platForm;
          }
        });
        await this.getGames(this.platform);
        this.emitChange();
      } else {
        this.game = val;
        this.emitChange();
      }
    }
  }
};
</script>
