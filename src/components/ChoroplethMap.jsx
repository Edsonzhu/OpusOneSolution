import { useState, useEffect, memo } from 'react';
import styled from 'styled-components';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { csv } from "d3-fetch";

// Components
import Slider from './Slider';

const CO2_DATA_URL = 'https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.csv';
const geoUrl = 'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-50m-simplified.json';

const Header = styled.div`
  font-size: 20px;
  margin-bottom: 1px;
  text-align: center;
`

const ChoroplethMap = ({ setTooltipContent }) => {
  const [data, setData] = useState([]);
  const [year, setYear] = useState();
  const [range, setRange] = useState([100, -100]);
  const [rangeYear, setRangeYear] = useState([2021, 1980]);
  const [dataByYear, setDataByYear] = useState([]);

  const colorScale = scaleLinear()
    .domain(range)
    .range(["#c6f5d3", "#07a634"]);

  useEffect(() => {
    csv(CO2_DATA_URL).then(csv => {
      let rangeYearHolder = rangeYear;
      
      csv.forEach((item) => {
        const yearParsed = parseInt(item.year);
    
        if (rangeYearHolder[0] > yearParsed) {
          rangeYearHolder[0] = yearParsed;
        } else if (rangeYearHolder[1] < yearParsed) {
          rangeYearHolder[1] = yearParsed;
        }
      })
      setRangeYear(rangeYearHolder);
      setYear(rangeYearHolder[1]);
      setData(csv);
    });
  }, []);

  useEffect(() => {
    let rangeHolder = range;

    const filteredByYear = data.filter(item => {
      const co2Parsed = parseFloat(item.co2);

      if (item.year == year) {
        if (rangeHolder[0] > co2Parsed) {
          rangeHolder[0] = co2Parsed;
        } else if (rangeHolder[1] < co2Parsed && item.iso_code !=="OWID_WRL" && item.iso_code !=='') {
          rangeHolder[1] = co2Parsed;
        }
        return true;
      }
      return false;
    });
    setRange(rangeHolder);
    setDataByYear(filteredByYear);
  }, [data, year]);

  return <>
    <Slider setYear={setYear} year={year} rangeYear={rangeYear} />
    <ComposableMap 
      data-tip=""  
      projectionConfig={{
        scale: 110,
        rotation: [-11, 0, 0],
      }}
      width={500}
      height={290}
      style={{ width: "100%", height: "auto" }}  
    >
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map(geo => {
            const cur = dataByYear.find(country => country.iso_code === geo.properties.ISO_A3);
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onMouseEnter={() => {
                  setTooltipContent(() =>
                  (cur && cur.country
                    ? <><Header>{cur.country}</Header><br />
                    Cement CO2: {cur.cement_co2 === '' ? '0' : cur.cement_co2} <br />
                    Coal CO2: {cur.coal_co2 === '' ? '0' : cur.coal_co2} <br />
                    Consumption CO2: {cur.consumption_co2 === '' ? '0' : cur.consumption_co2} <br />
                    Flaring CO2: {cur.flaring_co2 === '' ? '0' : cur.flaring_co2} <br />
                    Gas CO2: {cur.gas_co2 === '' ? '0' : cur.gas_co2} <br />
                    Oil CO2: {cur.oil_co2 === '' ? '0' : cur.oil_co2} <br />
                    Trade CO2: {cur.trade_co2 === '' ? '0' : cur.trade_co2} <br />
                    Methane: {cur.methane === '' ? '0' : cur.methane} <br />
                    Nitrous Oxide: {cur.nitrous_oxide === '' ? '0' : cur.nitrous_oxide} <br />
                    Other Industry CO2: {cur.other_industry_co2 === '' ? '0' : cur.other_industry_co2} <br />
                    Total CO2: {cur.co2 === '' ? '0' : cur.co2} <br />
                    CO2 Growth %: {cur.co2_growth_prct === '' ? '0' : cur.co2_growth_prct} <br />
                  </>
                  :'No CO2 emission'
                  ));
                }}
                onMouseLeave={() => {
                  setTooltipContent("");
                }}
                fill={colorScale(cur ? cur.co2 : "#FFF")}
                style={{
                  default: {
                    outline: 'none'
                  },
                  hover: {
                    fill: "#F53",
                    outline: 'none'
                  },    
                  pressed: {
                    outline: 'none'
                  }
                }}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  </>
}

export default memo(ChoroplethMap);