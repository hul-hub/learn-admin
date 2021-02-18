import http from "@/utils/http";

/**
 * 获取主渠道列表
 *
 * @export
 * @param {number} [size=1]
 * @param {number} [page=10]
 * @returns
 */
export function getLeaders(
  pageNo = 1,
  pageSize = 10,
  queryType = "",
  key = "",
  status = -1
) {
  const url = `/guild/leaderlist.do`;

  const data = { pageNo: pageNo, pageSize: pageSize };
  const queryTypeMap = queryType ? { queryType: queryType } : {};
  const keywordMap = key ? { queryValue: key } : {};
  const statusMap = status != -1 ? { status: status } : {};

  Object.assign(data, queryTypeMap, keywordMap, statusMap);

  console.log("http.get getMembers", data);

  return http.get2(url, data);
}

/**
 * 获取子渠道列表
 *
 * @export
 * @param {number} [size=1]
 * @param {number} [page=10]
 * @returns
 */
export function getPromoters(
  pageNo = 1,
  pageSize = 10,
  queryType = "",
  key = "",
  status = -1
) {
  const url = `/guild/scidlist.do`;

  const data = { pageNo: pageNo, pageSize: pageSize };
  const queryTypeMap = queryType ? { queryType: queryType } : {};
  const keywordMap = key ? { queryValue: key } : {};
  const statusMap = status != -1 ? { status: status } : {};

  Object.assign(data, queryTypeMap, keywordMap, statusMap);

  console.log("http.get getMembers", data);

  return http.get2(url, data);
}

export function getLeaderTests(data) {
  const url = `/guild/leaderlist.do`;
  return http.post(url, data);
}

export function getMemberLists(data) {
  const url = `/guild/bossteammembers.do`;
  return http.post(url, data);
}
