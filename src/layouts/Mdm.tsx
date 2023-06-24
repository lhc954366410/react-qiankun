import { CurrentUser } from '@/global';
import request from '@/utils/request';
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styles from './styles.less';
import PageHeader from './PageHeader';
import PageLeftMenu from './PageLeftMenu';
import { ProviderWrapper } from '@/plugin-model/runtime';
import { loadMicroApp } from 'qiankun';
import { log } from 'console';

const Mdm = () => {
    useEffect(() => {
        console.log("mdm微应用");

        const microApp = loadMicroApp({
            name: 'mdm', // app name registered
            entry: '//localhost:81/mdm/',
            container: '#mdm-container',
        });
        return () => {
            microApp.unmount();

        }
    }, [])

    return (
        <>
            <Outlet />
            <div id="mdm-container"></div>

        </>
    )

}
export default Mdm;