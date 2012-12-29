	var date1 = "2012-09-01 13:12:01"
	var date2 = "2012-09-18 13:12:01"
	
	var jsDate1 = parse_date(date1);
	var jsDate2 = parse_date(date2);
	
	diff = diffdate(jsDate1, jsDate2);
	
	
	
	
	
	
	function titre (d1, d2)
	
	function diffdate(d1, d2) {
		var WNbJours = d2.getTime() - d1.getTime();
		return Math.ceil(WNbJours/(1000*60*60*24));
	}
	
	
	
	function parse_date(string) {  
    	var date = new Date();  
    	var parts = String(string).split(/[- :]/);  
  
    	date.setFullYear(parts[0]);  
    	date.setMonth(parts[1] - 1);  
    	date.setDate(parts[2]);  
    	date.setHours(parts[3]);  
    	date.setMinutes(parts[4]);  
    	date.setSeconds(parts[5]);  
    	date.setMilliseconds(0);  

    	return date;  
}


	
	