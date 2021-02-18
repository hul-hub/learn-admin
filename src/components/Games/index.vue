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
import { getPlatforms, getGamesByPlatform, getZooms } from "@/api/global";

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
      zooms: this.defaultZooms
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
    // 获取 平台列表
    async getPlatforms() {
      try {
        const res = await getPlatforms();
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
        const res = await getGamesByPlatform(query);
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
    handleChangeGame(val) {
      this.zoom = "";
      this.game = val;

      this.emitChange();
      // 选择全部游戏, 重置区服
      if (this.game == "") {
        this.zooms = this.defaultZooms;
        return;
      }
      this.getZooms(this.game);
    },
    // 监听 区服更改
    handleChangeZoom(val) {
      this.zoom = val;
      this.emitChange();
    }
  }
};
</script>
