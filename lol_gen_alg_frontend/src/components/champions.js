import React, { Component } from 'react';
import { Button, List, Input, Row, Col, Spin, Card, Statistic } from 'antd';
import {CloseOutlined, ArrowUpOutlined} from '@ant-design/icons';
import cloneDeep from 'lodash/cloneDeep';
import Mychart from './wr_chart.js'
import Options from './gen_alg_options.js'
import LineChart from './Line';

const { Meta } = Card;
const gen_alg = require("../gen_alg_logic/main.js");
const champion_json = require("../data/full_champion_data.json");
const winrate_data = require("../data/winrate_data.json");
const util = require("../helpers/util.js")
const all_champions = util.get_champion_list(champion_json)


export default class ChampionList extends Component{
	constructor(props) {
		super(props);
		this.state = {
			available_champs:all_champions,
			selected_champs: new Set(),
			returned_champs: [],
			loading: false,
			count:0,
			show_graph: false,
			graph_data: util.get_graph_data(winrate_data),
      		iteration_data: [],
			gen_alg: {
				meta: true,
				population: 100,
				generations: 100,
				crossover_rate: .4,
				mutation_rate: .8,
			}
		}
	}

	handle_filter(e){
		this.setState({
			available_champs: util.filter_champions(e.target.value, all_champions)
		})
	}

	change_meta(){
		this.setState({
			gen_alg:{
				...this.state.gen_alg,
				meta: !this.state.meta
			}
		})
	}

	update_gen_alg(value, name) {
		console.log(name, value)
		this.setState({
			gen_alg: {
				...this.state.gen_alg,
				[name]: value
			}
		}, () => {console.log(this.state.gen_alg)})
	}

	remove_champion(item){
		let champs = this.state.selected_champs;
		let reset_graphs = cloneDeep(this.state.graph_data.clear_data);
		champs.delete(item);
		this.setState({
			selected_champs: champs,
			returned_champs: [],
			graph_data: {
				...this.state.graph_data,
				team_wr: reset_graphs,
				final_team_wr: reset_graphs,
				counter_team_wr: reset_graphs
			}
		})
	}

	select_champion(item){
		let team_wr = cloneDeep(this.state.graph_data.clear_data);
		let champs = this.state.selected_champs;
		let size = champs.size;
		champs.add(item);
		if(champs.size === size) {
			champs.delete(item);
		}
		else if (champs.size > 5) {
			let first_champ = champs.values().next().value;
			champs.delete(first_champ);
			console.log(champs)
		}

		if (champs.size === 5) {
			team_wr = cloneDeep(this.state.graph_data.clear_data)
			// calcualte the avg_winrate of the teamcomp
			let winrate = util.get_team_percentile(champs)
			let index = Math.round((winrate-this.state.graph_data.x_low)/.1)
			team_wr[index].y = this.state.graph_data.frequencies[index].y
		}

		let reset_graphs = cloneDeep(this.state.graph_data.clear_data)

		this.setState({
			selected_champs: champs,
			returned_champs: [],
			graph_data: {
				...this.state.graph_data,
				team_wr: team_wr,
				final_team_wr: reset_graphs,
				counter_team_wr: reset_graphs
			}
		})
	}

	lock_team(){
		this.setState({loading: true}, () =>
      setTimeout(this.select_team.bind(this), 0)
    )
	}

	reset_teams(){
		let reset_graphs = cloneDeep(this.state.graph_data.clear_data)
		this.setState({
			returned_champs: [],
			selected_champs: new Set(),
			graph_data: {
				...this.state.graph_data,
				team_wr: reset_graphs,
				counter_team_wr: reset_graphs,
				final_team_wr: reset_graphs,
			}
		})
	}

	select_team(){
		// get champ ids
		let champion_ids = [];
		for (let item of this.state.selected_champs) {champion_ids.push(item.id)}

		// run gen alg
		let results = gen_alg.full_gen_alg(champion_ids, this.state.gen_alg)
		let team = results.champions

		// get graph info
		let counter_team_wr = cloneDeep(this.state.graph_data.clear_data)
		let final_team_wr = cloneDeep(this.state.graph_data.clear_data)

		// initial value
		let winrate = util.get_team_percentile(team)
		console.log(winrate)
		let index = Math.round((winrate-this.state.graph_data.x_low)/.1)
		counter_team_wr[index].y = this.state.graph_data.frequencies[index].y

		// final value
		winrate = util.get_final_team_percentile(team)
		index = Math.round((winrate-this.state.graph_data.x_low)/.1)
		final_team_wr[index].y = this.state.graph_data.frequencies[index].y

		this.setState(
			{
				loading: false,
				returned_champs:team,
				fitness: results.fitness,
        		iteration_data: results.iteration_data,
				graph_data: {
					...this.state.graph_data,
					counter_team_wr: counter_team_wr,
					final_team_wr: final_team_wr,
					
					graph_num_generations: results.graph_num_generations,
					graph_average_fitness: results.graph_average_fitness,
				}
			})
	}

	render(){
		return(
			<div className="box">
				<Input
					className="champion_input"
					placeholder="Search for a Champion"
					onChange={this.handle_filter.bind(this)}
				/>

				<Row gutter={5}>

					<Col style={{minHeight: "100%"}} className="box" xs={{span:24, order:2}} sm={{span:8, order:1}} lg={{span:6, order:1}}>
						{Array.from(this.state.selected_champs).map((champ)=>
							<Card key={champ.id} className="center_div" style={{marginBottom: 10}}>
					 			<Row gutter={5}>
					 				<Col span={5} className="center_div">
						 				<img className="sidebar_your_champ_image" alt={champ.name} src={require('../images/'+champ.name+'.png')}/>
					 				</Col>
					 				<Col span={15} className="center_div" style={{textAlign: "left"}}>
										<h3 style={{margin:0}}>{champ.name}</h3>
										<p style={{margin:0}}><b>{champ.total_games}</b> Total Games</p>
					 					<p style={{margin:0}}><b>{champ.overall_win_rate}%</b> WR</p>
				 					</Col>
									<Col className="center_div">
									<Button
										icon={<CloseOutlined/>}
										size="small"
										onClick={this.remove_champion.bind(this, champ)}
										type="danger"
										shape="circle"/>
									</Col>
					 			</Row>
							</Card>
				 		)}
					</Col>

					<Col style={{minHeight: "100%"}} className="box" xs={{span:24, order:1}} sm={{span:8, order:2}} lg={{span:12, order:2}}>
	            <div className="center_div">
	              <List className="champ_select"
						    grid={{
						      gutter: 0,
						      xs: 3,
						      sm: 3,
						      md: 4,
						      lg: 5,
						      xl: 5,
						      xxl: 6,
						    }}
						    dataSource={this.state.available_champs}
						    renderItem={item => (
					      		<List.Item onClick={this.select_champion.bind(this, item)}>
											<Card
												hoverable
												className="champion_select_box"
												cover={
										      <img
														style={{margin: "auto", padding: 5}}
														className="champ_select_image"
										        alt={item.name + "select"}
										        src={require('../images/'+item.name+'.png')}
										      />
										    }
											>
											<Meta title={item.name}/>
											</Card>
					      		</List.Item>
						    )}
					  		/>
								<div style={{margin: 5}}>
									<Button
										type="primary"
										shape="round"
										size="large"
										style={{margin: 5}}
										disabled = {this.state.selected_champs.size < 5 ? true : false}
										onClick={this.lock_team.bind(this)}
									>
										Lock In
									</Button>
									<Button
										type="default"
										shape="round"
										size="large"
										style={{margin: 5}}
										onClick={this.reset_teams.bind(this)}
									>
										Reset
									</Button>
									<Options params={this.state.gen_alg} update={this.update_gen_alg.bind(this)}/>
								</div>
            </div>
					</Col>

          { this.state.loading?
            <Col className="loading_div" xs={{span:24, order:4}} sm={{span:8, order:3}} lg={{span:6, order:3}}>
                <Spin size="large" />
            </Col>
            :
            <Col style={{minHeight: "100%"}} className="box" xs={{span:24, order:4}} sm={{span:8, order:3}} lg={{span:6, order:3}}>
							{ this.state.returned_champs.length > 0 ?
								<Card style={{marginBottom: 10}}>
									<Statistic
										title="Counter Pick Confidence"
										value={this.state.fitness * 100}
										precision={2}
										valueStyle={{ color: '#3f8600' }}
										prefix={<ArrowUpOutlined />}
										suffix="%"
									/>
								</Card> :
								null
							}

							{Array.from(this.state.returned_champs).map((champ)=>
								<Card key={champ.id} className="center_div" style={{marginBottom: 10}}>
	                <Row gutter={2}>

	                  <Col span={12} className="center_div">
	                    {Object.entries(champ.matchups).map(([id, enemy]) =>
	                      <Row key={id} gutter={3}>
	                        <Col span={3}>
	                          <img className="inline_champ_image" alt={champion_json[id].name} src={require('../images/'+champion_json[id].name+'.png')}/>
	                        </Col>
	                        <Col span={21}>
	                          <p style={{margin:0, textAlign: "left"}} key={id}><b>{enemy.games} games</b> | <b>{enemy.winrate}%</b> losing against  </p>
	                        </Col>
	                      </Row>
	                    )}
	                  </Col>

	                  <Col span={7} className="center_div" style={{textAlign: "right"}}>
	                    <h3 style={{margin:0}}>{champ.name}</h3>
						<p style={{margin:0}}><b>{champ.total_games}</b> Total Games</p>
	                    <p style={{margin:0}}><b>{champ.overall_win_rate}%</b> Winrate</p>
	                  </Col>

	                  <Col span={5} className="center_div">
	                    <img alt={champ.name} className="sidebar_enemy_champ_image" src={require('../images/'+champ.name+'.png')}/>
	                  </Col>

	                </Row>
								</Card>
              )}
            </Col>
          }

				</Row>
				
				<div className="center_div">
					<Mychart
						graph_data = {this.state.graph_data}
					/>
				</div>
				<LineChart iteration_data = {this.state.iteration_data}/>
			</div>
		)
	}
}
