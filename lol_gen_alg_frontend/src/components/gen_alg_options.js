import React from 'react';
import { Row, Col, Checkbox, Slider, InputNumber, Collapse } from 'antd';

const { Panel } = Collapse;

export default class Mychart extends React.Component {
   render() {
     return (
       <Collapse bordered={false} style={{textAlign: "left", margin: 10}}>
         <Panel style={{borderBottomWidth: "0px"}} header="Advanced Options" key="1">
           <div className="center_div" style={{textAlign: 'left'}}>
             <Row  style={{marginBottom: 10}}>
               {/* <Col span={12}>
                 <Checkbox onChange={() => this.props.update(!this.props.params.meta, "meta")} checked={this.props.params.meta}>Meta Team Comp?</Checkbox>
               </Col> */}
             </Row>
             <p style={{margin: 0}}> Population Size </p>
             <Row style={{marginBottom: 10}}>
               <Col span={8}>
                 <Slider min={50} max={200} step={5} value={this.props.params.population} onChange={(value) => this.props.update(value, "population")}/>
               </Col>
               <Col span={4}>
                 <InputNumber min={50} max={200} step={5} value={this.props.params.population} onChange={(value) => this.props.update(value, "population")}/>
               </Col>
             </Row>
             <p style={{margin: 0}}> Number of Generations </p>
             <Row style={{marginBottom: 10}}>
               <Col span={8}>
                 <Slider min={10} max={1000} step={10} value={this.props.params.generations} onChange={(value) => this.props.update(value, "generations")}/>
               </Col>
               <Col span={4}>
                 <InputNumber min={10} max={1000} step={10} value={this.props.params.generations} onChange={(value) => this.props.update(value, "generations")}/>
               </Col>
             </Row>
             <p style={{margin: 0}}> Crossover Rate </p>
             <Row style={{marginBottom: 10}}>
               <Col span={8}>
                 <Slider min={0} max={1} step={0.01} value={this.props.params.crossover_rate} onChange={(value) => this.props.update(value, "crossover_rate")}/>
               </Col>
               <Col span={4}>
                 <InputNumber min={0} max={1} step={0.01} value={this.props.params.crossover_rate} onChange={(value) => this.props.update(value, "crossover_rate")}/>
               </Col>
             </Row>
             <p style={{margin: 0}}> Mutation Rate </p>
             <Row style={{marginBottom: 10}}>
               <Col span={8}>
                 <Slider min={0} max={1} step={0.01} value={this.props.params.mutation_rate} onChange={(value) => this.props.update(value, "mutation_rate")}/>
               </Col>
               <Col span={4}>
                 <InputNumber min={0} max={1} step={0.01} value={this.props.params.mutation_rate} onChange={(value) => this.props.update(value, "mutation_rate")}/>
               </Col>
             </Row>
             <p><i> warning: the higher the values, the longer the calculations will take.</i></p>

           </div>
         </Panel>
       </Collapse>
     )
   }
}
