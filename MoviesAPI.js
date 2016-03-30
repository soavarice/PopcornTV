var logger = require("./logger");
trakTVHeader = {
	    	'Content-Type': 'application/json',
	    	'trakt-api-version': '2',
	    	'trakt-api-key': '634453426f25dcdb0cb3bdc2697a5b35562b2b2f17e5e42d86007434c8aa73d3'
	    };
function getMovies(page, sort_by, amount, callback) {
	var request = require("request")
	
	var url = "https://yts.ag/api/v2/list_movies.json?sort_by=" + sort_by + "&limit=" + amount + "&page=" + page;
	logger.Debug("=== Getting Movies ===");
	logger.Debug(url);
	request({
	    url: url,
	    json: true
	}, function (error, response, body) {
 	   if (!error && response.statusCode === 200) {
	        var movies = body.data.movies;
	        logger.Debug(movies);
	        callback(movies);
	    } else {
			logger.warning("Error connecting to api-fetch and grabbing json: " + url);
			return;
	    }
	})
}
function getMoviesGenre(genre, amount, callback) {
	var page = 1;
	var request = require("request")

	var url = "https://yts.ag/api/v2/list_movies.json?genre=" + genre + "&limit=" + amount + '&sort_by=seeds';
	logger.Debug("=== Getting Movies via Genre ===");
	logger.Debug(url);
	request({
	    url: url,
	    json: true
	}, function (error, response, body) {
 	   if (!error && response.statusCode === 200) {
	        var movies = body.data.movies;
	        logger.Debug(movies);
	        callback(movies);
	    } else {
			logger.warning("Error connecting to api-fetch and grabbing json: " + url);
			return;
	    }
	})
}
function getMovieWithFanart(torrentID, resolution, callback) {
	var page = 1;
	var request = require("request")

	var url = "https://yts.ag/api/v2/movie_details.json?with_images=true&with_cast=true&movie_id=" + torrentID;
	logger.Debug("=== Getting Movie ===");
	logger.Debug(url);
	request({
	    url: url,
	    json: true
	}, function (error, response, body) {
 	   if (!error && response.statusCode === 200) {
	        var movie = body.data;
	        logger.Debug(movie.movie.imdb_code);
	        var Fan = require('./fanartGenerator')
	        try {
	        	Fan.generateFanart(movie.movie.imdb_code, resolution, function(url){
	        		logger.Debug("attempting callback in Fan.generateFanart");
					callback(movie, url);
				});
	        } catch(e) {
	        	movie['rt_audience_score'] = '50';
	        	callback(movie.movie, 'thumbnails/Background_blank_1080.jpg');
	        }
	    } else {
			logger.warning("Error connecting to api-fetch and grabbing json: " + url);
			return;
	    }
	})
}
function getMovie(torrentID, callback) {
	var page = 1;
	var request = require("request")

	var url = "https://yts.ag/api/v2/movie_details.json?with_images=true&with_cast=true&movie_id=" + torrentID;
	logger.Debug("=== Getting Movie ===");
	logger.Debug(url);
	request({
	    url: url,
	    json: true
	}, function (error, response, body) {
 	   if (!error && response.statusCode === 200) {
	        var movie = body.data;
	        logger.Debug(movie);
			callback(movie);
	    } else {
			logger.warning("Error connecting to api-fetch and grabbing json: " + url);
			return;
	    }
	})
}
function searchMovies(query, callback) {
	var page = 1;
	var request = require("request")

	var url = "https://yts.ag/api/v2/list_movies.json?sort_by=seeds&query_term=" + query;
	logger.Debug("=== Searching Movies ===");
	logger.Debug(url);
	request({
	    url: url,
	    json: true
	}, function (error, response, body) {
 	   if (!error && response.statusCode === 200) {
	        var movies = body.data.movies;
	        logger.Debug(movies);
	        callback(movies);
	    } else {
			logger.warning("Error connecting to api-fetch and grabbing json: " + url);
			return;
	    }
	})
}
function getFanart(imdb, callback){
	var request = require('request');
	var url = 'https://api-v2launch.trakt.tv/movies/' + imdb + '?extended=images';
	logger.Debug("=== Getting Fanart ===");
	logger.Debug(url);
	request({
	    url: url,
	    json: true,
	    headers: trakTVHeader
		}, function (error, response, body) {
 	   if (!error && response.statusCode === 200) {
	        var fanart = body.images.fanart.full;
	        logger.Debug(fanart);
	        callback(fanart);
	    } else {
			logger.warning("Error connecting to trakt.tv and grabbing json: " + url);
			return;
	    }
	})
}
function getRelatedMovies(movie_id, callback) {
	var page = 1;
	var request = require("request")

	var url = "https://yts.ag/api/v2/movie_suggestions.json?movie_id=" + movie_id;
	logger.Debug("=== Getting Related Movies ===");
	logger.Debug(url);
	request({
	    url: url,
	    json: true
	}, function (error, response, body) {
 	   if (!error && response.statusCode === 200) {
	        var movies = body.data.movies;
	        logger.Debug(movies);
	        callback(movies);
	    } else {
			logger.warning("Error connecting to api-fetch and grabbing json: " + url);
			return;
	    }
	})
}
function generateScreenSaverJSON(callback){
	var request = require("request")
	var url = "https://yts.ag/api/v2/list_movies.json?sort_by=seeds&limit=50";
	logger.Debug("=== Getting Movies ===");
	logger.Debug(url);

	request({
	    url: url,
	    json: true
	}, function (error, response, body) {
 	   if (!error && response.statusCode === 200) {
	        var movies = body.data.movies;
	        logger.Debug(movies);
	        var json = [];
	        movies.forEach(function(movie){
	        	json.push({
	        		type: 'photo',
	        		id: 'photo_' + movie.id,
	        		assets: [{
	        			width: 406,
	        			height: 600,
	        			src: movie.medium_cover_image
	        		}]
	        	})
	        });
	        logger.Debug(json);
	        callback(JSON.stringify(json));
	    } else {
			logger.warning("Error connecting to api-fetch and grabbing json: " + url);
			return;
	    }
	})
}

/*function getActorsMoviesByIMDB(actorID, callback){
	var request = require("request");
	var url = "https://api-v2launch.trakt.tv/people/nm" + actorID  + "/movies";
	logger.Debug("=== Getting Fanart ===");
	logger.Debug(url);
	request({
	    url: url,
	    json: true,
	    headers: trakTVHeader
		}, function (error, response, body) {
 	   if (!error && response.statusCode === 200) {
	        var cast = body.cast;
	        var movies;
	        for(var i = 0; i < cast.length; i++)
	        {
	        	
	        }
	        logger.Debug(cast);
	        callback(cast);
	    } else {
			logger.warning("Error connecting to trakt.tv and grabbing json: " + url);
			return;
	    }
	})
}*/

exports.getMovies = getMovies;
exports.getMovie = getMovie;
exports.getMovieWithFanart = getMovieWithFanart;
exports.searchMovies = searchMovies;
exports.getFanart = getFanart;
exports.getRelatedMovies = getRelatedMovies;
exports.getMoviesGenre = getMoviesGenre;
exports.generateScreenSaverJSON = generateScreenSaverJSON;
//exports.getActorsMoviesByIMDB = getActorsMoviesByIMDB;