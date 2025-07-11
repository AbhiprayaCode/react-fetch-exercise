import { useEffect, useState } from "react";
import { Spin, Card, Pagination, Typography, Tag, Button } from 'antd';
import { Link, useLocation } from "react-router-dom";
import SearchBar from "../components/SearchBar";

const { Paragraph, Title, Text } = Typography;
const PAGE_SIZE = 12;

const BookList = () => {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [current, setCurrent] = useState(1)
    const location = useLocation();
    const searchQuery = location.state?.search || '';

    useEffect(() => {
        setLoading(true);
        let url = 'http://localhost:8080/books/';
        if (searchQuery) {
            url = `http://localhost:8080/books?keyword=${encodeURIComponent(searchQuery)}`;
        }
        fetch(url)
            .then(res => res.json())
            .then(data => {
                setBooks(data)
                setLoading(false)
            })
            .catch(() => setLoading(false));
    }, [searchQuery]);

    if (loading) {
        return <Spin size="large" style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}} />;
    }

    const startIdx = (current - 1) * PAGE_SIZE;
    const endIdx = startIdx + PAGE_SIZE;
    const currentBooks = books.slice(startIdx, endIdx);
    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 32 }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 32, letterSpacing: 1 }}>
                Books List
            </Title>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
                <Link to="/books/add">
                    <Button type="primary" style={{ marginBottom: 32 }}>✏️ Add Book</Button>
                </Link>
                <SearchBar />
            </div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 24,
                marginBottom: 32,
                minHeight: 200
            }}>
                {currentBooks.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888', fontSize: 18 }}>
                        No books found.
                    </div>
                ) : (
                    currentBooks.map((item) => (
                        <Card
                            hoverable
                            key={item.id}
                            style={{
                                borderRadius: 12,
                                boxShadow: '0 2px 8px #f0f1f2',
                                background: '#fff',
                                border: '1px solid #f0f0f0',
                                transition: 'box-shadow 0.2s',
                                minHeight: 180,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                padding: 0
                            }}
                        >
                            <Title level={4} style={{ marginBottom: 8 }}>{item.title}</Title>
                            <Tag color="blue" style={{ marginBottom: 12 }}>{item.category}</Tag>
                            <Paragraph ellipsis={{ rows: 3 }} style={{ color: '#555', marginBottom: 0 }}>{item.description || '-'}</Paragraph>
                            <div style={{ marginTop: 16, textAlign: 'right' }}>
                                <Button
                                    type="primary"
                                    size="middle"
                                    onClick={() => {
                                        window.location.assign(`/books/${item._id || item.id}`);
                                    }}
                                >
                                    Details
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                <Pagination
                    current={current}
                    pageSize={PAGE_SIZE}
                    total={books.length}
                    onChange={page => setCurrent(page)}
                    showSizeChanger={false}
                />
            </div>
        </div>
    );
}
export default BookList;