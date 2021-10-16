// import './app.module.less';

import { ReactComponent as Logo } from './tower.svg';
import { ReactComponent as Snapshot1 } from './snapshot-1.svg';
import { ReactComponent as Snapshot2 } from './snapshot-2.svg';
import { ReactComponent as Snapshot3 } from './snapshot-3.svg';
import { GithubOutlined, BookOutlined, CompassOutlined, AlertTwoTone } from '@ant-design/icons'

import { Wallet } from '../components/wallet'

import { Layout, Menu, Typography, Row, Col, Card, Input, Button } from "antd";

const { Header, Content } = Layout
const { Title, Text } = Typography
const { Search } = Input

declare global {
    interface Window { getOfflineSigner: any; keplr: any; }
}

export function App() {
  const redirectToDocs = () => {
    window.location.href = "https://arcane-systems.github.io/rook";
  }

  const claimButton = <Button type="primary" style={{float: "right"}}>Claim</Button>

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
            <Wallet style={{float: "right"}}></Wallet>
            {/* TODO: Add menu bar back in */}
            {/* <Menu style={{ float:"right", borderBottom:"none"}} mode="horizontal" onClick={handleClick}>
              <Menu.Item key="roadmap" icon={<CompassOutlined />}>Roadmap</Menu.Item>
              <Menu.Item key="docs" icon={<BookOutlined />}>Docs</Menu.Item>
              <Menu.Item key="code" icon={<GithubOutlined />}>Code</Menu.Item>
            </Menu> */}
          </td>
        </table>
      </Header>
      <Content style={{ margin: "30px" }}>
        <Row justify="space-around">
          <Col span={6}>
            <Card>
              <Title>Claim</Title>
              <Text type="secondary">Start your journey as an ATOM tokenholder by claiming your first airdrop</Text>
              <br />
              <br />
              {claimButton}
              <br />
              <br />
              <Snapshot1 height="40vh" width="100%" style={{margin: '10px'}}/>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Snapshot2 height="40vh" width="100%" style={{margin: '10px'}}/>
              <Title>Learn</Title>
              <Text type="secondary">Peek into the docs to learn how to play</Text>
              {/* <Text type="secondary">Get a feel for the game by entering the Dojo</Text> */}
              <br />
              <br />
              <Button type="primary" style={{float: "right"}} onClick={redirectToDocs}>Enter</Button>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Title>Play</Title>
              <Text type="secondary">Try out the alpha version</Text>
              <br />
              <br />
              <Button type="primary" style={{float: "right"}} disabled>Coming Soon</Button>
              <br />
              <br />
              <Snapshot3 height="40vh" width="100%" style={{margin: '10px'}}/>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>    
  ); 
}

export default App;
