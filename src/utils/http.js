import axios from "axios";
import { Message } from "element-ui";
import router from "../router";
import store from "../store";

// Global config
// const CONTENT__TYPE = 'application/x-www-form-urlencoded';
const CONTENT__TYPE = "application/json;charset=utf-8";

export let API_URL;
if (process.env.NODE_ENV === "development") {
  API_URL = "";
} else {
  //API_URL = process.env.VUE_APP_API_URL;
  API_URL = "//" + location.hostname;
}

// request
const request = (defaults = {}) => {
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = API_URL;

  const instance = axios.create({
    // withCredentials: true,
  });

  // request 拦截,设置 header
  instance.interceptors.request.use(
    config => {
      const dealConfig = config;

      // get 请求增加时间戳, 预防数据缓存
      if (dealConfig.method === "get") {
        const timestamp = new Date().getTime();
        const preSymbol = /\?/.test(dealConfig.url) ? "&" : "?";
        dealConfig.url += `${preSymbol}_=${timestamp}`;
      }

      // Do something before request is sent
      dealConfig.headers = {
        "Content-Type": config.contentType || CONTENT__TYPE
      };

      return dealConfig;
    },
    error => {
      // Do something with request error
      const promise = Promise.reject(error);
      return promise;
    }
  );

  // response 拦截,处理返回结果
  instance.interceptors.response.use(
    response => {
      // Do something with response data
      const data = response.data;
      const promise = Promise.resolve(data);
      return promise;
    },
    error => {
      // Do something with response error
      console.log("error", error);
      if (error.response) {
        switch (error.response.status) {
          case 401:
            // 返回 401 清除token信息并跳转到登录页面
            console.log("返回 401 清除token信息并跳转到登录页面");
            Message.error({
              message: "登录过期，请重新登录",
              duration: 1500,
              onClose: () => {
                store.dispatch("logOut").then(() => {
                  router.replace("/login");
                  // 为了重新实例化 vue-router 对象 避免bug
                  location.reload();
                });
              }
            });
            break;
          default:
            break;
        }
      }

      const { status, statusText } = error.response;
      // 返回接口返回的错误信息
      const promise = Promise.reject({ status, statusText });
      return promise;
    }
  );

  return instance(defaults);
};

// http methods
const http = {
  get: (url, options) => {
    const config = Object.assign(
      {},
      {
        url,
        method: "GET"
      },
      options
    );
    return request(config);
  },
  get2: (url, body, options) => {
    const config = Object.assign(
      {},
      {
        url: url + http.toQueryString(body),
        method: "GET"
      },
      options
    );
    return request(config);
  },
  get3: (url, body, options) => {
    if (body) {
      url += http.toQueryString(body);
    }
    const config = Object.assign(
      {},
      {
        url,
        method: "GET",
        responseType: "blob"
      },
      options
    );
    return request(config);
  },
  post: (url, body, options) => {
    const config = Object.assign(
      {},
      {
        url,
        method: "POST",
        data: body
      },
      options
    );
    return request(config);
  },
  post2: (url, body, options) => {
    const config = Object.assign(
      {},
      {
        url: url + http.toQueryString(body),
        method: "POST",
        data: body
      },
      options
    );
    return request(config);
  },
  postForm: (url, body, options) => {
    let form = new FormData();
    for (let key in body) {
      if (body.hasOwnProperty(key)) {
        form.append(key, body[key]);
      }
    }
    const config = Object.assign(
      {},
      {
        url: url,
        method: "POST",
        data: form,
        processData: false,
        contentType: false
      },
      options
    );
    return request(config);
  },
  put: (url, body, options) => {
    const config = Object.assign(
      {},
      {
        url,
        method: "PUT",
        data: body
      },
      options
    );
    return request(config);
  },
  delete: (url, body, options) => {
    const config = Object.assign(
      {},
      {
        url,
        method: "DELETE",
        data: body
      },
      options
    );
    return request(config);
  },
  toQueryString(obj) {
    return obj
      ? "?" +
          Object.keys(obj)
            .sort()
            .map(key => {
              let val = obj[key];
              if (Array.isArray(val)) {
                return val
                  .sort()
                  .map(function(val2) {
                    return key + "=" + val2;
                  })
                  .join("&");
              }
              return key + "=" + val;
            })
            .join("&")
      : "";
  }
};

export default http;
