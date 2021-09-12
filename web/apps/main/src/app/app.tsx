import styles from './app.module.less';

import { ReactComponent as Logo } from './tower.svg';
import { GithubOutlined, BookOutlined, CompassOutlined } from '@ant-design/icons'

import { Layout, Menu, Typography, Row, Col, Card, Input, Image, Button } from "antd";

const { Header, Content } = Layout
const { Title, Text } = Typography
const { Search } = Input


export function App() {
  const handleClick = (e: any) => {
    switch(e.key) {
      case "docs":
        window.location.href = "https://github.com/cmwaters/rook";
        break;
      case "code":
        window.location.href = "https://github.com/cmwaters/rook";
        break;
      case "roadmap":
        break;
    }
  }

  return (
    <Layout>
      <Header style={{ margin: "20px" }}>
        <table style={{ width: "100%", verticalAlign: "middle" }}>
          <td>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center"}}>
              <Logo height="32" width="32"/>
              <Title level={3} style={{ margin: "10px"}}>Rook</Title>
            </div>
          </td>
          <td>
            <Menu style={{ float:"right", borderBottom:"none"}} mode="horizontal" onClick={handleClick}>
              <Menu.Item key="roadmap" icon={<CompassOutlined />}>Roadmap</Menu.Item>
              <Menu.Item key="docs" icon={<BookOutlined />}>Docs</Menu.Item>
              <Menu.Item key="code" icon={<GithubOutlined />}>Code</Menu.Item>
            </Menu>
          </td>
        </table>
      </Header>
      <Content style={{ margin: "40px" }}>
        <Row justify="space-around">
          <Col span={6}>
            <Card>
              <Title>Claim 🎁</Title>
              <Text type="secondary">Get your airdrop of goodies</Text>
              <br />
              <br />
              <Search placeholder="COSMOS Address" enterButton="Claim"/>
              <Image src="https://www.freeiconspng.com/uploads/no-image-icon-6.png" preview={false}/>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Image src="https://www.freeiconspng.com/uploads/no-image-icon-6.png" preview={false}/>
              <Title>Learn 🤔</Title>
              <Text type="secondary">Get a feel for the game by entering the Dojo</Text>
              <br />
              <br />
              <Button type="primary" style={{float: "right"}}>Enter</Button>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Title>Play 🕹</Title>
              <Text type="secondary">Try out the alpha version</Text>
              <br />
              <br />
              <Button type="primary" style={{float: "right"}}>Play</Button>
              <Image src="https://www.freeiconspng.com/uploads/no-image-icon-6.png" preview={false}/>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>    
  ); 
}

export default App;
