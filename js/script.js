var filters = {}
if (document.location.hash) {
	var hash = document.location.hash.substr(1) //.replace(/%22/g, '"')
		//Below relly should work, but doesn't...
		//hash.replace(/&quot;/ig, '"')
		//hash = encodeURIComponent(hash)
		//console.log(hash)
		//filters = JSON.parse(hash)


	//...therefore this method is used instead:
	var hashArr = hash.replace(/%22/g, '').replace(/{/g, '').replace(/}/g, '').split(',')
	console.log(hashArr)
		//console.log(JSON.parse(document.location.hash.substr(1)))
	for (var i in hashArr) {
		var key = hashArr[i].split(':')[0]
		var value = hashArr[i].split(':')[1]
		console.log(key)
		console.log(value)
		filters[key] = value
	}

}

for (var f in filters) {
	if (filters[f].indexOf(".") > -1 && filters[f].indexOf(".") < 1) {
		$("div[data-filter-group='" + f + "'] > *[data-filter='" + filters[f] + "']").addClass('is-checked active')
	} else {
		console.log("ffwe")
		$("div[data-filter-group='" + f + "'] > input").val(filters[f]);
		console.log($("div[data-filter-group='" + f + "'] > input").attr("data-filter"));
		filters[f] = $("div[data-filter-group='" + f + "'] > input").attr("data-filter")
	}
}

var banned = []
var oked = []
var noMoreTrees = false
$('#no-more-trees').hide()

function initIsotope() {
	$(function() {

		// filter functions
		var filterFns = {
			tallerThan: function() {
				var height = $(this).attr('tree-data-height')
				return $('#filters .taller-than').val() == "" || parseFloat(height) >= parseFloat($('#filters .taller-than').val()); //Ganska fult hardcodat, men jag vet inte hur jag passerar in argument i tallerThan()
			},
			shorterThan: function() {
				var height = $(this).attr('tree-data-height')
				return $('#filters .shorter-than').val() == "" || parseFloat(height) <= parseFloat($('#filters .shorter-than').val()); //Ganska fult hardcodat, men jag vet inte hur jag passerar in argument i shorterThan()
			},
			hardinessZone: function() {
				var hz = $(this).attr('tree-data-hz')
				return $('#filters .hardiness-zone').val() == "" || parseFloat(hz) <= parseFloat($('#filters .hardiness-zone').val()); //Ganska fult hardcodat, men jag vet inte hur jag passerar in argument i hardinessZone()
			},
			phValue: function() {
				var minmax = $(this).attr('tree-data-ph').split("-")
				var ph = $('#filters .ph-value').val()
				return ph >= minmax[0] && ph <= minmax[1] || ph.length == 0
					//return $('#filters .ph-levels').val() == "" || parseFloat(height) <= parseFloat($('#filters .ph-levels').val());//Ganska fult hardcodat, men jag vet inte hur jag passerar in argument i phValue()
			},
			nameFilter: function() {
				var name = $(this).attr('tree-data-name')
				var searchTerm = $('#filters .name-filter').val().toLowerCase()
				return name.indexOf(searchTerm) > -1 || searchTerm.length == 0
			}
		}


		// init Isotope
		window.$container = $('.isotope').isotope({
			itemSelector: '.tree-item',
			layoutMode: 'masonry',
			filter: function() {
				var isMatched = true

				for (var prop in filters) {
					var filter = filters[prop]
						// use function if it matches
					filter = filterFns[filter] || filter
						// test each filter
					if (filter) {
						isMatched = isMatched && $(this).is(filter)
					}
					// break if not matched
					if (!isMatched) {
						break
					}
				}
				return isMatched
			}
		})



		$('#filters').on('click input', '.btn, input', function() {



			// get group key
			var filterGroup = $(this).parents('.btn-group,.input-group').attr('data-filter-group')
			var currentFilter = $(this).attr('data-filter')
				//console.log(currentFilter)
				// set filter for group

			// arrange, and use filter fn
			$(this).siblings('.btn').removeClass('is-checked active').blur()
			if (!$(this).hasClass('is-checked active')) {
				filters[filterGroup] = currentFilter; //Lägger till så att isotope vet vad som ska filtreras 
				$(this).addClass('is-checked active')
			} else {
				if ($(this).hasClass('btn')) { //Annars funkar inte fyll i -fälten som de ska. De avselectas annars med blur().
					$(this).removeClass('is-checked active').blur()
					delete filters[filterGroup] //Tar bort så att isotope vet vad som ska filtreras 
				}
			}

			if ($(this).is('input') && $(this).val().length < 1) {
				$(this).removeClass('is-checked active')
				console.log(filters)
				console.log(filterGroup)
				console.log(filters[filterGroup])
				delete filters[filterGroup]
			}
			console.log(filters)
				//console.log(filters)
			noMoreTrees = false
			$('#no-more-trees').hide()
			addTree(getSuitableTree())
			$container.isotope('arrange')
			updateHash();
			//console.log(loadedTrees.length)
			//console.log(unloadedTrees.length)
		})
	})
}

function updateHash() {
	var hashFilters = {};
	for (var ff in filters) {
		if (filters[ff].indexOf(".") > -1 && filters[ff].indexOf(".") < 1) {
			hashFilters[ff] = filters[ff];
		} else {
			console.log($("div[data-filter-group='" + ff + "'] > input").val())
			hashFilters[ff] = $("div[data-filter-group='" + ff + "'] > input").val();
		}
	}
	document.location.hash = "#" + JSON.stringify(hashFilters);
}

function capitaliseFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function getSuitableTree() {
	var n
	for (var i = unloadedTrees.length - 1; i >= 0; i--) {
		n = unloadedTrees[i]

		//console.log(allTrees[n])
		//console.log(filters)
		if (filters['taller-than']) {
			var hgt = $('#filters .taller-than').val()
			if (parseFloat(allTrees[n].height) >= hgt) {} else {
				continue
			}
		}
		if (filters['shorter-than']) {
			var hgt = $('#filters .shorter-than').val()
			if (parseFloat(allTrees[n].height) <= hgt) {} else {
				continue
			}
		}
		if (filters['hardiness-zone']) {
			var hz = $('#filters .hardiness-zone').val()
			if (parseFloat(allTrees[n].hz) <= hz) {} else {
				continue
			}
		}
		if (filters['ph-value']) {
			var ph = $('#filters .ph-value').val()
			if (allTrees[n].pH.min <= ph && allTrees[n].pH.max >= ph) {} else {
				continue
			}
		}
		if (filters['name-filter']) {
			var term = $('#filters .name-filter').val()
			var str = allTrees[n].scientificName + "/" + allTrees[n].commonName
			str = str.toLowerCase()
			if (str.indexOf(term) > -1) {} else {
				continue
			}
		}
		if (filters['type-of-plant']) {
			if (allTrees[n].type.toLowerCase().replace(" ", "-").indexOf(filters['type-of-plant'].substr(6, 99)) > -1) {} else {
				continue
			}
		}
		if (filters['soil-texture']) {
			if (allTrees[n].soilTextureAdaptation.indexOf(filters['soil-texture'].substr(14, 99)) > -1) {} else {
				continue
			}
		}
		if (filters['soil-salinity']) {
			if (allTrees[n].tolerances.salinity >= parseInt(filters['soil-salinity'].substr(20, 99))) {} else {
				continue
			}
		}
		if (filters['soil-calcium']) {
			if (allTrees[n].tolerances.calcium >= parseInt(filters['soil-calcium'].substr(19, 99))) {} else {
				continue
			}
		}
		if (filters['drought-tolerance']) {
			if (allTrees[n].tolerances.drought >= parseInt(filters['drought-tolerance'].substr(19, 99))) {} else {
				continue
			}
		}
		if (filters['shade-tolerance']) {
			if (allTrees[n].tolerances.shade >= parseInt(filters['shade-tolerance'].substr(17, 99))) {} else {
				continue
			}
		}
		if (filters['deer-tolerance']) {
			if (allTrees[n].tolerances.deer >= parseInt(filters['deer-tolerance'].substr(16, 99))) {} else {
				continue
			}
		}
		if (filters['commercial-availability']) {
			if (allTrees[n].commercialAvailability >= parseInt(filters['commercial-availability'].substr(25, 99))) {} else {
				continue
			}
		}
		if (filters['fruiwer-color']) {
			var fcf = filters['fruiwer-color'].replace(".", "").replace("-fruiwers", "")
			var fct = allTrees[n].aesthetics.flowerColor.concat(allTrees[n].aesthetics.fruitColor)
			if (!allTrees[n].aesthetics.flowerConspicuous && !allTrees[n].aesthetics.fruitConspicuous) {
				continue
			} else if (fcf != "any" && fct.indexOf(capitaliseFirstLetter(fcf)) == -1) {
				continue
			}
		}
		if (filters['edible-parts']) {
			if (allTrees[n].abilities.edible == true && filters['edible-parts'] == ".edible" || allTrees[n].abilities.edible == false && filters['edible-parts'] == ".unedible") {} else {
				continue
			}
		}
		if (filters['leaf-retention']) {
			if (allTrees[n].leafRetention == true && filters['leaf-retention'] == ".evergreen" || allTrees[n].leafRetention == false && filters['leaf-retention'] == ".deciduous") {} else {
				continue
			}
		}


		//console.log("putting in:")
		//console.log(allTrees[n])
		loadedTrees.push(n)
		unloadedTrees.splice(i, 1)
		return allTrees[n]
	}
	noMoreTrees = true
	$('#no-more-trees').show()
}

function addFruiwerColors(arrOrStr) {
	var str = " any-fruiwers "

	if (typeof arrOrStr == "string") {
		str += arrOrStr + "-fruiwers"
	} else {
		str += arrOrStr.join("-fruiwers ") + "-fruiwers"
	}

	return str.toLowerCase()
}

function squeezeImage(obj) {
	var x = 240 / obj.width
	obj.width = parseInt(obj.width * x)
	obj.height = parseInt(obj.height * x)
	return obj
}

function choseWhichImage(arr) {
	if (arr[0] == undefined) {
		return "No Image"
	}
	return 0 //Denna är oftast featured-bilden på wikipedia och är oftast typ bäst.
	return (arr.length * Math.random()) | 0
}

function addTree(tree) {
	if (!tree || tree == null || tree == undefined || waitingToAddImage == true) {
		return
	}
	waitingToAddImage = true
	var classes = 'tree-item'
	var treeItemHeight = Math.pow(parseFloat(tree.height), 0.65) * 30
	classes += ' item-size-' + treeItemHeight
	classes += ' type-' + tree.type.toLowerCase().replace(" ", "-")
	if (tree.foliage.color) {
		classes += ' tree-color-' + tree.foliage.color.toLowerCase().replace(" ", "-")
	}
	if (tree.aesthetics.flowerConspicuous) {
		classes += addFruiwerColors(tree.aesthetics.flowerColor)
	} //Dessa kan behöva ändras till "if(blabla == 'true')"
	if (tree.aesthetics.fruitConspicuous) {
		classes += addFruiwerColors(tree.aesthetics.fruitColor)
	}
	if (tree.abilities.edible == true) {
		classes += " edible"
	} else {
		classes += " unedible"
	}

	if (tree.leafRetention == true) {
		classes += " evergreen"
	} else {
		classes += " deciduous"
	}
	for (var tolerance in tree.tolerances) {
		if (tree.tolerances[tolerance] == 3) {
			classes += ' ' + tolerance + '-tolerance-3' + ' ' + tolerance + '-tolerance-2' + ' ' + tolerance + '-tolerance-1' + ' ' + tolerance + '-tolerance-0'
		} else if (tree.tolerances[tolerance] == 2) {
			classes += ' ' + tolerance + '-tolerance-2' + ' ' + tolerance + '-tolerance-1' + ' ' + tolerance + '-tolerance-0'
		} else if (tree.tolerances[tolerance] == 1) {
			classes += ' ' + tolerance + '-tolerance-1' + ' ' + tolerance + '-tolerance-0'
		} else {
			classes += ' ' + tolerance + '-tolerance-0'
		}
	}
	if (tree.commercialAvailability == 3) {
		classes += ' commercial-availability-3' + ' commercial-availability-2' + ' commercial-availability-1' + ' commercial-availability-0'
	} else if (tree.commercialAvailability == 2) {
		classes += ' commercial-availability-2' + ' commercial-availability-1' + ' commercial-availability-0'
	} else if (tree.commercialAvailability == 1) {
		classes += ' commercial-availability-1' + ' commercial-availability-0'
	} else {
		classes += ' commercial-availability-0'
	}
	for (var i = 0; i < tree.soilTextureAdaptation.length; i++) {
		classes += " soil-texture-" + tree.soilTextureAdaptation[i].toLowerCase()
	}
	var tih = 240
	if (tree.images.length > 0) {
		var imgChoiceNum = choseWhichImage(tree.images)
		tih = tree.images[imgChoiceNum].height
		var canvas = $('<img class="tree-visual" src="' + tree.images[imgChoiceNum].url + '" style=height:' + tih + 'px;width=240px">')
	} else {
		var canvas = $('<canvas class="tree-visual" id="canvasfor' + tree.id.toLowerCase() + '" style=width:240px;height:240px"></canvas>')
		setTimeout(function() {
			drawTree(tree.id, tree.type)
			$(".fancybox").fancybox({
				openEffect: 'elastic',
				closeEffect: 'elastic',
				preload: false,
				arrows: false,
				iframe: {
					scrolling: true,
					preload: false
				}
			});
		}, 100)
	}

	var treeItem = $('<div id="' + tree.id + '" class="' + classes + '" tree-data-name="' + tree.scientificName.toLowerCase() + "/" + tree.commonName.toLowerCase() + '" tree-data-height="' + tree.height + '" tree-data-hz="' + tree.hz + '" tree-data-ph="' + tree.pH.min + '-' + tree.pH.max + '"></div>')
	var wikiHref = $('<a class="fancybox fancybox.iframe" rel="group" href="http://en.m.wikipedia.org/wiki/' + tree.scientificName.replace(" ", "_") + '?printable=yes"></a>')

	var modTools = $('<div class="mod-tools"></div>')
	var okImg = $('<div class="glyphicon glyphicon-ok-circle"></div>').on('click', function() {
		oked.push(tree.images[imgChoiceNum].url)
			//console.log(JSON.stringify(oked))
	})
	var countImg = $('<span>' + tree.images.length + '</span>')
	var banImg = $('<div class="glyphicon glyphicon-ban-circle"></div>').on('click', function() {
		banned.push(tree.images[imgChoiceNum].url)
			//console.log(JSON.stringify(banned))
	})
	modTools.append(okImg).append(countImg).append(banImg)

	var treeNameTag = $('<div class="tree-name-tag"></div>')
	var commonName = $('<h4 class="common-name">' + tree.commonName + '</h4>')
	var scientificName = $('<p class="text-center soft">' + tree.scientificName + '</p>')
	treeNameTag.append(commonName).append(scientificName)
	wikiHref.append(canvas)
	treeItem.append(wikiHref).append(treeNameTag) //.append(modTools)
	$('#tree-list').append(treeItem).isotope('insert', treeItem)
	waitingToAddImage = false
	if (!noMoreTrees && $(window).scrollTop() + ($(window).height() * 2) > $(document).height()) {
		addTree(getSuitableTree())
	}
}

function initialPopulationWithTrees() {
	initIsotope()
		/*for (var i = 0; i < 1/**parseInt(Object.keys(allTrees).length - 1)**/
		/*; i++) {
		    
		  }*/
	addTree(getSuitableTree())
	setTimeout(function() {
		$container.isotope('arrange')
	}, 300)
}

function shuffleArrayUsingFisherYatesShuffleAlgorithm(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1))
		var temp = array[i]
		array[i] = array[j]
		array[j] = temp
	}
	return array
}

function getTreeData() {

	$('.navbar, .centerer, .footer').hide() //Gömmer grejer så att loading-sidan blir fin.
	$('#loading-overlay').activity({
		outside: true,
		length: 15,
		space: 5,
		width: 8
	})

	$.ajax({
		'async': true, //Ändrade från false för att jag fick ett trökigt felmeddelande. Men allt funkade! - 2014-08-28
		'global': true,
		'url': "json/trees.json",
		'dataType': "json",
		'success': function(data) {
			$('.navbar, .centerer').show()
			$('#loading-overlay').activity(false).hide()

			window.allTrees = data
			window.loadedTrees = []
			window.unloadedTrees = []
			for (var t in data) {
				unloadedTrees.push(t)
			}
			unloadedTrees = shuffleArrayUsingFisherYatesShuffleAlgorithm(unloadedTrees)
			initialPopulationWithTrees()
			$('#share-box').share({
				networks: ['twitter', 'facebook'],
				orientation: 'horizontal',
				urlToShare: 'http://plantselectr.com',
				//affix: 'right bottom'
			});
			$('.footer').show()
		}
	})
}

getTreeData()


function fixContainerWidth() {
	var itemWidth = 246
	var minFreeSizeColumnWidth = $(window).width() / 20
	var numberOfContentColumns = Math.floor(($(window).width() - (minFreeSizeColumnWidth * 2)) / itemWidth)
	var newPad = ($(window).width() - (minFreeSizeColumnWidth * 2)) % itemWidth
	$('.centerer').css({
		'width': itemWidth * numberOfContentColumns
	})
	var navHeight = $('.navbar').height() - 20
		//Endast nödvändig när navbar bar classen navbar-fixed-top: $('.centerer').css('margin-top',navHeight)/**.css('padding-left',$(window).width()/20).css('padding-right',$(window).width()/20)**/
		//var treeListWidth = minFreeSizeColumnWidth * numberOfContentColumns
		//$('.container').css({'padding-left':newPad})
}

fixContainerWidth()

$(window).resize(function() {
	fixContainerWidth()
})

var waitingToAddImage = false
$(window).scroll(function() {
	if (!noMoreTrees && $(window).scrollTop() + ($(window).height() * 2) > $(document).height()) {
		addTree(getSuitableTree())
			/*if (waitingToAddImage == false){
			  //console.log("ÄR ingen swt igång")
			  addTree(getSuitableTree())
			}
			else {
			  //console.log("Är en scrollwaittimer igång")
			}*/
	}
})


//Min egenkonstruerade halvsmarta popup-bubble-justerare
$(document).ready(function() {
	if (navigator.userAgent.match(/msie/i)) {
		alert("Most things on this site probably won't work for you. Please consider switching to a modern browser.")
	}
	$('.glyphicon-info-sign').mouseover(function() {
		var ol = $(this).children('.info-bubble').offset().left
		var l = $(this).children('.info-bubble').css('left')
		console.log(ol)
		console.log($(window).width())
		console.log($(window).width() - 283)
		if (ol < 1) {
			newL = parseInt(l) + (1 - ol)
			$(this).children('.info-bubble').css('left', newL)
		} else if (ol > $(window).width() - 283) {
			console.log("För långt till höger..")
			newL = parseInt(l) - (ol - ($(window).width() - 283))
			$(this).children('.info-bubble').css('left', newL)
		}
	})
	$(document).keydown(function(e) {
		if (e.keyCode == 81) {
			console.log("unloadedTrees:")
			console.log(unloadedTrees)
			console.log("loadedTrees:")
			console.log(loadedTrees)
			console.log("filters:")
			console.log(filters)
			console.log("Borde fortsätta lägga till träd för att fönstret är nerscrollat:")
			console.log(!noMoreTrees && $(window).scrollTop() + ($(window).height() * 2) > $(document).height())
		}
	})
})