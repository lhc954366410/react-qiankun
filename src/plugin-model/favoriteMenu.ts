import { addMenuCollectApi, getSelfMenuApi } from "@/services/menu";
import { useEffect, useState } from "react";

export default () => {
    const [selfMenu, setselfMenu] = useState<any[]>([])
    const [loading, setloading] = useState(false);
    // useEffect(() => {
    //     getSelfMenu()
    // }, [])
    const setSelfMenu = async (data =selfMenu ) => {
        setloading(true)

        let addRes = await addMenuCollectApi({
            data
        })
        if (!addRes || addRes.status != 200) {
            setloading(false)
            return
        }
        getSelfMenu()

        // dispatch({
        //   type: 'global/addSelfMenu',
        //   payload: {
        //     data,
        //   },
        // });
    };


    let getSelfMenu = async () => {
        let menuRes = await getSelfMenuApi();
        if (menuRes.status == 200) {
            setselfMenu(menuRes.data)
            setloading(false)

        } else {
            setloading(false)
        }

    }
    return {
        loading,
        selfMenu,
        getSelfMenu,
        setSelfMenu,
    }

};