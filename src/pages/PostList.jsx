import { useEffect, useState } from "react"
import { Spin, Card, Pagination, Typography, Avatar, Tag, Tooltip, Button } from 'antd';
import { Link } from "react-router-dom"
import { UserOutlined, MessageOutlined } from '@ant-design/icons';

const { Paragraph, Text, Title } = Typography;
// const PAGE_SIZE = 12;

const PostList = () => {
    const [loading, setLoading] = useState(true)

    // Pagination
    const [posts, setPosts] = useState([])
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const startIdx = (page - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const currentPosts = posts.slice(startIdx, endIdx);

    // Fetching data from API
    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(res => res.json())
            .then(data => {
                setPosts(data)
                setLoading(false)
            })
    }, [])

    // Loading design
    if (loading) {
        return <Spin size="large" style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}} />
    }


    return (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>

            {/* Title */}
            <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
                <MessageOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                Posts List
            </Title>
            
            {/* Posts List */}
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

                {/* Mapping Posts */}
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

            {/* Pagination */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
                <Pagination
                    current={page}
                    pageSize={pageSize}
                    total={posts.length}
                    onChange={page => setPage(page)}
                    showSizeChanger={true}
                    onShowSizeChange={(current, size) => setPageSize(size)}
                    showQuickJumper={true}
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}   
                />
            </div>
        </div>
    )
}

export default PostList