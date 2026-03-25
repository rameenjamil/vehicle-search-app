window.addEventListener('load', start);
var searchForm = document.forms.searchForm

var data = getData()

function start() {
    console.log('Page loaded');

    data.then(function (cars) {
        // console.log(cars);
        populateMakeDropdown(cars)
    })
    searchForm.addEventListener('submit', handleFormSubmission);
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

    var selectedMake = document.getElementById('make').value;
    var selectedFuel = document.querySelector('input[name="fuel"]:checked').value;
    var minPrice = Number(document.getElementById('minPrice').value) || 0; //if the user doesn't enter a value, it will default to 0
    var maxPrice = Number(document.getElementById('maxPrice').value) || Infinity

    data.then(function (cars) {
        var results = filterCars(cars, selectedMake, selectedFuel, minPrice, maxPrice);
        console.log(results);
    })
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
        var matchesPrice = car.price >= minPrice && car.price <= maxPrice

        return matchesMake && matchesFuel && matchesPrice;
    })

}