/**
 * 序列化 对象
 *
 * @param {*} query
 */
export function serialize(query) {
  const temp = [];
  for (const key in query) {
    if (Object.hasOwnProperty.call(query, key)) {
      const enValue = encodeURIComponent(query[key]);
      temp.push(`${key}=${enValue}`);
    }
  }
  return temp.join("&");
}

/**
 * 反序列化 字符串
 *
 * @param {*} query
 */
export function deserialize(query) {
  // 参数为空 或者 为空对象返回空对象
  if (!query || JSON.stringify(query) === "{}") {
    return {};
  }

  const reg = /([^=&\s]+)[=\s]*([^&\s]*)/g;
  const obj = {};
  while (reg.exec(query)) {
    obj[RegExp.$1] = decodeURIComponent(RegExp.$2);
  }
  return obj;
}
/**
 * 字符串与数组互转
 * @param obj 对象
 * @param separator 分隔符
 * @returns {*}
 */
export function joinOrSplit(obj, separator = ",") {
  if (typeof obj === "string") {
    return obj.trim() ? obj.split(separator) : [];
  } else if (obj instanceof Array) {
    return obj ? obj.join(separator) : "";
  } else {
    throw new Error(
      "Incorrect parameter type: the type must be a string or an array."
    );
  }
}
