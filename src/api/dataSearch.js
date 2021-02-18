import http from "@/utils/http";
import qs from "qs";

/**
 * 获取 帐号注册记录
 *
 * @export
 * @returns
 */
export function getRegisters(query) {
  const url = `/user/registerRecord.do`;

  return http.get2(url, query);
}

/**
 * 获取 玩家角色信息
 *
 * @export
 * @returns
 */
export function getPlayers(query) {
  const url = `/user/userRoles.do`;

  return http.get2(url, query);
}

/**
 * 获取 注册统计信息
 *
 * @export
 * @returns
 */
export function getRecharges(query) {
  const url = `/user/orderRecord.do`;

  return http.get2(url, query);
}

/**
 * 获取 注册统计信息
 *
 * @export
 * @returns
 */
export function syncOA(orderId) {
  const url = `/user/synToOA.do`;
  const data = {
    orderId
  };

  return http.post2(url, data);
}

/**
 * 获取游戏分区数据汇总
 *
 * @export
 * @returns
 */
export function getList(query) {
  const url = `/user/gameZoneData.do`;

  return http.get2(url, query);
}

/**
 * 获取用户投放计划游戏
 * @param query
 * @returns {*}
 */
export function getMyGameList(query) {
  const url = `/ajax/getMyGameList.do?${qs.stringify(query)}`;

  return http.get(url);
}

/**
 * 获取平台列表
 * @returns {*}
 */
export function getPlatformListApi() {
  const url = `/ajax/platforms.do`;
  return http.get(url);
}

/**
 * 获取平台游戏列表
 * @param platformId
 * @returns {*}
 */
export function getPlatformGameListApi(platformId) {
  // const url = `/ajax/platformgame.do?platformId=${platformId}`;
  const url = `/ajax/platform.do?platformId=${platformId}`;
  return http.get(url);
}

/**
 * 账号注册记录（老版本）
 * @param query
 * @returns {*}
 */
export function oldRegisterRecord(query) {
  const url = `/user/oldRegisterRecord.do`;

  return http.get2(url, query);
}

/**
 * 获取玩家充值总计
 * @param query
 * @returns {*}
 */
export function orderRecordNum(query) {
  const url = `/user/orderRecordNum.do`;

  return http.post(url, query);
}

/**
 * 账号注册信息导出
 * @param query
 * @returns {*}
 */
export function oldRegisterExport(query) {
  const url = `/user/oldRegisterExport.do`;

  return http.get2(url, query);
}

/**
 * 玩家游戏信息导出
 * @param query
 * @returns {*}
 */
export function registerExport(query) {
  const url = `/user/registerExport.do`;

  return http.get2(url, query);
}

/**
 * 玩家充值记录导出
 * @param query
 * @returns {*}
 */
export function orderRecordExport(query) {
  const url = `/user/orderRecord.do`;

  return http.get2(url, query);
}
