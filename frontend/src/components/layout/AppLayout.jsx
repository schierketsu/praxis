import { Layout } from 'antd'
import AppHeader from './AppHeader'
import AppContent from './AppContent'
import Footer from '../Footer'

export default function AppLayout(){
    return (
        <Layout>
            <AppHeader/>
            <Layout>
                <AppContent/>
            </Layout>
            <Footer/>
        </Layout>
    )
}