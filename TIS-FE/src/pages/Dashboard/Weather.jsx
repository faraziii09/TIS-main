const Weather = ({ weatherData }) => {
  if (weatherData) {
    return (
      <div className="flex fade justify-center items-center m-2 text-white">
        <img
          alt=""
          className=""
          src={`https://openweathermap.org/img/wn/${weatherData?.weatherIcon}.png`}
        />
        <p className="m-0">{weatherData?.desc}</p>
        <span className="px-1.5">•</span>
        <p className="m-0">
          {weatherData?.temp}
          <sup>o</sup>C
        </p>
      </div>
    );
  }
};

export default Weather;
