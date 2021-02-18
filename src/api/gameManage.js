import http from "@/utils/http";
import qs from "qs";

/**
 * 获取推广链接
 *
 * @export
 * @returns
 */
export function getGameSpreadLinks(query) {
  const url = `/guildgame/gamesc.list.do`;

  return http.get2(url, query);
}

/**
 * 获取 平台列表
 *
 * @export
 * @returns
 */
export function getPlatforms() {
  const url = `/ajax/platforms.do`;

  return http.get(url);
}

/**
 * 获取 游戏运行环境
 *
 * @export
 * @returns
 */
export function getGameEnvis() {
  const url = `/ajax/rttypes.do`;

  return http.get(url);
}

/**
 * 获取 游戏列表
 *
 * @export
 * @returns
 */
export function getGames(platformId, rtType) {
  const url = `/ajax/platformgame.do?platformId=${platformId}&rtType=${rtType}`;

  return http.get(url);
}

/**
 * 获取 主推游戏列表
 * @param body
 * @returns {*}
 */
export function findRecommendGame({ gameId, pagination, scAccount, scName }) {
  const url = `/recommendgame/findRecommendGame.do`;
  return http.post(url, { gameId, pagination, scAccount, scName });
}

/**
 * 获取游戏下拉列表(不传默认查推广小组，如果填了子渠道ID则查推广员的推广游戏)
 * @param query
 * @returns {*}
 */
export function getGameInfo({ scId }) {
  const url = `/recommendgame/getGameInfo.do?${qs.stringify({
    scId
  })}`;
  return http.get(url);
}

/**
 * 获取推广小组当前主推游戏
 * @returns {*}
 */
export function getMcRecommendGame() {
  const url = `/recommendgame/getMcRecommendGame.do`;
  return http.get(url);
}

/**
 * 主推游戏设置
 * @param gameId
 * @param platformId
 * @param scid
 * @returns {*}
 */
export function setRecommendGame({ gameId, platformId, scid }) {
  const url = `/recommendgame/setRecommendGame.do`;
  return http.post(url, { gameId, platformId, scid });
}
/**
 * 保存主播id
 * @param data
 */
export function directAnchor(data) {
  const url = `/vv/directAnchor.save.do?${qs.stringify(data)}`;
  return http.post(url, data);
}
/**
 * 下载二维码推广图片
 * @param data
 */
export function downloadQRCodeExpandPage(data) {
  const url = `/mygame/downloadQRCodeExpandPage.do`;
  return http.get3(url, data);
}
