import fs from 'node:fs/promises';

// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;
  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
}
}
// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    return await fs.readFile('db/searchHistory.json','utf-8');
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    return await fs.writeFile('db/searchHistory.json', JSON.stringify(cities, null, '\t'))
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    return await this.read().then((cities) => {
    let parsedCities: City[];
    try {
      parsedCities = JSON.parse(cities).map((city: { name: string; id: string }) => new City(city.name, city.id));
     } catch (err) {
      parsedCities = [];
      }
      return parsedCities;
    }) 
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
   async addCity(cityName: string) {
    if (!cityName) {
      throw new Error('City cannot be blank.')
    }
    const cities = await this.getCities();
    const newID = `city-${Date.now()}-${Math.floor(Math.random() * 1000)}`; 
    const newCity = new City(cityName, newID);
    
    cities.push(newCity)
    
    await this.write(cities);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    const cities = await this.getCities();
    const updatedCities = cities.filter(city => city.id !== id);
    await this.write(updatedCities);
  
  }
  
  
}

export default new HistoryService();