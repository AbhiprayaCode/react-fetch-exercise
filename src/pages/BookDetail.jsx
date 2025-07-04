import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { Card, Typography, Tag, Divider, Button, Spin, Result, message, Popconfirm, Alert } from 'antd';
import axios from 'axios';


const BookDetail = () => {
    const { bookId: paramBookId } = useParams();
    const location = useLocation();
    const bookId = location.state?.bookId || paramBookId;
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetch(`http://localhost:8080/books/${bookId}`)
                .then(res => {
                    if (!res.ok) throw new Error('Book not found');
                    return res.json();
                })
                .catch(() => null),
            fetch(`http://localhost:8080/books/${bookId}/comments`)
                .then(res => res.ok ? res.json() : [])
                .catch(() => [])
        ]).then(([bookData, commentsData]) => {
            let bookObj = bookData;
            if (Array.isArray(bookData)) {
                bookObj = bookData[0] || null;
            }
            setBook(bookObj);
            setComments(Array.isArray(commentsData) ? commentsData : []);
            setLoading(false);
        });
    }, [bookId]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <Spin size="large" />
            </div>
        );
    }
    if (!book) {
        return (
            <Result
                status="error"
                title="Book Not Found"
                subTitle="The book you are looking for could not be found."
                extra={
                    <Button type="primary" onClick={() => navigate('/books')}>
                        Back to Books
                    </Button>
                }
            />
        );
    }

    // DELETE
    const handleDelete = async () => {
        try {
            const bookIdToDelete = book._id || book.id;
            await axios.delete(`http://localhost:8080/books/${bookIdToDelete}`);
            alert(`"${book.title}" deleted successfully!`);
            setTimeout(() => {
                navigate('/books');
            }, 1000);
        } catch (error) {
            message.error('Failed to delete book');
        }
    };

    const { Title, Paragraph, Text } = Typography;
    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
            <Link to="/books">
                <Button type="primary" style={{ marginBottom: 32 }}>Go Back</Button>
            </Link>
            <Card
                style={{
                    marginBottom: 32,
                    boxShadow: '0 2px 8px #f0f1f2',
                    borderRadius: 12,
                    background: '#f9fafb',
                    padding: 0
                }}
                bodyStyle={{ padding: 32 }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={2} style={{ marginBottom: 8 }}>{book.title}</Title>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Button
                            type="primary"
                            onClick={() => navigate(`/books/${bookId}/edit`, { state: { bookId, book } })}
                        >
                            Edit Book
                        </Button>
                        <Popconfirm
                            title="Delete the book"
                            description="Are you sure to delete this task?"
                            onConfirm={handleDelete}
                            // onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button danger>Delete</Button>
                        </Popconfirm>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    {book.category && <Tag color="blue">{book.category}</Tag>}
                    {book.author && <Tag color="geekblue">Author: {book.author}</Tag>}
                    {book.year && <Tag color="purple">Year: {book.year}</Tag>}
                </div>
                <Paragraph style={{ fontSize: 16, color: '#555', marginBottom: 16 }}>
                    {book.description || '-'}
                </Paragraph>
            </Card>
            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '24px 0 24px 0' }}>
                <Button type="dashed" onClick={() => navigate(`/books/${bookId}/add-comment`)}>
                    Add Comment
                </Button>
            </div>
            <Divider orientation="left">Comments ({comments.length})</Divider>
            <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px #f0f1f2', padding: 24 }}>
                {comments.length > 0 ? (
                    <ul style={{ paddingLeft: 20 }}>
                        {comments.map(comment => (
                            <Card
                            key={comment.id}
                            hoverable
                            style={{
                                marginBottom: '10px',
                                boxShadow: '0 1px 4px #f0f1f2',
                                borderRadius: 6,
                                background: '#fff',
                                borderLeft: '4px solid #1890ff',
                                transition: 'box-shadow 0.2s',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Text strong>{comment.name || 'Anonymous'}</Text>
                                </div>
                                <Text style={{ fontSize: 15 }}>{comment.message}</Text>
                            </div>
                        </Card>
                        ))}
                    </ul>
                    
                ) : (
                    <Text type="secondary">No comments found.</Text>
                )}
            </div>
            
        </div>
    );
}

export default BookDetail;
