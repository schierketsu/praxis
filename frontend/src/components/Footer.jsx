import React from 'react';
import { Layout, Typography, Row, Col, Space, Button } from 'antd';
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  GithubOutlined,
  SendOutlined,
  MessageOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Link } = Typography;
const { Footer: AntFooter } = Layout;

const Footer = () => {
  return (
    <AntFooter style={{
      background: '#1a1a1a',
      color: 'white',
      padding: '60px 0 30px 0',
      position: 'relative',
      overflow: 'hidden'
    }} className="footer-component">
      {/* Декоративные элементы */}
      <div style={{
        position: 'absolute',
        top: '-40%',
        left: '-15%',
        width: '350px',
        height: '350px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '50%',
        filter: 'blur(50px)'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '-25%',
        right: '-8%',
        width: '250px',
        height: '250px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '50%',
        filter: 'blur(40px)'
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
        <Row gutter={[48, 48]}>
          <Col xs={24} md={8}>
            <div className="fade-in-up">
              <Title level={3} style={{ color: 'white', marginBottom: '24px' }}>
                практикастудентам.рф
              </Title>
              <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px', lineHeight: '1.6' }}>
                Сделано с любовью к хорошим практикам 💙
              </Paragraph>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="fade-in-up">
              <Title level={4} style={{ color: 'white', marginBottom: '24px' }}>
                Блог
              </Title>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {/* <Link href="#" style={{ color: 'rgba(255, 255, 255, 0.8)', display: 'block' }}>
                  Рейтинг компаний
                </Link>
                <Link href="#" style={{ color: 'rgba(255, 255, 255, 0.8)', display: 'block' }}>
                  Часто задаваемые вопросы
                </Link> */}
                {/* <Link href="#" style={{ color: 'rgba(255, 255, 255, 0.8)', display: 'block' }}>
                  *
                </Link>
                <Link href="#" style={{ color: 'rgba(255, 255, 255, 0.8)', display: 'block' }}>
                  *
                </Link> */}
              </Space>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="fade-in-up" style={{ textAlign: 'right' }}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MailOutlined style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }} />
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    info@studprakt.ru
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <GithubOutlined style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }} />
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    
                  </span>
                </div>
              </Space>
            </div>
          </Col>
        </Row>

        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          marginTop: '60px',
          paddingTop: '40px',
          textAlign: 'center'
        }}>
          <Paragraph style={{ color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
            © 2025 практикастудентам.рф. Все права защищены.
          </Paragraph>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
