(function($){
	var DAY_MS = 24*60*60*1000;
	var isSameDay = function(arg1 ,arg2) {
		var ad = new Date(arg1);
		var bd = new Date(arg2);
		return ad.getFullYear() == bd.getFullYear() && 
				ad.getMonth() == bd.getMonth() &&
				ad.getDate() == bd.getDate();
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
		},
		"addMonth": function(now,num) {
			if(!now) {
				return;
			}
			var curM = now.getMonth();
			var op = 0 < num ? 1 : -1
			var retDate = new Date(now);
			ret = curM + num;
			if(11 < ret) {
				var mod = ret % 11;
				retDate.setFullYear(now.getFullYear()+(ret-mod)/11);
				retDate.setMonth(mod-1);
				return retDate;
			} else if(0 > ret) {
				var mod = Math.abs(ret) %11
				retDate.setFullYear(now.getFullYear()-(ret-mod)/11);
				retDate.setMonth(12 - mod);
				return retDate;
			}
			retDate.setMonth(ret);
			return retDate;
		}
	};
})(window);
