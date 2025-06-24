import { useState } from 'react';
import axios from 'axios';
import { Input, Button, Card, Spin, Typography, Avatar, Tag, Alert } from 'antd';
import { SafetyCertificateOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const VirusTotal = () => {
  const [url, setUrl] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Gunakan prefix VITE_ untuk env variable di Vite
  const VT_API_KEY = import.meta.env.VITE_VIRUS_TOTAL_API;

  const handleScan = async () => {
    setLoading(true);
    setScanResult(null);
    setErrorMsg('');

    if (!VT_API_KEY) {
      setLoading(false);
      setErrorMsg('VirusTotal API key is missing. Please set VITE_VIRUS_TOTAL_API in your .env file.');
      return;
    }

    try {
      const response = await axios.post(
        'https://www.virustotal.com/api/v3/urls',
        new URLSearchParams({ url }).toString(),
        {
          headers: {
            'x-apikey': VT_API_KEY,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const urlId = response.data.data.id;

      // Polling untuk menunggu status selesai jika masih queued
      let result;
      let status = 'queued';
      let tries = 0;
      while (status === 'queued' && tries < 10) {
        result = await axios.get(
          `https://www.virustotal.com/api/v3/analyses/${urlId}`,
          {
            headers: {
              'x-apikey': VT_API_KEY,
            },
          }
        );
        status = result.data.data?.attributes?.status || 'queued';
        if (status === 'queued') {
          await new Promise(res => setTimeout(res, 1500));
        }
        tries++;
      }

      setScanResult(result.data);
    } catch (error) {
      setErrorMsg(
        error?.response?.data?.error?.message ||
        error?.message ||
        'Failed to scan. Please check your API key and network.'
      );
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
          <Avatar size={48} icon={<SafetyCertificateOutlined />} style={{ marginRight: 16, background: '#eb2f96' }} />
          <div>
            <Title level={4} style={{ margin: 0 }}>VirusTotal URL Scanner</Title>
            <Tag color="magenta" style={{ marginTop: 4 }}>Security</Tag>
          </div>
        </div>
        <Paragraph style={{ marginBottom: 24 }}>
          Scan a URL for malware and threats using the VirusTotal API and view the analysis summary.
        </Paragraph>
        {errorMsg && (
          <Alert message={errorMsg} type="error" showIcon style={{ marginBottom: 16 }} />
        )}
        <Input
          type="text"
          placeholder="Insert URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: '100%', marginBottom: 12 }}
          disabled={loading}
        />
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Button
            type="primary"
            onClick={handleScan}
            loading={loading}
            disabled={!url}
            style={{ minWidth: 180, borderRadius: 20 }}
          >
            Scan
          </Button>
        </div>
        {loading && (
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <Spin size="large" />
          </div>
        )}
        {scanResult && (() => {
          const attr = scanResult.data?.attributes || {};
          const stats = attr.stats || {};
          const results = attr.results || {};
          const status = attr.status || scanResult.status || '-';
          const urlId = scanResult.meta?.url_info?.id || scanResult.data?.id;

          if (status === "queued") {
            return (
              <div style={{ marginTop: 20, textAlign: 'center' }}>
                <Spin size="large" />
                <div style={{ marginTop: 12, color: '#888' }}>Analysis is queued, please wait...</div>
              </div>
            );
          }
          return (
            <Card style={{ marginTop: 24, textAlign: 'left', borderLeft: '4px solid #eb2f96', borderRadius: 8 }}>
              <Title level={4}>Analysis Result</Title>
              <div style={{ marginBottom: 16 }}>
                <b>Status:</b> {status}<br />
                <b>Total Engines:</b> {Object.keys(results).length || '-'}<br />
                <b>Malicious:</b> {typeof stats.malicious === 'number' ? stats.malicious : '-'}<br />
                <b>Harmless:</b> {typeof stats.harmless === 'number' ? stats.harmless : '-'}<br />
                {urlId && (
                  <span>
                    <b>Detail:</b> <a
                      href={`https://www.virustotal.com/gui/url/${urlId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >View on VirusTotal</a>
                  </span>
                )}
              </div>
              <details>
                <summary style={{ cursor: 'pointer', marginBottom: 8 }}>Show Full JSON</summary>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {JSON.stringify(scanResult, null, 2)}
                </pre>
              </details>
            </Card>
          );
        })()}
      </Card>
    </div>
  );
};

export default VirusTotal;
