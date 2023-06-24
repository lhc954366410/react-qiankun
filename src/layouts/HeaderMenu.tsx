import React, { useState, useEffect, useMemo, useRef } from 'react';
import styles from './styles.less';
import {
  AppstoreOutlined,
  RightOutlined,
  CloseOutlined,
  DragOutlined,
  StarOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Spin, Input, Collapse, Tag } from 'antd';
import { SortTable, DragProps } from '@/components/Sort';
import { arrayMoveImmutable } from 'array-move';
import { getAllMenuApi } from '@/services/menu';
import { useModel } from '@/plugin-model';
import { Link } from 'react-router-dom';

const { Search } = Input;
const { Panel } = Collapse;

interface IProps {
  show: boolean;
  setshow: (show: boolean) => void;
}
const HeaderAllMenu: React.FC<IProps> = ({
  show,
  setshow,
}) => {
  // console.log("这是HeaderAllMenu组件-------");
  const [showAll, setshowAll] = useState(false);
  const timer = useRef<any>(null);
  const { loading, selfMenu, setSelfMenu } = useModel('favoriteMenu');

  const hideMenu = () => {
    setshow(false);
    setshowAll(false);
  };
  const removeMenu = (removeMenu: string) => {
    const data = selfMenu.filter(obj => obj.menuCode !== removeMenu);
    setSelfMenu(data)
  };
  const dragProps: DragProps = {
    onDragEnd: (fromIndex: number, toIndex: number) => {
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
  const onMouseLeave = () => {
    clearTimeout(timer.current);
  };
  const onMouseEnter = () => {
    timer.current = setTimeout(() => {
      setshowAll(true);
    }, 300);
  };
  return (
    <div className={styles.allMenuBox + ' ' + (show ? styles.show : '')}>
      <aside className={show ? styles.asideShow : styles.asideHide}>
        <div className={styles.menuBox}>
          <div
            className={styles.allMenuBtn}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <AppstoreOutlined />
            <span className={styles.text}>所有菜单</span>
            <span className={styles.RightOutlined}>
              <RightOutlined />
            </span>
          </div>
          {loading && (
            <div className={styles.loading}>
              <Spin></Spin>
            </div>
          )}
          <SortTable dragProps={dragProps}>
            <ul className={styles.collectMenu}>
              {selfMenu.map(item => (
                <li className={styles.item} key={item.lineId}>
                  <UnorderedListOutlined />

                  <a
                    href={
                      item.project == 'root' ? item.url : '/' + item.project + item.url
                    }
                    target="_blank"
                    rel="noopener"
                    className={styles.text}
                  >
                    {item.name}
                  </a>
                  <CloseOutlined
                    className={styles.deleteIcon}
                    onClick={() => removeMenu(item.menuCode)}
                  />
                  <DragOutlined className={styles.moveIcon + ' drag'} />
                </li>
              ))}
            </ul>
          </SortTable>
        </div>
      </aside>
      <AllMenuBox hideMenu={hideMenu} showAll={show} />
      <div className={styles.mask} onClick={hideMenu}></div>
    </div>
  );
};
export default HeaderAllMenu
// export default HeaderAllMenu;

interface AllMenuProps {
  selfMenu: any[];
  showAll: boolean;
  hideMenu: () => void;
}
const AllMenu: React.FC<AllMenuProps> = ({
  showAll,
  hideMenu,
}) => {
  // console.log("这是AllMenu组件------")
  const [searchText, setsearchText] = useState<string>('');
  const [selectCode, setselectCode] = useState('');
  const [menuAll, setmenuAll] = useState<any[]>([])
  const { selfMenu, setSelfMenu } = useModel('favoriteMenu');

  const inCount = useRef(0)
  let timer = React.useRef<any>(null);
  useEffect(() => {
    if (inCount.current) {
      getAllMenu()
    }

  }, [searchText]);
  useEffect(() => {
    if (showAll) {
      let el = document?.querySelector('#menuSearch') as HTMLInputElement;
      el.focus();
      if (inCount.current == 0) {
        ++inCount.current
        getAllMenu()
      }


    }
  }, [showAll]);

  const getAllMenu = async () => {
    let res = await getAllMenuApi({
      data: {
        platform: 'PC',
        searchText,
      },
    })
    if (res.status == 200) {
      setmenuAll(res.data)
    }
  }


  const close = () => {
    hideMenu();
  };
  const findMenu = (menuCode: string) => {
    const index = selfMenu.findIndex(item => item.menuCode === menuCode);
    if (index === -1) {
      return false;
    }
    return true;
  };
  const menuListTSX = useMemo(
    () =>
      menuAll?.map(item => {
        return item?.children?.map((item1: any) => (
          <div className={`${styles.item} ${selectCode == item1.code ? styles.selectItme : ""}`} key={item1.code}>
            <h6 id={item1.code} style={{ paddingTop: "5px" }} > <Tag color="#f50">{item1.name}</Tag> </h6>
            {item1?.children?.map((item2: any) => (
              <div className={styles.content} key={item2.code}>
                {/* <Link to={item2.url || '/'}>{item2.name}</Link> */}
                <Link to={"/" + item2.project + item2.url || '/'}>{item2.name}</Link>

                {findMenu(item2.code) ? (
                  <span
                    onClick={() => removeCollect(item2)}
                    className={styles.collect}
                  >
                    <StarOutlined />
                  </span>
                ) : (
                  <span
                    onClick={() => addCollect(item2)}
                    className={styles.icon}
                  >
                    <StarOutlined />
                  </span>
                )}
              </div>
            ))}
          </div>
        ));
      }),
    [menuAll, selectCode, selfMenu],
  );
  //菜单的取消和收藏点击事件
  const removeCollect = (item: any) => {
    const data = selfMenu.filter(obj => obj.menuCode !== item.code);
    setSelfMenu(data)
  };
  const addCollect = (item: any) => {
    let list = [...selfMenu];
    list.push({
      menuCode: item.code,
      orderId: selfMenu.length,
      platform: 'PC',
    });
    console.log("list", list)
    setSelfMenu(list)
  };
  const rightMenuTSX = useMemo(
    () =>
      menuAll.map((item: any, i) => (
        <Panel header={item.name} key={item.code}>
          <ul className={styles.ul}>
            {item?.children?.map((item2: any) => (
              <li
                key={item2.code}
                onClick={() => liOnclick(item2.code)}
                className={item2.code == selectCode ? styles.check : ''}
              >
                <span className={styles.span}>{item2.name}</span>
              </li>
            ))}
          </ul>
        </Panel>
      )),
    [menuAll, selectCode],
  );
  const liOnclick = (code: string) => {
    setselectCode(code);
    timer.current = null;
    const el = document.querySelector('#' + code) as HTMLDivElement;
    const menuListBox = document.querySelector(
      '#menuListBox',
    ) as HTMLDivElement;
    const currentY = menuListBox.scrollTop;
    const targetY = el.offsetTop;
    scrollAnimation(menuListBox, currentY, targetY);
    //  el?.scrollIntoView()

    // menuListBox.scrollTop = el.offsetTop;
  };
  const scrollAnimation = (el: any, currentY: number, targetY: number) => {
    // 获取当前位置方法
    // const currentY = document.documentElement.scrollTop || document.body.scrollTop

    // 计算需要移动的距离
    let needScrollTop = targetY - currentY;
    let _currentY = currentY;
    let speed = 3;
    setTimeout(() => {
      // 一次调用滑动帧数，每次调用会不一样
      const dist = Math.ceil(needScrollTop / speed);
      _currentY += dist;
      el.scrollTo(_currentY, currentY);
      // 如果移动幅度小于十个像素，直接移动，否则递归调用，实现动画效果
      if (needScrollTop > speed || needScrollTop < -speed) {
        scrollAnimation(el, _currentY, targetY);
      } else {
        el.scrollTo(_currentY, targetY);
      }
    }, 16.7);
  };

  return (
    <div className={showAll ? styles.showAllMenu : styles.hideAllMenu}>
      <div className={styles.box}>
        <div className={styles.left}>
          {/* 放搜索 */}
          <div className={styles.search}>
            <Search
              placeholder="菜单搜索"
              onSearch={(value: any) => setsearchText(value)}
              id="menuSearch"
            />
          </div>
          {/* 菜单列表 */}
          <div className={styles.menuListBox} id="menuListBox">
            <div className={styles.menuList}>
              {/* 分类 */}
              {menuListTSX}
            </div>
          </div>
        </div>
        <div className={styles.right}>
          {' '}
          <Collapse bordered={false}>{rightMenuTSX}</Collapse>
        </div>
      </div>
      <div className={styles.close} onClick={close}>
        <CloseOutlined />
      </div>
    </div>
  );
};
const AllMenuBox = AllMenu
