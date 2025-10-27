import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import "./CountryTable.css";

const GET_ALL_COUNTRIES = gql`
  query GetAllCountries {
    countries {
      code
      name
      capital
      continent {
        code
        name
      }
      languages {
        code
      }
    }
  }
`;

const GET_COUNTRIES_BY_CONTINENT = gql`
  query GetCountriesByContinent($continentCode: ID!) {
    continent(code: $continentCode) {
      countries {
        code
        name
        capital
        continent {
          code
          name
        }
        languages {
          code
        }
      }
    }
  }
`;

interface Language {
  code: string;
}

interface Continent {
  code: string;
  name: string;
}

interface Country {
  code: string;
  name: string;
  capital: string | null;
  continent: Continent;
  languages: Language[];
}

interface AllCountriesData {
  countries: Country[];
}

interface ContinentCountriesData {
  continent: {
    countries: Country[];
  };
}

interface CountryTableProps {
  continent: string | null;
}

type SortField = "name" | "languageCount";
type SortOrder = "asc" | "desc";

export const CountryTable = ({ continent }: CountryTableProps) => {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const allCountriesQuery = useQuery<AllCountriesData>(GET_ALL_COUNTRIES, {
    skip: continent !== null,
  });

  const continentCountriesQuery = useQuery<ContinentCountriesData>(
    GET_COUNTRIES_BY_CONTINENT,
    {
      variables: { continentCode: continent },
      skip: continent === null,
    }
  );

  const { loading, error, data } = continent
    ? continentCountriesQuery
    : allCountriesQuery;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  if (loading)
    return <div className="country-table-container">Loading countries...</div>;
  if (error)
    return (
      <div className="country-table-container">
        Error loading countries: {error.message}
      </div>
    );

  const countries = continent
    ? (data as ContinentCountriesData)?.continent?.countries || []
    : (data as AllCountriesData)?.countries || [];

  const sortedCountries = [...countries].sort((a, b) => {
    if (sortField === "name") {
      const comparison = a.name.localeCompare(b.name);
      return sortOrder === "asc" ? comparison : -comparison;
    } else {
      const aCount = a.languages.length;
      const bCount = b.languages.length;
      return sortOrder === "asc" ? aCount - bCount : bCount - aCount;
    }
  });

  console.log(sortedCountries);

  const filteredCountries = sortedCountries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderSortArrow = (field: SortField) => {
    if (sortField !== field)
      return <span style={{ marginLeft: "5px", color: "#cbd5e1" }}>↕</span>;
    return sortOrder === "asc" ? (
      <span style={{ marginLeft: "5px" }}>↑</span>
    ) : (
      <span style={{ marginLeft: "5px" }}>↓</span>
    );
  };

  return (
    <div className="country-table-container">
      <div className="table-header">
        <div className="table-info">
          Showing {filteredCountries.length}{" "}
          {filteredCountries.length === 1 ? "country" : "countries"}
        </div>
         <div>
          <input
            type="text"
            placeholder="Search for countries"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="country-search-input"
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="country-table">
          <thead>
            <tr>
              <th
                className={`sortable-header ${
                  sortField === "name" ? "active-sort" : ""
                }`}
                onClick={() => handleSort("name")}
              >
                Country {renderSortArrow("name")}
              </th>
              <th>Capital</th>
              <th
                className={`sortable-header ${
                  sortField === "languageCount" ? "active-sort" : ""
                }`}
                onClick={() => handleSort("languageCount")}
              >
                Languages {renderSortArrow("languageCount")}
              </th>
              <th>Continent</th>
            </tr>
          </thead>
          <tbody>
            {sortedCountries.length === 0 ? (
              <tr>
                <td colSpan={4} className="no-results">
                  No countries found
                </td>
              </tr>
            ) : (
              filteredCountries.map((country) => (
                <tr key={country.code}>
                  <td className="country-name">{country.name}</td>
                  <td>{country.capital || "N/A"}</td>
                  <td className="population-cell">
                    {country.languages.length}
                  </td>
                  <td>{country.continent.name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <small>Click column headers to sort</small>
      </div>
    </div>
  );
};
