import { useState } from 'react'
import { RegionChart } from '../RegionChart'
import { CountryTable } from '../CountryTable'

export const Dashboard = () => {
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null)

  const handleRegionClick = (continentCode: string) => {
    if (selectedContinent === continentCode) {
      setSelectedContinent(null)
    } else {
      setSelectedContinent(continentCode)
    }
  }

  return (
    <div className="dashboard">
      <h2>Languages by Continent</h2>
      <RegionChart 
        onRegionClick={handleRegionClick}
        selectedContinent={selectedContinent}
      />
      <h2>Countries {selectedContinent ? `(Filtered)` : ''}</h2>
      <CountryTable continent={selectedContinent} />
    </div>
  )
}

