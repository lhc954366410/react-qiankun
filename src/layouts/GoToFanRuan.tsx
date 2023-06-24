import useCurrentUser from '@/hook/useCurrentUser';
import request from '@/utils/request';
import { message } from 'antd';
import React ,{FC, useRef} from 'react';

const GoToFanRuan :FC = ()=>{
    const currentUser = useCurrentUser();
    const isRequest =  useRef(false)
    const goto= async ()=>{
        if(isRequest.current)return;
        isRequest.current = true
        let userId = currentUser.userId;
        let res = await request('/mdm-first/Mdm0013/getFanRuanURL', {
            method: 'POST',
            data: {
              data:{
                menuCode: "",
                userId,
                prefix:"E"
              }
            }
        }) 
        if(res?.status==200){
            open(res.data.url,'_blank' ,'noreferrer')
        }else{
            message.error("跳转失败")

        }   
        setTimeout(()=>{
            isRequest.current = false
        },1000)

    }
    return<>
        <span onClick={goto}>报表系统</span>
    </>

}
export default GoToFanRuan