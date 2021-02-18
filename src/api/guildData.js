import http from "@/utils/http";

/**
 * VV公会量数据报表
 *
 * @export
 * @param
 * @returns
 */
export function guildDayDatalist(data) {
  const url = `/guildDayData/list.do`;
  return http.get2(url, data);
}
/**
 * VV公会量数据报表-导出
 *
 * @export
 * @param
 * @returns
 */
export function guildDayDataexport(data) {
  const url = `/guildDayData/export.do`;
  return http.get2(url, data);
}
/**
 * 公会用户日新增质量报表
 *
 * @export
 * @param
 * @returns
 */
export function guildUserDayAddedlist(data) {
  const url = `/guildUserDayAdded/list.do`;
  return http.get2(url, data);
}
/**
 * 公会用户日新增质量报表-导出
 *
 * @export
 * @param
 * @returns
 */
export function guildUserDayAddedexport(data) {
  const url = `/guildUserDayAdded/export.do`;
  return http.get2(url, data);
}
/**
 * 推广员日质量报表
 *
 * @export
 * @param
 * @returns
 */
export function extensionAgentDayQualitylist(data) {
  const url = `/extensionAgentDayQuality/list.do`;
  return http.get2(url, data);
}
/**
 * 推广员日质量报表
 *
 * @export
 * @param
 * @returns
 */
export function extensionAgentDayQualityexport(data) {
  const url = `/extensionAgentDayQuality/export.do`;
  return http.get2(url, data);
}
/**
 * 主播所属公会收入榜
 *
 * @export
 * @param
 * @returns
 */
export function anchorIncomelist(data) {
  const url = `/anchorIncome/list.do`;
  return http.get2(url, data);
}
/**
 * 导出主播所属公会收入榜
 *
 * @export
 * @param
 * @returns
 */
export function anchorIncomeexport(data) {
  const url = `/anchorIncome/export.do`;
  return http.get2(url, data);
}
/**
 * 渠道收入榜
 *
 * @export
 * @param
 * @returns
 */
export function channelIncomelist(data) {
  const url = `/channelIncome/list.do`;
  return http.get2(url, data);
}
/**
 * 渠道收入榜-导出
 *
 * @export
 * @param
 * @returns
 */
export function channelIncomeexport(data) {
  const url = `/channelIncome/export.do`;
  return http.get2(url, data);
}
/**
 * 查询基础营收
 *
 * @export
 * @param
 * @returns
 */
export function basicRevenuelist(data) {
  const url = `/basicRevenue/list.do`;
  return http.get2(url, data);
}
/**
 * 基础营收-导出
 *
 * @export
 * @param
 * @returns
 */
export function basicRevenueexport(data) {
  const url = `/basicRevenue/export.do`;
  return http.get2(url, data);
}
