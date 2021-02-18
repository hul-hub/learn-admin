import http from "@/utils/http";

/**
 * 获取 统计信息
 *
 * @export
 * @returns
 */
export function getAnalysis() {
  const url = `/user/homePageData.do`;

  return http.get(url);
}

/**
 *获取 公告列表
 *
 * @export
 */
export function getNotices() {}

/**
 *获取 公告详情
 *
 * @export
 */
export function getNotice() {}
