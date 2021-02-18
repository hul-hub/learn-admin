/* eslint-disable no-useless-escape */

/**
 * 验证邮箱
 *
 * @param  {any} email
 * @returns
 */
export function validateEmail(email) {
  const re = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/;
  return re.test(email);
}

/**
 * 验证手机号码
 *
 * @export
 * @param {any} mobile
 * @returns
 */
export function validateMobile(mobile) {
  const re = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[0-9])\d{8}$/;
  return re.test(mobile);
}
/**
 * 验证 QQ
 *
 * 1 首位不能是0  ^[1-9]
 * 2 必须是 [5, 11] 位的数字  \d{4,9}
 *
 * @export
 * @param {any} qq
 * @returns
 */
export function validateQQ(qq) {
  const re = /^[1-9]\d{4,9}$/;
  return re.test(qq);
}

/**
 * 验证新密码
 *
 * 6-15个字符，至少含数字，字母，符号中的2种
 *
 * @export
 * @param {any} password
 * @returns
 */
export function validateNewPassword(password) {
  const re = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,15}$/;
  return re.test(password);
}

/**
 * 验证身份证
 *
 *
 * @export
 * @param {any} idCard
 * @returns
 */
var checkProv = function(val) {
  var pattern = /^[1-9][0-9]/;
  var provs = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江 ",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北 ",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏 ",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门"
  };
  if (pattern.test(val)) {
    if (provs[val]) {
      return true;
    }
  }
  return false;
};
var checkDate = function(val) {
  var pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/;
  if (pattern.test(val)) {
    var year = val.substring(0, 4);
    var month = val.substring(4, 6);
    var date = val.substring(6, 8);
    var date2 = new Date(year + "-" + month + "-" + date);
    if (date2 && date2.getMonth() == parseInt(month) - 1) {
      return true;
    }
  }
  return false;
};
var checkCode = function(val) {
  var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  var parity = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];
  var code = val.substring(17);
  if (p.test(val)) {
    var sum = 0;
    for (var i = 0; i < 17; i++) {
      sum += val[i] * factor[i];
    }
    if (parity[sum % 11] == code.toUpperCase()) {
      return true;
    }
  }
  return false;
};
export function validateIdCard(idCard) {
  // const re = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
  // return re.test(idCard);
  if (checkCode(idCard)) {
    var date = idCard.substring(6, 14);
    if (checkDate(date)) {
      if (checkProv(idCard.substring(0, 2))) {
        return true;
      }
    }
  }
  return false;
}
