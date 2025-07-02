import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Card, Typography, Form, Input, Button, message, Select } from 'antd';

const { Title } = Typography;

function EditBook() {
  const { bookId: paramBookId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  // Prioritize bookId from state, fallback to param
  const bookId = location.state?.bookId || paramBookId;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    // If book data is passed from navigation state, use it, else fetch
    const bookData = location.state?.book;
    if (bookData) {
      form.setFieldsValue(bookData);
      setLoading(false);
    } else {
      setLoading(true);
      axios.get(`http://localhost:8080/books/${bookId}`)
        .then(res => {
          const data = Array.isArray(res.data) ? res.data[0] : res.data;
          form.setFieldsValue(data);
        })
        .finally(() => setLoading(false));
    }
  }, [bookId, location.state, form]);

  const handleUpdate = async (values) => {
    setSaving(true);
    try {
      await axios.put(`http://localhost:8080/books/${bookId}`, values);
      message.success('Book updated successfully!');
      setTimeout(() => {
        navigate(`/books/${bookId}`);
      }, 800);
    } catch (error) {
      message.error('Failed to update book');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 32 }}>
      <Card style={{ boxShadow: '0 2px 8px #f0f1f2', borderRadius: 12 }}>
        <Title level={3} style={{ marginBottom: 24 }}>Edit Book</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please input the title!' }]}> 
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} />
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
            <Button type="primary" htmlType="submit" loading={saving} style={{ minWidth: 120 }}>
              Update Book
            </Button>
            <Button onClick={() => navigate(-1)} disabled={saving} style={{ marginLeft: 12 }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default EditBook;
