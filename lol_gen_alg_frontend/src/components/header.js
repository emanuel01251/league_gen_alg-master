import React from 'react';
import { Button, Typography } from 'antd';
const { Title } = Typography;
const { Text } = Typography;

export default class Header extends React.Component {

       render() {
         return (
            <div className="header_div">
              <Title> LoL DNA </Title>
              <div style={{margin: 10}}><Text> A Genetic Algorithm-Based Method for Team Composition in League of Legends </Text></div>
              <div style={{margin: 10}}>
                (Patch 10.3)
              </div>
            </div>
         )}
}
