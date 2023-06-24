import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.less';
import { Popover, Spin } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import useCurrentUser from '@/hook/useCurrentUser';
import { changeProCentrerApi, getWarehouse } from '@/services/global';
interface whsMenuListProps {
  code: string;
  name: string;
  loggingStatus?: number;
  whsMenuList: whsMenuListProps[],
}


const Warehouse: React.FC = () => {
  const reqCount = useRef(0)
  const currentUser = useCurrentUser();
  const [whsMenuList, setwhsMenuList] = useState<whsMenuListProps[]>([])
  const [loading, setloading] = useState(false)
  const whsMenuClick = (item: whsMenuListProps) => {
    if (item.loggingStatus == 1) {
      return
    }
    changeProCentrerApi({
      whsCode: item.code,
      id: currentUser?.userId,
      companyCode: currentUser?.companyCode,
      productionCenter: currentUser?.productionCenter,
    })



  }
  const onMouseLeave = async () => {
    if (reqCount.current == 0) {
      ++reqCount.current
      let res = await getWarehouse({})
      if (res?.status == 200) {
        setwhsMenuList(res.data)

      }


    }
  }
  const warehouseTSX = () => {
    if (loading) {
      return <Spin />
    }
    return whsMenuList.map(item => {
      return <div className={styles.list} key={item.code}>
        <h6 className={styles.name}>{item.name}</h6>
        {item.whsMenuList.map(item2 =>
          <div key={item2.code}>
            <p className={styles.name2}>{item2.name}</p>
            <div>
              {
                item2.whsMenuList.map(item3 => <p key={item3.code} className={styles.name3} onClick={() => whsMenuClick(item3)}>{item3.name}{item3.loggingStatus == 1 && <CheckOutlined style={{ color: "green" }} />}</p>)
              }
            </div>
          </div>
        )}

      </div>
    })
  }
  return (
    <>
      <Popover
        // trigger="click"

        placement="bottomRight"
        content={<div className={styles.warehouseBox}>{warehouseTSX()}</div>}
      >
        <span onMouseEnter={onMouseLeave}>仓库管理</span>
      </Popover>
    </>
  );
};

export default Warehouse
