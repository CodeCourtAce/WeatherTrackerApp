import dotenv from 'dotenv';
dotenv.config();
import { Dayjs } from 'dayjs';

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  id: number;
  lat: number;
  lng: number;
  name: string;
  country: string;
  //state: string;
}
// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: Dayjs | string;
  icon: string;
  iconDescription: string;
  tempF: number;
  humidity: number
  windSpeed: number;

  constructor(city: string, date: Dayjs | string, icon: string, iconDescription: string, tempF: number, windSpeed: number, humidity: number) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.humidity = humidity;
    this.windSpeed = windSpeed;

  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: any = process.env.API_BASE_URL;
  private APIKey: any = process.env.API_KEY;
  private cityName: string;
  //constructor
  constructor(cityName: string) {
    this.cityName = cityName;
  }
  // TODO: Create fetchLocationData method
  

  private async fetchLocationData() {
    const response = await fetch(this.buildGeocodeQuery());
    //console.log(response,"Line 50");
    if (!response.ok) {
      throw new Error("Failed to fetch location data");
    }
    const locationData = await response.json();
    //console.log(locationData, "Line 55");
    return locationData;
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    //console.log(locationData, "Location Data 59")
    const { city } = locationData;
    const { id, name, coord, country, } = city;
    const { lat, lon } = coord;
    const lng = lon;
    const coordinates: Coordinates = { id, lat, lng, name, country };
    return coordinates;
  }
  // TODO: Create buildGeocodeQuery method
  //uses city name to do the geocode query from the API documentation
  private buildGeocodeQuery(): string {
    return `${this.baseURL}?q=${this.cityName}&appid=${this.APIKey}&units=imperial`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    //const coordinates = await this.fetchAndDestructureLocationData();
    if (!coordinates) {
      throw new Error('Unable to fetch coordinates.')
    }
    const { lat, lng } = coordinates;
    //console.log(lat, "Line 81");
    //console.log(lng, "Line 82");
    return `${this.baseURL}?lat=${lat}&lon=${lng}&appid=${this.APIKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    try {
      const response = await this.fetchLocationData();
      //console.log(response, "Line 87");
      if (!response) {
        console.error();
        throw new Error('Network response error.');
      }
      //console.log("line 92",response.json());

      // Destructure the relevant data from the response
      const coordinates = this.destructureLocationData(response);

      //console.log(coordinates, "Line 95");

      return coordinates;

    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      return undefined;

    }
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData() {
    try {
      const coordinates = await this.fetchAndDestructureLocationData();
      //console.log(coordinates, "Line 111")
      if (!coordinates) {
        throw new Error("Unable to fetch coordinates")
      }
      const weatherQuery = this.buildWeatherQuery(coordinates);
      const response = await fetch(weatherQuery);
      //console.log(weatherQuery, "Line 119");
      //console.log(response, "Line 120");
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      
      const weatherData = await response.json();
      //console.log('weatherData',weatherData)
      //console.log('forcastarray',weatherData[1])
      return weatherData;

      
  
      // const temperature = weatherData.list[0].main.temp;
     
      // const { cityName, date, icon, description, temp, humidity, wind } = weatherData; // Assuming this structure
      // new Weather(cityName, date, icon, description, temp, humidity, wind);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return undefined;
    }

  }

  // TODO: Build parseCurrentWeather method 
  // 5 day 
  private async parseWeatherData(i: number) {
    const data = await this.fetchWeatherData();
   // console.log(data, "line 142")
   //console.log(data.list.length)
    try {

      const parsedWeather = {
        cityName: data.city.name,
        date: new Date(data.list[i].dt * 1000).toLocaleDateString(),
        icon: data.list[i].weather[0].icon,
        description: data.list[i].weather[0].description,
        temp: data.list[i].main.temp,
        windSpeed: data.list[i].wind.speed,
        humidity: data.list[i].main.humidity,
      };
      const tempF = parseFloat(((parsedWeather.temp - 273.15) * 1.8 + 32).toFixed(2));
      //console.log(parsedWeather, "Line 156")
      const weather = new Weather(
        parsedWeather.cityName,
        parsedWeather.date,
        parsedWeather.icon,
        parsedWeather.description,
        tempF,
        parsedWeather.windSpeed,
        parsedWeather.humidity);

      return weather;
    } catch (err) {
      console.error("Error parsing weather data.", err)
      return undefined;
    }

  }
  //parseCurrentWeather();

  // TODO: Complete buildForecastArray method
  private async buildForecastArray() {
    const forecastArray = [];
    const data = await this.fetchWeatherData();
    //console.log('buildForecastArray data', data)
    // Assuming weatherData contains daily forecasts
    for (let i = 0; i < data.list.length+1; i += 7) {
      const weather = await this.parseWeatherData(i);
      console.log(weather, "Line 188")
      if (weather) {
        // Create a forecast object
        const forecast = {
          cityName: weather.city,
          date: weather.date,
          icon: weather.icon,
          iconDescription: weather.iconDescription,
          tempF: weather.tempF,
          windSpeed: weather.windSpeed,
          humidity: weather.humidity
        };

        // Add the forecast to the array
        forecastArray.push(forecast);
      }
    }

    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(cityName: string) {

    const weatherService = new WeatherService(cityName);
    const cityWeather = await weatherService.parseWeatherData(1);
    const forecastArray = await weatherService.buildForecastArray();
    //console.log(forecastArray, "Line 208")
    
    if (cityWeather) {
      console.log(`${cityWeather.city}'s Weather Report:`);
      console.log(`Date: ${cityWeather.date}`);
      console.log(`Description: ${cityWeather.iconDescription}`);
      console.log(`Temperature: ${cityWeather.tempF}°F`);
      console.log(`Humidity: ${cityWeather.humidity}%`);
      console.log(`Wind Speed: ${cityWeather.windSpeed} m/s`);
      const weatherData = [cityWeather, forecastArray];
      return weatherData;
    } else {
      console.error(`Could not retrieve weather data for ${cityName}`);
      return [];


    }

  }
}
const defaultCity = "New York"
export default new WeatherService(defaultCity);