	var date1 = "2012-09-01 13:12:01"
	var date2 = "2012-09-18 13:12:01"
	
	var jsDate1 = parse_date(date1);
	var jsDate2 = parse_date(date2);
	
	diff = diffdate(jsDate1, jsDate2);
	
	var curseur= d3.select("#curseur").append("svg")
					  .attr("class", "chart");
	
	curseur.append("line")
	       .attr("x1", 10)
	       .attr("x2", 400)
	       .attr("y1", 30)
	       .attr("y2", 30)
	       .style("stroke", "black")
	       .style("stroke-width", 4);
	curseur.append("rect")
	       .attr("width", 10)
	       .attr("height", 20)
	       .attr("x", 10)
	       .attr("y",10)
	       .style("fill","grey" )
	       .on("mousedown", animate);
	
	function animate(){
		d3.select(this).attr("x",event.clientX);
		
	} 
	
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


	
	
