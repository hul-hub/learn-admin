"use strict";

import store from "@/store";
import { getZonesList, getGameList, getRolesList } from "@/api/aid";

let aidService = {
  /**
   * 根据平台ID获取游戏列表
   * @param platform
   */
  getGameList: (platform, cb) => {
    getGameList({ platformId: platform }).then(
      res => {
        console.log(res, "--------------getGameList");
        if (res.state === "ok") {
          let gameList = res.data;
          let gameOption = [];
          for (let i = 0; i < gameList.length; i++) {
            gameOption.push({
              value: gameList[i].value,
              label: gameList[i].text
            });
            cb && cb(gameOption);
          }
        }
      },
      () => {}
    );
  },
  /**
   * 获取游戏区服列表
   */
  getZonesList: (platformId, gameId, cb) => {
    getZonesList({
      platformId: platformId,
      gameId: gameId
    })
      .then(res => {
        console.log(res, "-----------------getZonesList");
        if (res.state === "ok") {
          let zonesList = res.data;
          let zonesOption = [];
          for (let i = 0; i < zonesList.length; i++) {
            zonesOption.push({
              value: zonesList[i].value,
              label: zonesList[i].text
            });
            cb && cb(zonesOption);
          }
        }
      })
      .catch(() => {});
  },
  /**
   * 获取角色列表
   */
  getRolesList: (platformId, gameId, zoneId, userId, cb) => {
    getRolesList({
      platformId: platformId,
      gameId: gameId,
      zoneId: zoneId,
      userId: userId
    })
      .then(res => {
        console.log(res, "-----------------getRolesList");
        if (res.state === "ok") {
          let rolesList = res.data;
          let rolesOption = [];
          for (let i = 0; i < rolesList.length; i++) {
            rolesOption.push({
              value: rolesList[i].value,
              label: rolesList[i].text
            });
            cb && cb(rolesOption);
          }
        }
      })
      .catch(() => {});
  }
};

export default aidService;
