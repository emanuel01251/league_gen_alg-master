function product_Range(a,b) {
  var prd = a,i = a;

  while (i++< b) {
    prd*=i;
  }
  return prd;
}


export function ncr(n, r)
{
  if (n === r)
  {
    return 1;
  }
  else
  {
    r=(r < n-r) ? n-r : r;
    return product_Range(r+1, n)/product_Range(1,n-r);
  }
}

export function filter_champions(filter, champion_list){
	if (filter.trim() === "") {
		return champion_list;
	}
	else {
		filter = filter.toLowerCase();
		let filtered_list = [];
		champion_list.forEach(function(item, index){
			if (item.name.toLowerCase().includes(filter)){
				filtered_list.push(item);
			}
		})
		return filtered_list;
	}
}

export function get_graph_data(winrate_data){
  let frequencies = []
  let percentiles = []
  let team_wr = []
  let total_comps = ncr(148,5)
  let percentile = 0
  let x_low = 60;
  let x_high = 40;
  let y_low = 100;
  let y_high = 0;
  for (var i in winrate_data) {

  	// include non 0 data
    let val = Math.round(winrate_data[i]['total']/total_comps * 10000) / 100
    percentile = Math.round((percentile + val) * 1000)/1000

		// get the high and low x values
		if (winrate_data[i]['winrate'] < x_low){
			x_low = winrate_data[i]['winrate']
		}
		if (winrate_data[i]['winrate'] > x_high){
			x_high = winrate_data[i]['winrate']
		}

		// get the high and low y values
		if (val < y_low){
			y_low = val
		}
		if (val > y_high){
			y_high = val
		}

		// get percentiles as another datapoint
		percentiles.push({
			y: percentile,
			x: winrate_data[i]['winrate'],
		})

		// get frequencies and save as datapoint
		frequencies.push({
			y: val,
			x: winrate_data[i]['winrate'],
		})

    // get team wrs and save as datapoint
		team_wr.push({
			y: null,
			x: winrate_data[i]['winrate'],
		})
  }
  return {
      clear_data: team_wr,
      frequencies: frequencies,
      percentiles: percentiles,
      team_wr: team_wr,
      counter_team_wr: team_wr,
      final_team_wr: team_wr,
      x_high: x_high,
      x_low: x_low,
      y_high: y_high,
      y_low: y_low
  }
}

export function get_champion_list(champion_json){
  let champion_list = [];
  for (var id in champion_json) {
  	champion_list.push({
  		id: id,
  		name: champion_json[id].name,
  		total_games: champion_json[id].total_games,
  		overall_win_rate: champion_json[id].overall_win_rate
  	});
  }
  champion_list.sort((a,b) => (a.name > b.name) ? 1:-1)
  return champion_list
}

export function get_team_percentile(champions){
  /*
  Given the team wr dataset, and the list of champions,
  calculate the average winrate and what bin to drop the data point in
  */
  let avg_winrate = 0
  for (var champ of champions) {
    avg_winrate += champ.overall_win_rate;
  }
  return Math.round(avg_winrate/5 * 10)/10
}

export function get_final_team_percentile(champions){
  /*
  Given the result from the gen alg, averages the counter pick
  winrates to get an overall winrate for this team against
  the given set of champions
  */
  let avg_winrate = 0;
  for (var champ of champions) {
    var temp_winrate = 0;
    var count = 0;
    for (var id in champ.matchups) {

      temp_winrate += champ.matchups[id].winrate;
      count += 1
    }
    avg_winrate += temp_winrate/count;
  }
  avg_winrate = avg_winrate / champions.length;
  return Math.round(avg_winrate * 10)/10;
}
