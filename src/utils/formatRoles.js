/**
 * 格式化权限
 * @param {*} account
 */
export default function(account) {
  if (account.isGuildBoss === 1 && account.userType === 2) {
    const roles = ["boss"];
    if (account.isSupport === 1) {
      roles.push("support");
    }
    if (account.showGuildDataReport === 1) {
      roles.push("showGuildDataReport");
    }
    if (account.enablePrivate === 1) {
      //自定义风格
      roles.push("enablePrivate");
    }
    if (account.productWatch === 1) {
      //产品洞察
      roles.push("allRole");
      roles.push("productWatch");
    }
    if (account.giftPutOutAuth === 1) {
      //发放福利礼包
      roles.push("allRole");
      roles.push("giftPutOutAuth");
    }
    if (account.posterPutInIsEnable === 1) {
      //广告投放
      roles.push("posterPutInIsEnable");
    }
    if (account.isShowPersonalCenter === 1) {
      //是否显示个人中心
      roles.push("isShowPersonalCenter");
    }
    if (account.isShowServerRatio === 1) {
      //是否显示通服点位表
      roles.push("isShowServerRatio");
    }
    if (account.isShowGuildBalance === 1) {
      //是否显示财务结算表
      roles.push("isShowGuildBalance");
    }
    if (account.adventStatus === 0) {
      //盒子管理入驻功能
      roles.push("adventStatus");
    }
    if (account.adventStatus === 4) {
      //盒子管理入驻功能
      roles.push("adventStatus2");
    }
    if (account.isShowGuildConsumeMoney === 1) {
      roles.push("isShowGuildConsumeMoney");
    }
    return roles;
  }

  if (account.isGuildBoss === 0 && account.userType === 2) {
    const roles = ["leader"];
    if (account.isSupport === 1) {
      roles.push("support");
    }
    if (account.productWatch === 1) {
      //产品洞察
      roles.push("allRole");
      roles.push("productWatch");
    }
    if (account.giftPutOutAuth === 1) {
      //发放福利礼包
      roles.push("allRole");
      roles.push("giftPutOutAuth");
    }
    if (account.adventStatus === 4) {
      //盒子管理入驻功能
      roles.push("adventStatus2");
    }
    if (account.isShowGuildConsumeMoney === 1) {
      roles.push("isShowGuildConsumeMoney");
    }
    return roles;
  }

  if (account.isGuildBoss === 0 && account.userType === 3) {
    const roles = ["seoer"];
    if (account.isSupport === 1) {
      roles.push("support");
    }
    if (account.productWatch === 1) {
      //产品洞察
      roles.push("allRole");
      roles.push("productWatch");
    }
    if (account.giftPutOutAuth === 1) {
      //发放福利礼包
      roles.push("allRole");
      roles.push("giftPutOutAuth");
    }
    if (account.adventStatus === 4) {
      //盒子管理入驻功能
      roles.push("adventStatus2");
    }
    if (account.isShowGuildConsumeMoney === 1) {
      roles.push("isShowGuildConsumeMoney");
    }

    return roles;
  }

  return [];
}
