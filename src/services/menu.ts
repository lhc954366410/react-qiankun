import request from "@/utils/request";
//收藏菜单
export async function addMenuCollectApi(params: any) {
    return request('/mdm-first/Mdm0013/addMenuCollect', {
        method: 'POST',
        data: params,
    });
}

//获取收藏菜单
export async function getSelfMenuApi() {
    return request('/jms-first/MenuCollect/mdm001307CollectMenu', {
        method: 'POST',
        data: {
            data: {
                platform: 'PC',
            },
        },
    });
}
//获取所有菜单
export async function getAllMenuApi(params: any) {
    return request('/jms-first/Smp0025/selectJson', {
        method: 'POST',
        data: {
            ...params,
        },
    });
}