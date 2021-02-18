import http from "@/utils/http";

/**
 * 获取 公会认证信息、状态
 *
 * @export
 * @returns
 */
export function getCertification() {
  const url = `/guild/getCertMsg.do`;

  return http.get(url);
}

/**
 * 资质认证保存
 *
 * @export
 * @returns
 */
export function saveCertification(data) {
  const url = `/guild/certsave.do`;
  return http.post(url, data);
}

/**
 * 上传资质认证照片
 *
 * @export
 * @returns
 */
export function uploadImg(data) {
  const url = `/guild/uploadFile.do`;

  return http.post(url, data);
}
