import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Typography, Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const AddCategory = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [catLoading, setCatLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        setCatLoading(true);
        axios.get('http://localhost:8080/category')
            .then(res => setCategories(res.data))
            .catch(() => setCategories([]))
            .finally(() => setCatLoading(false));
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await axios.post('http://localhost:8080/category', values);
            message.success('Category added successfully!');
            form.resetFields();
            fetchCategories();
        } catch (err) {
            message.error('Failed to add category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 500, margin: '0 auto', padding: 32 }}>
            <Card style={{ boxShadow: '0 1px 4px #eaeaea', borderRadius: 12, marginBottom: 28, background: '#fff' }}>
                <Title level={4} style={{ marginBottom: 18, textAlign: 'center', color: '#222', letterSpacing: 0.5 }}>
                    Category List
                </Title>
                <div style={{ minHeight: 48 }}>
                    {catLoading ? (
                        <div style={{ textAlign: 'center', color: '#bbb', padding: 12, fontSize: 15 }}>Loading...</div>
                    ) : categories.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#bbb', padding: 12, fontSize: 15 }}>No categories found.</div>
                    ) : (
                        <div style={{
                            display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', padding: 4
                        }}>
                            {categories.map((cat, idx) => (
                                <div
                                    key={cat._id || cat.id || idx}
                                    style={{
                                        background: '#f6f6f6',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: 16,
                                        padding: '5px 16px',
                                        fontSize: 15,
                                        color: '#333',
                                        fontWeight: 400,
                                        minWidth: 70,
                                        textAlign: 'center',
                                        letterSpacing: 0.2,
                                        transition: 'box-shadow 0.15s, background 0.15s',
                                        cursor: 'pointer',
                                        userSelect: 'none',
                                        outline: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        boxShadow: '0 1px 2px #f0f1f2',
                                    }}
                                    tabIndex={0}
                                    onMouseOver={e => {
                                        e.currentTarget.style.background = '#e6f0ff';
                                        e.currentTarget.style.boxShadow = '0 2px 8px #e0e7ff';
                                    }}
                                    onMouseOut={e => {
                                        e.currentTarget.style.background = '#f6f6f6';
                                        e.currentTarget.style.boxShadow = '0 1px 2px #f0f1f2';
                                    }}
                                >
                                    <span style={{ fontSize: 15, color: '#888' }}>#</span> {cat.name || cat}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>
            <Card style={{ boxShadow: '0 2px 8px #f0f1f2', borderRadius: 12 }}>
                <Title level={3} style={{ marginBottom: 24 }}>Add Category</Title>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item label="Category Name" name="name" rules={[{ required: true, message: 'Please input the category name!' }]}> 
                        <Input placeholder="Category name" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} style={{ minWidth: 120 }}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}

export default AddCategory;
