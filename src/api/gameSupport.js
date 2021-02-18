import http from "@/utils/http";

//==========================================内部管理后台拷贝过来的部分==================================
/**
 * 获取 扶持账号列表
 * @param data
 * @returns {*}
 */
export function getSupportAccountListApi(data) {
  const url = `/supportacount/list.do`;
  return http.get2(url, data);
}

/**
 * 修改扶持账号密码
 * @param data
 * @returns {*}
 */
export function modifySupportAccountPasswordApi(data) {
  const url = `/supportacount/updatePassword.do`;
  return http.get2(url, data);
}
/**
 * 修改扶持账号状态
 * @param data
 * @returns {*}
 */
export function modifySupportAccountStatusApi(data) {
  const url = `/supportacount/updateStatus.do`;
  return http.post(url, data);
}

/**
 * 获取 扶持审核列表
 * @returns {*}
 * @param data
 */
export function getSupportGrantListApi(data) {
  const url = `/support/grantlist.do`;
  return http.post(url, data);
}

/**
 * 扶持审核-允许
 * @param id
 */
export function setGrantAgreeApi(id) {
  const url = `/support/agree.do?id=${id}`;
  return http.get(url);
}
/**
 * 扶持审核-拒绝
 * @param id
 */
export function setGrantRejectApi(id) {
  const url = `/support/reject.do?id=${id}`;
  return http.get(url);
}

/**
 * 游戏扶持 - 设置列表
 * @param platformId
 * @param gameId
 * @param page
 * @returns {*}
 */
export function getSupportSettingsListApi(
  platformId,
  gameId,
  page = { count: 0, pageNo: 1, pageSize: 10 }
) {
  const url = `/gsSetting/list.do?platformId=${platformId}&gameId=${gameId}`;
  const body = page;
  return http.post(url, body);
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
 * 是否使用“获取推广员下载包游戏下拉列表”，具体和产品确认
 *
 * @param platformId
 * @returns {*}
 */
export function getPlatformGameListApi(platformId) {
  // const url = `/ajax/platformgame.do?platformId=${platformId}`;
  const url = `/ajax/platform.do?platformId=${platformId}`;
  return http.get(url);
}

/**
 * 获取平台游戏区服列表
 * @param platformId
 * @param gameId
 * @returns {*}
 */
export function getPlatformGameZoneListApi(platformId, gameId) {
  const url = `/ajax/zones.do?platformId=${platformId}&gameId=${gameId}`;
  return http.get(url);
}

/**
 *
 * 保存/添加 游戏扶持设置
 * @export
 * @returns{*}
 * @param data
 */
export function saveGameSupportSettingApi(data) {
  const url = `/gsSetting/save.do`;
  // console.log('save:', data);
  return http.post(url, data);
}

//=======================================公会后台新增===================================

/**
 * 获取 扶持账号申请记录列表
 * @param data
 * @returns {*}
 */
export function getSupportAccountApplyRecordListApi(data) {
  const url = `/guild/gameSupport/supportApplyList.do`;
  return http.post(url, data);
}

/**
 * 获取 扶持账号统计列表
 * @param data
 * @returns {*}
 */
export function getSupportAccountTotalListApi(data) {
  const url = `/guild/gameSupport/supportApplyTotal.do`;
  return http.post(url, data);
}

/**
 * 获取 赠送首充 列表
 * @param data
 * @returns {*}
 */
export function getFirstRechargeListApi(data) {
  const url = `/sive/list.do`;
  return http.get2(url, data);
}

/**
 * 赠送首充
 * @param data
 * @returns {*}
 */
export function giveFirstRechargeApi(data) {
  const url = `/sive/save.do`;
  return http.post(url, data);
}

/**
 * 查看元宝池数量
 */
export function previewPool(data) {
  const url = `/guild/gameSupport/ingotPool.do`;

  return http.post(url, data);
}
/**
 * 获取 赠送首充角色信息
 * @param data
 * @returns {*}
 */
export function getFirstRechargeUserRole(data) {
  const url = `/sive/findUserRole.do`;
  return http.post(url, data);
}
/**
 * 新 赠送首充
 * @param data
 * @returns {*}
 */
export function sendSiveFirstRechargeApi(data) {
  const url = `/sive/sendSiveFirst.do`;
  return http.post(url, data);
}
