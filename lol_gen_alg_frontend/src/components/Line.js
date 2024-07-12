import React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { generations: "2017", fitness: 32 },
  { generations: "2018", fitness: 42 },
  { generations: "2019", fitness: 51 },
  { generations: "2020", fitness: 60 },
  { generations: "2021", fitness: 51 },
  { generations: "2022", fitness: 95 }
];

const RechartsExample = ({ iteration_data }) => {
  return (
    <div>
    <h1>Average Champion’s Performance per Generation</h1>  
    <LineChart width={1000} height={500} data={iteration_data} className='center_div'>
      <Line type="monotone" dataKey="fitness" stroke="#2196F3" strokeWidth={3} />
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="generations" />
      <YAxis />
      <Tooltip />
      <Legend />
    </LineChart>
    </div>
    
  );
};

export default RechartsExample;
