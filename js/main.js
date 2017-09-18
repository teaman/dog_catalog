// function: addPagination: adds pagination div, managed by hiding all rows,
//    			 then showing just those rows that are calculated for the selected page.
// returns: [string] snippet of HTML containing page numbers that are clickble.
// args: prependToID: [string] DOM id to attach the pagination div to using prependToID
// 		rows: [integer] length of the total row count that is being controlled
const addPagination = (prependToID, rows) => {
	const totalRows = rows;
	const recordPerPage = 10;
	const totalPages = Math.ceil(totalRows / recordPerPage);

	// construct the pagination div
	let $pages = $('<div id="pages">Page:</div>');
	for (var i = 0; i < totalPages; i++) {
		if(i===0) {
			$('<span class="pageNumber selected">' + (i + 1) + '</span>').appendTo($pages);
		}
		else {
			$('<span class="pageNumber">' + (i + 1) + '</span>').appendTo($pages);
		}
	}
	$pages.prependTo(prependToID);

	// page number hover highlighting
	$('.pageNumber').hover(
		function() {
			$(this).addClass('focus');
		},
		function() {
			$(this).removeClass('focus');
		}
	);

	// hide all rows, then only show those for page 1
	$('table').find('tbody tr:has(td)').hide();
	let tr = $('table tbody tr:has(td)');
	for (let j = 0; j <= recordPerPage - 1; j++) {
		$(tr[j]).show();
	}

	// handler for clicks on page numbers
	$('span').click(function() {
		//hide all rows
		$('#tblData').find('tbody tr:has(td)').hide();
		let nBegin = ($(this).text() - 1) * recordPerPage;
		let nEnd = $(this).text() * recordPerPage - 1;
		// only show the rows in the page range
		for (let k = nBegin; k <= nEnd; k++) {
			$(tr[k]).show();
		}

		// show highlighting for selected page
		$("span.pageNumber").removeClass('selected');
		$(this).addClass('selected');
	});
};

// function: getRandomDogPhoto
// returns: [string] promise of JSON data message containing photo URL
// args: breed: [string] breed name
// 		subBreed: [string] sub-breed name
const getRandomDogPhoto = (breed, subBreed) => {
	let photoRoute = "https://dog.ceo/api/breed/" + breed + "/images/random";

	// if a sub-breed name was passed in, get the random image for it
	if(subBreed) {
		photoRoute = "https://dog.ceo/api/breed/" + breed + "/" + subBreed + "/images/random";
	}

	// get the photo url
	return $.getJSON(photoRoute).then(function(data) {
		return data;
	});
};

// function: createButtonItemList
// returns: [string] containing an unordered list of items containing buttons
// args: items: [array] of ul items
//       class: [string] class value to apply to each list item
const createButtonItemList = (items, itemClass = '') => {
	let uList = ["<ul>"]; // start the UL tag
	let classStr = '';

	// handle an itemClass value when passed in
	if(itemClass.length) {
		classStr = ' class="' + itemClass + '"';
	}

	// create a list of items tag wrapped in a link string
	for(let i = 0; i < items.length; i++) {
		let btnStr = '<button type="button" data-toggle="modal" data-target="#myModal">' + items[i] + '</button>';
		uList.push('<li' + classStr + '>' +
			btnStr +
		"</li>");
	}
	uList.push("</ul>"); // end UL tag

	return uList.join("");
};


// function: dogBreedRow
// returns: [string] containing a table row with 2 cols: master breed name and a UL of any sub-breeds
// args:
// 		breed: [string] dog breed name
//		subBreeds; [array] of sub breed names
const dogBreedRow = (breed, subBreeds) => {
	let itemListHTML = '';
	let subBreedsCnt = subBreeds.length;
	let breedLink = '<button type="button" data-toggle="modal" data-target="#myModal">' + breed + '</button>';

	// check if there are sub-breeds for this breed of dog
	if(subBreedsCnt > 0) {
		breedLink = breed;
		itemListHTML = createButtonItemList(subBreeds, breed);
	}

	return "<tr>" +
		"<td class='breed'>" + breedLink + "</td>" +
		"<td class='sub-breed'>" + itemListHTML + "</td>" +
	"</tr>";
};


// function: getDogBreeds
// returns: [JSON] promise  of data containing dog breeds and sub-breeds
const getDogBreeds = () => {
	// get all dog breeds and sub-breeds
	return $.getJSON("https://dog.ceo/api/breeds/list/all").then(function(data) {
		return data;
	});
};


// triggers when the page has loaded
$(document).ready(function() {
	// call the dogs
	getDogBreeds().then(function(response) {
		let dogBreeds = [];

		if(response.status === 'error'){
			$("#tblData tbody").html('<tr><td colspan="2" class="error">An error occurred while retrieving dog breeds.</td></tr>');
		}
		else {
			// process each breed (and sub-breed) name
			$.each(response.message, function(breed, subBreeds){
				dogBreeds.push(dogBreedRow(breed, subBreeds));
			});

			// parse the dogBreeds array into a string of HTML content
			// and append it to the table tbody
			$(dogBreeds.join("")).appendTo("#tblData tbody");
		}

		// add pagination to the div with id "#dogs"
		addPagination('#dogs', dogBreeds.length);

		// handler for clicks on an <a class="breed"> tag
		$('.breed button').click(function(e) {
	  	let breed = $(e.target).text();
			let breedTitle = 'Breed: ' + breed;

			// clear out the title and image if previously exists
			$('#myModalLabel').removeClass("error");
			$('#showimagediv').html('').show();
			// set the new modal title
			$('#myModalLabel').text(breedTitle);

			// get a random breed image and display with title
			getRandomDogPhoto(breed).then(function(response) {
				let img = {};

				// check for error
				if(response.status === 'error'){
					$('#myModalLabel').addClass("error");
					$('#myModalLabel').text(response.message); // change the title to show the error msg
				}
				// no error
				else {
					img = $('<img />', {
						src : response.message,
					 	class : "img-responsive"
					});
					$('#showimagediv').html(img).show();
				}
			});

		});

		// handler for clicks on a <li><a> combo
		$('li button').click(function(e) {
			let breed = $(this).parent().attr("class");
			let subBreed = $(e.target).text();
			let breedTitle = 'Breed: ' + breed + ' (' + subBreed + ')';

			// clear out the title and image if previously exists
			$('#myModalLabel').removeClass("error");
			$('#showimagediv').html('').show();
			// set the new modal title
			$('#myModalLabel').text(breedTitle);

			// get a random sub-breed image and display with title
			getRandomDogPhoto(breed, subBreed).then(function(response) {
				let img = {};

				// check for error
				if(response.status === 'error'){
					$('#myModalLabel').addClass("error");
					$('#myModalLabel').text(response.message); // change the title to show the error msg
				}
				// no error
				else {
					img = $('<img />', {
						src : response.message,
					 	class : "img-responsive"
					});
					$('#showimagediv').html(img).show();
				}
			});
		});

	});
});
