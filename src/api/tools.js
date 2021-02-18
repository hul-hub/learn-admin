import http from "@/utils/http";
import qs from "qs";

/**
 * 改绑玩家归属游戏角色列表查询(new)
 * @param data
 * @returns {*}
 */
export function getNewGamePlayers(data) {
  const url = `/tieup/findGameRoleList.do`;
  return http.post(url, data);
}

/**
 * 改绑玩家渠道提交(新规则)
 * @param userId
 * @param nowMcId
 * @param nowScId
 * @param splitDate
 * @param mcId
 * @param scId
 * @param platformId
 * @param appId
 * @returns {*}
 */
// export function changeBindNewGamePlayer(userId,platformId, splitDate,nowMcId, nowScId, mcId, scId,appId) {
//   const url = `/tieup/saveTieup.do?userId=${userId}&platformId=${platformId}&splitDate=${splitDate}&nowMcId=${nowMcId}&nowScId=${nowScId}&mcId=${mcId}&scId=${scId}&appId=${appId}`;
//
//   return http.put(url);
// }
export function changeBindNewGamePlayer(data) {
  const url = `/tieup/saveTieup.do`;

  return http.post(url, data);
}

/**
 * 根据平台后缀查询logo  自定义风格
 * @param {*} data
 */
export function findPrivateLogo(data) {
  const url = `/fun/findPrivateLogo.do`;
  return http.post2(url, data);
}

/**
 * 自定义平台风格编辑
 * @param {*} data
 */
export function editPrivatePage(data) {
  const url = `/guild/regular/editPrivatePage.do`;
  return http.post(url, data);
}

/**
 * 导出新增操作日志记录（内部、公会后台）
 *
 * @export
 * @returns
 */
export function operLogSetExportLog(data) {
  const url = `/operLog/setExportLog.do`;
  return http.get2(url, data);
}

/**
 * 产品洞察获取分类
 * @param query
 * @returns {*}
 */
export function getCatAndTagApi(data) {
  const url = `/adinsights/getCatAndTag.do`;
  return http.get2(url, data);
}
/**
 * 产品洞察获取列表
 * @param query
 * @returns {*}
 */
export function getProductListApi(data) {
  const url = `/adinsights/getProductList.do`;
  return http.get2(url, data);
}
/**
 * 产品洞察获取创意组列表
 * @param query
 * @returns {*}
 */
export function getCreativeListApi(data) {
  const url = `/adinsights/getCreativeList.do`;
  return http.get2(url, data);
}

/**
 * 获取websocket链接
 * @param query
 * @returns {*}
 */
export function getWebSocketUrl() {
  const url = `/guildNetty/getWebSocketUrl.do`;
  return http.get(url);
}
