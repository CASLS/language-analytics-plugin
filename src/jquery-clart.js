(function ( $ ) {
	var allComments = [['Phrases'],["This is a test comment"], ["This is another test comment"], ["This is a third test comment"]];
	var commentWords = [];
	var wordCountArray = {};
	var chartTitle = "<h3 style='text-align:center;'>Word Cloud - Word Tree</h3>";
	
    $.fn.WordCloudWithTree = function(options) {
    	// This is the easiest way to have default options.
        var settings = $.extend({}, $.fn.WordCloudWithTree.defaults, options );
        var plugin = $.fn.WordCloudWithTree;

        allComments = settings.allComments;
        commentWords = settings.commentWords;
    	chartTitle = settings.chartTitle;
    	
    	plugin.wordTree = Object.assign({}, plugin.wordTree, settings.wordTree);
    	plugin.wordCloud = Object.assign({}, plugin.wordCloud, settings.wordCloud);
    	
        var container = $(this);
//        container.css("position","relative");
//        container.css("padding","10px 10px 40px 10px");
//        container.css("box-shadow","0 2px 8px 0 rgba(0,0,0,0.2)");
//        container.css("background-color","#ffffff");
//        container.css("margin","20px");
        container.append(chartTitle);
        container.append("<div id='commentsWordCloud'></div>");
        var wordTreeButtons = 
        	'<div class="btn-toolbar" role="toolbar" aria-label="..." style="">' + 
				'<div class="btn-group" role="group" aria-label="...">' + 
					'<button type="button" class="btn btn-default" onclick="$.fn.WordCloudWithTree.wordTree.type = \'prefix\'; $.fn.WordCloudWithTree.drawWordTree();">Prefix</button>' +
			 		'<button type="button" class="btn btn-default" onclick="$.fn.WordCloudWithTree.wordTree.type = \'double\'; $.fn.WordCloudWithTree.drawWordTree();">Double</button>' +
					'<button type="button" class="btn btn-default" onclick="$.fn.WordCloudWithTree.wordTree.type = \'suffix\'; $.fn.WordCloudWithTree.drawWordTree();">Suffix</button>' +
				'</div>' +
				'<div class="btn-group" role="group" aria-label="...">' +
					'<button type="button" class="btn btn-default" onclick="$.fn.WordCloudWithTree.wordTree.type = \'suffix\'; $.fn.WordCloudWithTree.wordTree.word = \'\'; $.fn.WordCloudWithTree.drawWordTree();">Reset</button>' +
				'</div>' +
			'</div>';
        container.append(wordTreeButtons);
        container.append("<div id='commentsWordTree'></div>");
        container.append('<label class="copyrightLabel" style="position:absolute;bottom:-5px;left:0px;right:0px;height:30px;background:#9B9B9B;padding:5px;color:white;text-align:center;box-shadow:0 2px 8px 0 rgba(0,0,0,0.2);">&copy; CASLS Language Analytics & Reporting Tools</label>');
        
        
        if(commentWords.length == 0){
        	for(i in allComments){
        		var phrase = allComments[i];
        		//Trim white space from the end of the phrase, then lower case everythihng, then strip out any punctuation with regex.
        		phrase = $.trim(phrase).replace(/\b[-.,()&$#!\[\]{}"']+\B|\B[-.,()&$#!\[\]{}"']+\b/g, "");;
        		//Split the phrase into word parts
        		var words = phrase.split(" ");
        		for(x in words){
        			var singleWord = words[x];
        			//Count each word
        			if(wordCountArray.hasOwnProperty(singleWord)){
        				wordCountArray[singleWord] += 1; 
        			}else{
        				wordCountArray[singleWord] = 1;
        			}
        		}
        	}
        	
        	for(key in wordCountArray){
        		var newArray = {text: key, weight: wordCountArray[key]};
        		commentWords.push(newArray);
        	}
        }
		
		function setUpWordCloudData(words, dataContainer = "body", weightDivider= 1){
			var i;
			for(i in words){
				var word = words[i];
				word.html = {
					"data-toggle": "popover",
					"data-content": word.weight / weightDivider,
					"data-trigger": "hover",
					"data-placement": "auto",
					"data-container": dataContainer,
				};
				word.handlers = { mouseover: function(e){
//	 				console.log(e);
					wordcloudHover(this)
				}, click: function(e){
					console.log($(this).text());
					$.fn.WordCloudWithTree.wordTree.word = $(this).text(); 
					$.fn.WordCloudWithTree.drawWordTree()
				}};
			}
		}
	
		function wordcloudHover(word){
// 			console.log(word);
			$(word).popover('show');
		}
		
		$(document).ready(function(){			
			setUpWordCloudData(commentWords);

			//Initialize Google Charts - Wordtree        
        	google.charts.load('current', {packages:['wordtree']});
        	google.charts.setOnLoadCallback($.fn.WordCloudWithTree.drawWordTree)
			
        	//Draw the word cloud.
        	$.fn.WordCloudWithTree.drawWordCloud();
		});
		
        return this;
    };
    
    $.fn.WordCloudWithTree.drawWordCloud = function(){
    	$('#commentsWordCloud').jQCloud(commentWords, {
			  width: $.fn.WordCloudWithTree.wordCloud.width,
			  height: $.fn.WordCloudWithTree.wordCloud.height,
			  colors: $.fn.WordCloudWithTree.wordCloud.colors
			});
    };
	
    $.fn.WordCloudWithTree.drawWordTree = function(){
    	  var data = google.visualization.arrayToDataTable(allComments);

	        var options = {
	          wordtree: {
	            format: $.fn.WordCloudWithTree.wordTree.format,
	            word: $.fn.WordCloudWithTree.wordTree.word,
	            type: $.fn.WordCloudWithTree.wordTree.type
	          },
	          width: $.fn.WordCloudWithTree.wordTree.width,
	          height: $.fn.WordCloudWithTree.wordTree.height,
	        };

      	var chart = new google.visualization.WordTree(document.getElementById("commentsWordTree"));
      	chart.draw(data, options);
    };
    
	 $.fn.WordCloudWithTree.defaults = {
			 // These are the defaults.
	    	allComments: allComments,
	    	commentWords: commentWords,
	    	chartTitle: chartTitle
		 };
	
	 $.fn.WordCloudWithTree.wordTree = {
				width: 350,
				height: 350,
				format: 'implicit',
	            word: '',
	            type: 'suffix'
		};
	 
	 $.fn.WordCloudWithTree.wordCloud = {
				width: 350,
				height: 350,
				colors: ["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"].reverse()
		};
}( jQuery ));