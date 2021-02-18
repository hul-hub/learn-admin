import http from "@/utils/http";
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
 * 用户行为数据
 *
 * @export
 * @returns
 */
export function getUserBehaviorListApi(query) {
  const url = `/vvData/userBehavior.do`;

  return http.get2(url, query);
}

/**
 * 用户账号数据
 *
 * @export
 * @returns
 */
export function getAccountListApi(query) {
  const url = `/vvData/userAccount.do`;

  return http.get2(url, query);
}

/**
 * VIP增值服务汇总
 *
 * @export
 * @returns
 */
export function getSummaryListApi(query) {
  const url = `/vvData/vipSummary.do`;

  return http.get2(url, query);
}

/**
 * VIP增值服务明细
 *
 * @export
 * @returns
 */
export function getVIPConsumeApi(query) {
  const url = `/vvData/vipConsume.do`;

  return http.get2(url, query);
}

/**
 * 直播消费数据汇总
 *
 * @export
 * @returns
 */
export function getLiveSummaryListApi(query) {
  const url = `/vvData/liveConsumeData.do`;

  return http.get2(url, query);
}

/**
 * 直播数据明细
 *
 * @export
 * @returns
 */
export function getLiveConsumeApi(query) {
  const url = `/vvData/liveConsume.do`;

  return http.get2(url, query);
}

/**
 * vv日报数据
 *
 * @export
 * @returns
 */
export function getDailyListApi(query) {
  const url = `/vvData/dayTotal.do`;

  return http.get2(url, query);
}
/**
 * v直播消费数据 导出
 *
 * @export
 * @returns
 */
export function exportLiveConsumeApi(data) {
  let url = `/vvData/exportLiveConsume.do`;
  return http.get3(url, data);
}

/**
 * vv日报数据导出
 *
 * @export
 * @returns
 */
export function exportDayTotal(query) {
  const url = `/vvData/dayTotal.do`;

  return http.get2(url, query);
}

/**
 * 直播消费数据导出
 *
 * @export
 * @returns
 */
export function exportLiveConsumeData(query) {
  const url = `/vvData/liveConsumeData.do`;

  return http.get2(url, query);
}

/**
 * VIP增值服务汇总导出
 *
 * @export
 * @returns
 */
export function exportVipSummary(query) {
  const url = `/vvData/vipSummary.do`;

  return http.get2(url, query);
}
