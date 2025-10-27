Country Data Visualization Dashboard

A React + TypeScript project visualizing country and continent data using GraphQL and Apollo Client, with rich features like a language-count bar chart, sortable searchable country table, and responsive design.

GitHub Repository Link
https://github.com/kumarvikas10/MMoser-Assign.git

Features
Region Bar Chart: SVG-based, interactive horizontal bars showing number of languages by continent.

Countries Table: Sortable by country name and number of languages, with continent filter and live search.

Search Filter: Quickly find countries by name with instant, case-insensitive filtering.

Apollo Client: Fetches live data from Countries GraphQL API.

Responsive Design: Works well on desktop and mobile screens.

Getting Started
Clone the repo:

text
git clone https://github.com/kumarvikas10/MMoser-Assign.git
Install dependencies:

text
npm install
Start development server:

text
npm start
Open in Browser:

Visit http://localhost:5173 (default for Vite)

Folder Structure
text
src/
  components/
    RegionChart/
    CountryTable/
    Dashboard/
  types/
  App.tsx
  main.tsx
  
Usage
Click a continent bar to filter the table by that region.

Use the table headers to sort countries.

Use the search box to live-filter countries by name.

