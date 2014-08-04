/* 代码整理：懒人之家 */
(function($){
	$.fn.advancedtable = function(custom) {
	
		// Default configuration
		var defaults = {
		  	rowsPerPage: 10,
			currentPage: 1,
			loadElement: "",
			searchField: "",
			searchColumn: 0,
			searchCaseSensitive: false,
			navigationLabel: "",
			delay: 300,
			sortDefault: "asc",
			sortColumnDefault: 0,
			sorting: true,
			ascImage: '',
			descImage: '',
			csv: '',
			csvSeperator: ',',
			evenColor: '',
			oddColor: ''
		};
		  
		// Combine user and default configuration
		var settings = $.extend({}, defaults, custom);
		
		// Decrement currentPage setting
		settings.currentPage--;
		
		// Variable declarations
		var table = this;
		var currentPage = 0;
		
		// If csv file table
		if(settings.csv != ''){
			
			// Show loader box
			showLoad();	

			$.get(settings.csv, function(data){				   
				var rows = data.split('\n');
				var rowNumber = rows.length;
				var colNumber = rows[0].split(settings.csvSeperator).length;
				var htmlData = "";
				for(var i=0 ; i < rowNumber ; i++){
					cols = rows[i].split(settings.csvSeperator);
					htmlData += '<tr class="" style="display: table-row;">';
					for(var j=0; j < colNumber ; j++){
						htmlData += "<td>" + cols[j] + "</td>";
					}
					htmlData += "</tr>";
				}
				
				// Fill table
				table.find("tbody").html(htmlData);
				
				// Redraw table
				redrawTable();
				
			});
		}
			
		// Define searchfield if needed
		if(settings.searchField != ""){	
			$(settings.searchField).show();
			$(settings.searchField).keyup(redrawTable);
		}
			
		// Redraw table
		redrawTable();

		// START REDRAWTABLE
		function redrawTable() {

			// Show loader box
			showLoad();	
		
			// Case sensitive option string format
			var strsearch = "";
			if(typeof(this.value) != "undefined"){
				if(settings.searchCaseSensitive){
					strsearch = this.value;
				}else{
					strsearch = this.value.toLowerCase();	
				}
			}

			// Define counter
			var i = 0;
		 
			// START TR LOOP
		  	table.find('tbody tr').each(function () { 

				// Set found to false
				var found = false;
				
				// Define counter
				var i = 1;
				
				// START TD LOOP
				$(this).find('td').each(function () { 		  
					
					// If search all columns or search in this column
					if((settings.searchColumn==0) || (settings.searchColumn==i)){
						
						// Case sensitive string format
						if(settings.searchCaseSensitive){
							var strcell = stripHtml(this.innerHTML);
						}else{
							var strcell = stripHtml(this.innerHTML.toLowerCase());
						}

						// If string is found in this cell
						if((strcell.indexOf(strsearch) > -1)){
							found = true;  
						}
					}
					
					// Increment column number
					i++;
					
				});
				// END TD LOOP
				
				// Mark hide or show row
				if(found){
					$(this).removeClass("searchhide");
				}else{
					$(this).addClass("searchhide");
				}

			}); 
				
			// Count table rows that match the search term
			tableRows = table.find('tbody tr:not(.searchhide)').length;
			
			// Calculate the number of pages
			var pages = Math.ceil(tableRows / settings.rowsPerPage);
				
			// Remove old footer
			table.find("tfoot").remove();
			
			// Calculate values
			var firstRow = table.find("tr:first");
			var numCols = firstRow[0].cells.length;
			var endEow = ((settings.currentPage + 1) * settings.rowsPerPage);
			var startRow = (endEow - settings.rowsPerPage) + 1;

			// Info block
			var blockInfo = '<div class="tableInfo">Showing ' + startRow + ' - ' + endEow + ' of ' + tableRows + '</div>';
			
			// If there are more rows than rowsPerPage than build the navigation
			var blockNavigation = "";
			if(tableRows > settings.rowsPerPage){
				
				blockNavigation += '<div class="tableNavigation">';
				if(settings.navigationLabel != ""){
					blockNavigation += '<span>' + settings.navigationLabel + '&nbsp;&nbsp;</span>';
				}
				
				if(true){
					blockNavigation += '<ul>';
					for(var i = 0;i < pages; i++){
						blockNavigation += '<li' + ((settings.currentPage == i) ? ' class="active"' : "") + '><a href="javascript:void();">' + (i+1) + '</a></li>';
					}
					blockNavigation += '</ul>';
				}else{
					blockNavigation += '<select id="#tnavigation">';
					for(var i = 0;i < pages; i++){
						blockNavigation += '<option value="' + (i+1) + '" ' + ((settings.currentPage == i) ? ' selected="selected"' : "") + '>' + (i+1) + '</option>';
					}
					blockNavigation += '</select>';
				}
				
				blockNavigation += '</div>';
			}
	
			// Add new footer to table
			table.append('<tfoot><tr><td colspan="' + numCols + '">' + blockInfo + blockNavigation + '</td></tr></tfoot>');

			// Bind clickhandler on pagenavigations
			table.find('.tableNavigation li').bind('click', function() {
				
				// Show loader box
				showLoad();	
					
				// Get current page number
				var currentPage = (parseInt($(this).find("a").html())) - 1;
					
				// Set active page
				setActivePage(currentPage);
				
				// Hide loader box
				hideLoad();	
				
				stripeRows();

			});
			
			// Bind clickhandler on dropdown pagination
			table.find('.tableNavigation select').change(function() {
				
				// Show loader box
				//showLoad();	
					
				// Get current page number
				//alert($(this).find("option").attr("value"));
				alert($('#tnavigation :selected').val());
				//var currentPage = (parseInt($(this).find("option").value)) - 1;

				// Set active page
				/*setActivePage(currentPage);
				
				// Hide loader box
				hideLoad();	
				*/
			});
			
			// Add sort handlers
			if(settings.sorting){
				if(table.find('thead th a').length == 0){
					var sorthandle = 0;
					table.find('thead th').each(function() { 
						$(this).html('<a href="javascript:void();" id="sorthandle' + sorthandle + '">' + $(this).html() + '</a><span id="sortaschandle' + sorthandle + '" class="sortshowhandle"><img src="' + settings.ascImage + '" alt="Arrow up icon"/></span><span id="sortdeschandle' + sorthandle + '" class="sortshowhandle"><img src="' + settings.descImage + '" alt="Arrow down icon"/></span><span id="sorttypehandle" class="allsorttypehandle" style="display:none"></span>');
						$(this).bind('click', sortTable);
						sorthandle++;
					});
					table.find(".sortshowhandle").hide();
					sortTable(settings.sortColumnDefault);
				}
			}
			
			// Sort function
			function sortTable(column){
				
				// Show loader box
				showLoad();

				if(typeof(column) == "number"){
					var sortColumn = table.find('thead th:eq(' + column + ') a').attr("id");
				}else{
					var sortColumn = $(this).find('a').attr("id");
				}
				sortColumn = sortColumn.replace("sorthandle", "");
				
				
				var sortAction = getSortAction(sortColumn);
				var rows = new Array(tableRows);
				
				// Fill arrays
				var counter = 0;
				table.find('tbody tr').each(function() { 
					var sortString = $(this).find('td').eq(sortColumn).html().toLowerCase();
					rows[counter] = [sortString,'<tr>' + $(this).html() + '</tr>'];
					counter++;

				});
				
				if(sortAction == "asc"){
					rows.sort(sortAsc);
				}else{
					rows.sort(sortDesc);
				}
				
				var sortedHtml = "";
				for(var i=0; i < tableRows; i++){
					sortedHtml += rows[i][1];
				}
				
				table.find('tbody').html(sortedHtml);
				
				// Redraw table
				redrawTable();
				
			}
			
			// Get current page number
			currentPage = getCurrentPage();
					
			// Set active page
			setActivePage(currentPage);
			
			// Hide loader box
			hideLoad();	
			
			// Add Table stripes
			stripeRows();
						
		} 
		// END REDRAWTABLE
		
		// START SETACTIVEPAGE
		function setActivePage(number){
		
			// Make the correct page selected
			table.find('.tableNavigation li').removeClass("active");
			table.find('.tableNavigation li:eq(' + number + ')').addClass("active");
				
			// Get current rows per page
		    var rowsPerPage = settings.rowsPerPage;
		        
		    // Show rows
		    var from 		= number * rowsPerPage;
		    var to 			= (number + 1) * rowsPerPage;
			var tableRows 	= table.find('tbody tr:not(.searchhide)').length;
			
	        table.find('tbody tr').hide();
			table.find('tbody tr:not(.searchhide)').slice(from, to).show();
			
			// Change information text
			table.find('.tableInfo').html("Showing " + (from + 1) + " - " + ((tableRows < to) ? tableRows : to) + " of " + tableRows);
			
		}
		// END SETACTIVEPAGE
		
		// START GETCURRENTPAGE
		function getCurrentPage(){
			var currentPage = (parseInt(table.find('.tableNavigation li.active').find("a").html())) - 1;
			if(isNaN(currentPage)){
				return 0;
			}
			return currentPage;
		}
		// END GETCURRENTPAGE
		
		// START SHOWLOAD
		function showLoad(){
			if(settings.loadElement != ""){
				$(settings.loadElement).show();
			}
		}
		//END SHOWLOAD
		
		// START HIDELOAD
		function hideLoad(){
			if(settings.loadElement != ""){
				if(settings.delay > 0){
					setTimeout( function () { 
							$(settings.loadElement).hide();
					}, settings.delay);
				}else{
					$(settings.loadElement).hide();
				}
			}
		}
		//END HIDELOAD
		
		// START STRIPHTML
		function stripHtml(oldString) {

		   var newString = "";
		   var inTag = false;
		   for(var i = 0; i < oldString.length; i++) {
		   
				if(oldString.charAt(i) == '<') inTag = true;
				if(oldString.charAt(i) == '>') {
					  if(oldString.charAt(i+1)=="<")
					  {
							//dont do anything
			}
			else
			{
				inTag = false;
				i++;
			}
				}
		   
				if(!inTag) newString += oldString.charAt(i);

		   }

		   return newString;
		}
		// END STRIPHTML
		
		// START TRIM
		function trimString(str){
			return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		}
		// END TRIM
		
		// START POPUP
		function popup(data) {
			var generator = window.open('', 'csv', 'height=400,width=600');
			generator.document.write('<html><head><title>CSV</title>');
			generator.document.write('</head><body >');
			generator.document.write('<textArea cols=70 rows=15 wrap="off" >');
			generator.document.write(data);
			generator.document.write('</textArea>');
			generator.document.write('</body></html>');
			generator.document.close();
			return true;
		}
		// END POPUP
		
		// START SORTASC
		function sortAsc(a, b) {
			
			a = a[0];
			b = b[0];
			
			// Number sorter
			if(!isNaN(a) && !isNaN(b)){	
				return a - b;
			}
			
			// String sorter
			return a == b ? 0 : (a < b ? -1 : 1);
		}
		// END SORTASC
		
		// START SORTDESC
		function sortDesc(a, b) {
			
			a = a[0];
			b = b[0];
			
			// Number sorter
			if(!isNaN(a) && !isNaN(b)){	
				return b - a;
			}
			
			// String sorter
			return a == b ? 0 : (a > b ? -1 : 1);
		}
		// END SORTDESC
		
		function getSortAction(column){
			var columnObj = table.find('thead th').eq(column);

			var currentState = columnObj.find("#sorttypehandle").html()
			table.find(".allsorttypehandle").html("");
			table.find(".sortshowhandle").hide();
			
			if(currentState == "asc"){
				columnObj.find("#sortdeschandle" + column).show();
				columnObj.find("#sortaschandle" + column).hide();
				columnObj.find("#sorttypehandle").html("desc");
				return "desc";
			}

			if(currentState == "desc"){
				columnObj.find("#sortaschandle" + column).show();
				columnObj.find("#sortdeschandle" + column).hide();
				columnObj.find("#sorttypehandle").html("asc");
				return "asc";
			}
			
			if(settings.sortDefault == "asc"){
				$("#sortaschandle" + column).show();
				columnObj.find("#sorttypehandle").html("asc");
			}else{
				$("#sortdeschandle" + column).show();
				columnObj.find("#sorttypehandle").html("desc");
			}
			return settings.sortDefault;
			
		}
		
		function stripeRows(){
			table.find("tbody tr").removeClass("odd");
			table.find("tbody tr").removeClass("even");
			table.find("tbody tr:visible:even").addClass("even");
			table.find("tbody tr:visible:odd").addClass("odd");
		}

		// Return the jQuery object to allow for chainability.
		return this;
		
	}
	
})(jQuery);
