# AutoMarket – Vehicle Search Application

## Overview
AutoMarket is a client-side web application designed to allow users to search and filter a dataset of vehicles using multiple criteria. The application is developed using HTML, CSS, and JavaScript, and demonstrates dynamic content rendering, efficient data handling, and responsive user interaction.

---

## Features

- Dynamic search and filtering:
  - Filter by make, model, fuel type, and transmission  
  - Price range and year range filtering  
- Instant search:
  - Results update in real time as users interact with inputs  
- Dynamic user interface:
  - Vehicle cards generated using JavaScript DOM manipulation  
- Featured vehicles:
  - Highlighted vehicles loaded directly from the dataset  
- Responsive design:
  - Layout adapts to different screen sizes, including mobile devices  
- Accessibility:
  - Semantic HTML structure  
  - Keyboard-friendly navigation  
- Back to top functionality  
- Mobile navigation menu  

---

## Technologies Used

- HTML5 – semantic structure  
- CSS3 – styling, layout, and responsiveness  
- JavaScript (ES6) – application logic, DOM manipulation, and event handling  
- JSON – structured vehicle dataset  

---

## How It Works

### Data Handling
Vehicle data is stored in a JSON file (`vehicles.json`) and retrieved using the `fetch()` API. The data is stored in a global variable:

```javascript
var allCars = [];
```
This approach improves performance by ensuring the dataset is loaded once and reused throughout the application. By avoiding repeated calls to `fetch()`, the application becomes more efficient and scalable, particularly as the dataset grows.

---

### Search Logic

Filtering is implemented using the `filterCars()` function. This function processes user input and applies multiple conditions using JavaScript’s `.filter()` method.

The filtering criteria include:

- Make and model  
- Fuel type  
- Transmission  
- Price range  
- Year range  

Each condition returns a boolean value, and only vehicles that satisfy all selected criteria are included in the results. This allows accurate and efficient data filtering.

---

### Instant Search Behaviour

The application provides real-time filtering through event-driven programming. Event listeners are attached to form inputs such as dropdowns and numeric fields. When a user changes a value, the `runSearch()` function is triggered, which calls `performSearch()`.

This allows results to update instantly without requiring a page reload, improving the overall user experience.

---

### Dynamic Rendering

Search results are displayed dynamically using the `renderCars()` function. Instead of using static HTML, elements are created programmatically using `document.createElement()`.

Each vehicle is displayed as a card containing:

- Image  
- Title (make and model)  
- Price  
- Key vehicle details  
- “View Details” button  

This approach allows the interface to update efficiently based on filtered results.

---

### Event Handling

The application uses a combination of direct event listeners and event delegation:

- `change` events for dropdown inputs  
- `input` events for price and year fields  
- Event delegation for dynamically generated “View Details” buttons  

Event delegation is implemented at document level, allowing interaction with dynamically created elements without attaching individual listeners to each button.

---

### User Interaction

When the “View Details” button is clicked, additional vehicle information is displayed using a JavaScript alert. The full vehicle object is stored using `data-*` attributes, allowing easy retrieval without additional data processing.

---

### Performance and Scalability

The application is designed with performance in mind:

- Data is fetched once and reused  
- Efficient filtering is achieved using `.filter()`  
- Event delegation reduces the number of event listeners  

For larger datasets, further improvements such as pagination or server-side filtering could be implemented.

## Project Structure
```
AutoMarket/
│── index.html
│── style.css
│── app.js
│── vehicles.json
│── images/
│── cars-logo/
```


---

## How to Run

1. Clone or download the repository  
2. Open `index.html` in a web browser  

For an improved development workflow, it is recommended to use Live Server within Visual Studio Code.

---

## Testing and Debugging

- Debugging carried out using `console.log()` to monitor data flow and function behaviour  
- HTML and CSS validated using W3C validation tools  
- Accessibility evaluated using WAVE and Lighthouse  

---

## Scalability

The application is designed with scalability in mind:

- Data is loaded once and reused (`allCars`)  
- Efficient filtering implemented using `.filter()`  

### Future Improvements

- Pagination for larger datasets  
- User authentication and saved vehicle functionality  
- Interactive brand-based filtering  

---

## Learning Outcomes

This project demonstrates:

- Development of dynamic web content using JavaScript  
- Implementation of efficient search and filtering mechanisms  
- Use of DOM manipulation and event-driven programming  
- Application of responsive and accessible design principles  
- Use of GitHub for version control and project management  

---

## Author

Developed as part of a coursework assignment.

---

## Licence

This project is intended for educational purposes only.
