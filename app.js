window.addEventListener('load', start);
var searchForm = document.forms.searchForm

var data = getData()



// Get the button
var scrollToTopBtn = document.getElementById("backToTop");

// Function to show or hide the button based on scroll position
window.onscroll = function () {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
};

// Function to smoothly scroll back to the top
scrollToTopBtn.addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


function start() {
    console.log('Page loaded');

    data.then(function (cars) {
        // console.log(cars);
        populateMakeDropdown(cars)
    })
    loadFeaturedCars()

    searchForm.addEventListener('submit', handleFormSubmission);
    document.getElementById('clearBtn').addEventListener('click', clearForm)

    //instant search functionality - event listeners 
    document.getElementById('make').addEventListener('change', runSearch);
    document.querySelectorAll('input[name="fuel"]').forEach(function (radio) {
        radio.addEventListener('change', runSearch);
    });

    document.getElementById('minPrice').addEventListener('input', runSearch);
    document.getElementById('maxPrice').addEventListener('input', runSearch);
}

function getData() {
    return fetch('vehicles.json')
        .then(function (response) {
            return response.json();
        })
}

function populateMakeDropdown(cars) {
    var makeSelect = document.getElementById('make');
    var makeList = cars.map(function (car) {   //extracting the make of each car and putting it in a list
        return car.make
    })

    makeList = new Set(makeList) //removing duplicates from the list of makes
    makeList.forEach(function (make) {  //populating the dropdown with the makes
        var option = document.createElement('option');
        option.value = make.toLowerCase();
        option.innerText = make;
        makeSelect.appendChild(option);
    })
}

function handleFormSubmission(e) {
    console.log('Form submitted');
    e.preventDefault(); //preventing the form from submitting and refreshing the page
    performSearch(false);
}

function filterCars(cars, make, fuel, minPrice, maxPrice) {

    make = make.toLowerCase();
    fuel = fuel.toLowerCase();

    return cars.filter(function (car) {
        // console.log("selected make: ", make)  commented out the console logs for debugging purposes, but they can be uncommented if needed to check the values of the variables
        // console.log("car make: ", car.make)
        // console.log("selected fuel: ", fuel)
        // console.log("car fuel: ", car.fuelType)


        var matchesMake = make === '' || car.make.toLowerCase() === make;
        var matchesFuel = fuel === '' || car.fuelType.toLowerCase() === fuel;
        var matchesPrice = car.price >= minPrice && car.price <= maxPrice //max price is inclusive

        return matchesMake && matchesFuel && matchesPrice;
    })

}

function clearForm() {
    searchForm.reset();

    document.getElementById('resultContainer').innerHTML = '';
    document.getElementById('resultsHeading').classList.add('hidden');

    console.log('Form cleared');
}

function createElement(name, text) {
    var element = document.createElement(name);

    if (text !== undefined) {
        element.innerText = text;
    }
    return element;
}

function renderCars(results, containerId, cardClass, isPreview) {
    var container = document.getElementById(containerId);
    container.innerHTML = '';

    if (results.length === 0) {
        container.appendChild(createElement('p', 'No results found.'));
        return;
    }

    results.forEach(function (car) {

        var card = document.createElement('article');
        card.className = cardClass;

        var imageWrapper = document.createElement('div');
        imageWrapper.className = 'image-wrapper';

        var image = document.createElement('img');

        if (car.image && car.image.startsWith('images/')) {
            image.src = car.image;
        } else {
            image.src = 'images/myicon.png';
        }

        image.alt = car.make + ' ' + car.model;
        imageWrapper.appendChild(image)

        var content = createElement('div')
        content.className = 'featured-content'

        var title = createElement('h3', car.make + ' ' + car.model);
        var price = createElement('p', 'Price: £' + car.price.toLocaleString());
        price.className = 'price'
        var meta = createElement('p', car.year + ' - ' + car.fuelType);
        meta.className = 'meta'

        var button = createElement('button', 'View Details');
        button.className = 'details-btn';

        button.addEventListener('click', function () {
            alert('You clicked on ' + car.make + ' ' + car.model);
        });

        if (isPreview) {
            var simple = createElement(
                'p',
                car.make + " " + car.model + " - £" + car.price.toLocaleString()
            );
            card.append(simple);
        } else {
            content.append(image, title, price, meta, button);
        }

        card.append(imageWrapper, content)
        container.appendChild(card);
    });
}

function runSearch() {
    performSearch(true)
}

function performSearch(isPreview) {

    var selectedMake = document.getElementById('make').value;

    var fuelInput = document.querySelector('input[name="fuel"]:checked');
    var selectedFuel = fuelInput ? fuelInput.value : '';

    var minInput = document.getElementById('minPrice').value;
    var minPrice = minInput === "" ? 0 : Number(minInput);

    var maxInput = document.getElementById('maxPrice').value;
    var maxPrice = maxInput === "" ? Infinity : Number(maxInput);

    data.then(function (cars) {
        var results = filterCars(cars, selectedMake, selectedFuel, minPrice, maxPrice);
        if (isPreview) {
            results = results.slice(0, 5);
        }

        renderCars(results, 'resultContainer', 'car-card', isPreview);
        document.getElementById('resultsHeading').classList.remove('hidden');
    });
}

function loadFeaturedCars() {
    data.then(function (cars) {

        var featuredCars = cars.slice(0, 3);

        renderCars(featuredCars, 'featuredContainer', 'car-card', false);
    });
}