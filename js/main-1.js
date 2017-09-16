const getRandomDogPhoto = (breed, subBreed) => {
	let photoURL = "https://dog.ceo/api/breed/" + breed + "/images/random";

	// if a sub-breed name was passed in, get the random image for it
	if(subBreed) {
		photoURL = "https://dog.ceo/api/breed/" + breed + "/" + subBreed + "/images/random";
	}
	// get the photo url
	$.getJSON( photoURL, function(data) {
		return data.message;
	});
	// else return empty string
	return "";
}

// function: unorderedItemsList
// returns: [string] containing an unordered list of items
const unorderedItemsList = (items) => {
	let uList = ["<ul>"];

	// create a list item tag for each sub breed of dog
	for(let i = 0; i < items.length; i++) {
		uList.push("<li id='" + items[i] + "'>" +
			items[i] +
		"</li>");
	}
	uList.push("</ul>");

	return uList.join("");
};


// function: dogBreedRow
// returns: [string] containing a table row with 2 cols: master breed name and a UL of any sub-breeds
const dogBreedRow = (breed, subBreeds) => {
	let subBreedUList = "---";
	let subBreedsCnt = subBreeds.length;

	// check if there are sub-breeds for this breed of dog
	if(subBreedsCnt > 0) {
		subBreedUList = unorderedItemsList(subBreeds);
	}

	return "<tr>" +
			"<td class='breed' id='" + breed + "'>" + breed + "</td>" +
			"<td class='sub-breed'>" +
			subBreedUList +
			"</td>" +
		"</tr>";
};

// triggers when the page has loaded
$(document).ready(function() {

	// get all dog breeds and sub-breeds
	$.getJSON( "https://dog.ceo/api/breeds/list/all", function( data ) {
		let dogBreeds = [];

		// process each breed (and sub-breed)
		$.each(data.message, function(breed, subBreads){
			dogBreeds.push(dogBreedRow(breed, subBreads));
		});

		// parse the dogBreeds array into a string of HTML content
		// and append it to the table tbody
		$(dogBreeds.join("")).appendTo("#tblData tbody");

		// ---- PAGINATION ----
		const totalRows = dogBreeds.length;
	  const recordPerPage = 20;
	  const totalPages = Math.ceil(totalRows / recordPerPage);

		// construct the pagination div
	  let $pages = $('<div id="pages">Page: </div>');
	  for (var i = 0; i < totalPages; i++) {
			if(i===0) {
				$('<span class="pageNumber selected">&nbsp;' + (i + 1) + '</span>').appendTo($pages);
			}
			else {
				$('<span class="pageNumber">&nbsp;' + (i + 1) + '</span>').appendTo($pages);
			}
	  }
		$pages.prependTo('#dogs');

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

		// click on page number
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
		// ---- END PAGINATION ----

	});
});
