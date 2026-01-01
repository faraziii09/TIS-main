import { useEffect, useState } from "react";
import { useStateContext } from "../../ContextProvider";

const format = (value) => {
  if (value < 10) {
    return "0" + value;
  } else {
    return value;
  }
};

function getGreeting(hour) {
  let greeting;

  if (hour >= 5 && hour < 12) {
    greeting = "Good morning";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good afternoon";
  } else if (hour >= 17 && hour < 21) {
    greeting = "Good evening";
  } else {
    greeting = "Good night";
  }

  return greeting + ",";
}

const Info = () => {
  const { User } = useStateContext();
  const [currDateTime, setCurrDateTime] = useState({
    time: "",
    date: "",
  });
  const [greeting, setGreeting] = useState("");

  const updateCurrTime = () => {
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const formattedDate = now.toLocaleDateString("en-US", options);
    setCurrDateTime({
      time: `${format(
        now.getHours() > 12 ? now.getHours() - 12 : now.getHours()
      )}:${format(now.getMinutes())}`,
      date: formattedDate,
    });
    setGreeting(getGreeting(now.getHours()));
  };

  useEffect(() => {
    updateCurrTime();
    const interval = setInterval(updateCurrTime, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div className="mt-6 slide-down">
      <div className="text-center text-white">
        <h1 className="font-bold text-7xl mb-1.5 ">{currDateTime?.time}</h1>
        <p>{currDateTime?.date}</p>
        <p className="mt-8 text-5xl font-bold ">
          {greeting} {User?.displayName}
        </p>
      </div>
    </div>
  );
};

export default Info;
