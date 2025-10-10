import { Layout } from 'antd'

const contentStyle = {
  textAlign: 'center',
  minHeight: 'calc(100vh - 60px)',
  color: '#fff',
  backgroundColor: '#7fc0e6ff',
  padding: '1rem'
};

export default function AppCotent(){
    return (
        <Layout.Content style = {contentStyle}>
            <h1>Content</h1>
        </Layout.Content>
    )
}