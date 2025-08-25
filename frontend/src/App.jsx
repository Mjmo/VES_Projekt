import { useState, useEffect,useRef } from 'react';
import { io } from 'socket.io-client';
import './App.css';
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);



const MAX_POINTS = 20;
const INITIAL_POINTS=20;
const INITIAL_TEMP=20;

function App() {


const initialData = Array(INITIAL_POINTS).fill(INITIAL_TEMP);
  const [temperatureData, setTemperatureData] = useState({
    labels: [],
    datasets: [
      {
        label: "Temprature",
        data:[],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        tension: 0.3,
      },
    ],
  });

  useEffect(() => {
  const socket = io("http://localhost:3000", {
  transports: ["websocket"],
  withCredentials: true,
});
socket.on("connect",()=>{
  console.log("Connected to websocket")
});
socket.on("mqtt_message",(msg)=>{

  console.log("message reciviced",msg.message);
      setTemperatureData((prev) => {
        const newLabels = [...prev.labels, new Date().toLocaleTimeString()].slice(-MAX_POINTS);
        const newData = [...prev.datasets[0].data, msg.message].slice(-MAX_POINTS);

        return {
          labels: newLabels,
          datasets: [
            {
              ...prev.datasets[0],
              data: newData,
            },
          ],
        };
      });

})
    

    return () => {
      socket.off("mqtt_message");
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ height: "400px", padding: "20px" }}>
      <Line
        data={temperatureData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
        }}
        height={300}
      />
    </div>
  );
}

export default App;
