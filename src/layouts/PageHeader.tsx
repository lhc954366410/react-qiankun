import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import styles from './styles.less';
// import PageHeaderRight from './pageHeaderRight';
// import HeaderMenu from './HeaderMenu';
import useCurrentUser from '@/hook/useCurrentUser';
// import HeaderMenu from './HeaderMenu';
import PageHeaderRight from './pageHeaderRight';
const HeaderMenu = lazy(() => import(/** HeaderMenu*/ `./HeaderMenu`))

const PageHeader: React.FC<any> = () => {
  // console.log("这是PageHeader组件-------");
  const timer = useRef<any>(null);
  const currentUser = useCurrentUser();

  const [show, setshow] = useState(false);
  useEffect(() => {
    const fn = (e: any) => {
      if (e.ctrlKey && e.keyCode == 71) {
        e.preventDefault()
        setshow(true)
      }

    }
    document.addEventListener("keydown", fn, false)
    return () => {
      document.removeEventListener("keydown", fn, false)
    }
  }, [])
  const onMouseLeave = () => {
    clearTimeout(timer.current);
  };
  const onMouseEnter = () => {
    timer.current = setTimeout(() => {
      setshow(true);
    }, 500);
  };
  const iconClick = () => {
    clearTimeout(timer.current);
    setshow(!show);

  }
  return (
    <div>
      {/* 头部 */}
      <div className={styles.headContent}>
        <div className={styles.headContentLeft}>
          <span
            className={styles.leftIcon}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={iconClick}
          // onMouseEnter={() => setshow(true)}
          >
            <span className={styles.xian} style={{ transform: show ? "rotate(45deg)" : "rotate(0deg)" }}></span>
            <span className={styles.xian} style={{ opacity: show ? "0" : "1" }}></span>
            <span className={styles.xian} style={{ transform: show ? "rotate(-45deg)" : "rotate(0deg)" }}></span>
            {/* <PicRightOutlined /> */}
          </span>
          <span className={styles.title}>{currentUser?.companyName || ''}</span>
          {/* <span >(有问题请联系信息部陈明洁，电话：13939092023)</span> */}
        </div>
        <PageHeaderRight />
      </div>
      {/* 全部 菜单 */}

      <Suspense fallback={null}>
        <HeaderMenu setshow={setshow} show={show} />

      </Suspense>
    </div>
  );
};

export default PageHeader