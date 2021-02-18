import { findPrivateLogo } from "@/api/tools";

const TokenKey = "Admin-Token-platform";
export function getCookies() {
  let c_param = "";
  if (document.cookie.length > 0) {
    var arr = document.cookie.split("; ");
    for (var i = 0; i < arr.length; i++) {
      var arr2 = arr[i].split("="); //再次切割
      //判断查找相对应的值
      if (arr2[0] == TokenKey) {
        c_param = arr2[1];
        //保存到保存数据的地方
      }
    }
    const platform = c_param;
    getfindPrivateLogo(platform);
  }
}

export function getfindPrivateLogo(platform) {
  const data = {
    postfixName: platform
  };
  findPrivateLogo(data)
    .then(res => {
      if (res.state === "fail") {
        console.log(res.message || "获取失败，请重试");
        return;
      } else {
        if (res.data.privateName == "" || res.data.privateName == null) {
          return (document.title = "游戏推广平台");
        } else {
          return (document.title = res.data.privateName);
        }
      }
    })
    .catch(e => {
      console.log("查询失败，请重试");
    });
}
