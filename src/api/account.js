import http from "@/utils/http";
import qs from "qs";

/**
 * 用户名登录
 *
 * @export
 * @param {any} loginInfo
 * @returns
 */
export function loginByUsername(data) {
  console.log("API 用户名登录...", data);
  data.pwd = encodeURIComponent(data.pwd);

  const url = `/fun/login.do?loginName=${data.loginName}&pwd=${data.pwd}&yzm=${
    data.yzm
  }&userType=${data.userType}&source=${data.source}`;
  return http.get(url);
}

/**
 * 退出登录
 *
 * @export
 * @returns
 */
export function logout() {
  const url = `/users/logout`;
  return http.post(url);
}

/**
 * 获取用户信息
 *
 * @export
 * @param {any} id
 * @returns
 */
export function getAccount(id) {
  const url = `/user/info.do?userId=${id}`;

  return http.get(url);
}

/**
 * 检查 用户名是否重复
 *
 * @export
 * @param {any} data
 * @returns
 */
export function checkUsername(name) {
  const url = `/fun/chkLoginName.do?loginName=${name}`;

  return http.get(url);
}

/**
 * 检查 公会名称是否重复
 *
 * @export
 * @param {any} data
 * @returns
 */
export function checkGuildName(name) {
  const url = `/guild/checkGuildName.do?guildName=${name}`;

  return http.get(url);
}

/**
 * 检查 手机是否超过限制
 *
 * @export
 * @param {any} data
 * @returns
 */
export function checkPhoneNumber(data) {
  const url = `/guild/checkPhoneNumber.do`;

  return http.post(url, data);
}

/**
 * 注册 公会帐号
 *
 * @export
 * @param {any} data
 * @returns
 */
export function register(data) {
  const url = `/guild/register.do`;

  return http.post(url, {
    ...data,
    platformId: undefined
  });
}

/**
 * 保存用户信息
 * @param data
 * @returns {*|AxiosPromise<any>}
 */
export function saveUserInfo(data) {
  const url = `/userinfo/saveinfo.do`;

  return http.post(url, data);
}

/**
 * 获取用户信息
 * @param data
 * @returns {*|AxiosPromise<any>}
 */
export function getUserDetailsInfo() {
  const url = `/userinfo/editinfo.do`;
  return http.get(url);
}

/**
 * 修改密码
 * @param data
 * @returns {*|AxiosPromise<any>}
 */
export function savePwd(data) {
  const url = `/userinfo/savepwd.do`;
  return http.post2(url, data);
}

/**
 * 检查用户是否设置二级密码(返回值 0 未设置 1 已设置)
 * @returns {*}
 */
export function gameMangerCheckRole() {
  const url = `/gameManger/checkRole.do`;
  return http.get(url);
}

/**
 * 保存权限新密码
 * @param body
 * @returns {*}
 */
export function gameMangerSaveRolePassword(body) {
  const url = `/gameManger/saveRolePassword.do`;
  return http.post2(url, body);
}

/**
 * 二级权限验证
 * @param password - 二级权限密码
 */
export function checkAdmin(rolepwd) {
  const url = `/gUser/checkRole.do?rolepwd=${rolepwd}`;
  return http.post(url, { rolepwd });
}

/**
 * 获取公会资料
 * @param type
 * @returns {*}
 */
export function editAuditingInfo(type) {
  const url = `/guildauditingGuild/editAuditingInfo.do?type=${type}`;
  return http.get(url);
}

/**
 * 提交公会资料
 * @param data
 * @returns {*}
 */
export function auditingInfo(data) {
  const url = `/guildauditingGuild/auditingInfo.do`;
  return http.put(url, data);
}
