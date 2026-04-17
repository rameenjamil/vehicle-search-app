window.addEventListener('load', start);
var searchForm = document.forms.searchForm

var data = getData()

var allCars = []



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
        allCars = cars
        populateMakeDropdown(cars)
        populateModelDropdown(cars, '')
        populateTransmissionDropdown(cars)
        loadFeaturedCars()
    })

    searchForm.addEventListener('submit', handleFormSubmission);
    document.getElementById('clearBtn').addEventListener('click', clearForm)

    //instant search functionality - event listeners 
    document.getElementById('make').addEventListener('change', function () {
        var selectedMake = this.value;

        populateModelDropdown(allCars, selectedMake);

        runSearch();
    });
    document.querySelectorAll('input[name="fuel"]').forEach(function (radio) {
        radio.addEventListener('change', runSearch);
    });
    document.getElementById('transmission').addEventListener('change', runSearch);
    document.getElementById('minPrice').addEventListener('input', runSearch);
    document.getElementById('maxPrice').addEventListener('input', runSearch);
}

/**
 * Fetches vehicle data from JSON file
 * @returns {Promise<Array<Object>>} Promise resolving to list of cars
 */
function getData() {
    return fetch('vehicles.json')
        .then(function (response) {
            return response.json();
        })
}

/**
 * Populates the make dropdown with unique car makes
 * @param {Array<Object>} cars - list of vehicle objects
 */
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

function populateModelDropdown(cars, selectedMake) {
    var modelSelect = document.getElementById('model');

    modelSelect.innerHTML = '';

    var defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.innerText = 'Any';
    modelSelect.appendChild(defaultOption);

    var filteredCars;

    // filtering cars based on selected make
    if (selectedMake) {
        filteredCars = cars.filter(function (car) {
            return car.make.toLowerCase() === selectedMake.toLowerCase();
        });
    } else {
        filteredCars = cars;
    }

    // extracted models
    var modelList = filteredCars.map(function (car) {
        return car.model;
    });

    // removed duplicates
    modelList = new Set(modelList);

    // populated dropdown
    modelList.forEach(function (model) {
        var option = document.createElement('option');
        option.value = model.toLowerCase();
        option.innerText = model;
        modelSelect.appendChild(option);
    });
    // console.log("Selected make: ", selectedMake)
    // console.log("filtered cars:", filteredCars)
}

function populateTransmissionDropdown(cars) {
    var transmissionSelect = document.getElementById('transmission');

    transmissionSelect.innerHTML = '';

    var defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.innerText = 'Any';
    transmissionSelect.appendChild(defaultOption);

    var transmissionList = cars.map(function (car) {
        return car.transmission;
    });
    transmissionList = new Set(transmissionList);
    transmissionList.forEach(function (transmission) {
        var option = document.createElement('option');
        option.value = transmission.toLowerCase();
        option.innerText = transmission;
        transmissionSelect.appendChild(option);
    });
}

function handleFormSubmission(e) {
    console.log('Form submitted');
    e.preventDefault(); //preventing the form from submitting and refreshing the page
    performSearch(false);
}

/**
 * Filters vehicles based on search criteria
 * @param {Array<Object>} cars - list of vehicles
 * @param {string} make - selected make
 * @param {string} fuel - selected fuel type
 * @param {number} minPrice - minimum price
 * @param {number} maxPrice - maximum price
 * @returns {Array<Object>} filtered vehicles
 */
function filterCars(cars, make, model, fuel, transmission, minPrice, maxPrice, minYear, maxYear) {

    make = make.toLowerCase();
    model = model.toLowerCase();
    fuel = fuel.toLowerCase();

    return cars.filter(function (car) {
        // console.log("selected make: ", make)  commented out the console logs for debugging purposes
        // console.log("car make: ", car.make)
        // console.log("selected model: ", model)
        // console.log("car model: ", car.model)
        // console.log("selected fuel: ", fuel)
        // console.log("car fuel: ", car.fuelType)


        var matchesMake = make === '' || car.make.toLowerCase() === make;
        var matchesModel = model === '' || car.model.toLowerCase() === model;
        var matchesFuel = fuel === '' || car.fuelType.toLowerCase() === fuel;
        var matchesPrice = car.price >= minPrice && car.price <= maxPrice //max price is inclusive
        var matchesYear = car.year >= minYear && car.year <= maxYear;
        var matchesTransmission = !transmission || car.transmission.toLowerCase() === transmission;
        return matchesMake && matchesModel && matchesFuel && matchesPrice && matchesYear && matchesTransmission;
    })

}

/**
 * Renders car results into the DOM
 * @param {Array<Object>} results - filtered cars
 * @param {string} containerId - HTML container ID
 * @param {string} cardClass - CSS class for styling
 * @param {boolean} isPreview - whether to show limited preview
 */
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

            var details =
                "Make: " + car.make + "\n" +
                "Model: " + car.model + "\n" +
                "Year: " + car.year + "\n" +
                "Price: £" + car.price.toLocaleString() + "\n" +
                "Transmission: " + car.transmission + "\n" +
                "Fuel Type: " + car.fuelType + "\n" +
                "Mileage: " + car.mileage.toLocaleString() + " miles\n" +
                "Engine Size: " + car.engineSize + "L\n" +
                "MPG: " + car.mpg + "\n" +
                "Tax: £" + car.tax;

            alert(details);
        });

        content.append(title, price, meta, button);

        card.append(imageWrapper, content)
        container.appendChild(card);
    });
}

function runSearch() {
    performSearch(true)
}

/**
 * Handles search logic and updates UI with results
 * @param {boolean} isPreview - limits number of results if true
 */
function performSearch(isPreview) {

    var selectedMake = document.getElementById('make').value;
    var selectedModel = document.getElementById('model').value;

    var fuelInput = document.querySelector('input[name="fuel"]:checked');
    var selectedFuel = fuelInput ? fuelInput.value : '';

    var minInput = document.getElementById('minPrice').value;
    var minPrice = minInput === "" ? 0 : Number(minInput);

    var maxInput = document.getElementById('maxPrice').value;
    var maxPrice = maxInput === "" ? Infinity : Number(maxInput);

    var transmission = document.getElementById('transmission').value;
    var minYearInput = document.getElementById('minYear').value;
    var minYear = minYearInput === "" ? 0 : Number(minYearInput);

    var maxYearInput = document.getElementById('maxYear').value;
    var maxYear = maxYearInput === "" ? Infinity : Number(maxYearInput);

    var results = filterCars(allCars, selectedMake, selectedModel, selectedFuel, transmission, minPrice, maxPrice, minYear, maxYear);
    if (isPreview) {
        results = results.slice(0, 5);
    }

    renderCars(results, 'resultContainer', 'car-card', isPreview);
    document.getElementById('resultsHeading').classList.remove('hidden');
}

/**
 * Resets search form and clears results
 */
function clearForm() {
    searchForm.reset();

    document.getElementById('resultContainer').innerHTML = '';
    document.getElementById('resultsHeading').classList.add('hidden');

    console.log('Form cleared');
}

/**
 * Creates a DOM element with optional text content
 * @param {string} name - HTML tag name
 * @param {string} text - text content (optional)
 * @returns {HTMLElement}
 */
function createElement(name, text) {
    var element = document.createElement(name);

    if (text !== undefined) {
        element.innerText = text;
    }
    return element;
}

/**
 * Loads and displays featured cars on the homepage
 */
function loadFeaturedCars() {

    var featuredCars = allCars.filter(function (car) {
        return car.featured === true;
    })
        .slice(0, 6);
    renderCars(featuredCars, 'featuredContainer', 'featured-card', false);
}
