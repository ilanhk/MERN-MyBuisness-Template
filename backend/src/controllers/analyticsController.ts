import { Request, Response } from 'express';
import User from "../models/userModel";
import ProductClicked from '../models/productClickedModel';
import WebTraffic from '../models/webTrafficModel';



// @desc Add a Product that was clicked
// @route POST /api/analytics/product
// @access Admin
export const addClickedProduct  = async (req: Request, res: Response) => {
  
};


// @desc Add a Person that visited the website
// @route POST /api/analytics/traffic
// @access Admin
export const addWebVistor = (req: Request, res: Response) => {
  
};