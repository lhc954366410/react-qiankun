import { CurrentUser } from '@/global';
import request from '@/utils/request';
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styles from './styles.less';
import PageHeader from './PageHeader';
import PageLeftMenu from './PageLeftMenu';
import { ProviderWrapper } from '@/plugin-model/runtime';

interface userContextProps {
    currentUser: CurrentUser;
    [key: string]: any;
}
const initialState = { currentUser: {} };
export const userContext = React.createContext<userContextProps>(initialState);

const SecurityLayout = () => {
    console.log("SecurityLayout----------",)
    const navigate = useNavigate();
    const [currentUser, setcurrentUser] = useState<CurrentUser>({})
    const [isReady, setisReady] = useState(false);
    useEffect(() => {
        fetchCurrent()
    }, [])

    const fetchCurrent = async () => {
        const currentUserString: string | null = localStorage.getItem('currentUser');
        if (currentUserString !== null && currentUserString !== undefined) {
            try {
                const currentUser = JSON.parse(currentUserString);
                let pathname = window.location.pathname;
                if (pathname.indexOf("/update/") > -1) {
                    pathname = pathname.substring(0, pathname.indexOf("/update/")) + "/add"
                }
                window.pageCode = pathname;//表格读取这个
                const response = await request(`/jms-first/BsLogin/loginCheck?AuthorizationToken=${currentUser.token}&pageId=${pathname}`, {});
                if (response && response.status === 405) {
                    // token过期
                    localStorage.clear();
                    navigate("/login")
                } else {
                    document.head.querySelectorAll("link").forEach(item => {
                        if (item.rel == "icon") {
                            item.href = currentUser.logoPicAddress
                        }
                    })
                    // 获取表格列设置
                    if (response?.data?.versionNumber) {
                        let localVersion = localStorage.getItem(pathname + "Version")
                        if (response?.data?.versionNumber != localVersion) {

                        }
                    }
                    setisReady(true)
                    setcurrentUser(currentUser)

                }
            } catch (error) {
                console.log(error);
            }
        } else {
            navigate("/login")
        }
    }

    if (!isReady) {
        return <>正在检测登录</>
    }
    return (
        <userContext.Provider value={{ currentUser: currentUser! }}>
            <ProviderWrapper>
                <>
                    <PageHeader />
                    <div className={styles.pageContent}>
                        <div className={styles.box}>
                            <PageLeftMenu />
                            <div className={styles.pageRight}>
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </>
            </ProviderWrapper>
        </userContext.Provider>
    )

}
export default SecurityLayout;