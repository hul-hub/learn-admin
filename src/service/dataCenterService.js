"use strict";

import { getPlatformList, getGameList, getZonesList } from "@/api/aid";

export const ZONE_ALL = {
  value: "所有区服",
  text: "所有区服",
  parentValue: "所有区服"
};
export const GAME_ALL = {
  value: "全部游戏",
  text: "全部游戏",
  parentValue: "全部游戏",

  __nextList: [ZONE_ALL]
};
export const PLATFORM_ALL = {
  value: "全部平台",
  text: "全部平台",
  parentValue: "全部平台",

  __nextList: [GAME_ALL]
};

let _prevDatas = null;
let _nowDatas = null;

let _bReqPlatformList = false;
async function _requestPlatformList(fnOnDatas) {
  if (_bReqPlatformList) {
    console.log("platform list requesting");
    return;
  }

  _bReqPlatformList = true;

  let res;
  try {
    res = await getPlatformList();
  } catch (error) {
    console.error(error);
    _bReqPlatformList = false;
    return;
  }

  _bReqPlatformList = false;

  _prevDatas = _nowDatas;
  const data = res && res.data ? res.data : [];
  data.unshift(PLATFORM_ALL);
  _nowDatas = data;

  fnOnDatas && fnOnDatas();
}

async function _requestGameList(platformId, fnOnDatas) {
  let platformVo = _getPlatform(platformId);
  if (!platformVo) {
    console.error("不存在的平台 platformId: " + platformId);
    return;
  }
  if (platformVo._bReq) {
    console.log("正在或者已经请求该平台的游戏列表 platformId: " + platformId);
    return;
  }
  platformVo._bReq = true;

  let res;
  try {
    res = await getGameList({
      platformId
    });
  } catch (error) {
    console.error(error);
    platformVo._bReq = false;
    return;
  }

  const data = res && res.data ? res.data : [];
  data.unshift(GAME_ALL);

  platformVo = _getPlatform(platformId);
  if (platformVo) {
    platformVo.__nextList = data;
  }

  fnOnDatas && fnOnDatas();
}

async function _requestZonesList(platformId, gameId, fnOnDatas) {
  let gameVo = _getGame(platformId, gameId);
  if (!gameVo) {
    console.error(
      "不存在的平台游戏 platformId: " + platformId + "  gameId:" + gameId
    );
    return;
  }
  if (gameVo._bReq) {
    console.log(
      "正在或者已经请求区服列表 platformId: " +
        platformId +
        "  gameId:" +
        gameId
    );
    return;
  }
  gameVo._bReq = true;

  let res;
  try {
    res = await getZonesList({
      platformId,
      gameId
    });
  } catch (error) {
    console.error(error);
    gameVo._bReq = false;
    return;
  }

  const data = res && res.data ? res.data : [];
  data.unshift(ZONE_ALL);

  gameVo = _getGame(platformId, gameId);
  if (gameVo) {
    gameVo.__nextList = data;
  }

  fnOnDatas && fnOnDatas();
}

function _doGetPlatformList(fnOnDatas) {
  if (_nowDatas) return _nowDatas;

  _requestPlatformList(fnOnDatas);

  if (_prevDatas) return _prevDatas;

  return [PLATFORM_ALL];
}

function _doGetGameList(platformList, platformId, fnOnDatas) {
  const l = platformList.length;
  for (let i = 0; i < l; ++i) {
    const vo = platformList[i];
    if (vo.value != platformId) continue;

    const nextList = vo.__nextList;
    if (nextList) return nextList;
    break;
  }

  _requestGameList(platformId, fnOnDatas);

  return PLATFORM_ALL.__nextList;
}

function _doGetZoneList(gameList, platformId, gameId, fnOnDatas) {
  const l = gameList.length;
  for (let i = 0; i < l; ++i) {
    const vo = gameList[i];
    if (vo.value != gameId) continue;

    const nextList = vo.__nextList;
    if (nextList) return nextList;
    break;
  }

  _requestZonesList(platformId, gameId, fnOnDatas);

  return GAME_ALL.__nextList;
}

function _getPlatform(platformId) {
  if (!_nowDatas) return null;

  const l = _nowDatas.length;
  for (let i = 0; i < l; ++i) {
    const vo = _nowDatas[i];
    if (vo.value != platformId) continue;

    return vo;
  }
  return null;
}

function _getGame(platformId, gameId) {
  const platformVo = _getPlatform(platformId);
  if (!platformVo) return null;

  const gameList = platformVo.__nextList;
  if (!gameList) return null;

  const l = gameList.length;
  for (let i = 0; i < l; ++i) {
    const vo = gameList[i];
    if (vo.value != gameId) continue;

    return vo;
  }
  return null;
}

const dataCenterService = {
  getGameConditions(platformId, gameId, fnDatas, fnOnDatas) {
    const platformList = _doGetPlatformList(fnOnDatas);
    const gameList = _doGetGameList(platformList, platformId, fnOnDatas);
    const zoneList = _doGetZoneList(gameList, platformId, gameId, fnOnDatas);

    fnDatas(platformList, gameList, zoneList);
  },

  clearGameCondtions() {
    _prevDatas = _nowDatas;
    _nowDatas = null;
  }
};

export default dataCenterService;
