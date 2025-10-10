import {Layout} from 'antd'

const headerStyle = {
  width: "100%",
  textAlign: "center",
  height: 60,
  padding: "1rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: '#8bde91ff' 
};
export default function AppHeader(){
    return (
        <Layout.Header style = {headerStyle}>
            <h1>Header</h1>
        </Layout.Header>
    )
}