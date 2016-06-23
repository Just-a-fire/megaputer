window.onload = function() {	
	document.body.style.margin = '0';
	// document.body.style.overflowX = 'hidden';
}

// TODO
// сетка

Object.prototype.draw = function() {	
	if (this instanceof Array && this.length === 0 || Object.keys(this).length === 0) {
		console.log('nothing to draw');
		return;
	}

	var division_size = 10; // размер делений шкал

	var vertical_scale_width = 40;
	var diagram_right_margin = 30;

	var horizontal_scale_width = 40;
	var diagram_top_margin = 20;

	var vertical_scale_margin = 40;
	var horizontal_scale_margin = 30;


	var line_chart = function(source)
    {		
    	var lines_count = source[Object.keys(source)[0]].length;
    	for (i in source) {
    		if (!source.hasOwnProperty(i)) continue;
    		if (source[i].length !== lines_count) {
    			console.log('Не все элементы объекта имеют одинаковую длину.');
    			return;
    		}
		};

		var diagram = prepare_diagram();
		var context = diagram.getContext("2d");

		var colors = ['#026737', '#03ADEE', '#F6931C', '#257ABD', '#00929F'];

		var diagram_pure_width = diagram.width - vertical_scale_width - diagram_right_margin;
		var diagram_pure_height = diagram.height - horizontal_scale_width - diagram_top_margin;

		var max_define = Object.keys(source).reduce(function(max, current){
			return Math.max(max, current);
		}, 0); // максимальная величина определения функции

		var his_width = diagram_pure_width/max_define;

		var max_value = Object.keys(source).reduce(function(max, current){
			return Math.max(max, Math.max.apply(Math, source[current]));
		}, 0); // максимальная величина значения функции

		// рисование вертикальной шкалы
		verticalScale(context, max_value, diagram_pure_height);

		// рисование горизонтальной шкалы
		horizontalScale(context, max_define, diagram_pure_width, diagram_pure_height);

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
    } // end line_chart

    
	var histogram = function(source)
    {
		var s_length = source.length;
		var diagram = prepare_diagram();
		var context = diagram.getContext("2d");

		var fill_style = '#5B9BD5';
		var stroke_style = '#333';

		var diagram_pure_width = diagram.width - vertical_scale_width - diagram_right_margin;
		var diagram_pure_height = diagram.height - diagram_top_margin;

		var his_width = diagram_pure_width/s_length;

		var max_value = source.reduce(function(max, current){
			return Math.max(max, charToNum(current));
		}, 0);

		// рисование вертикальной шкалы
		verticalScale(context, max_value, diagram_pure_height);

		// рисование самой гистограммы
		for (var i = 0; i < source.length; i++) {
			var current_item = charToNum(source[i]);
			var ry = (max_value - current_item)/max_value * diagram_pure_height
			var ry_ = current_item/max_value * diagram_pure_height;

			context.rect(vertical_scale_width + his_width * i, ry + diagram_top_margin, his_width, ry_);
			context.fillStyle = fill_style;
	      	context.fill();
			context.strokeStyle = stroke_style;
	      	context.stroke();
		};
    } // end histogram


    var scatter_plot = function(source)
    {
		var s_length = source.length;
		var diagram = prepare_diagram();
		var context = diagram.getContext("2d");

		var fill_style = 'green';
		var stroke_style = '#333';

		var diagram_pure_width = diagram.width - vertical_scale_width - diagram_right_margin;
		var diagram_pure_height = diagram.height - horizontal_scale_width - diagram_top_margin;

		var max_value = source.reduce(function(max, current){
			return Math.max(max, current.y);
		}, 0);

		var max_define = source.reduce(function(max, current){
			return Math.max(max, current.x);
		}, 0);		

		// рисование вертикальной шкалы
		verticalScale(context, max_value, diagram_pure_height);

		// рисование горизонтальной шкалы
		horizontalScale(context, max_define, diagram_pure_width, diagram_pure_height);

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
    } // scatter_plot


    var stacked_bar_chart = function(source)
    {
		var s_length = source.length;
		var diagram = prepare_diagram();
		var context = diagram.getContext("2d");

		var stroke_style = '#333';

		var diagram_pure_width = diagram.width - vertical_scale_width - diagram_right_margin;
		var diagram_pure_height = diagram.height - horizontal_scale_width - diagram_top_margin;

		// var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
		var colors = ['#1589FF', '#4EE2EC', '#F62217', '#FFCA39', '#00929F'];

		var max_value = source.reduce(function(max, chart){
			return Math.max(max, chart.reduce(function(sum, current, index){
				return index > 0 ? sum + current : sum;
			}, 0));
		}, 0);

		// рисование вертикальной шкалы
		verticalScale(context, max_value, diagram_pure_height);

		// рисование горизонтальной шкалы
		// рисование линии горизонтальной шкалы
		horizontalScaleLine(context, diagram_pure_width + vertical_scale_margin + diagram_right_margin, diagram_pure_height + diagram_top_margin);

		context.font = "20px sans-serif";
		context.textAlign = "center";
		
		/////////////////////////////////////
		// var charts = {};
		var charts = {"jan":[], "feb":[], "mar":[], "apr":[], "may":[], "jun":[], "jul":[], "aug":[], "sep":[], "oct":[], "nov":[], "dec":[]};

		for (var i = 0; i < source.length; i++) {
			var current_item = source[i];

			if (charts[current_item[0]] === undefined) {
				console.log('invalid period: ' + current_item[0]);
				context.fillText('invalid period: ' + current_item[0], vertical_scale_margin + diagram_pure_width / 2, diagram_pure_height / 2);
				return;
				// charts[current_item[0]] = [current_item.slice(1)];
			} else {
				charts[current_item[0]].push(current_item.slice(1));
			}
		};
		// при условии, что ширина чарта 2 части, а ширина границы между чартами 1 часть
		var chart_parts = 2, divide_parts = 1;
		var piece_count = 0 + divide_parts;
		// считаем сколько всего частей в графике
		for (chart in charts) {
			if (!charts.hasOwnProperty(chart)) continue;
			if (charts[chart].length === 0) {
				// console.log('dee');
				delete charts[chart];
				continue;
			}
			piece_count += charts[chart].length * chart_parts;
			piece_count += divide_parts;			
		}
		var piece_width = diagram_pure_width/piece_count; // ширина одной части в пикселях
		////////////////////////////////////////////
		var cur_x = piece_width * divide_parts;
		var index_start = 1;

		for (var it in charts) {
			if (!charts.hasOwnProperty(it)) continue;
			var current_period_chart = charts[it];

			// тексты шкалы периода чарта
			var cur_chart_width = current_period_chart.length * chart_parts * piece_width;
			context.fillStyle = '#333';
			context.fillText(it, cur_x + vertical_scale_margin + cur_chart_width / 2, diagram_pure_height + division_size + 12 + diagram_top_margin);

			for (var i = 0; i < current_period_chart.length; ++i) {
				var current_item = current_period_chart[i];

				var cur_height = 0;
				for (var j = 0; j < current_item.length; ++j) {
					var fill_style = colors[j % colors.length];

					var ry = (max_value - current_item[j])/max_value * diagram_pure_height;
					var ry_ = current_item[j]/max_value * diagram_pure_height;

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

    } // end stacked_bar_chart

    //////////////////////////////////////////////////////////
    //////////////// вспомогательные функции /////////////////
    //////////////////////////////////////////////////////////

    function prepare_diagram() {
    	var diagram = document.createElement('canvas');
		diagram.style.border = '1px solid #ccc';
		set_diagram_size(diagram);
		document.body.appendChild(diagram);
		return diagram;
    }

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

	function verticalScale(context, max_value, diagram_pure_height) {
		context.moveTo(vertical_scale_margin, 0); // + diagram_top_margin
		context.lineTo(vertical_scale_margin, diagram_pure_height + diagram_top_margin);

		var scale_size_y = diagram_pure_height;
		var step_params_y = getScaleStep(max_value, scale_size_y);

		context.font = "12px sans-serif";

		var cur_val_y = step_params_y.value;
		var cur_px_y = scale_size_y - step_params_y.px;
		// деления вертикальной шкалы
		while (cur_val_y <= max_value)
		{
			context.fillText(cur_val_y, vertical_scale_margin - division_size - 12 - 6, cur_px_y + 4 + diagram_top_margin);
			context.moveTo(vertical_scale_margin, cur_px_y + diagram_top_margin);
			context.lineTo(vertical_scale_margin - division_size, cur_px_y + diagram_top_margin);
			cur_val_y += step_params_y.value;
			cur_px_y -= step_params_y.px;
		}
		context.stroke();
	}

	function horizontalScale(context, max_define, diagram_pure_width, diagram_pure_height) {
		// рисование линии горизонтальной шкалы
		context.moveTo(vertical_scale_margin, diagram_pure_height + diagram_top_margin);
		context.lineTo(diagram_pure_width + vertical_scale_margin + diagram_right_margin, diagram_pure_height + diagram_top_margin);

		var scale_size_x = diagram_pure_width;
		var step_params_x = getScaleStep(max_define, scale_size_x);

		context.font = "12px sans-serif";
		context.textAlign = "center";

		var cur_val_x = step_params_x.value;
		var cur_px_x = step_params_x.px;
		// деления горизонтальной шкалы
		while (cur_val_x <= max_define)
		{
			context.fillText(cur_val_x, cur_px_x + vertical_scale_margin, diagram_pure_height + division_size + 12 + diagram_top_margin);
			context.moveTo(cur_px_x + vertical_scale_margin, diagram_pure_height + diagram_top_margin);
			context.lineTo(cur_px_x + vertical_scale_margin, diagram_pure_height + division_size + diagram_top_margin);
			cur_val_x += step_params_x.value;
			cur_px_x += step_params_x.px;
		}
		context.stroke();
	}

	function horizontalScaleLine(context, x, y) { // рисование линии горизонтальной шкалы
		context.moveTo(vertical_scale_margin, y);
		context.lineTo(x, y);

		context.stroke();
	}

    ///////////////////////////////////////////////////
    //// определение типа диаграммы по типу данных ////
    ///////////////////////////////////////////////////

    if (this instanceof Array === false) {
		current_type = 'line chart';
		console.log('line chart');
		line_chart(this);
	} else {
		if (this[0] instanceof Array) {
			console.log('stacked bar chart');
			stacked_bar_chart(this);
		}
		else if (this[0] instanceof Object) {
			console.log('scatter plot');
			scatter_plot(this);
		}
		else {
			console.log('histogram');
			histogram(this);
		}
	}

};