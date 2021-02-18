import http from "@/utils/http";
import qs from "qs";

/**
 * 游戏入驻管理
 * @param query
 * @returns {*}
 */
export function gameMangergamePlanList(query) {
  const url = `/gameManger/gamePlan.list.do?${qs.stringify(query)}`;
  return http.get(url);
}

/**
 * 获取推广小组
 * @returns {*}
 */
export function gameMangerMcListByBoss() {
  const url = `/gameManger/mcListByBoss.do`;
  return http.get(url);
}

/**
 * 获取推广员
 * @param query
 * @returns {*}
 */
export function gameMangerScListByMc(query) {
  const url = `/gameManger/scListByMc.do?${qs.stringify(query)}`;
  return http.get(url);
}

/**
 * 申请与撤销入驻
 * @param body
 * @returns {*}
 */
export function gameMangerGamePlanEdit(body) {
  const url = `/gameManger/gamePlan.edit.do`;
  return http.post2(url, body);
}

/**
 * 获取游戏下所有推广组和推广员
 * @param query
 * @returns {*}
 */
export function gameMangerGameScList(query) {
  const url = `/gameManger/gameScList.do?${qs.stringify(query)}`;
  return http.get(url);
}

/**
 * 批量添加删除推广员的推广游戏
 * @param body
 * @returns {*}
 */
export function gameMangerAddScGameList(body) {
  const url = `/gameManger/addScGameList.do`;
  return http.post2(url, body);
}

export function mygameGetMyGamesInfo(query) {
  const url = `/mygame/getMyGamesInfo.do?${qs.stringify(query)}`;
  return http.get(url);
}

/**
 * ios打包
 * @param query
 * @returns {*}
 */
export function mygameSubiospackage(query) {
  const url = `/mygame/subiospackage.do?${qs.stringify(query)}`;
  return http.get(url);
}

/**
 * 安卓打包
 * @param query
 * @returns {*}
 */
export function mygameSubpackage(query) {
  const url = `/mygame/subpackage.do?${qs.stringify(query)}`;
  return http.get(url);
}

/**
 * 获取推广链接
 * @param query
 * @returns {*}
 */
export function mygameGetDownloadUrl(query) {
  const url = `/mygame/getDownloadUrl.do?${qs.stringify(query)}`;
  return http.get(url);
}
/**
 * 获取推广短链-新
 * @param query
 * @returns {*}
 */
export function mygameGetNewDownloadUrl(query) {
  const url = `/guild/gamesc.shortUrlNewer.do?${qs.stringify(query)}`;
  return http.get(url);
}
/**
 * 获取h5链接
 * @param data
 * @returns {*}
 */
export function generatorH5Link(data) {
  const url = `/ajax/generatorH5Link.do`;
  return http.get2(url, data);
}

/**
 * PC打包
 * @param query
 * @returns {*}
 */
export function mygameSubPcpackage(query) {
  const url = `/mygame/subPcPackage.do?${qs.stringify(query)}`;
  return http.get(url);
}
