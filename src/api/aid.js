import http from "@/utils/http";

/**
 * 一键申请扶持账号
 */
export function onekeyApplyAccount() {
  const url = `/guild/gameSupport/registerSupport.do`;
  return http.post(url);
}

/**
 * 获取平台列表
 */
export function getPlatformList() {
  const url = `/ajax/platforms.do`;
  return http.get(url);
}

/**
 * 获取游戏列表
 */
export function getGameList(data) {
  const url = `/ajax/platform.do`;
  return http.get2(url, data);
}

/**
 * 根据平台与游戏获取区服列表
 * @param data
 * @returns {*}
 */
export function getZonesList(data) {
  const url = `/ajax/zones.do`;
  return http.get2(url, data);
}

/**
 * 获取角色列表
 * @param data
 * @returns {*}
 */
export function getRolesList(data) {
  const url = `/ajax/roles.do`;
  return http.get2(url, data);
}

/**
 * 获取余额
 * @param data
 * @returns {*}
 */
export function getUsableMoney(data) {
  const url = `/guild/gameSupport/usableMoney.do`;
  return http.post(url, data);
}

/**
 * 新手第一次申请扶持
 * @param data
 * @returns {*}
 */
export function applySupportFirst(data) {
  const url = `/guild/gameSupport/addSupportRole.do`;
  return http.post(url, data);
}

/**
 * 扶持帐号管理获取扶持帐号
 * @param data
 * @returns {*|AxiosPromise<any>}
 */
export function getSupportAccountList(data) {
  const url = `/guild/gameSupport/supportAccountList.do`;
  return http.post(url, data);
}

/**
 * 冻结启用修改帐号状态
 * @param data
 * @returns {*}
 */
export function changeAccountState(data) {
  const url = `/guild/gameSupport/updateAccountStatus.do`;
  return http.post(url, data);
}

/**
 * 修改帐号扶持帐号密码
 * @param data
 * @returns {*}
 */
export function updatePassword(data) {
  const url = `/guild/gameSupport/updatePassword.do`;
  return http.post(url, data);
}

/**
 * 申请游戏扶持角色列表
 * @param data
 * @returns {*|AxiosPromise<any>}
 */
export function getApplyRoleList(data) {
  const url = `/guild/gameSupport/supportRole.do`;
  return http.post(url, data);
}
/**
 * 扶持游戏信息
 * @param data
 * @returns {*|AxiosPromise<any>}
 */
export function getSupportInfo(data) {
  const url = `/guild/gameSupport/supportInfo.do`;
  return http.post(url, data);
}

/**
 * 扶持号申请扶持，非第一次申请
 * @param data
 * @returns {*|AxiosPromise<any>}
 */
export function applySupport(data) {
  const url = `/guild/gameSupport/applySupport.do`;
  return http.post(url, data);
}

/**
 * 扶持金额档位
 * @param data
 * @returns {*|AxiosPromise<any>}
 */
export function supportRank(data) {
  const url = `/guild/gameSupport/supportRank.do`;
  return http.post(url, data);
}

/**
 * 校验扶持号密码是否与原密码一致
 *
 * @export
 * @param {*} id
 * @returns
 */
export function checkPassword(data) {
  const url = `/guild/gameSupport/chkPassword.do`;
  return http.post(url, data);
}

/**
 * 获取小组元宝池信息(只能在首次扶持和后续扶持中使用，请注意)
 * @param platformId
 * @param gameId
 * @param zoneId
 * @returns {*}
 */
export function bossUsableMoney(data) {
  const url = `/guild/gameSupport/bossUsableMoney.do`;

  return http.post(url, data);
}

/**
 * 获取查询用户游戏(去除了平台信息)
 */
export function getUserGameList() {
  const url = `/guild/common/getUserGameList.do`;
  return http.post(url);
}
/**
 * 通过游戏获取对应平台
 */
export function getGameLikeNameMixed(data) {
  const url = `/ajax/getGameLikeNameMixed.do`;
  return http.get2(url, data);
}
