<template>
  <div class="games-select">
    <el-select
      style="width: 150px"
      v-model="platformType"
      filterable
      @change="handleChangePlatform"
      :disabled="disabledPlatformType"
      v-if="hasBoxPlan"
    >
      <el-option
        v-for="item in platformTypes"
        :key="item.value"
        :label="item.text"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-select
      style="width: 150px"
      :placeholder="gamePlaceholder"
      v-model="game"
      filterable
      @change="handleChangeGame"
      :disabled="disabledGame"
    >
      <el-option
        v-for="item in games"
        :key="item.gameId"
        :label="item.gameName"
        :value="item.gameId"
      ></el-option>
    </el-select>

    <el-select
      v-if="hasZoom"
      style="width: 150px"
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
import { getGamesByPlatform, getZooms, getGamesByDiscount } from "@/api/global";
import { mapGetters } from "vuex";

export default {
  name: "BoxGame",
  props: {
    // 是否显示区服选项
    hasZoom: {
      type: Boolean,
      default: true
    },
    // 默认平台
    defaultPlatformType: {
      type: String,
      default: "0"
    },
    defaultPlatformId: {
      type: String,
      default: ""
    },
    // 默认平台类型
    defaultPlatformTypes: {
      type: Array,
      default: function() {
        return [
          {
            text: "专服",
            value: "0"
          },
          {
            text: "折扣",
            value: "1"
          }
        ];
      }
    },
    disabledPlatformType: {
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
        return [];
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
        return [];
      }
    }
  },
  data() {
    return {
      platformId: this.defaultPlatformId,
      platformType: this.defaultPlatformType,
      platformTypes: this.defaultPlatformTypes,
      game: this.defaultGame,
      games: this.defaultGames,
      zoom: this.defaultZoom,
      zooms: this.defaultZooms,
      showDiscountGame: 0
    };
  },
  created() {
    this.getGames();
  },
  computed: {
    ...mapGetters(["account"]),
    hasBoxPlan() {
      return this.account.hasBoxPlan == 1 ? true : false;
    }
  },
  watch: {
    defaultGame: function(val) {
      this.game = val;
      if (this.game !== "" && this.hasZoom) {
        this.getGames(this.game);
      }
    }
  },
  methods: {
    // 获取 平台类型下的游戏列表
    async getGames(platformType) {
      // if (platformType == 1) {
      //   if (
      //     this.$route.fullPath === "/gameManage/link" ||
      //     this.$route.fullPath === "/gameManage/admission/index"
      //   ) {
      //     this.showDiscountGame = 0;
      //   } else {
      //     this.showDiscountGame = 1;
      //   }
      // }
      const query = {
        isDiscountGame: this.platformType,
        showDiscountGame: this.platformType
      };

      try {
        const res = await getGamesByDiscount(query);
        if (res.state === "ok") {
          this.games = res.data;
        } else if (res.state === "fail") {
          console.log("Games games res.state fail");
        }
      } catch (error) {
        console.log("Games getGames error =>>", error);
      }
      this.emitChange();
    },
    // 获取 游戏区服列表
    async getZooms(gameId) {
      let currentGame = this.games.filter(item => {
        return item.gameId == gameId;
      });
      if (currentGame.length > 0) {
        this.platformId = currentGame[0].platformId;
      } else {
        this.zooms = [];
        return false;
      }
      const query = {
        platformId: this.platformId,
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
        platformType: this.platformType,
        platformId: this.platformId,
        gameId: this.game,
        zoomId: this.zoom
      });
    },
    // 监听 平台类型更改
    handleChangePlatform(val) {
      this.game = "";
      this.zoom = "";
      this.platformId = "";
      this.platformType = val;
      this.getGames(this.platformType);
      console.log(1111);

      this.emitChange();
    },
    // 监听 游戏更改
    handleChangeGame(val) {
      this.zoom = "";
      this.game = val;
      this.getZooms(this.game);
      this.emitChange();
      this.$emit("changePlatform", {
        // platformType: this.platformType,
        platformId: this.platformId,
        gameId: this.game
        // zoomId: this.zoom
      });
    },
    // 监听 区服更改
    handleChangeZoom(val) {
      this.zoom = val;
      this.emitChange();
      this.$emit("changeChangeZoom", {
        // platformType: this.platformType,
        platformId: this.platformId,
        gameId: this.game
        // zoomId: this.zoom
      });
    }
  }
};
</script>
