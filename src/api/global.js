import http, { API_URL } from "@/utils/http";

/**
 * 获取 短信验证码
 *
 * @export
 * @returns
 */
export function getSMSCode(mobile, source) {
  const url = `/fun/sendCode.do?phoneNumber=${mobile}&source=${source}`;

  return http.get(url);
}

/**
 * 获取 短信验证码
 *
 * @export
 * @returns
 */
export function getValidateCode() {
  const timestamp = new Date().getTime();
  const res = `${API_URL}/fun/yzm.do?timestamp=${timestamp}`;

  return res;
}

/**
 * 获取 短连接
 *
 * @export
 * @returns
 */
// export function getShortLink(link) {
//   const url = `/ajax/getshorturl.do?url=${link}`;

//   return http.get(url);
// }

export function getShortLink(data) {
  const url = `/ajax/getshorturl.do`;

  return http.get2(url, data);
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
 * 获取 游戏平台列表
 */
export function getPlatforms() {
  const url = `/ajax/platforms.do`;
  return http.get(url);
}

/**
 * 获取 游戏平台列表
 */
export function getPlatforms2() {
  const url = `/ajax/guildPatforms.do`;
  return http.get(url);
}
/**
 * 获取 平台的游戏列表
 */
export function getGamesByPlatform(data) {
  const url = `/ajax/platform.do`;

  return http.get2(url, data);
}

/**
 * 获取 平台的游戏列表
 */
export function getGamesByPlatform2(data) {
  const url = `/ajax/MixPointPlatform.do`;

  return http.get2(url, data);
}

/**
 * 获取 游戏的区服列表
 */
export function getZooms(data) {
  const url = `/ajax/zones.do`;

  return http.get2(url, data);
}
/**
 * 根据专服折扣平台的游戏列表
 */
export function getGamesByDiscount(data) {
  const url = `/guild/common/getUserCataGameList.do`;

  return http.get2(url, data);
}
