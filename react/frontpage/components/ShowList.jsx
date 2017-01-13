// ShowList.jsx

import React from 'react';

import { Link } from 'react-router';

import Loader from './Loader.jsx';

require('./ShowList.scss');

// order in which days appear
const scheduleDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
Implemented as a presentational component (view)

@prop schedule: show IDs -> {'Mon': [1, 15, 2], 'Tue': [2, 3, 4], ...}
@prop shows: show objects indexed by their ids
@prop fetching: currently fetching objects
@prop updateShows: callback to update all listed shows
**/
var ShowList = React.createClass({
	componentWillMount() {
		this.props.updateShows();
	},
	componentWillReceiveProps(nextProps) {
		if (nextProps.shows) {
			var sorted = sortedShows(nextProps.shows);
			this.setState({
				schedule: sorted
			});
		}
	},
	getInitialState() {
		return {
			schedule: []
		}
	},
	urlFromShow(show) {
		return "/shows/" + show.id;
	},
	render() {
		return (
			<div className="showList">
				{ this.props.fetching && this.props.shows.length == 0 ?
					<Loader />
				:
				  this.state.schedule.map((show) => (
						<div key={show.id}>
							<Link to={this.urlFromShow(show)}>
								<h3>{show.day + " " + show.time + ": "}{show.title}</h3>
							</Link>
							<p>{show.blurb}</p>
							<br />
						</div>
					))
				}
			</div>
		);
	}
});

// shows sorted by day, then time
const sortedShows = (shows) => {
	// clone shows and sort
	var sorted = shows.slice(0);
	sorted.sort(
		function(a, b) {
			if (a.day !== b.day) {
				return scheduleDays.indexOf(a.day) - scheduleDays.indexOf(b.day);
			} else {
				return militaryTime(a.time) - militaryTime(b.time);
			}
		});
	return sorted;
};

// converts time string to military time number
// "8pm" -> 20
// "12am" -> 0
const militaryTime = (time) => {
	var hour = Number(time.replace(/[^0-9]+/g, "")) % 12;
	if (time.indexOf("p") >= 0) {
		hour += 12;
	}
	return hour;
};

export default ShowList;