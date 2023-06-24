import React, { useEffect } from 'react';
import styles from './styles.less';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
interface IProps {
  children?: React.ReactNode;
  routes?: any[];
  loading?: boolean;
  title?: string;
  pageCode?: string;
}

const PageContent: React.FC<IProps> = ({
  children,
  routes = [],
  loading = false,
  title = '',
  pageCode,
}) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
    let pathname = window.location.pathname;
    if (pathname.indexOf("/update/") > -1) {
      pathname = pathname.substring(0, pathname.indexOf("/update/")) + "/add"
    }
    window.pageCode = pathname;//表格读取这个
  }, []);
  return (
    <>
      <div className={styles.pageBody}>
        <div>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/">首页</Link>
            </Breadcrumb.Item>
            {routes.map((item: any) => (
              <Breadcrumb.Item key={item.breadcrumbName}>
                {item.path ? (
                  <Link to={item.path}>{item.breadcrumbName}</Link>
                ) : (
                  item.breadcrumbName
                )}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
          {children}
        </div>
      </div>
    </>
  );
};

export default PageContent;

