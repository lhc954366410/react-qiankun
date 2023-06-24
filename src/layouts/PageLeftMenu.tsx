import React, { useEffect, useState } from 'react';
import styles from './styles.less';
import {
  BarChartOutlined,
  CloseOutlined,
  DragOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Spin, Tooltip } from 'antd';
import { SortTable, DragProps } from '@/components/Sort';
import { arrayMoveImmutable } from 'array-move';
import { useModel } from '@/plugin-model';
import { Link } from 'react-router-dom';
const PageLeftMenu: React.FC = () => {
  console.log("这是PageLeftMenu组件---")
  const [show, setshow] = useState(false);
  const [reportMenuShow, setReportMenuShow] = useState(false);
  const { loading, selfMenu, setSelfMenu, getSelfMenu } = useModel('favoriteMenu');
  useEffect(() => {
    getSelfMenu()
  }, [])


  const onClick = () => {

    setshow(!show);
    if (show) {
      setReportMenuShow(false)
    }
  };

  const removeMenu = async (removeMenu: string) => {
    const data = selfMenu.filter((obj: any) => obj.menuCode !== removeMenu);
    setSelfMenu(data)
  };
  const dragProps: DragProps = {
    onDragEnd: async (fromIndex: number, toIndex: number) => {
      const newData = arrayMoveImmutable(selfMenu, fromIndex, toIndex);
      let data = newData.map((item: any, index: number) => {
        item.orderId = index;
        return item;
      })
      setSelfMenu(data)
    },
    handleSelector: '.drag',
    nodeSelector: 'li',
  };

  return (
    <>
      {/* <ReportMenu show={reportMenuShow}/> */}
      <div className={styles.pageLesf + ' ' + (show ? styles.w200 : '')}>
        <div className={styles.pageLeftBar}>
          {loading && (
            <div className={styles.loading}>
              <Spin></Spin>
            </div>
          )}
          <SortTable dragProps={dragProps}>
            <ul className={styles.collectMenu}>
              {selfMenu.map((item: any) => {
                if (show) {
                  return (
                    <li className={styles.item} key={item.lineId}>
                      {/* <CloseOutlined className={styles.itmeIcon} /> */}
                      <UnorderedListOutlined />
                      <Link to={"/" + item.project + item.url || '/'}>{item.name}</Link>
                      <CloseOutlined
                        className={styles.deleteIcon}
                        onClick={() => removeMenu(item.menuCode)}
                      />
                      <DragOutlined className={styles.moveIcon + ' drag'} />
                    </li>
                  );
                } else {
                  return (
                    <Tooltip
                      placement="right"
                      title={item.name}
                      key={item.lineId}
                    >
                      <Link to={"/" + item.project + item.url || '/'} className={styles.text + ' ' + styles.item}>

                        <UnorderedListOutlined />

                      </Link>
                    </Tooltip>
                  );
                }
              })}
            </ul>
          </SortTable>
        </div>
        <div className={styles.opMenu} style={{ bottom: "43px", color: "#1890ff" }} onClick={() => setReportMenuShow(!reportMenuShow)}>
          <BarChartOutlined />{show && <span style={{ fontSize: "14px" }}>报表菜单</span>}
        </div>
        <div onClick={onClick} className={styles.opMenu}>
          {show ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        </div>
      </div>
    </>
  );
};
export default PageLeftMenu
