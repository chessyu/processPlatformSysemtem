
import request from '../utils/request'


export const GetSonSysetemList = (params:any) =>
    request({
        url:'/system/main/platform',
        method:'post',
        params
    })

export const GetSysMenuList = (params:any) =>
    request({
        url:'/system/main/platformMenu',
        method:'post',
        params
    });
