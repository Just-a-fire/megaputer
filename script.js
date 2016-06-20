window.onload = function() {	
	document.body.style.margin = '0';
	// document.body.style.overflowX = 'hidden';
}

// TODO
// сетка
// histogram -> diagram

// сделать всё в прототипе объекта, а остальное переделать если это instanceof Array

Array.prototype.draw = function() {
	if (this.length === 0) {
		console.log('nothing to draw');
		return;
	}

	// private functions
	var histogram = function(arr)
    {
        var source_histogram = arr;
		var s_length = source_histogram.length;
		var histogram = document.createElement('canvas');

		histogram.style.border = '1px solid #ccc';
		set_diagram_size(histogram);

		document.body.appendChild(histogram);
		var context = histogram.getContext("2d");

		var fill_style = '#5B9BD5';
		var stroke_style = '#333';

		var his_width = histogram.width/s_length;
		// var max_value = Math.max.apply(Math, source_histogram);

		var max_value = source_histogram.reduce(function(max, current){
			return Math.max(max, charToNum(current));
		}, 0);
		console.log(max_value);


		for (var i = 0; i < source_histogram.length; i++) {
			var current_item = charToNum(source_histogram[i]);
			var ry = (max_value - current_item)/max_value * histogram.height;
			var ry_ = current_item/max_value * histogram.height;
			// console.log(ry, max_value, source_histogram[0]);

			context.rect(his_width * i, ry, his_width, ry_);
			context.fillStyle = fill_style;
	      	context.fill();
	      	// context.lineWidth = 1;
			context.strokeStyle = stroke_style;
	      	context.stroke();
		};
    }

    var scatter_plot = function(arr)
    {
    	var source_histogram = arr;
		var s_length = source_histogram.length;
		var scatter = document.createElement('canvas');

		scatter.style.border = '1px solid #ccc';
		set_diagram_size(scatter);

		document.body.appendChild(scatter);
		var context = scatter.getContext("2d");

		var fill_style = 'green';
		var stroke_style = '#333';

		var his_width = scatter.width/s_length;

		var max_value = source_histogram.reduce(function(max, current){
			return Math.max(max, current.y);
		}, 0);

		console.log(max_value);

		// for (var i = 0; i < source_histogram.length; i++) {
		// 	var current_item = source_histogram[i];
		// 	var ry = (max_value - current_item.y)/max_value * scatter.height;

		// 	context.arc(his_width * i, ry, current_item.r, 0, 2 * Math.PI);
		// 	context.fillStyle = fill_style;
	 //      	context.fill();
		// 	context.strokeStyle = stroke_style;
	 //      	context.stroke();
		// };

		for (var i = 0; i < source_histogram.length; i++) {
			var current_item = source_histogram[i];
			var ry = (max_value - current_item.y)/max_value * scatter.height;

			context.beginPath();
			context.arc(his_width * i, ry, current_item.r, 0, 2 * Math.PI);
			context.fillStyle = fill_style;
	      	context.fill();
			context.strokeStyle = stroke_style;
	      	context.stroke();
		};
    }

    var stacked_bar_chart = function(arr)
    {
    	var source = arr;
		var s_length = source.length;
		var diagram = document.createElement('canvas');

		diagram.style.border = '1px solid #ccc';
		set_diagram_size(diagram);

		document.body.appendChild(diagram);
		var context = diagram.getContext("2d");

		// var fill_style = '#5B9BD5';
		var stroke_style = '#333';

		var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
		var colors = ['#3D5AAE', '#90B328', '#9C2910', '#FFCA39', '#00929F'];

		var max_value = source.reduce(function(max, chart){
			return Math.max(max, chart.reduce(function(sum, current, index){
				return index > 0 ? sum + current : sum;
			}, 0));
		}, 0);

		console.log(max_value);

		var charts = {};

		var charts_ = {};

		for (var i = 0; i < source.length; i++) {
			var current_item = source[i];
			var chart_count = charts[current_item[0]];
			charts[current_item[0]] = chart_count === undefined ? 1 : chart_count + 1;

			if (charts_[current_item[0]] === undefined) {
				charts_[current_item[0]] = [current_item.slice(1)];
			} else {
				charts_[current_item[0]].push(current_item.slice(1));
			}
		};

		console.log(charts);
		console.log(charts_);
		/////////////////////////////////////
		var chart_parts = 2, divide_parts = 1;
		var piece_count = 0 + divide_parts;
		for (chart in charts) {
			if (!charts.hasOwnProperty(chart)) continue;
			piece_count += charts[chart] * chart_parts;
			piece_count += divide_parts;			
		}
		piece_count += divide_parts;
		console.log(piece_count);
		var piece_width = diagram.width/piece_count;
		////////////////////////////////////////////
		var cur_x = piece_width * divide_parts;
		var index_start = 1;

		// for (var i = 0; i < source.length; i++) {
		// 	var current_item = source[i];
		// 	var cur_height = 0;
		// 	for (var j = index_start; j < current_item.length; ++j) {
		// 		var fill_style = colors[j - index_start];

		// 		var ry = (max_value - current_item[j])/max_value * diagram.height;
		// 		var ry_ = current_item[j]/max_value * diagram.height;

		// 		context.beginPath();
		// 		context.rect(cur_x, ry - cur_height, piece_width * chart_parts, ry_);
		// 		context.fillStyle = fill_style;
		//       	context.fill();
		// 		context.strokeStyle = stroke_style;
		//       	context.stroke();

		// 		cur_height += ry_;
		// 	}

	 //      	cur_x += piece_width * divide_parts + piece_width * chart_parts;
		// };

		for (var it in charts_) {
			var current_period_chart = charts_[it];

			for (var i = 0; i < current_period_chart.length; ++i) {
				var current_item = current_period_chart[i];

				var cur_height = 0;
				for (var j = 0; j < current_item.length; ++j) {
					var fill_style = colors[j % colors.length];

					var ry = (max_value - current_item[j])/max_value * diagram.height;
					var ry_ = current_item[j]/max_value * diagram.height;
					console.log(cur_x, ry, piece_width * chart_parts, ry_);

					context.beginPath();
					context.rect(cur_x, ry - cur_height, piece_width * chart_parts, ry_);
					context.fillStyle = fill_style;
			      	context.fill();
					context.strokeStyle = stroke_style;
			      	context.stroke();

					cur_height += ry_;
				}

				cur_x += piece_width * chart_parts;

			}

			cur_x += piece_width * divide_parts;

		}

    }
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////// вспомогательные функции /////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////

    function charToNum(char) {
		var parsed = parseInt(char, 10);
		if (parsed > 0)
			return parsed;
		return char.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
	}

	function set_diagram_size(diagram) {
		diagram.width = window.innerWidth
		|| document.documentElement.clientWidth
		|| document.body.clientWidth;
		diagram.height = window.innerHeight
		|| document.documentElement.clientHeight
		|| document.body.clientHeight;
		
		diagram.width -= 20;
	}

    var diagram_types = ['stacked bar chart', 'scatter plot', 'histogram'];
    var current_type = '';

 //    if (this instanceof Object && this instanceof Array === false) {
	// 	current_type = 'line chart';
	// 	console.log('line chart');
	// 	line_chart(this);
	// }
	if (this[0] instanceof Array) {
		current_type = 'stacked bar chart';
		console.log('stacked bar chart');
		stacked_bar_chart(this);
	}
	else if (this[0] instanceof Object) {
		current_type = 'scatter plot';
		console.log('scatter plot');
		scatter_plot(this);
	}
	else {
		current_type = 'histogram';
		console.log('histogram');
		histogram(this);
	}

}



Object.prototype.draw = function() {	
	if (this.length === 0) {
		console.log('nothing to draw');
		return;
	}


	var line_chart = function(obj)
    {
    	var source = obj;
		// var s_length = Object.keys(source).length;
		var diagram = document.createElement('canvas');

		diagram.style.border = '1px solid #ccc';
		diagram.width = window.innerWidth
		|| document.documentElement.clientWidth
		|| document.body.clientWidth;
		diagram.height = window.innerHeight
		|| document.documentElement.clientHeight
		|| document.body.clientHeight;

		diagram.width -= 20;

		document.body.appendChild(diagram);
		var context = diagram.getContext("2d");

		var fill_style = 'red';
		var stroke_style = '#333';

		// var his_width = diagram.width/s_length; // TODO replace

		var max_define = Object.keys(source).reduce(function(max, current){
			return Math.max(max, current);
		}, 0);

		var his_width = diagram.width/max_define;

		var max_value = Object.keys(source).reduce(function(max, current){
			return Math.max(max, source[current][1]);
		}, 0);

		console.log(max_define);
		
		// рисование линий, соединяющих точки
		var moved = false;
		for (i in source) {
			if (!parseInt(i, 10)) continue;
			var current_item = source[i];
			var ry = (max_value - current_item[1])/max_value * diagram.height;
			if (!moved) {
				context.moveTo(his_width * i, ry);
				moved = true;
			}
			context.lineTo(his_width * i, ry);
		};
		context.stroke();
		
		// рисование самих точек
		for (i in source) {
			if (!parseInt(i, 10)) continue;
			var current_item = source[i];
			var ry = (max_value - current_item[1])/max_value * diagram.height;
			

			context.beginPath();

			context.arc(his_width * i, ry, current_item[2], 0, 2 * Math.PI);
			context.fillStyle = fill_style;
	      	context.fill();
			context.strokeStyle = stroke_style;
	      	context.stroke();
		};

    }

	console.log('line chart');
    line_chart(this);
}