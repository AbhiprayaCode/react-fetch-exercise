import React from 'react';
import { Menu } from 'antd';

const NavBar = ({ activeKey, onChange }) => {
  const items = [
    { key: 'Home', label: 'Home' },
    { key: 'Posts', label: 'Posts' },
    { key: 'Books', label: 'Books' },
    { key: 'Categories', label: 'Categories' },
    { key: 'Translate', label: 'Translate' },
    { key: 'Scanner', label: 'VirusTotal Scanner' },
  ];

  return (
    <nav
      style={{
        width: '100%',
        background: '#fff',
        boxShadow: '0 2px 8px #f0f1f2',
        marginBottom: 24,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        height: 56,
      }}>
        <div style={{ fontWeight: 700, fontSize: 22, color: '#2b3a55', letterSpacing: 1 }}>
          Welcome!👋
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={[activeKey]}
          onClick={({ key }) => onChange(key)}
          style={{ border: 'none', minWidth: 0, flex: 1, justifyContent: 'flex-end', background: 'transparent', fontSize: 16 }}
          items={items.map(item => ({ ...item, style: { padding: '0 18px' } }))}
        />
      </div>
    </nav>
  );
};

export default NavBar;
