import useTableRequest from '@/hook/useTableRequest';
import { Button, Input, message, Row, Col, Form, Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import request from '@/utils/request';
import useCurrentUser from '@/hook/useCurrentUser';
interface AuthorizationLoginOtherProps {
}
const T = ({ setflag }: any) => {
    const [state, setstate] = useState(120);

    useEffect(() => {
        let timer = setInterval(() => {
            setstate(c => {
                if (c == 1) {
                    clearInterval(timer);
                    setflag(false);
                    return 120;
                }
                return c - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    return <span>{state}(秒)</span>;
};

const AuthorizationLoginOther: React.FC<AuthorizationLoginOtherProps> = ({ }) => {
    const currentUser = useCurrentUser()
    const [visible, setvisible] = useState(false);
    const [visibleCode, setvisibleCode] = useState(false);
    const [flag, setflag] = useState(false);
    const [form] = Form.useForm();
    const [searchParams, setsearchParams] = useState({
        orderBy: 'id desc',
        searchText: '',
        status: ['1', '3', '4'],
        isEnabledBs: 1,
    })
    const { tableProps } = useTableRequest({
        url: '/mdm-first/Mdm0013/select',
        params: searchParams,
        autoLoad: false,
    });
    const loginVCodeSend = (params: any) =>
        request('/jms-first/CsLogin/loginVCodeSend', {
            method: 'POST',
            data: {
                data: params,
            },
        });
    const adminLogin = (params: any) =>
        request('/jms-first/BsLogin/adminLogin', {
            method: 'POST',
            data: {
                data: params,
            },
        });
    const selectoneMdm0013 = (params: any) =>
        request('/mdm-first/Mdm0013/selectone', {
            method: 'POST',
            data: {
                data: params,
            },
        });

    const columns = [
        {
            title: '员工id',
            dataIndex: 'id',
            width: 100,
        },
        {
            title: '姓名',
            dataIndex: 'name',
            width: 100,
        },
        {
            title: '部门',
            dataIndex: 'departmentName',
            width: 100,
        },
    ]

    const [saveInfo, setSaveInfo] = useState<any>({});

    const onRow = (row: any) => {
        return {
            onClick: () => {
                setSaveInfo(row);
            }
        }
    }

    const _onOk = () => {
        if (!saveInfo.phone) {
            message.info('请点击选中一个员工！');
            return
        }
        setvisibleCode(true);
    }

    const getCode = () => {
        //@ts-ignore
        let phone = document.getElementById('currentPhone').value;
        // console.log('phone', document.getElementById('currentPhone'));
        // return

        if (!phone) {
            message.info('请输入手机号码');
            return;
        }

        loginVCodeSend({
            phone,
            type: 2,
        }).then(res => {
            if (res.status == 200) {
                setflag(true);
                message.info('请注意查收验证码');
            } else {
                setflag(false);
            }
        });
    };

    const [loginLoading, setloginLoading] = useState(false);
    const onFinish = async (values: any) => {
        setloginLoading(true);
        let res = await adminLogin({
            companyCode: saveInfo.companyCode,
            phone: saveInfo.phone,
            vcode: values.vcode,
        });
        if (res.status == 200) {
            message.success('登录成功！');
            setvisibleCode(false);
            localStorage.setItem('currentUser', JSON.stringify(res.data));
            window.location.reload();
        }

        setloginLoading(false);
    }

    const getMdm0013SelectOne = async () => {
        let res = await selectoneMdm0013({ id: currentUser.userId });
        if (res.status == 200) {
            form.setFieldsValue({ currentPhone: res.data.phone });
        }
    }

    useEffect(() => {
        visibleCode && getMdm0013SelectOne()
        return () => {
        }
    }, [visibleCode])

    return (
        <>
            <span style={{ cursor: 'pointer' }} onClick={() => setvisible(true)}>授权登录</span>
            <Modal
                title='选择员工'
                onOk={_onOk}
                okText='确定'
                open={visible}
                onCancel={() => setvisible(false)}>
                <Input.Search onSearch={(val) => setsearchParams({ ...searchParams, searchText: val })} placeholder='请输入员工' />
                <Table {...tableProps} columns={columns} rowKey='id' scroll={{ y: 500 }} onRow={onRow} />
            </Modal>
            <Modal
                confirmLoading={loginLoading}
                onOk={form.submit}
                okText='确定登录'
                open={visibleCode}
                onCancel={() => setvisibleCode(false)}
                title='获取验证码'>
                <Form size='middle' form={form} onFinish={onFinish}>
                    <Row>
                        <Col span={23}>
                            <Form.Item label='电话号码'>
                                <Form.Item name='currentPhone' className="inlineBlock w60_1" rules={[{ required: true, message: '请输入电话号码' }]}>
                                    <Input disabled placeholder='请输入登录人电话号码' />
                                </Form.Item>
                                <span className="w2px"></span>
                                <span className="inlineBlock w40_1">
                                    <Button style={{ width: '100%' }} disabled={flag} onClick={getCode} >
                                        {flag ? <T setflag={setflag}></T> : '获取验证码'}
                                    </Button>
                                </span>
                            </Form.Item>
                        </Col>
                        <Col span={23}>
                            <Form.Item label='验证码' name='vcode' rules={[{ required: true, message: '请输入验证码' }]}>
                                <Input placeholder='请输入验证码' onPressEnter={form.submit} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    )
}

export default AuthorizationLoginOther;