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
        var source = arr;
		var s_length = source.length;
		var diagram = document.createElement('canvas');

		diagram.style.border = '1px solid #ccc';
		set_diagram_size(diagram);

		document.body.appendChild(diagram);
		var context = diagram.getContext("2d");

		var fill_style = '#5B9BD5';
		var stroke_style = '#333';

		var vertical_scale_width = 40;
		var diagram_right_margin = 30;
		var diagram_pure_width = diagram.width - vertical_scale_width - diagram_right_margin;

		var diagram_top_margin = 20;
		var diagram_pure_height = diagram.height - diagram_top_margin;

		var his_width = diagram_pure_width/s_length;

		var max_value = source.reduce(function(max, current){
			return Math.max(max, charToNum(current));
		}, 0);

		var vertical_scale_margin = 30;
		// рисование линии вертикальной шкалы
		context.moveTo(vertical_scale_margin, 0); // + diagram_top_margin
		context.lineTo(vertical_scale_margin, diagram_pure_height + diagram_top_margin);

		var scale_size = diagram_pure_height;

		// рисование вертикальной шкалы
		var step_params = getScaleStep(max_value, scale_size);

		context.font = "12px sans-serif";

		var cur_val = 0;
		var cur_px = scale_size;

		while (cur_val < max_value)
		{
			cur_val += step_params.value;
			cur_px -= step_params.px;
			context.fillText(cur_val, 2, cur_px + 4 + diagram_top_margin);
			context.moveTo(vertical_scale_margin, cur_px + diagram_top_margin);
			context.lineTo(20, cur_px + diagram_top_margin);
		}
		context.stroke();

		function vert_scale(vertical_scale_width) {
			
		}

		// рисование самой гистограммы
		for (var i = 0; i < source.length; i++) {
			var current_item = charToNum(source[i]);
			var ry = (max_value - current_item)/max_value * diagram_pure_height
			var ry_ = current_item/max_value * diagram_pure_height;

			context.rect(vertical_scale_width + his_width * i, ry + diagram_top_margin, his_width, ry_);
			context.fillStyle = fill_style;
	      	context.fill();
	      	// context.lineWidth = 1;
			context.strokeStyle = stroke_style;
	      	context.stroke();
		};
    }

    var scatter_plot = function(arr)
    {
    	var source = arr;
		var s_length = source.length;
		var diagram = document.createElement('canvas');

		diagram.style.border = '1px solid #ccc';
		set_diagram_size(diagram);

		document.body.appendChild(diagram);
		var context = diagram.getContext("2d");

		var fill_style = 'green';
		var stroke_style = '#333';

		var vertical_scale_width = 40;
		var diagram_right_margin = 30;
		var diagram_pure_width = diagram.width - vertical_scale_width - diagram_right_margin;

		var horizontal_scale_width = 40;
		var diagram_top_margin = 20;
		var diagram_pure_height = diagram.height - horizontal_scale_width - diagram_top_margin;

		// var his_width = diagram.width/s_length;

		var max_value = source.reduce(function(max, current){
			return Math.max(max, current.y);
		}, 0);

		var max_define = source.reduce(function(max, current){
			return Math.max(max, current.x);
		}, 0);		

		// рисование вертикальной шкалы

		var vertical_scale_margin = 40; // 30
		// рисование линии вертикальной шкалы
		context.moveTo(vertical_scale_margin, 0); // + diagram_top_margin
		context.lineTo(vertical_scale_margin, diagram_pure_height + diagram_top_margin);

		var scale_size_y = diagram_pure_height;
		var step_params_y = getScaleStep(max_value, scale_size_y);

		context.font = "12px sans-serif";

		var cur_val_y = 0;
		var cur_px_y = scale_size_y;

		while (cur_val_y < max_value)
		{
			cur_val_y += step_params_y.value; // TODO: выходит за пределы, т.к. увеличивается перед рисованием
			cur_px_y -= step_params_y.px;
			context.fillText(cur_val_y, 2, cur_px_y + 4 + diagram_top_margin);
			context.moveTo(vertical_scale_margin, cur_px_y + diagram_top_margin);
			context.lineTo(20, cur_px_y + diagram_top_margin);
			// это рисование не только шкалы, но и сетки, причем значение десятых долей пикселя cur_px_y надо приводить ближе к 0.5
			// console.log('cur_val_y', cur_val_y, 'cur_px_y', cur_px_y);
			// context.moveTo(20, cur_px_y);
			// context.lineTo(diagram_pure_width + vertical_scale_margin, cur_px_y);
		}
		context.stroke();

		// рисование горизонтальной шкалы

		var horizontal_scale_margin = 30;
		// рисование линии горизонтальной шкалы
		context.moveTo(vertical_scale_margin, diagram_pure_height + diagram_top_margin);
		context.lineTo(diagram_pure_width + vertical_scale_margin + diagram_right_margin, diagram_pure_height + diagram_top_margin);

		var scale_size_x = diagram_pure_width;
		var step_params_x = getScaleStep(max_define, scale_size_x);

		context.font = "12px sans-serif";
		context.textAlign = "center";

		var cur_val_x = 0;
		var cur_px_x = 0;

		while (cur_val_x < max_define)
		{
			cur_val_x += step_params_x.value;
			cur_px_x += step_params_x.px;
			context.fillText(cur_val_x, cur_px_x + vertical_scale_margin, diagram_pure_height + 10 + 12 + diagram_top_margin);
			context.moveTo(cur_px_x + vertical_scale_margin, diagram_pure_height + diagram_top_margin);
			context.lineTo(cur_px_x + vertical_scale_margin, diagram_pure_height + 10 + diagram_top_margin);
		}
		context.stroke();

		// рисование самих точек
		for (var i = 0; i < source.length; i++) {
			var current_item = source[i];
			var ry = (max_value - current_item.y)/max_value * diagram_pure_height;
			context.beginPath();
			context.arc(vertical_scale_width + current_item.x / max_define * diagram_pure_width, ry + diagram_top_margin, current_item.r, 0, 2 * Math.PI);
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

		var stroke_style = '#333';

		var vertical_scale_width = 40;
		var diagram_right_margin = 30;
		var diagram_pure_width = diagram.width - vertical_scale_width - diagram_right_margin;

		var horizontal_scale_width = 40;
		var diagram_top_margin = 20;
		var diagram_pure_height = diagram.height - horizontal_scale_width - diagram_top_margin;

		var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
		var colors = ['#3D5AAE', '#90B328', '#9C2910', '#FFCA39', '#00929F'];

		var max_value = source.reduce(function(max, chart){
			return Math.max(max, chart.reduce(function(sum, current, index){
				return index > 0 ? sum + current : sum;
			}, 0));
		}, 0);

		var vertical_scale_margin = 40; // 30
		// рисование линии вертикальной шкалы
		context.moveTo(vertical_scale_margin, 0); // + diagram_top_margin
		context.lineTo(vertical_scale_margin, diagram_pure_height + diagram_top_margin);

		var scale_size = diagram_pure_height;

		// рисование вертикальной шкалы
		var step_params = getScaleStep(max_value, scale_size);

		context.font = "12px sans-serif";

		var cur_val = 0;
		var cur_px = scale_size;

		while (cur_val < max_value)
		{
			cur_val += step_params.value;
			cur_px -= step_params.px;
			context.fillText(cur_val, 2, cur_px + 4 + diagram_top_margin);
			context.moveTo(vertical_scale_margin, cur_px + diagram_top_margin);
			context.lineTo(20, cur_px + diagram_top_margin);
		}
		context.stroke();

		////////////////////////////////////////////////////
		////////////////////////////////////////////////////
		////////////////////////////////////////////////////

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

		// рисование горизонтальной шкалы

		var horizontal_scale_margin = 30;
		// рисование линии горизонтальной шкалы
		context.moveTo(vertical_scale_margin, diagram_pure_height + diagram_top_margin);
		context.lineTo(diagram_pure_width + vertical_scale_margin + diagram_right_margin, diagram_pure_height + diagram_top_margin);

		context.font = "20px sans-serif";
		context.textAlign = "center";

		// while (cur_val_x < max_define)
		// {
		// 	cur_val_x += step_params_x.value;
		// 	cur_px_x += step_params_x.px;
		// 	context.fillText(cur_val_x, cur_px_x + vertical_scale_margin, diagram_pure_height + 10 + 12 + diagram_top_margin);
		// 	context.moveTo(cur_px_x + vertical_scale_margin, diagram_pure_height + diagram_top_margin);
		// 	context.lineTo(cur_px_x + vertical_scale_margin, diagram_pure_height + 10 + diagram_top_margin);
		// }
		context.stroke();
		/////////////////////////////////////
		var chart_parts = 2, divide_parts = 1;
		var piece_count = 0 + divide_parts;
		for (chart in charts) {
			if (!charts.hasOwnProperty(chart)) continue;
			piece_count += charts[chart] * chart_parts;
			piece_count += divide_parts;			
		}
		// piece_count += divide_parts;
		console.log(piece_count);
		var piece_width = diagram_pure_width/piece_count;
		////////////////////////////////////////////
		var cur_x = piece_width * divide_parts;
		var index_start = 1;

		for (var it in charts_) {
			if (!charts_.hasOwnProperty(it)) continue;
			var current_period_chart = charts_[it];

			var cur_chart_width = current_period_chart.length * chart_parts * piece_width;
			context.fillStyle = '#333';
			context.fillText(it, cur_x + vertical_scale_margin + cur_chart_width / 2, diagram_pure_height + 10 + 12 + diagram_top_margin);

			for (var i = 0; i < current_period_chart.length; ++i) {
				var current_item = current_period_chart[i];

				var cur_height = 0;
				for (var j = 0; j < current_item.length; ++j) {
					var fill_style = colors[j % colors.length];

					var ry = (max_value - current_item[j])/max_value * diagram_pure_height;
					var ry_ = current_item[j]/max_value * diagram_pure_height;
					// console.log(cur_x, ry, piece_width * chart_parts, ry_);

					context.beginPath();
					context.rect(cur_x + vertical_scale_width, ry - cur_height + diagram_top_margin, piece_width * chart_parts, ry_);
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

	function getNumberOfDigits(number) {
	    return parseInt(number, 10).toString().length;
	}

	function getScaleStep(max_value, scale_size) {
		var max_value_digits_count = getNumberOfDigits(max_value);
		var first_number = Number(String(max_value).charAt(0));

		var step = 1;
		if (max_value_digits_count === 1) {
			step = 1;
		} else {
			step = (first_number < 5 ? 5 : 10) * Math.pow(10, max_value_digits_count - 2);
		}

		return {
			value: step,
			px: step/max_value * scale_size
		};
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
		
    	var lines_count = source[Object.keys(source)[0]].length;
    	console.log(lines_count);
    	for (i in source) {
    		if (!source.hasOwnProperty(i)) continue;
    		if (source[i].length !== lines_count) {
    			console.log('Не все элементы объекта имеют одинаковую длину.');
    			return;
    		}
		};

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

		var colors = ['#026737', '#03ADEE', '#F6931C', '#257ABD', '#00929F'];

		// var fill_style = 'red';
		// var stroke_style = '#333';

		var vertical_scale_width = 40;
		var diagram_right_margin = 30;
		var diagram_pure_width = diagram.width - vertical_scale_width - diagram_right_margin;

		var horizontal_scale_width = 40;
		var diagram_top_margin = 20;
		var diagram_pure_height = diagram.height - horizontal_scale_width - diagram_top_margin;

		// var his_width = diagram.width/s_length; // TODO replace

		var max_define = Object.keys(source).reduce(function(max, current){
			return Math.max(max, current);
		}, 0);

		var his_width = diagram_pure_width/max_define; // pure width

		var max_value = Object.keys(source).reduce(function(max, current){
			return Math.max(max, Math.max.apply(Math, source[current]));
		}, 0);
		// console.log('max_value', max_value);

		// рисование вертикальной шкалы

		var vertical_scale_margin = 40; // 30
		// рисование линии вертикальной шкалы
		context.moveTo(vertical_scale_margin, 0); // + diagram_top_margin
		context.lineTo(vertical_scale_margin, diagram_pure_height + diagram_top_margin);

		var scale_size_y = diagram_pure_height;
		var step_params_y = getScaleStep(max_value, scale_size_y);

		context.font = "12px sans-serif";

		var cur_val_y = step_params_y.value;
		var cur_px_y = scale_size_y - step_params_y.px;

		while (cur_val_y < max_value)
		{
			context.fillText(cur_val_y, 2, cur_px_y + 4 + diagram_top_margin);
			context.moveTo(vertical_scale_margin, cur_px_y + diagram_top_margin);
			context.lineTo(20, cur_px_y + diagram_top_margin);
			cur_val_y += step_params_y.value; // TODO: выходит за пределы, т.к. увеличивается перед рисованием
			cur_px_y -= step_params_y.px;
		}
		context.stroke();

		// рисование горизонтальной шкалы

		var horizontal_scale_margin = 30;
		// рисование линии горизонтальной шкалы
		context.moveTo(vertical_scale_margin, diagram_pure_height + diagram_top_margin);
		context.lineTo(diagram_pure_width + vertical_scale_margin + diagram_right_margin, diagram_pure_height + diagram_top_margin);

		var scale_size_x = diagram_pure_width;
		var step_params_x = getScaleStep(max_define, scale_size_x);

		context.font = "12px sans-serif";
		context.textAlign = "center";

		var cur_val_x = 0;
		var cur_px_x = 0;

		while (cur_val_x < max_define)
		{
			cur_val_x += step_params_x.value;
			cur_px_x += step_params_x.px;
			context.fillText(cur_val_x, cur_px_x + vertical_scale_margin, diagram_pure_height + 10 + 12 + diagram_top_margin);
			context.moveTo(cur_px_x + vertical_scale_margin, diagram_pure_height + diagram_top_margin);
			context.lineTo(cur_px_x + vertical_scale_margin, diagram_pure_height + 10 + diagram_top_margin);
		}
		context.stroke();

		var point_radius = 4;

		for (var i = 0; i < lines_count; ++i) {
			var fill_style = colors[i];
			var stroke_style = colors[i];

			// рисование линий, соединяющих точки
			var moved = false;
			for (j in source) {
				if (!parseInt(j, 10)) continue;
				var current_item = source[j];
				var ry = (max_value - current_item[i])/max_value * diagram_pure_height;
				if (!moved) {
					context.moveTo(vertical_scale_width + his_width * j, ry + diagram_top_margin);
					moved = true;
				}
				context.lineTo(vertical_scale_width + his_width * j, ry + diagram_top_margin);
			};
			context.strokeStyle = stroke_style;
			context.stroke();
			
			// рисование самих точек
			for (j in source) {
				if (!parseInt(j, 10)) continue;
				var current_item = source[j];
				var ry = (max_value - current_item[i])/max_value * diagram_pure_height;

				context.beginPath();
				context.arc(vertical_scale_width + his_width * j, ry + diagram_top_margin, point_radius, 0, 2 * Math.PI);
				context.fillStyle = fill_style;
		      	context.fill();
				context.strokeStyle = stroke_style;
		      	context.stroke();
			};
		}
		


    }

    function getNumberOfDigits(number) {
	    return parseInt(number, 10).toString().length;
	}

	function getScaleStep(max_value, scale_size) {
		var max_value_digits_count = getNumberOfDigits(max_value);
		var first_number = Number(String(max_value).charAt(0));

		var step = 1;
		if (max_value_digits_count === 1) {
			step = 1;
		} else {
			step = (first_number < 5 ? 5 : 10) * Math.pow(10, max_value_digits_count - 2);
		}

		return {
			value: step,
			px: step/max_value * scale_size
		};
	}

	console.log('line chart');
    line_chart(this);
}