import { useQuery, gql } from '@apollo/client'
import './RegionChart.css'

const GET_CONTINENTS = gql`
  query GetContinents {
    continents {
      code
      name
      countries {
        languages {
          code
        }
      }
    }
  }
`

interface Language {
  code: string
}

interface Country {
  languages: Language[]
}

interface Continent {
  code: string
  name: string
  countries: Country[]
}

interface ContinentsData {
  continents: Continent[]
}

interface RegionChartProps {
  onRegionClick: (continent: string) => void
  selectedContinent: string | null
}

export const RegionChart = ({ onRegionClick, selectedContinent }: RegionChartProps) => {
  const { loading, error, data } = useQuery<ContinentsData>(GET_CONTINENTS)

  if (loading) return <div className="region-chart"><div className="chart-container">Loading continents data...</div></div>
  if (error) return <div className="region-chart"><div className="chart-container">Error loading continents: {error.message}</div></div>

  console.log(data)
  const continentData = data?.continents.map(continent => {
    const uniqueLanguages = new Set<string>()
    continent.countries.forEach(country => {
      country.languages.forEach(lang => {
        uniqueLanguages.add(lang.code)
      })
    })
    console.log(uniqueLanguages)
    return {
      code: continent.code,
      name: continent.name,
      languageCount: uniqueLanguages.size
    }
  }).sort((a, b) => b.languageCount - a.languageCount) || []
  console.log(continentData)
  
  const maxLanguages = Math.max(...continentData.map(c => c.languageCount))
  const chartHeight = continentData.length * 60
  const chartWidth = 800
  const labelWidth = 150
  const barMaxWidth = chartWidth - labelWidth - 100
  const barHeight = 40

  return (
    <div className="region-chart">
      <div className="chart-title">Continental Language Distribution</div>
      <div className="chart-container">
        <svg width={chartWidth} height={chartHeight} style={{ display: 'block' }}>
          {continentData.map((continent, index) => {
            const barWidth = (continent.languageCount / maxLanguages) * barMaxWidth
            const yPosition = index * 60 + 10
            const isSelected = selectedContinent === continent.code

            return (
              <g
                key={continent.code}
                onClick={() => onRegionClick(continent.code)}
                style={{ cursor: 'pointer' }}
              >
                <text
                  x={labelWidth - 10}
                  y={yPosition + barHeight / 2}
                  textAnchor="end"
                  alignmentBaseline="middle"
                  style={{ fontSize: '14px', fill: '#333' }}
                >
                  {continent.name}
                </text>
                <rect
                  x={labelWidth}
                  y={yPosition}
                  width={barWidth}
                  height={barHeight}
                  fill={isSelected ? '#2563eb' : '#60a5fa'}
                  stroke={isSelected ? '#1e40af' : 'none'}
                  strokeWidth={isSelected ? 3 : 0}
                  rx={4}
                  ry={4}
                  opacity={isSelected ? 1 : 0.8}
                  style={{ transition: 'all 0.3s ease' }}
                />
                <text
                  x={labelWidth + barWidth + 10}
                  y={yPosition + barHeight / 2}
                  textAnchor="start"
                  alignmentBaseline="middle"
                  style={{ fontSize: '14px', fontWeight: 'bold', fill: '#333' }}
                >
                  {continent.languageCount}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
      <div className="chart-instructions">
        Click on a continent to filter the country table
      </div>
    </div>
  )
}

