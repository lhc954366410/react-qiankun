import { createRoot } from 'react-dom/client'
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { registerMicroApps, start } from 'qiankun';
import zhCN from 'antd/locale/zh_CN';
import { ConfigProvider } from 'antd'

import App from './App'
import './App.less'

const root = document.querySelector('#root-master')
registerMicroApps([
  {
    name: 'bms', // app name registered
    entry: '//localhost:81/bms/',
    container: '#bms-container',
    activeRule: '/bms/',
  },
  // {
  //   name: 'mdm', // app name registered
  //   entry: '//localhost:81/mdm/',
  //   container: '#mdm-container',
  //   activeRule: '/mdm/',
  // },
  {
    name: 'wms', // app name registered
    entry: '//localhost:81/wms/',
    container: '#wms-container',
    activeRule: '/wms/',
  },
  // {
  //   name: 'ppi', // app name registered
  //   entry: '//localhost:81/ppi/',
  //   container: '#ppi-container',
  //   activeRule: '/ppi/',
  // },
]);


if (root) {
  createRoot(root).render(
    // <StrictMode>
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>

        <App />
      </BrowserRouter>
    </ConfigProvider>
    // </StrictMode>
  )
}

start({
  prefetch: false,
  excludeAssetFilter: assetUrl => { // 指定部分特殊的动态加载的微应用资源（css/js) 不被 qiankun 劫持处理
    // 自定义白名单链接
    const whiteList = [
      'http://localhost:8000/CLodopfuncs.js?priority=0',
      'http://localhost:18000/CLodopfuncs.js?priority=0']
    /**
     * 白名单协议：子应用下如需要放行动态加载的css/js资源，可以在链接上带上参数 _custom-exclude_=MAIN
     */
    const whiteWords = ['_custom-exclude_=MAIN'] // 白名单关键词：协议制定 _custom-exclude_=MAIN。
    if (whiteList.includes(assetUrl)) {
      return true
    }
    return whiteWords.some(w => {
      return assetUrl.includes(w)
    })
  },
});
