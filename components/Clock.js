import React ,{useState,useEffect} from "react";

export default function Clock() {
    const [time, setTime] = useState();
    useEffect(() => {
        setInterval(() => {
            const date = new Date();
            setTime(date.toLocaleTimeString());
        }, 1000);
    } , []);
  return (
    <div className="clock">{time}</div>
  )
}