import React, { Component } from 'react';
import { GoogleMap, Marker } from "react-google-maps"
import MapforApp from './MapforApp';
import './App.css';
import axios from 'axios';
import { Layout, Menu, Breadcrumb, Icon, Button, InputNumber,  Row, Col, Divider, Input } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

function onChange(value) {
  console.log('changed', value);
}

export default class MenuforApp extends React.Component {
  constructor(props){
    super(props);
    this.state={
      collapsed:false,
      smLat: 0,
      smLong: 0,
      geoLat: 0,
      geoLong: 0,
      newQues: String,
      newAns: String,
      newClue: String,
      markers: [],
      geoArray: [
        {},{},{},{},{}
      ],
    }
  }

  handleLat(lat) {
    this.setState({
      smLat : parseFloat(lat)
    })    
  }
  handleLng(lng) {
    this.setState({
      smLng: parseFloat(lng)
    })
  }
  handleQues(q) {
    this.setState({
      newQues: q 
    })
  }
  handleAns(a) {
    this.setState({
      newAns: a
    })
  }
  handleClue(c) {
    this.setState({
      newClue: c
    })
  }

  handleGeolat(geoLat,i) {
    let geoArray = this.state.geoArray;
    geoArray[i][geoLat.target.name]= parseFloat(geoLat.target.value);

    this.setState({
      geoArray  
    });
  }

	onCollapse = (collapsed) => {
		this.setState({collapsed});
	}

  postReq() {
    let id = Math.random(1000);
    axios.post('http://13.232.33.75:3000/putCoord', {
      unique_id: id,
      name: 'Marker'+id,
      lat: this.state.smLat,
      lng: this.state.smLng,
      question: this.state.newQues,
      answer: this.state.newAns,
      clue: this.state.newClue
    }).then(function (res) {
      console.log(res)
    }).catch(function (error) {
      console.log(error)
    })
  }
  addMark() {
    let m = this.state.markers;
    let newLat = this.state.smLat;
    let newLng = this.state.smLng;
    m.push(<Marker noRedraw={true} key={this.state.smLat} position={{lat: newLat, lng: newLng}} />);
    this.setState({
        markers:m
    });
    this.postReq();

  }
  handleGeofence() {
    axios.post('http://13.232.33.75:3000/putPolygonalGeofence', {
      coords: this.state.geoArray
    }).then(function (res) {
      console.log(res)
    }).catch(function (error) {
      console.log(error)
    })
    this.setState({
      enableFence : true
    });
  }
	render() {
		return (
		<Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
          style={{background: '#009688'}}
        >
          <div className="logo"><h3 style={{textAlign:'center', padding: 10, color: 'white'}}>TwentyThreeML</h3></div>
          
          <Menu defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1">
              <Icon type="home" />
              <span>Home</span>
            </Menu.Item>
            
            <Menu.Item key="2">
              <Icon type="notification" /> 
              <span>Notifications</span>
            </Menu.Item>
            
            <SubMenu
              key="sub1"
              title={<span><Icon type="tool" /><span>Actions</span></span>}
            >
              <Menu.Item key="3">Save Point</Menu.Item>
              <Menu.Item key="4">AR Functions</Menu.Item>
              <Menu.Item key="5">Anchored Point</Menu.Item>
              <Menu.Item key="6">Highlight</Menu.Item>
              <Menu.Item key="7">Interaction Block</Menu.Item>
            
            </SubMenu>
            
            <SubMenu
              key="sub2"
              title={<span><Icon type="team" /><span>Users</span></span>}
            >
              <Menu.Item key="8">Live</Menu.Item>
              <Menu.Item key="9">List</Menu.Item>
            </SubMenu>

            <Menu.Item key="10">
              <Icon type="exclamation-circle-o" />
              <span>Faults</span>
            </Menu.Item>
          </Menu>
        </Sider>
        
        <Layout>
          <Header style={{ background: '#4DB6AC' , padding: 0 , height: '80px'}} ><h1 style={{textAlign: 'center', color: 'white', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '3px'}}>Dashboard</h1></Header>
          <Content style={{ margin: '16px 16px' }}>
            
            <div>
              <Row>
                
                <Col span={18} push={6} style={{background: 'white', height: '480px'}}>
                
                  <MapforApp markers={this.state.markers} enableFence={this.state.enableFence} geoArray={this.state.geoArray}></MapforApp>
                
                </Col>
                <Col span={6} pull={18} style={{background: '#80CBC4', height: '480px'}}>

                    <h2 style={{color: 'white', textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center', margin: '20px', fontWeight:'500'}}>Add Markers Here: </h2>
                    <Divider></Divider>
                    <Row style={{margin: '20px 10px'}} type="flex" justify="start">
                      
                      <Col><h3 style={{letterSpacing: '2px', textTransform: 'uppercase', marginRight: '-40px', marginLeft: '10px', paddingBottom: '10px'}}>LAT:  </h3></Col>
                      
                      <Col span={6} offset={8}><Input style={{width: '90px' }} onChange={lat => this.handleLat(lat.target.value)} id="lat-text" /></Col>
                      
                    </Row>
                      
                    <Row style={{margin: '20px 10px'}} type="flex" justify="start">
                      
                      <Col><h3 style={{letterSpacing: '2px', textTransform: 'uppercase', marginRight: '28px', marginLeft: '10px', paddingBottom: '10px'}}>LONG:  </h3></Col>
                      
                      <Col><Input style={{width: '90px' }} id="long-text" onChange={(lng) => this.handleLng(lng.target.value)}/></Col>

                    </Row>

                    <Row style={{margin: '20px 10px'}} type="flex" justify="start">
                      
                      <Col><h3 style={{letterSpacing: '2px', textTransform: 'uppercase', marginRight: '29px', marginLeft: '10px', paddingBottom: '10px'}}>Ques:  </h3></Col>
                      
                      <Col><Input style={{width: '90px' }} id="ques-text" onChange={q => this.handleQues(q.target.value)}/></Col>

                    </Row>

                    <Row style={{margin: '20px 10px'}} type="flex" justify="start">
                      
                      <Col><h3 style={{letterSpacing: '2px', textTransform: 'uppercase', marginRight: '38px', marginLeft: '10px', paddingBottom: '10px'}}>Ans:  </h3></Col>
                      
                      <Col><Input style={{width: '90px' }} id="ans-text" onChange={a=>this.handleAns(a.target.value)}/></Col>

                    </Row>

                    <Row style={{margin: '20px 10px'}} type="flex" justify="start">
                      
                      <Col><h3 style={{letterSpacing: '2px', textTransform: 'uppercase', marginRight: '30px', marginLeft: '10px', paddingBottom: '10px'}}>Clue:  </h3></Col>
                      
                      <Col><Input style={{width: '90px' }} id="clue-text" onChange={c=>this.handleClue(c.target.value)}/></Col>

                    </Row>
                    
                    <Row>
                      <Col span={6} offset={6}><Button type="primary" style={{width: '150px'}} onClick={() => this.addMark()} style={{fontWeight:'600', width: '180px', marginLeft:'-20px', boxShadow:'2px solid black'}}>Add Marker</Button></Col>
                    </Row>

                </Col>
              </Row>
              <Divider style={{width: '20px'}}/>
              <Row>
                <Col span={24} style={{background: '#80CBC4', height: '300px'}}>

                    <Row>
                      <Col>
                        <h2 style={{ textShadow: '1px 1px #000', color: 'white', textAlign: 'center', letterSpacing: '2px', fontWeight: '600', textTransform: 'uppercase', margin:'20px'}}>Add Geo Fence points here: </h2>
                      </Col>
                      <Divider></Divider>
                      
                      <Col>

                        <Row gutter={32} style={{marginLeft:'144px'}}>
                          
                          <Col span={4}>
                            <Input placeholder = "Lat" name="lat" onChange={(e) => this.handleGeolat(e,0)}/>
                            <Input placeholder = "Long" name="lng" onChange={(e) => this.handleGeolat(e,0)} style={{marginTop:'16px'}} />
                          </Col>
                          
                          <Col span={4}>
                            <Input placeholder = "Lat" name="lat" onChange={(e) => this.handleGeolat(e,1)} />
                            <Input placeholder = "Long" name="lng" style={{marginTop:'16px'}} onChange={(e) => this.handleGeolat(e,1)} />
                          </Col>

                          <Col span={4}>
                            <Input placeholder = "Lat" name="lat" onChange={(e) => this.handleGeolat(e,2)} />
                            <Input placeholder = "Long" name="lng" style={{marginTop:'16px'}} onChange={(e) => this.handleGeolat(e,2)} />
                          </Col>

                          <Col span={4}>
                            <Input placeholder = "Lat" name="lat" onChange={(e) => this.handleGeolat(e,3)}/>
                            <Input placeholder = "Long" name="lng" style={{marginTop:'16px'}} onChange={(e) => this.handleGeolat(e,3)}/>
                          </Col>

                          <Col span={4}>
                            <Input placeholder = "Lat" name="lat" onChange={(e) => this.handleGeolat(e,4)}/>
                            <Input placeholder = "Long" name="lng" style={{marginTop:'16px'}} onChange={(e) => this.handleGeolat(e,4)}/>
                          </Col>
                          </Row>
                          
                          <Row style={{marginTop: '45px'}}>
                          <Col span={8} push={11}>
                            <Button type="primary" style={{width:'120px', height:'40px', fontSize:'18px'}} onClick={()=>this.handleGeofence()}>Add Points</Button>
                          </Col>
                        </Row>

                      </Col>
                    </Row>

                </Col>
              </Row>
            </div>

          </Content>
          
          <Footer style={{ textAlign: 'center' }}>
            TwentyThreeML Studios - 2018 @ AngelHack, Bengaluru
          </Footer>

        </Layout>
      </Layout>
		);
	}
}
