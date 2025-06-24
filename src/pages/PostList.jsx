import { useEffect, useState } from "react"
import { Spin, Card, Pagination, Typography, Avatar, Tag, Tooltip, Button } from 'antd';
import { Link } from "react-router-dom"
import { UserOutlined, MessageOutlined } from '@ant-design/icons';

const { Paragraph, Text, Title } = Typography;
const PAGE_SIZE = 12;

const PostList = () => {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [current, setCurrent] = useState(1)

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(res => res.json())
            .then(data => {
                setPosts(data)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return <Spin size="large" style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}} />
    }

    const startIdx = (current - 1) * PAGE_SIZE;
    const endIdx = startIdx + PAGE_SIZE;
    const currentPosts = posts.slice(startIdx, endIdx);

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
                <MessageOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                Posts List
            </Title>
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
                marginTop: 16,
                background: "#fff",
                borderRadius: 8,
                boxShadow: '0 2px 8px #f0f1f2',
                padding: 8
            }}>
                {currentPosts.map((item) => (
                    <Card
                        hoverable
                        key={item.id}
                        style={{
                            margin: 0,
                            boxShadow: '0 1px 4px #f0f1f2',
                            borderRadius: 8,
                            background: '#f9fafb',
                            borderLeft: '4px solid #1890ff',
                            transition: 'box-shadow 0.2s',
                            cursor: 'pointer',
                            padding: 0
                        }}
                        bodyStyle={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 16,
                            padding: 20,
                            minHeight: 100
                        }}
                    >
                        <Avatar size={40} icon={<UserOutlined />} style={{ background: '#1890ff', marginRight: 8 }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Text strong style={{ fontSize: 16 }}>{item.title}</Text>
                            </div>
                            <Paragraph ellipsis={{ rows: 2 }} style={{ margin: '8px 0 0 0' }}>{item.body}</Paragraph>
                        </div>
                        <div style={{ alignSelf: 'center' }}>
                            <Tooltip title="View Details">
                                <Link to={`/posts/${item.id}`}>
                                    <Button type="primary" shape="round" size="middle">
                                        More
                                    </Button>
                                </Link>
                            </Tooltip>
                        </div>
                    </Card>
                ))}
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
                <Pagination
                    current={current}
                    pageSize={PAGE_SIZE}
                    total={posts.length}
                    onChange={page => setCurrent(page)}
                    showSizeChanger={false}
                />
            </div>
        </div>
    )
}

export default PostList