import axios, { InternalAxiosRequestConfig } from "axios";
import { log } from "console";
import React from "react";
import { Modal, notification } from 'antd'
const serverErrorCode = {
    "20009": "业务异常",
    "10009": "验证异常",
    "30009": "内核异常",
    "40009": "数据查询或者入库异常",
    "50009": "运行中异常",
    "10000009": "未知异常",
}

const axiosInstance = axios.create({
    timeout: 1000,
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    baseURL: "http://120.27.242.75:9201",

});

axiosInstance.interceptors.request.use(
    (config: any) => {  // 入参是 config，不是 request。
        console.log("config", config);

        const currentUserString: string | null = localStorage.getItem('currentUser');
        let url = config.baseURL + config.url as string;
        let token = '';
        if (currentUserString !== null && currentUserString !== undefined) {
            try {
                const currentUser = JSON.parse(currentUserString);
                token = currentUser.token;
            } catch (error) {
                console.log(error);
            }
        }
        if (config.data && config.data.data) {
            Object.keys(config.data.data).forEach(item => {
                if (config.data.data[item] === undefined) {
                    config.data.data[item] = '';
                }
            });
        }
        let requestUrl = '';
        if (localStorage.getItem('url')) {
            // let  i = url.indexOf('-first');
            let str = url.split('/')[1];

            let NewStr = JSON.parse(localStorage.getItem('url') || '');
            // let repx = url.match(/(?<=\/)\D{3,}(?=\-first)/g) as string[];
            if (NewStr.hasOwnProperty(str)) {
                requestUrl = NewStr[str] + url;
            } else {
                requestUrl = process.env.API_URL + url;
            }
        } else {
            requestUrl = process.env.API_URL + url;
        }

        return {
            ...config,
            url: url.indexOf('http') > -1 ? url : requestUrl,
            headers: {
                AuthorizationToken: token,
                url: location.href,
                terminal: 'pc'
            },
        };
    },
    error => Promise.reject(error)
);
// 添加响应拦截器
axiosInstance.interceptors.response.use((response) => {
    const { url } = response.config;
    const data = response.data;
    if (data.status !== 200) {
        let tsx = React.createElement('div', { dangerouslySetInnerHTML: { __html: data.message || "" } });
        if (data.status == 10009) {
            Modal.error({
                title: `校验错误 ${data.status}-${url}`,
                content: tsx, // data.message//,<pre>data.msg || data.message</pre>
                width: '600px',
                className: 'zrModal',
                centered: true,
            });
        } else if (data.status == 1998) {
        } else {
            notification.error({
                message: `${serverErrorCode[data.status + ""] || "请求错误"} ${data.status}-${url}`,
                description: tsx,
            });
        }
    }
    return data;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
});
// InternalAxiosRequestConfig<any>
const request = async (url: string, config: any) => {
    let res = await axiosInstance.request({
        ...config,
        url
    })
    return res



}

export default request