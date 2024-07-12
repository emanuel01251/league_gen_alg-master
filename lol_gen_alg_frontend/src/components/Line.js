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

const RechartsExample = ({ iteration_data }) => {
  return (
    <div>
    <h1>Average Champion’s Performance per Generation</h1>  
    <LineChart width={1500} height={500} data={iteration_data} className='center_div'>
      <Line type="monotone" dataKey="fitness" stroke="#2196F3" strokeWidth={1} />
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
