import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { BarChart } from '@mui/x-charts/BarChart';
import { useMemo, useState } from 'react';

export default function BarAnimation({ orders }) {
  const [itemNb, setItemNb] = useState(1);
  const [skipAnimation, setSkipAnimation] = useState(false);

  const lastMonthIncomeData = useMemo(() => {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    if (!Array.isArray(orders)) {
      return [];
    }

    const incomePerDay = {};

    orders.filter(order => new Date(order.date).getMonth() === lastMonth.getMonth()).forEach(order => {
      const totalIncome = order.products.reduce((sum, product) => sum + product.price * product.quantity, 0);
      const date = new Date(order.date);
      const formattedDate = `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;

      if (incomePerDay[formattedDate]) {
        incomePerDay[formattedDate] += totalIncome;
      } else {
        incomePerDay[formattedDate] = totalIncome;
      }
    });

    return Object.entries(incomePerDay).map(([x, y]) => ({ x, y }));
  }, [orders]);

  console.log(lastMonthIncomeData);

  const xLabels = lastMonthIncomeData.slice(0, itemNb).map(item => item.x);

  const highlightScope = {
    highlighted: 'series',
    faded: 'global',
  };

  const series = [
    {
      label: 'Income ',
      data: lastMonthIncomeData.map(item => item.y),
    },
  ].map((s) => ({ ...s, highlightScope }));

  const handleItemNbChange = (event, newValue) => {
    if (typeof newValue !== 'number') {
      return;
    }
    setItemNb(newValue);
  };

  return (
    <Box sx={{ width: "100%" }} >
      {lastMonthIncomeData.length > 0 ? (
        <BarChart
          height={500}
          series={series
            .slice(0, 1)
            .map((s) => ({ ...s, data: s.data.slice(0, itemNb) }))}
          skipAnimation={skipAnimation}
          xAxis={[{ data: xLabels, scaleType: 'band' }]}
          margin={{ left: 70 }}
        />
      ) : (
        <Typography>No data available for the chart.</Typography>
      )}
      <FormControlLabel
        checked={skipAnimation}
        control={
          <Checkbox onChange={(event) => setSkipAnimation(event.target.checked)} />
        }
        label="Skip animation"
        labelPlacement="end"
      />
      <Typography id="input-item-number" gutterBottom>
        Number of Date
      </Typography>
      <Slider
        value={itemNb}
        onChange={handleItemNbChange}
        valueLabelDisplay="auto"
        min={1}
        max={lastMonthIncomeData.length}
        defaultValue={lastMonthIncomeData.length}
        aria-labelledby="input-item-number"
      />
    </Box>
  );
}

