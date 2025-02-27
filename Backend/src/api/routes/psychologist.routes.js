import express from "express";
import psychologistController from "../controllers/psychologist.controller.js";

const psychologistRouter = express.Router();

psychologistRouter.get("/get-psychologist-list", psychologistController.getPsychologistList);
psychologistRouter.get("/get-specialization-list", psychologistController.getUniqueSpecializations);
psychologistRouter.get("/:doctorId", psychologistController.getPsychologistById);

export default psychologistRouter;