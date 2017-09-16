// triggers when the page has loaded
$(document).ready(function() {

	// const getRandomDogPhoto = (breed, subBreed) => {
	function getRandomDogPhoto(breed, subBreed) {
		let photoRoute = "https://dog.ceo/api/breed/" + breed + "/images/random";

		// if a sub-breed name was passed in, get the random image for it
		if(subBreed) {
			photoRoute = "https://dog.ceo/api/breed/" + breed + "/" + subBreed + "/images/random";
		}
		// get the photo url
		// $.getJSON( photoRoute, function(data) {
		return $.getJSON(photoRoute).then(function(data) {
			return data.message;
		});
	}


	function getPhotoURLs(breed, subBreedsArr) {
		let photoArr = [];

		for(let i = 0; i < subBreedsArr.length; i++) {
			getRandomDogPhoto(breed, subBreedsArr[i]).then(function(subBreedPhotoURL) {
				photoArr[subBreedsArr[i]] = subBreedPhotoURL;
			});
		}
		return photoArr;
	}

	// function: createPhotoDiv
	// returns: [string] containing HTML div with linked photo and label
	const createPhotoDiv = (key, photoURL) => {
		return "" +
			"<div>" +
				"<a class='post-avatar thumbnail' href='" + photoURL + "'>" +
					"<img src='" + photoURL + "'>" +
					"<div class='text-center text-transform capitalize'>" + key + "</div>" +
				"</a>" +
			"</div>";
	};

// 	// function: createSubBreedPhotoList
// 	// returns: [string] containing HTML for sub breed dog names and photos
// 	const createSubBreedPhotoList = (breed, subBreeds) => {
// 		let photoArr = [];
//
// 		for(let i = 0; i < subBreeds.length; i++) {
// 			$.getJSON(photoRoute).then(function(subBreedPhotoURL) {
// 				photoArr[subBreeds[i]] = subBreedPhotoURL;
// 			});
// 		// getRandomDogPhoto(breed, subBreeds[i]).then(function(subBreedPhotoURL) {
// 		// 		// subBreedsDivList.push(createPhotoDiv(breed, subBreedPhotoURL));
// 		// 		photoArr[subBreeds[i]] = subBreedPhotoURL;
// 		// 	});
// 		}
//
// 		return photoArr.join("");
// 	};

	// function: dogBreedRow
	// returns: [string] containing a table row with 2 cols: master breed name and a UL of any sub-breeds
	const dogBreedRow = (breed, subBreeds) => {
		let breedPhotoURLs = "";
		let breedPhotos = "";
		let subBreedsCnt = subBreeds.length;

			// check if there are sub-breeds for this breed of dog
			if(subBreedsCnt > 0) {
				breedPhotoURLs = getPhotoURLs(breed, subBreeds);
console.log(breedPhotoURLs);

				for(let i = 0; i < subBreeds.length; i++) {
console.log(subBreeds[i]);

					// createPhotoDiv(subBreeds[i], breedPhotoURLs[subBreeds[i]]);
				}
				// breedPhotos = createSubBreedPhotoList(breed, subBreeds);
			}


			return "<tr>" +
					"<td class='breed' id='" + breed + "'>" + breed + "</td>" +
					"<td class='sub-breed'>" +
						"<div class='well'>" +
							breedPhotos +
						"</div>" +
					"</td>" +
				"</tr>";
		// });
	};


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
