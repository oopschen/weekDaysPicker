(function($){
	var DAY_MS = 24*60*60*1000;
	var isSameDay = function(arg1 ,arg2) {
		return Math.abs(arg2 - arg1) < DAY_MS
	};
	var isWeekend = function(num) {
		return 0 == num || 6 == num;
	};
	var getObj = function(s,e) {
		var gap = (e-s)/DAY_MS;
		return {
			"s":s,
			"e":e,
			"v": (gap < 1 ? Math.ceil(gap) : Math.floor(gap)) + 1
		};
	};
	var calWeekDays = function(start,end) {
		var sd = new Date(start).getTime();
		var ed = new Date(end).getTime();
		if( sd > ed ) {
			return;
		}
		var ret = [];
		var lastWeekDay;
		var tmp = sd;
		while(true) {
			var curDay = new Date(tmp).getDay();
			if(lastWeekDay && isWeekend(curDay) ) {
				ret[ret.length] = getObj(lastWeekDay,(tmp-DAY_MS));
				lastWeekDay = undefined;
			} else if ( !lastWeekDay && !isWeekend(curDay) ) {
				lastWeekDay =  tmp;
			}
			tmp+=DAY_MS;
			if( tmp >= end ) {
				break;
			}
		}

		if(lastWeekDay) {
			ret[ret.length] = getObj(lastWeekDay,(end - DAY_MS));
		}
		return ret;
	};

	var exclude = function(list,excludes) {
		if(!excludes) {
			return list;
		}
		if(!list) {
			return;
		}
		var ret = [];
		var loopList = list;
		for(var j=0;j<excludes.length;j++){
			var excludeMs = new Date(excludes[j]).getTime();
			var isChange = false;
			for(var i=0;i<loopList.length;i++){
				var obj = loopList[i];
				if ( excludeMs < obj.s || excludeMs > obj.e ) {
					ret[ret.length] = obj;
					continue;
				}
				isChange = true;
				if(isSameDay(excludeMs,obj.s)) {
					var _t = calWeekDays(obj.s+DAY_MS,obj.e+DAY_MS)
					if(_t && 0 != _t.length ) {
						ret = ret.concat(_t);
					}
				} else if (isSameDay(excludeMs,obj.e)) {
					var _t = calWeekDays(obj.s,obj.e)
					if(_t && 0 != _t.length ) {
						ret = ret.concat(_t);
					}
				} else {
					var _t = calWeekDays(obj.s,excludeMs);
					if(_t && 0 != _t.length ) {
						ret = ret.concat(_t);
					}
					_t = calWeekDays(excludeMs+DAY_MS,obj.e+DAY_MS);
					if(_t && 0 != _t.length ) {
						ret = ret.concat(_t);
					}
				}
			}
			if(isChange) {
				loopList = ret;
				ret = [];
			}
		}
		return loopList;
	};

	$.jb = {
		"getText" :  function() {
			console.log(exclude(calWeekDays(new Date("2012-03-12"),new Date("2012-03-21")),["2012-03-15","2012-03-19"]));
		}
	};
})(window);
