import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Form, Input, Button, message } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const AddComment = () => {
  const { bookId } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await axios.post(`http://localhost:8080/books/${bookId}/comments`, values);
      message.success('Comment added successfully!');
      form.resetFields();
      setTimeout(() => {
        navigate(`/books/${bookId}`);
      }, 800);
    } catch (err) {
      message.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 32 }}>
      <Card style={{ boxShadow: '0 2px 8px #f0f1f2', borderRadius: 12 }}>
        <Title level={3} style={{ marginBottom: 24 }}>Add Comment</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your name!' }]}> 
            <Input placeholder="Your name" />
          </Form.Item>
          <Form.Item label="Comment" name="message" rules={[{ required: true, message: 'Please input your comment!' }]}> 
            <Input.TextArea rows={3} placeholder="Your comment" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ minWidth: 120 }}>
              Submit
            </Button>
            <Button onClick={() => navigate(-1)} disabled={loading} style={{ marginLeft: 12 }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddComment;
