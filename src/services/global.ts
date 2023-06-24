import request from "@/utils/request";

//获取仓库
export async function getWarehouse(params: any) {
    return request('/jms-first/MenuCollect/mdm001312Menu', {
        method: 'POST',
        data: params,
    });
}
//该表生产中心
export async function changeProCentrerApi(params: any) {
    let response = await request('/jms-first/BsLogin/changeProCentrer', {
        method: 'POST',
        data: {
            data: params
        },
    });
    if (response && response.status === 200) {
        let currentUser = JSON.parse(localStorage.getItem('currentUser') || "{}")
        localStorage.setItem('currentUser', JSON.stringify({
            ...response.data,
            companyName: currentUser.companyName,
            logoPicAddress: currentUser.logoPicAddress,
        }));
        location.reload();
    }
    return response

}