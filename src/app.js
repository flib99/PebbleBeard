/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */
var Settings = require('settings');
var UI = require('ui');
var ajax = require("ajax");

Settings.config(
  { url: 'http://joshwalls.co.uk/pebblebeard' },
  function(e) {
    console.log('closed configurable');

    // Show the parsed response
    console.log(JSON.stringify(e.options));
	
	Settings.option('ip', e.options.ip);
	Settings.option('port', e.options.port);
	Settings.option('key', e.options.key);
	

    // Show the raw response if parsing failed
    if (e.failed) {
      console.log(e.response);
    }
  }
);



var ip = Settings.option('ip');
var port = Settings.option('port');
var key = Settings.option('key');


var address = "http://" + ip + ":" + port + "/api/" + key + "/";

var todayArray = [];
var soonArray = [];
var laterArray = [];
var missedArray = [];
var snatchedArray = [];
var downloadedArray = [];

var date;
var time;

var weekday = [];
weekday[0] = "Sun";
weekday[1] = "Mon";
weekday[2] = "Tue";
weekday[3] = "Wed";
weekday[4] = "Thu";
weekday[5] = "Fri";
weekday[6] = "Sat";

var splash = new UI.Card({
  title: 'PebbleBeard',
  subtitle: 'SickBeard for your Pebble',
  body: 'Loading...'
});

var errorCard = new UI.Card({
	title: "Error",
	subtitle: "Could not connect to SickBeard",
	body: "Check your config"
});

splash.show();




ajax(
{
	url: address,
	type: "json"
},
function(data)
{
	if (data.result != "success")
		{
			errorCard.show();
		}
	console.log("Success");
		
},
function(error)
{
	errorCard.show();
}
);

var menuArray = [
	{
		title: "Airing Today"
	},
	{
		title: "Airing Soon"
	},
	{
		title: "Airing Later"
	},
	{
		title: "Missed"
	},
	{
		title: "Recently Snatched"
	},
	{
		title: "Recently Downloaded"
	},
	{
		title: "Functions"
	}
];

var menu = new UI.Menu({
	sections: [{
		title: "Menu",
		items: menuArray
	}]
});

var functionArray = [
	{
		title: "Post Process"
	},
	{
		title: "Force Search"
	}
];

var functionMenu = new UI.Menu({
	sections: [{
		title: "Functions",
		items: functionArray
	}]
});


menu.show();
splash.hide();

menu.on("select", function(e) {
	if (e.item.title == "Airing Today")
		{
			ajax(
			{
				url: address + "?cmd=future&sort=date&type=today",
				type: "json"
			},
			function(data)
			{	
				todayArray = [];
				
				
				for(var i in data.data.today)
					{
						
						todayArray.push(
							{
								title: (data.data.today[i].show_name),
								subtitle: "S" + (data.data.today[i].season) + "E" + (data.data.today[i].episode) + " - " + (data.data.today[i].ep_name)
							});
					}
				
				var todayMenu = new UI.Menu({
					sections: [{
						title: "Today",
						items: todayArray
					}]
				});
				
				todayMenu.show();
				
				todayMenu.on("select", function(e) {
					var j = e.itemIndex;
					console.log(j);
					var todayInfo = new UI.Card({
						title: data.data.today[j].show_name,
						subtitle: "S" + (data.data.today[j].season) + "E" + (data.data.today[j].episode),
						body: data.data.today[j].ep_plot,
						scrollable: true,
						style: "small"
					});
					todayInfo.show();
				});
				
			},
			function (error)
			{
				console.log(error);
			}
			);
		}
	else if (e.item.title == "Airing Soon")
		{
			ajax(
			{
				url: address + "?cmd=future&sort=date&type=soon",
				type: "json"
			},
			function(data)
			{	
				soonArray = [];
				
				for(var i in data.data.soon)
					{
						date = (data.data.soon[i].airdate).split('-');
						time = new Date(date[1] + '/' + date[2] + '/' + date[0]);
						
						
						
						soonArray.push(
							{
								title: (data.data.soon[i].show_name),
								subtitle: "S" + (data.data.soon[i].season) + "E" + (data.data.soon[i].episode) + " - " + (data.data.soon[i].ep_name) + " - " + weekday[time.getUTCDay()]
							});
					}
				
				var soonMenu = new UI.Menu({
					sections: [{
						title: "Soon",
						items: soonArray
					}]
				});
				
				soonMenu.show();
				
				soonMenu.on("select", function(e) {
					var j = e.itemIndex;
					console.log(j);
					var soonInfo = new UI.Card({
						title: data.data.soon[j].show_name,
						subtitle: "S" + (data.data.soon[j].season) + "E" + (data.data.soon[j].episode),
						body: data.data.soon[j].ep_plot,
						scrollable: true,
						style: "small"
					});
					soonInfo.show();
				});
				
			},
			function (error)
			{
				console.log(error);
			}
			);
		}
	else if (e.item.title == "Airing Later")
		{
			ajax(
			{
				url: address + "?cmd=future&sort=date&type=later",
				type: "json"
			},
			function(data)
			{	
				laterArray = [];
				
				for(var i in data.data.later)
					{
						date = (data.data.later[i].airdate).split('-');
						time = date[2] + '/' + date[3];
						
						laterArray.push(
							{
								title: (data.data.later[i].show_name),
								subtitle: "S" + (data.data.later[i].season) + "E" + (data.data.later[i].episode) + " - " + (data.data.later[i].ep_name) + " - " + time
							});
					}
				
				var laterMenu = new UI.Menu({
					sections: [{
						title: "Later",
						items: laterArray
					}]
				});
				
				laterMenu.show();
				
				laterMenu.on("select", function(e) {
					var j = e.itemIndex;
					console.log(j);
					var laterInfo = new UI.Card({
						title: data.data.later[j].show_name,
						subtitle: "S" + (data.data.later[j].season) + "E" + (data.data.later[j].episode),
						body: data.data.later[j].ep_plot,
						scrollable: true,
						style: "small"
					});
					laterInfo.show();
				});
				
			},
			function (error)
			{
				console.log(error);
			}
			);
		}
	else if (e.item.title == "Missed")
		{
			ajax(
			{
				url: address + "?cmd=future&sort=date&type=missed",
				type: "json"
			},
			function(data)
			{	
				missedArray = [];
				
				for(var i in data.data.missed)
					{
						date = (data.data.missed[i].airdate).split('-');
						time = new Date(date[1] + '/' + date[2] + '/' + date[0]);
						
						missedArray.push(
							{
								title: (data.data.missed[i].show_name),
								subtitle: "S" + (data.data.missed[i].season) + "E" + (data.data.missed[i].episode) +  " - " + (data.data.missed[i].ep_name) + " - Last " + weekday[time.getUTCDay()]
							});
					}
				
				var missedMenu = new UI.Menu({
					sections: [{
						title: "Missed",
						items: missedArray
					}]
				});
				
				missedMenu.show();
				
				missedMenu.on("select", function(e) {
					var j = e.itemIndex;
					console.log(j);
					var missedInfo = new UI.Card({
						title: data.data.missed[j].show_name,
						subtitle: "S" + (data.data.missed[j].season) + "E" + (data.data.missed[j].episode),
						body: data.data.missed[j].ep_plot,
						scrollable: true,
						style: "small"
					});
					missedInfo.show();
				});
				
			},
			function (error)
			{
				console.log(error);
			}
			);
		}
	else if (e.item.title == "Functions")
		{
			functionMenu.show();
			
			functionMenu.on("select", function(e) {
				var success = new UI.Card({
						title: "It worked!"
					});
				var error = new UI.Card({
						title: "It didn't work",
						body: "Force Search may not work on all configs of SickBeard"
					});
				if (e.item.title == "Force Search")
					{
						ajax(
						{
							url: address + "?cmd=sb.forcesearch",
							type: "json"
						},
						function(data)
						{
							if (data.result == "success")
								{
									success.show();
								}
							else
								{
									error.show();
								}
						},
						function(error)
						{
							error.show();
						});
					}
				else if (e.item.title == "Post Process")
					{
						ajax(
						{
							url: address + "?cmd=postprocess",
							type: "json"
						},
						function(data)
						{
							if (data.result == "success")
								{
									success.show();
								}
							else
								{
									error.show();
								}
						},
						function(error)
						{
							error.show();
						});
					}
			});
		}
	else if (e.item.title == "Recently Snatched")
		{
			ajax(
			{
				url: address + "?cmd=history&limit=10&type=snatched",
				type: "json"
			},
			function(data)
			{	
				snatchedArray = [];
				
				for(var i in data.data)
					{
						
						
						snatchedArray.push(
							{
								title: (data.data[i].show_name),
								subtitle: "S" + (data.data[i].season) + "E" + (data.data[i].episode)
							});
					}
				
				var snatchedMenu = new UI.Menu({
					sections: [{
						title: "Snatched",
						items: snatchedArray
					}]
				});
				
				snatchedMenu.show();
				
				snatchedMenu.on("select", function(e) {
					var j = e.itemIndex;
					console.log(j);
					var snatchedInfo = new UI.Card({
						title: data.data[j].show_name,
						subtitle: "S" + (data.data[j].season) + "E" + (data.data[j].episode),
						body: "From: " + data.data[j].provider + "\nQuality: " + data.data[j].quality + "\nName: " + data.data[j].resource,
						scrollable: true,
						style: "small"
					});
					snatchedInfo.show();
				});
				
			},
			function (error)
			{
				console.log(error);
			}
			);
		}
	else if (e.item.title == "Recently Downloaded")
		{
			ajax(
			{
				url: address + "?cmd=history&limit=10&type=downloaded",
				type: "json"
			},
			function(data)
			{	
				downloadedArray = [];
				
				for(var i in data.data)
					{
						
						
						downloadedArray.push(
							{
								title: (data.data[i].show_name),
								subtitle: "S" + (data.data[i].season) + "E" + (data.data[i].episode)
							});
					}
				
				var downloadedMenu = new UI.Menu({
					sections: [{
						title: "Downloaded",
						items: downloadedArray
					}]
				});
				
				downloadedMenu.show();
				
				downloadedMenu.on("select", function(e) {
					var j = e.itemIndex;
					console.log(j);
					var downloadedInfo = new UI.Card({
						title: data.data[j].show_name,
						subtitle: "S" + (data.data[j].season) + "E" + (data.data[j].episode),
						body: "From: " + data.data[j].provider + "\nQuality: " + data.data[j].quality + "\nName: " + data.data[j].resource,
						scrollable: true,
						style: "small"
					});
					downloadedInfo.show();
				});
				
			},
			function (error)
			{
				console.log(error);
			}
			);
		}
});