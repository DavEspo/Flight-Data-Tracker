// // controllers/flightController.mjs
// import * as flightService from '../services/flightService.mjs';

// export async function getFlights(req, res) {
//   try {
//     const flights = await flightService.getFlights();
//     res.json(flights);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

// export async function addFlight(req, res) {
//   try {
//     const result = await flightService.addFlight(req.body);
//     res.status(201).json(result);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

// export async function updateFlight(req, res) {
//   try {
//     const result = await flightService.updateFlight(req.params.id, req.body);
//     res.json(result);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

// export async function deleteFlight(req, res) {
//   try {
//     const result = await flightService.deleteFlight(req.params.id);
//     res.json(result);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }
