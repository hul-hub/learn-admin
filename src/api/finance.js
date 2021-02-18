import http from "../utils/http";
import qs from "qs";
import { exportExl } from "../utils/exportExcel";

/**
 * 财务结算单
 * @param pageNo - 页
 * @param pageSize - 页大小
 * @param billDates - 账单时间(多个时间以逗号隔开)
 * @param balanceType - 账单结算类型
 * @returns {*}
 */
export function guildBill({
  pageNo = 1,
  pageSize = 10,
  billDates,
  balanceType
}) {
  return http.get(`/guildBill/guildBill.do?${qs.stringify(arguments[0])}`);
}

/**
 * 导出财务结算单
 * @param billDates 账单时间(多个时间以逗号隔开)
 */
export function exGuildBill({ billDates }) {
  exportExl(`/guildBill/exGuildBill.do?${qs.stringify(arguments[0])}`);
}

/**
 * 游戏收入汇总
 * @param queryType - 查询类型 1-推广主渠道账号 2-主渠道名称 3-子渠道账号 7-订单号 14-推广员名称
 * @param queryValue - 查询值
 * @param billDates - 账单时间(多个时间以逗号隔开)
 * @param balanceType - 账单结算类型
 * @param gameId - 游戏
 * @returns {*}
 */
export function getGameBill({
  queryType,
  queryValue,
  billDates,
  balanceType,
  gameId
}) {
  return http.get(`/guildBill/getGameBill.do?${qs.stringify(arguments[0])}`);
}

/**
 * 导出游戏收入汇总
 * @param queryType - 查询类型 1-推广主渠道账号 2-主渠道名称 3-子渠道账号 7-订单号 14-推广员名称
 * @param queryValue - 查询值
 * @param billDates - 账单时间(多个时间以逗号隔开)
 * @param gameId - 游戏
 */
export function exGameBill({ queryType, queryValue, billDates, gameId }) {
  exportExl(`/guildBill/exGameBill.do?${qs.stringify(arguments[0])}`);
}

/**
 * 游戏收益明细
 * @deprecated
 * @param pageNo - 页
 * @param pageSize - 页大小
 * @param queryType - 查询类型 1-推广主渠道账号 2-主渠道名称 3-子渠道账号 7-订单号 14-推广员名称
 * @param queryValue - 查询值
 * @param gameId - 游戏
 * @param startDate - 开始时间
 * @param endDate - 结束时间
 * @returns {*}
 */
export function orderData({
  pageNo = 1,
  pageSize = 10,
  queryType,
  queryValue,
  gameId,
  startDate,
  endDate
}) {
  return http.get(`/guildBill/orderData.do?${qs.stringify(arguments[0])}`);
}

/**
 * 扣款补款记录
 * @param pageNo - 页
 * @param pageSize - 页大小
 * @param gameId - 游戏
 * @param extensionType - 补扣款类型(1 补款 2 扣款)
 * @param startDate - 开始时间
 * @param endDate - 结束时间
 * @returns {*}
 */
export function extensionMoney({
  pageNo = 1,
  pageSize = 10,
  gameId,
  extensionType,
  startDate,
  endDate
}) {
  return http.get(`/guildBill/extensionMoney.do?${qs.stringify(arguments[0])}`);
}

/**
 * 获取当月所有结算日期
 * @param month - 查询的月份(不传为全部)
 * @returns {*}
 */
export function getBillCycleByMonth({ month } = {}) {
  return http.get(
    `/autoBill/getBillCycleByMonth.do?${qs.stringify(arguments[0])}`
  );
}

/**
 * 获取公会全部账单类型
 * @returns {*}
 */
export function guildBalanceType() {
  return http.get(`/guildBill/guildBalanceType.do`);
}

/**
 * 查询全部入驻游戏
 * @returns {*}
 */
export function gameList() {
  return http.get(`/autoBill/gameList.do`);
}
