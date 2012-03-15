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
	var formatDate = function(date) {
		return '' + date.getFullYear() + '.' + (date.getMonth()+1) + '.' + date.getDate();
	};
	var isArrContainsSameMS = function(list,ele) {
	        if(!list || !ele || 0 == list.length) {
	          return false;
                }
                for(var i=0;i<list.length;i++) {
                  if(isSameDay(list[i],ele)) {
                    return true;
                  }
                }
                return false;
        };
	var calWeekDays = function(start,end,ex) {
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
			if(lastWeekDay && ( isArrContainsSameMS(ex,tmp) || isWeekend(curDay)) ) {
				ret[ret.length] = getObj(lastWeekDay,(tmp-DAY_MS));
				lastWeekDay = undefined;
			} else if ( !lastWeekDay && !isWeekend(curDay) && !isArrContainsSameMS(ex,tmp)) {
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
	var formatEx = function (ex) {
	        if(!ex || 0==ex.length) {
	          return;
                }
                //convert to ms
                var exms = [];
                for(var i=0;i<ex.length;i++) {
                  try{
                    exms[exms.length] = new Date(ex[i]).getTime();
                  }catch(e){}
                }
                return exms;
        };

	var output = function(ret){
		if(!ret||0==ret.length) {
			return ;
		}
		var str = [];
		var totalDay = 0;
		for(var i=0;i<ret.length;i++) {
			var obj = ret[i];
			if(1==obj.v) {
                          str[str.length] = formatDate(new Date(obj.s)) + ' 共' + obj.v + '天';
                        } else {
                          str[str.length] = formatDate(new Date(obj.s)) + '-' + formatDate(new Date(obj.e)) + ' 共' + obj.v + '天';
                        }
			totalDay += obj.v;
		}
		return {
			"d":totalDay,
			"r":str.join(';')
		};
	};

	$.jb = {
		"getText" :  function(start,end,excludes) {
		        var _ex = formatEx(excludes);
			var ret = calWeekDays(new Date(start),new Date(end),_ex);
			return output(ret);
		}
	};
})(window);
