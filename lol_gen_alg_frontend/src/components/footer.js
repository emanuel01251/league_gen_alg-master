import React from 'react';
import { Typography, Layout } from 'antd';

const { Text, Title } = Typography;
const { Content } = Layout;

export default class Footer extends React.Component {

       render() {
         return (
            <div ref={this.props.location}>
              <Layout className="footer_div">
                
              </Layout>
            </div>
         )}
}
