import { useState } from 'react';
import styled from 'styled-components';
import ReactTooltip from "react-tooltip";

// Components
import ChoroplethMap from './components/ChoroplethMap'

const Header = styled.h1`
  text-align: center;
`

const App = () => {
  const [info, setInfo] = useState("");

  return (
    <>
      <Header>CO2 Emission By Year</Header>
      <ChoroplethMap setTooltipContent={setInfo} />
      <ReactTooltip>{info}</ReactTooltip>
    </>
  );
}

export default App;
