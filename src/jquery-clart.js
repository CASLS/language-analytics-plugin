/* ========================================================================
 * CASLS Language Analytics & Reporting Tools: jquery-clart.js v1.0.1
 * http://casls-stash.uoregon.edu/projects/CLART/repos/jquery-language-analytics-plugin
 * ========================================================================
 * Copyright 2018 Center for Applied Second Language Studies
 * Author: Carl Burnstein
 * Licensed under Apache License 2.0 (https://www.apache.org/licenses/LICENSE-2.0.html)
 * ======================================================================== 
 * 
 * Copyright 2018 Center for Applied Second Language Studies

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 * */

(function ( $ ) {
	var allComments = [['Phrases'],["This is a test comment"], ["This is another test comment"], ["This is a third test comment"]];
	var commentWords = [];
	var wordCountArray = {};
	var chartTitle = "<h3 style='text-align:center;'>Word Cloud - Word Tree</h3>";
	
    $.fn.collocationWidget = function(options) {
    	// This is the easiest way to have default options.
        var settings = $.extend({}, $.fn.collocationWidget.defaults, options );
        var plugin = $.fn.collocationWidget;

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
					'<button type="button" class="btn btn-default" onclick="$.fn.collocationWidget.wordTree.type = \'prefix\'; $.fn.collocationWidget.drawWordTree();">Prefix</button>' +
			 		'<button type="button" class="btn btn-default" onclick="$.fn.collocationWidget.wordTree.type = \'double\'; $.fn.collocationWidget.drawWordTree();">Double</button>' +
					'<button type="button" class="btn btn-default" onclick="$.fn.collocationWidget.wordTree.type = \'suffix\'; $.fn.collocationWidget.drawWordTree();">Suffix</button>' +
				'</div>' +
				'<div class="btn-group" role="group" aria-label="...">' +
					'<button type="button" class="btn btn-default" onclick="$.fn.collocationWidget.wordTree.type = \'suffix\'; $.fn.collocationWidget.wordTree.word = \'\'; $.fn.collocationWidget.drawWordTree();">Reset</button>' +
				'</div>' +
			'</div>';
        container.append(wordTreeButtons);
        container.append("<div id='commentsWordTree'></div>");
        container.append('<label class="copyrightLabel" style="position:absolute;bottom:-5px;left:0px;right:0px;height:30px;padding:5px 15px 5px 15px;color:#9B9B9B;text-align:right;">&copy; CASLS Language Analytics & Reporting Tools</label>');
        
        
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
					$.fn.collocationWidget.wordTree.word = $(this).text(); 
					$.fn.collocationWidget.drawWordTree()
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
        	google.charts.setOnLoadCallback($.fn.collocationWidget.drawWordTree)
			
        	//Draw the word cloud.
        	$.fn.collocationWidget.drawWordCloud();
		});
		
        return this;
    };
    
    $.fn.collocationWidget.drawWordCloud = function(){
    	$('#commentsWordCloud').jQCloud(commentWords, {
			  width: $.fn.collocationWidget.wordCloud.width,
			  height: $.fn.collocationWidget.wordCloud.height,
			  colors: $.fn.collocationWidget.wordCloud.colors
			});
    };
	
    $.fn.collocationWidget.drawWordTree = function(){
    	  var data = google.visualization.arrayToDataTable(allComments);

	        var options = {
	          wordtree: {
	            format: $.fn.collocationWidget.wordTree.format,
	            word: $.fn.collocationWidget.wordTree.word,
	            type: $.fn.collocationWidget.wordTree.type
	          },
	          width: $.fn.collocationWidget.wordTree.width,
	          height: $.fn.collocationWidget.wordTree.height,
	        };

      	var chart = new google.visualization.WordTree(document.getElementById("commentsWordTree"));
      	chart.draw(data, options);
    };
    
	 $.fn.collocationWidget.defaults = {
			 // These are the defaults.
	    	allComments: allComments,
	    	commentWords: commentWords,
	    	chartTitle: chartTitle
		 };
	
	 $.fn.collocationWidget.wordTree = {
				width: 350,
				height: 350,
				format: 'implicit',
	            word: '',
	            type: 'suffix'
		};
	 
	 $.fn.collocationWidget.wordCloud = {
				width: 350,
				height: 350,
				colors: ["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"].reverse()
		};
	 
	 
	 $.fn.commentInteractionsWidget = function(options) {
		 // This is the easiest way to have default options.
		 var settings = $.extend({}, $.fn.commentInteractionsWidget.defaults, options );
		 var widget = $.fn.commentInteractionsWidget;
		 
		 var commentCountData = [];
		 var commentWordCountData = [];
		 var commentAverageWordsPerComment = [];
		 var projectLabels = [];
		 
		 for(key in settings.commentsByProject){
			 projectLabels.push(key);
			 var pComments = settings.commentsByProject[key];
			 var commentsCounts = pComments.length;
			 commentCountData.push(commentsCounts);
			 var pWordCount = 0;
			 var pCommentCount = 0;
			 var i;
			 for(i in pComments){
				 var comment = pComments[i];
				 var commentWords = comment.split(" ");
				 pWordCount += commentWords.length;
				 pCommentCount += 1;
			 }
			 var averageWordsPerComment = (pWordCount / pCommentCount).toFixed(2);
			 commentWordCountData.push(pWordCount);
			 commentAverageWordsPerComment.push(averageWordsPerComment);
		 }
	        
		 var container = $(this);
		 
		 $(document).ready(function(){
			 container.append(settings.chartTitle);
			 container.append('<canvas id="projectInteractions" width="100%" height="100%"></canvas>');
			 container.append('<label class="copyrightLabel" style="position:absolute;bottom:-5px;left:0px;right:0px;height:30px;padding:5px 15px 5px 15px;color:#9B9B9B;text-align:right;">&copy; CASLS Language Analytics & Reporting Tools</label>');
			 var ctx = document.getElementById("projectInteractions");
			 var chart1 = new Chart(ctx,{
			    type: 'bar',
			    data: {
			    	labels: projectLabels,
			    	datasets: [
				        {
					        type: "line",
					    	label: "Avg # of words per comment",
					    	fill: false,
					    	borderColor: "#EB2060",
					    	backgroundColor: "#EB2060",
				            data: commentAverageWordsPerComment,
				        },
			    		{
					    	label: "Total comments",
					    	fill: false,
					    	borderColor: "#26A9E0",
					    	backgroundColor: "#26A9E0",
				            data: commentCountData,
				        },
				        {
					        type: "line",
					    	label: "# of words",
					    	fill: false,
					    	borderColor: "#8BC53F",
					    	backgroundColor: "#8BC53F",
				            data: commentWordCountData,
				        },
				    ]
				},
			    options: {
			    	maintainAspectRatio: false,
				}
			});
			 
		 });
		 return this;
	 };
	 
	 $.fn.commentInteractionsWidget.defaults = {
		commentsByProject: {
					"Project 1" : [
						"This is a test comment",
						"This is another test comment",
						"This is a third test comment"
					],
					"Project 2" : [
						"This is a test comment woot",
						"This is another test",
						"This is a third"
					],
					"Project 3" : [
						"This is a test comment woot",
						"This is another test test",
						"This is a third fourth fifth sixth"
					],
				},
	 	chartTitle: "<h3 style='text-align:center;'>Project Interactions</h3>"
	 };
}( jQuery ));