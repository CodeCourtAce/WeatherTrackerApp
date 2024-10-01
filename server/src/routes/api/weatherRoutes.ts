import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  // TODO: GET weather data from city name
  const { cityName } = req.body; 
  //console.log(cityName, "Line 11");
  if (!cityName) {
    return res.status(400).json({ error: 'City name is required.' });
  }
  try {
    const weatherData = await WeatherService.getWeatherForCity(cityName); 
      // TODO: save city to search history
    await HistoryService.addCity(cityName);

    // Respond with weather data
    return res.status(200).json(weatherData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve weather data.' });
  }
});



// TODO: GET search history
router.get('/history', async (_req, res) => {
  try {
    const cities = await HistoryService.getCities();
    return res.status(200).json(cities);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve search history.' });
  }

});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await HistoryService.removeCity(id);
    return res.status(204).send(); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete city from search history.' });
  }

});

export default router;