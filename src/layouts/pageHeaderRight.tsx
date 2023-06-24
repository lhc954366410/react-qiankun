import React, { Suspense, lazy } from 'react';
import styles from './styles.less';
import { Dropdown, Menu, Popover } from 'antd';
import { CurrentUser } from '@/global';
import useCurrentUser from '@/hook/useCurrentUser';
import Warehouse from './Warehouse';
import { changeProCentrerApi } from '@/services/global';
import GoToFanRuan from './GoToFanRuan';
// import AuthorizationLoginOther from './AuthorizationLoginOther';
// import AuthorizationLoginOther from './AuthorizationLoginOther';
// import GoToFanRuan from './GoToFanRuan';
const AuthorizationLoginOther = lazy(() => import(/** AuthorizationLoginOther*/ `./AuthorizationLoginOther`))


const PageHeaderRight: React.FC = () => {
  // console.log("这是PageHeaderRight组件-------");
  const dispatch = () => { }
  const currentUser = useCurrentUser()
  const logout = () => {
    localStorage.clear();
    if (process.env.NODE_ENV == "development") {
      window.location.href = '/login';
    } else {
      window.location.href = '/user/login';

    }
  };
  const productionCenterList = () => {
    return currentUser?.bsLoginUserProductionCenterList?.map(item => {
      return (
        <Menu.Item
          key={item.productionCenter}
          onClick={() => productionCenterClick(item.productionCenter)}
        >
          {item.productionCenterName}
        </Menu.Item>
      );
    });
  };
  const salesCenterList = () => {
    return Object.keys(currentUser?.salesCenterList || {}).map(item => {
      return (
        <Menu.Item
          key={item}
          onClick={() => salesCenterClick(item)}
        >
          {currentUser?.salesCenterList![item]}
        </Menu.Item>
      );
    });
  };
  const productionCenterClick = (productionCenter: string) => {
    changeProCentrerApi({
      productionCenter,
      organizationCode: currentUser?.organizationCode,
      salesCenter: currentUser?.salesCenter,
      id: currentUser?.userId,
      companyCode: currentUser?.companyCode,
      loginWhsList: currentUser?.loginWhsList || [],

    })

  };
  const salesCenterClick = (salesCenter: string) => {
    changeProCentrerApi({
      salesCenter,
      organizationCode: currentUser?.organizationCode,
      productionCenter: currentUser?.productionCenter,
      id: currentUser?.userId,
      companyCode: currentUser?.companyCode,
      loginWhsList: currentUser?.loginWhsList || [],

    })
  };


  return (
    <div className={styles.right}>
      <Popover
        content={
          <div className={styles.logout} onClick={logout}>
            退出登录
          </div>
        }
      >
        <span>{currentUser?.name || '无用户'}</span>
      </Popover>
      <Dropdown
        overlay={<Menu>
          {productionCenterList()}
          <Menu.Item key="set" onClick={() => window.open("/productionCenter/edit/" + currentUser?.productionCenter)}>
            生产中心设置
          </Menu.Item>
        </Menu>}
        placement="bottomLeft"
      >
        <span style={{ cursor: 'pointer' }}>
          {currentUser?.productionCenterName}
        </span>
      </Dropdown>
      <Dropdown
        overlay={<Menu>
          {salesCenterList()}

        </Menu>}
        placement="bottomLeft"
      >
        <span style={{ cursor: 'pointer' }}>
          {currentUser?.salesCenter && currentUser?.salesCenterList![currentUser?.salesCenter]}
        </span>
      </Dropdown>
      <Warehouse />
      <Suspense fallback={null}>
        {currentUser?.isAdmin == 1 && <AuthorizationLoginOther />}

      </Suspense>

      <GoToFanRuan />
    </div>
  );
};

export default PageHeaderRight 
