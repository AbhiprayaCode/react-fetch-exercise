import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Spin, Result, Button, Card, Avatar, Typography, Tag, Tooltip } from 'antd';
import { UserOutlined, MessageOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const PostDetail = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        let postLoaded = false;
        let commentsLoaded = false;

        fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
            .then(res => res.json())
            .then(data => {
                setPost(data);
                postLoaded = true;
                if (commentsLoaded) setLoading(false);
            });

        fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
            .then(res => res.json())
            .then(data => {
                setComments(data)
                commentsLoaded = true;
                if (postLoaded) setLoading(false);
            })
    }, [postId]);

    if (loading) {
        return <Spin size="large" style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}} />
    }

    if (!post || !post.id) {
        return <Result
                    status="error"
                    title="Failed to load post"
                    extra={
                    <Link to="/posts">
                        <Button>
                            Back to Posts
                        </Button>
                    </Link>
                    }
                />
    }

    return (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
            <Card
                style={{
                    marginBottom: 32,
                    boxShadow: '0 2px 8px #f0f1f2',
                    borderRadius: 8,
                    background: '#f9fafb'
                }}
                bodyStyle={{ padding: 32 }}
            >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                    <Avatar size={48} icon={<UserOutlined />} style={{ marginRight: 16, background: '#1890ff' }} />
                    <div>
                        <Title level={4} style={{ margin: 0 }}>{post.title}</Title>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                            <Tag color="blue">Post #{post.id}</Tag>
                        </div>
                    </div>
                </div>
                <Paragraph style={{ fontSize: 16, marginTop: 12, marginBottom: 0, whiteSpace: 'pre-line' }}>
                    {post.body}
                </Paragraph>
            </Card>

            <Title level={4} style={{ margin: '32px 0 16px 0' }}>
                <MessageOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                Comments ({comments.length})
            </Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <Card
                            key={comment.id}
                            hoverable
                            style={{
                                marginBottom: 0,
                                boxShadow: '0 1px 4px #f0f1f2',
                                borderRadius: 6,
                                background: '#fff',
                                borderLeft: '4px solid #1890ff',
                                transition: 'box-shadow 0.2s',
                                cursor: 'pointer'
                            }}
                            bodyStyle={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: 20 }}
                        >
                            <Avatar
                                icon={<UserOutlined />}
                                style={{ background: '#1890ff', marginRight: 8 }}
                            />
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Text strong>{comment.email}</Text>
                                </div>
                                <Title level={5} style={{ margin: '4px 0 8px 0' }}>{comment.name}</Title>
                                <Text style={{ fontSize: 15 }}>{comment.body}</Text>
                            </div>
                        </Card>
                    ))
                ) : (
                    <Paragraph>No comments found.</Paragraph>
                )}
            </div>
            <div style={{ marginTop: 40, textAlign: 'center' }}>
                <Link to="/posts">
                    <Button type="primary" size="large" style={{ borderRadius: 20, padding: '0 32px' }}>
                        Back to Posts
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default PostDetail;
