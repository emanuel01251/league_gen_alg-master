import Chart from "react-apexcharts";
import React from 'react';


export default class Mychart extends React.Component {
       constructor(props) {
         super(props);
         this.state = {
           series: [
             {
               name: 'Frequency',
               type: 'area',
               data: this.props.graph_data.frequencies
             },
             {
               name: 'Percentile',
               type: 'scatter',
               data: this.props.graph_data.percentiles
             },
             {
               name: 'Selected Team’s Average Performance',
               type: 'scatter',
               data: this.props.graph_data.team_wr
             },
             {
               name: 'Calculated Team’s Average Performance',
               type: 'scatter',
               data: this.props.graph_data.counter_team_wr
             },
             {
               name: 'Calculated Team’s Performance vs. Selected Team',
               type: 'scatter',
               data: this.props.graph_data.final_team_wr
             }
           ],
           options: {
             title: {
               text: 'Team Composition Performance'
             },
             chart: {
               zoom: {
                 enabled: false
               },
               height: 350,
               toolbar: {
                 show: false,
               },
                fontFamily: 'Roboto Mono, monospace'
             },
             fill: {
               type:'solid',
               opacity: [0.35, 0.35, 1, 1, 1],
             },
             markers: {
               size: [0, 0, 7, 7, 7]
             },
             tooltip: {
              shared: true,
            },
             legend: {
               show: true,
               position: 'top',
               horizontalAlign: 'left'
             },
             xaxis: {
               type: 'numeric',
               labels: {
                 trim: false,
                 showDuplicates: false,
                 formatter: function(value, index){
                   return value.toFixed(1)
                 }
               },
               tickAmount: 10,
               title: {
                 text: "Win Rate",
                 offsetY: 10
               }
             },
             yaxis: {
               min: this.props.graph_data.y_low,
               max:this.props.graph_data.y_high,
             }
           }
         };
       }

       componentDidUpdate(prevProps) {
         if ((this.props.graph_data.team_wr !== prevProps.graph_data.team_wr) || (this.props.graph_data.counter_team_wr !== prevProps.graph_data.counter_team_wr)) {
           let series = JSON.parse(JSON.stringify(this.state.series));
           series[2].data = this.props.graph_data.team_wr
           series[3].data = this.props.graph_data.counter_team_wr
           series[4].data = this.props.graph_data.final_team_wr

           this.setState({
             series: series
           })
         }
       }

       render() {
         return (
           <div id="chart">
            <Chart options={this.state.options} series={this.state.series} type="line" height={350} />
           </div>
         )}
}
