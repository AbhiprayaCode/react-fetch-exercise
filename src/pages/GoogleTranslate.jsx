import { useState } from 'react';
import axios from 'axios';
import { Input, Button, Card, Typography, Spin, Avatar, Tag } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

function GoogleTranslate() {
  const [text, setText] = useState('');
  const [translated, setTranslated] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    setLoading(true);
    setTranslated('');
    try {
      const res = await axios.get('https://translate.googleapis.com/translate_a/single', {
        params: {
          client: 'gtx',
          sl: 'auto',         
          tl: 'ko',           
          dt: 't',
          q: text,
        },
      });

      setTranslated(res.data[0][0][0]);
    } catch (err) {
      console.error(err);
      setTranslated('Error Occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <Card
        style={{
          background: '#f9fafb',
          borderRadius: 8,
          boxShadow: '0 2px 8px #f0f1f2',
          marginBottom: 24
        }}
        bodyStyle={{ padding: 32 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <Avatar size={48} icon={<GlobalOutlined />} style={{ marginRight: 16, background: '#faad14' }} />
          <div>
            <Title level={4} style={{ margin: 0 }}>English to Korean Translator</Title>
            <Tag color="gold" style={{ marginTop: 4 }}>Translate</Tag>
          </div>
        </div>
        <Paragraph style={{ marginBottom: 24 }}>
          Translate english text to Korean for free using Google Translate API.
        </Paragraph>
        <TextArea
          rows={4}
          placeholder="Input Text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ marginBottom: 12, width: '100%' }}
          disabled={loading}
        />
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Button
            type="primary"
            onClick={handleTranslate}
            disabled={!text || loading}
            loading={loading}
            style={{ minWidth: 180, borderRadius: 8 }}
          >
            Translate to Korean
          </Button>
        </div>
        <Card
          type="inner"
          title="Result (Korean)"   
          style={{ background: '#fffbe6', minHeight: 100, borderLeft: '4px solid #faad14', borderRadius: 8 }}
          bodyStyle={{ padding: 20 }}
        >
          {loading ? (
            <div style={{ textAlign: 'center' }}>
              <Spin />
            </div>
          ) : (
            <Paragraph style={{ fontSize: 18, minHeight: 24 }}>
              {translated || <span style={{ color: '#aaa' }}>Translation will appear here.</span>}
            </Paragraph>
          )}
        </Card>
      </Card>
    </div>
  );
}

export default GoogleTranslate;
