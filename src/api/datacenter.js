import http from "@/utils/http";
import { serialize } from "@/utils";

/**
 * 获取每日推广业绩
 * @param {int}		queryType		查询类型 1-推广主渠道账号 2-主渠道名称 3-子渠道账号
 * @param {string}	queryValue		查询值
 * @param {string}	platformId		平台ID
 * @param {string}	gameId			游戏ID
 * @param {string}	zoneId			zoneId
 * @param {int}		days			多少天内
 *
 */
export function daystatistics(
  queryType,
  queryValue,
  platformId,
  gameId,
  zoneId,
  startDate,
  endDate,
  isDiscountGame
) {
  const url = `/datacenter/daystatistics.do`;

  const data = {
    queryType,
    queryValue,
    platformId,
    gameId,
    zoneId,
    startDate,
    endDate,
    isDiscountGame
  };

  return http.get2(url, data);
}

/**
 * 获取推广小组推广业绩
 * @param {int}		queryType		查询类型 1-推广主渠道账号 2-主渠道名称
 * @param {string}	queryValue		查询值
 * @param {string}	platformId		平台ID
 * @param {string}	gameId			游戏ID
 * @param {string}	zoneId			zoneId
 * @param {string}	startDate		开始时间
 * @param {string}	endDate			结束时间
 *
 */
export function mcstatistics(
  queryType,
  queryValue,
  platformId,
  appId,
  zoneId,
  startDate,
  endDate,
  pageNo,
  pageSize,
  isDiscountGame
) {
  const url = `/datacenter/mcstatistics.do`;

  const data = {
    queryType,
    queryValue,
    platformId,
    appId,
    zoneId,
    startDate,
    endDate,
    pageNo,
    pageSize,
    isDiscountGame
  };

  return http.get2(url, data);
}

/**
 * 获取子渠道推广业绩
 * @param {int}		queryType		查询类型 1-推广主渠道账号 2-主渠道名称 3-子渠道账号
 * @param {string}	queryValue		查询值
 * @param {string}	platformId		平台ID
 * @param {string}	gameId			游戏ID
 * @param {string}	zoneId			zoneId
 * @param {string}	startDate		开始时间
 * @param {string}	endDate			结束时间
 *
 */
export function scstatistics(
  queryType,
  queryValue,
  platformId,
  gameId,
  zoneId,
  startDate,
  endDate,
  isDiscountGame
) {
  const url = `/datacenter/scstatistics.do`;

  const data = {
    queryType,
    queryValue,
    platformId,
    gameId,
    zoneId,
    startDate,
    endDate,
    isDiscountGame
  };

  return http.get2(url, data);
}

/**
 * 获取游戏推广汇总
 * @param {int}		queryType		查询类型 1-推广主渠道账号 2-主渠道名称 3-子渠道账号
 * @param {string}	queryValue		查询值
 * @param {string}	platformId		平台ID
 * @param {string}	gameId			游戏ID
 * @param {string}	zoneId			区服
 * @param {string}	startDate		开始时间
 * @param {string}	endDate			结束时间
 *
 */
export function gamestatistics(
  queryType,
  queryValue,
  platformId,
  gameId,
  zoneId,
  startDate,
  endDate,
  isDiscountGame
) {
  const url = `/datacenter/gamestatistics.do`;

  const data = {
    queryType,
    queryValue,
    platformId,
    gameId,
    zoneId,
    startDate,
    endDate,
    isDiscountGame
  };

  return http.get2(url, data);
}

/**
 * 获取每日直播收入统计
 *
 */
export function liveDayIncome(query) {
  const queryStr = query ? `?${serialize(query)}` : "";
  const url = `/datacenter/liveDayIncome.do${queryStr}`;
  return http.get(url);
}

/**
 * 获取子渠道备注列表
 * @returns {*}
 */
export function getGameScRealNames() {
  const url = `/datacenter/getGameScRealNames.do`;
  return http.get(url);
}
