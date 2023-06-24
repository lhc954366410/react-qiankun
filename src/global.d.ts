export interface CurrentUser {
    userId?: number;
    name?: string;
    token?: string;
    companyCode?: string;
    logoPicAddress?: string;
    companyName?: string;
    departmentName?: string;
    postName?: string;
    isAdmin?: number;
    isAutoDepartmentNumber?: number;
    isAutoJobNumber?: number;
    isAutoPostNumber?: number;
    departmentId?: number;
    postId?: number;
    productionCenterName?: string;
    bsLoginUserProductionCenterList?: any[];
    productionCenter?:string;
    loginWhsList?:any[];
    salesCenterList?:{[key:string]:string}
    organizationCodeList?:{[key:string]:string}
    salesCenter?:string;
    organizationCode?:string,
  }