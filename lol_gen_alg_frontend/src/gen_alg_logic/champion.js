export default class Champion {
	constructor(id, name, matchups, overall_win_rate, total_games){
		this.id = id;
		this.name = name;
		this.matchups = matchups;
		this.overall_win_rate = overall_win_rate;
		this.total_games = total_games;

	}
	//confidence score
	check_winrate(id_to_check){
		let z = 1.96;
		var champion = this.matchups[id_to_check];
		if (champion === undefined) {
			return null;
		}
		var total_games = champion['games'];
		var p_initial = champion['winrate']/100;
		return p_initial - z * Math.sqrt((p_initial*(1-p_initial))/(total_games));
	}


}
