import "./styles.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type UnitType = 'pv' | 'uv'

const pointsData = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const getValues = (data: typeof pointsData, unit: UnitType) => {
  return data.reduce((acc: number[], point) => {
    acc.push(point[unit])

    return acc
  }, [])
}
const getAverageValue = (values: number[]) => {
  return values.reduce((acc: number, value) => {
    return acc += value
  }, 0) / values.length;
}
const getDeviation = (values: number[], averageValue: number) => {
  const sum = values.reduce((acc: number, currentValue) => {
    return acc += Math.pow((currentValue - averageValue), 2)
  }, 0)

  return Math.sqrt(sum / values.length)
};
const getBreakingPointValues = (
    data: typeof pointsData, unit: UnitType
) => {
  const values = getValues(data, unit);

  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)

  const averageValue = getAverageValue(values)
  const deviation = getDeviation(values, averageValue)

  const breakingPointValue = deviation + averageValue

  const colorBreakingPointPercentage = `${(1 - (breakingPointValue - minValue) / (maxValue - minValue)) * 100}%`

  return { breakingPointValue, colorBreakingPointPercentage }
}

const CustomizedDot = ({props, breakingPointValue, strokeColor}: {
  props: any,
  breakingPointValue: number,
  strokeColor: string
}) => {
  const { cx, cy, value } = props;
  return (
      <svg xmlns="http://www.w3.org/2000/svg">
        <circle
            r="3"
            cx={cx}
            cy={cy}
            fill="white"
            stroke={value > breakingPointValue ? "red" : strokeColor}
        />
      </svg>
  );
};

const CustomizedActiveDot = ({props, breakingPointValue, fillColor}: {
  props: any,
  breakingPointValue: number,
  fillColor: string
}) => {
  const { cx, cy, value } = props;
  return (
      <svg xmlns="http://www.w3.org/2000/svg">
        <circle
            r="4"
            cx={cx}
            cy={cy}
            fill={value > breakingPointValue ? "red" : fillColor}
            stroke="white"
            strokeWidth={2}
        />
      </svg>
  );
};

export default function App() {
  const { breakingPointValue: breakingPointValueUv, colorBreakingPointPercentage: colorBreakPointPercentageUv} = getBreakingPointValues(pointsData, 'uv')
  const { breakingPointValue: breakingPointValuePv, colorBreakingPointPercentage: colorBreakPointPercentagePv } = getBreakingPointValues(pointsData, 'pv')

  return (
      <LineChart
          width={730}
          height={250}
          data={pointsData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <defs>
          <linearGradient id="colorUv" gradientTransform="rotate(90)">
            <stop offset="0%" stopColor="red"/>
            <stop offset={colorBreakPointPercentageUv} stopColor="red"/>
            <stop offset={colorBreakPointPercentageUv} stopColor="#82ca9d"/>
            <stop offset="100%" stopColor="#82ca9d"/>
          </linearGradient>
          <linearGradient id="colorPv" gradientTransform="rotate(90)">
            <stop offset="0%" stopColor="red"/>
            <stop offset={colorBreakPointPercentagePv} stopColor="red"/>
            <stop offset={colorBreakPointPercentagePv} stopColor="#8884d8"/>
            <stop offset="100%" stopColor="#8884d8"/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="name"/>
        <YAxis/>
        <Tooltip/>
        <Legend/>
        <Line
            type="monotone"
            dataKey="uv"
            stroke="url(#colorUv)"
            dot={(props) => <CustomizedDot key={props.key} props={props} breakingPointValue={breakingPointValueUv} strokeColor="#82ca9d" />}
            activeDot={(props: any) => <CustomizedActiveDot key={props.key} props={props} breakingPointValue={breakingPointValueUv} fillColor="#82ca9d" />}
        />
        <Line
            type="monotone"
            dataKey="pv"
            stroke="url(#colorPv)"
            dot={(props) => <CustomizedDot key={props.key} props={props} breakingPointValue={breakingPointValuePv} strokeColor="#8884d8" />}
            activeDot={(props: any) => <CustomizedActiveDot key={props.key} props={props} breakingPointValue={breakingPointValuePv} fillColor="#8884d8" />}
        />
      </LineChart>
  );
}
