import { useEffect, useState } from 'react';
import { Spin, Card, Typography, Tag } from 'antd';
import { MessageOutlined, GlobalOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const pages = [
    {
        name: 'Home',
        tag: 'Overview',
        description: 'Displays an overview of all pages and their functionalities in this mini project.',
        icon: <GlobalOutlined style={{ color: '#1890ff' }} />,
    },
    {
        name: 'Posts',
        tag: 'Fetch',
        description: 'Shows a paginated list of posts fetched from an API. You can browse and select posts to view more details.',
        icon: <MessageOutlined style={{ color: '#52c41a' }} />,
    },
    {
        name: 'Translate',
        tag: 'Translate',
        description: 'Allows you to translate English text to Indonesian using the free Google Translate API.',
        icon: <GlobalOutlined style={{ color: '#faad14' }} />,
    },
    {
        name: 'VirusTotal Scanner',
        tag: 'Security',
        description: 'Lets you scan a URL for malware and threats using the VirusTotal API, and view a summary of the analysis.',
        icon: <SafetyCertificateOutlined style={{ color: '#eb2f96' }} />,
    },
];

const Home = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 300);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <Spin
                size="large"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh"
                }}
            />
        );
    }

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
            <Card
                style={{
                    background: '#f5f7fa',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px #f0f1f2',
                    marginBottom: 24
                }}
                bodyStyle={{ padding: 32 }}
            >
                <Title level={2} style={{ textAlign: 'center', marginBottom: 8, letterSpacing: 1 }}>
                    Forum Overview
                </Title>
                <Paragraph style={{ textAlign: 'center', marginBottom: 32, color: '#888' }}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis repellat deleniti aliquam sit animi cum veritatis sequi illum laborum cumque!
                </Paragraph>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0,
                        background: '#fff',
                        borderRadius: 8,
                        overflow: 'hidden',
                        boxShadow: '0 1px 4px #e6e6e6'
                    }}
                >
                    {pages.map((page, idx) => (
                        <Card
                            key={page.name}
                            hoverable
                            bordered={false}
                            style={{
                                borderBottom: idx !== pages.length - 1 ? '1px solid #f0f0f0' : 'none',
                                borderRadius: 0,
                                background: idx % 2 === 0 ? '#fafbfc' : '#fff',
                                transition: 'background 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0 24px',
                                minHeight: 90,
                                boxShadow: 'none'
                            }}
                            bodyStyle={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: 0,
                                width: '100%'
                            }}
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            <div style={{ minWidth: 48, textAlign: 'center', fontSize: 28, marginRight: 24 }}>
                                {page.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <Title level={4} style={{ margin: 0, display: 'inline-block' }}>
                                    {page.name}
                                </Title>
                                <Tag color="blue" style={{ marginLeft: 12, verticalAlign: 'middle' }}>{page.tag}</Tag>
                                <Paragraph style={{ margin: '4px 0 0 0', color: '#555' }}>{page.description}</Paragraph>
                            </div>
                        </Card>
                    ))}
                </div>
            </Card>
        </div>
    );
}

export default Home;