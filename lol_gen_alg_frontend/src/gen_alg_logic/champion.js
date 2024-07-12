export default class Champion {
	constructor(id, name, matchups, overall_win_rate, total_games){
		this.id = id;
		this.name = name;
		this.matchups = matchups;
		this.overall_win_rate = overall_win_rate;
		this.total_games = total_games;

	}

	check_winrate(id_to_check){
		/*
        Given a champion ID and the current champions matchups,
        get back their win rate against the given champion.
        If there is no data for this champion return null
        :param id_to_check: ID to check as a string
        :return: Win rate as a float or None
		*/

		let z = 1.96;
		// let z = 1.645;
		var champion = this.matchups[id_to_check];
		if (champion === undefined) {
			return null;
		}
		var total_games = champion['games'];
		var p_initial = champion['winrate']/100;
		return p_initial - z * Math.sqrt((p_initial*(1-p_initial))/(total_games));

	}


}
