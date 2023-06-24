import { CurrentUser } from '@/global';
import request from '@/utils/request';
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styles from './styles.less';
import PageHeader from './PageHeader';
import PageLeftMenu from './PageLeftMenu';
import { ProviderWrapper } from '@/plugin-model/runtime';
import { loadMicroApp } from 'qiankun';

const Mdm = () => {
    useEffect(() => {
        const microApp = loadMicroApp({
            name: 'ppi', // app name registered
            entry: '//localhost:81/ppi/',
            container: '#ppi-container',
        });
        return () => {
            microApp.unmount();

        }
    }, [])

    return (
        <>
            <Outlet />
            <div id="ppi-container"></div>

        </>
    )

}
export default Mdm;