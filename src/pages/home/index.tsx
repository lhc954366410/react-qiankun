import React from 'react';
import { Card, Row, Col } from 'antd';
import PageContent from '@/layouts/PageContent';
import { useModel } from '@/plugin-model';
import { Link } from 'react-router-dom';

interface linkItem {
    project: string;
    url: string;
    name: string;
}


const linkStyle = {
    marginBottom: 15,
};

const Page: React.FC<any> = () => {
    const { selfMenu } = useModel('favoriteMenu');

    const renderQuickLink = (list: linkItem[]) => {
        return list.map(item => {
            return <Col key={item.url} style={linkStyle} offset={1} span={7}>
                {item.project == 'ppi' ? (
                    <Link to={item.url || '/'}>{item.name}</Link>
                ) : (
                    <a href={(item.project == 'root' ? "" : "/" + item.project) + item.url || '/'}>{item.name}</a>
                )}

            </Col>
        })
    }

    return (
        <PageContent title='首页'>
            <Row gutter={32}>
                <Col span={12}>
                    <Card title="快速入口">
                        <Row align="middle" gutter={32}>
                            {renderQuickLink(selfMenu)}
                        </Row>
                    </Card>
                </Col>
            </Row>
        </PageContent>
    );
};

export default Page;
