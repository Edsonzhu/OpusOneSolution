import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
  root: {
    width: 350,
  },
  input: {
    width: 55,
  },
});

const Container = styled.div`
  margin: 0 auto 10px;
`

const SliderStyled = ({ setYear, year, rangeYear }) => {
  const classes = useStyles();

  const handleSliderChange = (_event, newValue) => {
    setYear(newValue);
  };

  return (
    <Container className={classes.root}>
      <Typography id="input-slider" gutterBottom>
        Year: {year}
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          {rangeYear[0]}
        </Grid>
        <Grid item xs>
          <Slider
            value={typeof year === 'number' ? year : rangeYear[1]}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            min={rangeYear[0]}
            max={rangeYear[1]}
          />
        </Grid>
        <Grid item>
          {rangeYear[1]}
        </Grid>
      </Grid>
    </Container>
  );
}

export default SliderStyled;