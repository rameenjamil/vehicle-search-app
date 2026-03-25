window.addEventListener('load', start);

var data = getData()

function start() {
    console.log('Page loaded');

    data.then(function (cars) {
        console.log(cars);
        populateMakeDropdown(cars)
    })

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
        option.value = make;
        option.innerText = make;
        makeSelect.appendChild(option);
    })
}
