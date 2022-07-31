import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Graph = ({ fills }) => {
    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Pnl Graph',
          },
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'second',
                    displayFormats: {
                        second: 'MMMM dd, h:mm:ss a'
                    }
                }
            },
            y: {
                beginAtZero: true
            }
        }
    };

    const labels = fills.map(fill => fill.timestamp);
    const pnls = fills.map(fill => fill.pnl)
    const cumulativePnl = []
    pnls.reduce( (prev, cur, i) => cumulativePnl[i] = prev + cur, 0)

    const data = {
        labels,
        datasets: [
          {
            label: 'PnL per timestamp',
            data: pnls,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'Cumulative PnL',
            data: cumulativePnl,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          }
        ],
    };

    return <Line options={options} data={data} />;
}
  
export default Graph