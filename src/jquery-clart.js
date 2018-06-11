(function ( $ ) {
    var wordtreeRootWord = '';
	var wordtreeType = 'suffix';
	var allComments = [['Phrases'],["This is a test comment"], ["This is another test comment"], ["This is a third test comment"]];
	var commentWords = [];
	var wordCountArray = {};
	
    $.fn.WordCloudWithTree = function(options) {
    	// This is the easiest way to have default options.
        var settings = $.extend({
            // These are the defaults.
        	wordtreeRootWord: wordtreeRootWord,
        	wordtreeType: wordtreeType,
        	allComments: allComments,
        	commentWords: commentWords
        }, options );
        
        var container = $(this);
        container.append("<div id='commentsWordCloud'></div>");
        var wordTreeButtons = 
        	'<div class="btn-toolbar" role="toolbar" aria-label="...">' + 
				'<div class="btn-group" role="group" aria-label="...">' + 
					'<button type="button" class="btn btn-default" onclick="wordtreeType = \'prefix\';drawChart();">Prefix</button>' +
			 		'<button type="button" class="btn btn-default" onclick="wordtreeType = \'double\';drawChart();">Double</button>' +
					'<button type="button" class="btn btn-default" onclick="wordtreeType = \'suffix\';drawChart();">Suffix</button>' +
				'</div>' +
				'<div class="btn-group" role="group" aria-label="...">' +
					'<button type="button" class="btn btn-default" onclick="wordtreeType = \'suffix\'; wordtreeWord = \'\'; drawChart();">Reset</button>' +
				'</div>' +
			'</div>';
        container.append(wordTreeButtons);
        container.append("<div id='commentsWordTree'></div>");
        
        wordtreeRootWord = settings.wordtreeRootWord;
        wordtreeType = settings.wordtreeType;
        allComments = settings.allComments;
        commentWords = settings.commentWords;
        
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
    	
//		function drawChart() {
//	        var data = google.visualization.arrayToDataTable(
//	        		allComments
//	        );
//
//	        var options = {
//	          wordtree: {
//	            format: 'implicit',
//	            word: wordtreeRootWord,
//	            type: wordtreeType
//	          }
//	        };
//
//        	var chart = new google.visualization.WordTree(document.getElementById("commentsWordTree"));
//        	chart.draw(data, options);
//		}
		
		function setUpWordCloudData(words, dataContainer, weightDivider= 1){
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
					wordtreeRootWord = $(this).text(); 
					drawChart();
				}};
			}
		}
	
		function wordcloudHover(word){
// 			console.log(word);
			$(word).popover('show');
		}
		
		$(document).ready(function(){
			var width = $('#commentsWordCloud').parent().css("width");
			width = width.replace("px", "") - 30;
			
			setUpWordCloudData(commentWords, "#commentsWordCloud");
			
			setTimeout(function(){
				google.charts.setOnLoadCallback($.fn.WordCloudWithTree.drawChart())
			}, 300);
			
			$('#commentsWordCloud').jQCloud(commentWords, {
				  width: width,
				  height: 350,
				  colors: ["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"].reverse()
				});
		});
		
        return this;
    };
    
	
    $.fn.WordCloudWithTree.drawChart = function(){
    	  var data = google.visualization.arrayToDataTable(allComments);

	        var options = {
	          wordtree: {
	            format: 'implicit',
	            word: wordtreeRootWord,
	            type: wordtreeType
	          }
	        };

      	var chart = new google.visualization.WordTree(document.getElementById("commentsWordTree"));
      	chart.draw(data, options);
    };
}( jQuery ));