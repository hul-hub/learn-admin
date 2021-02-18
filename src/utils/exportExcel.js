/**
 * 导出excel文件
 * @param downloadUrl 服务器给出的文件下载地址
 * @param fileName 自定义下载后的文件名
 */
export function exportExl(downloadUrl, fileName) {
  console.log("exportExl", downloadUrl, fileName);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.target = "_black";
  a.download = `${fileName}.xlsx`;
  a.click();
}
