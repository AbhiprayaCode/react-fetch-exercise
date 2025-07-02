import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Typography, Form, Input, Button, message, Select } from 'antd';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8080/books';
const { Title } = Typography;

const AddBook = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [catLoading, setCatLoading] = useState(true);
    const navigate = useNavigate();

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

    const handleAddCategory = async (name) => {
        if (!name || !name.trim()) return;
        try {
            await axios.post('http://localhost:8080/category', { name });
            message.success('Category added!');
            fetchCategories();
            form.setFieldsValue({ category: name });
        } catch (err) {
            message.error('Failed to add category');
        }
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const res = await axios.post(API_URL, values);
            const newBook = res.data;
            message.success('Book added successfully!');
            form.resetFields();
            setTimeout(() => {
                navigate(`/books/${newBook._id}`, { state: { book: newBook } });
            }, 800);
        } catch (err) {
            message.error('Failed to add book');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 32 }}>
            <Card style={{ boxShadow: '0 2px 8px #f0f1f2', borderRadius: 12 }}>
                <Title level={3} style={{ marginBottom: 24 }}>Add Book</Title>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please input the title!' }]}> 
                        <Input placeholder="Title" />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <Input.TextArea rows={3} placeholder="Description" />
                    </Form.Item>
                    <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Please select a category!' }]}> 
                        <Select
                            placeholder="Select category"
                            loading={catLoading}
                            options={categories.map(cat => ({ label: cat.name || cat, value: cat.name || cat }))}
                            showSearch
                            optionFilterProp="label"
                            dropdownRender={menu => (
                                <>
                                    {menu}
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 8 }}>
                                        <Input
                                            placeholder="Add new category"
                                            size="small"
                                            style={{ flex: 1 }}
                                            onPressEnter={e => {
                                                handleAddCategory(e.target.value);
                                                e.target.value = '';
                                            }}
                                        />
                                        <Button
                                            type="link"
                                            size="small"
                                            onClick={e => {
                                                const input = e.target.closest('div').querySelector('input');
                                                if (input && input.value) {
                                                    handleAddCategory(input.value);
                                                    input.value = '';
                                                }
                                            }}
                                        >Add</Button>
                                    </div>
                                </>
                            )}
                        />
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

export default AddBook;