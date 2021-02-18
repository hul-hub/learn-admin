import Cookies from "js-cookie";

const TokenKey = "Admin-Token-Union";
const AccountKey = "Admin-Account-Union";
const STORAGE = "sessionStorage";

/**
 * 读取 账户权限
 */
export function getToken() {
  return Cookies.get(TokenKey);
}

/**
 * 设置 账户权限
 * @param {*} token
 */
export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

/**
 * 删除 账户权限
 */
export function removeToken() {
  return Cookies.remove(TokenKey);
}

/**
 * 获取 用户信息 从存储
 *
 * @export
 * @returns
 */
export function getAccountFromStorage() {
  return JSON.parse(window[STORAGE].getItem(AccountKey));
}

/**
 * 获取 用户信息 从存储
 *
 * @export
 * @returns
 */
export function setAccountFromStorage(account) {
  const accountInfo =
    typeof account === "string" ? account : JSON.stringify(account);
  return window[STORAGE].setItem(AccountKey, accountInfo);
}

/**
 * 获取 用户信息 从存储
 *
 * @export
 * @returns
 */
export function removeAccountFromStorage() {
  return window[STORAGE].removeItem(AccountKey);
}

/**
 * 设置 sso_sessionid
 * @param {*}
 */
export function setSsoSession(tokenId) {
  return Cookies.set("sso_sessionid2", tokenId);
}
