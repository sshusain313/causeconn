import { Request, Response } from 'express';
import Country from '../models/Country';
import City from '../models/City';
import DistributionCategory from '../models/DistributionCategory';
import DistributionPoint from '../models/DistributionPoint';

export const getSettings = async (req: Request, res: Response) => {
  const [countries, cities, categories, points] = await Promise.all([
    Country.find(),
    City.find(),
    DistributionCategory.find(),
    DistributionPoint.find()
  ]);
  res.json({ countries, cities, categories, points });
};

// Get points by city and category
export const getPointsByCityAndCategory = async (req: Request, res: Response) => {
  const { cityId, categoryId } = req.params;
  const points = await DistributionPoint.find({
    cityId,
    categoryId,
    isActive: true
  });
  res.json(points);
};

// Country
export const createCountry = async (req: Request, res: Response) => {
  const country = await Country.create(req.body);
  res.json(country);
};
export const updateCountry = async (req: Request, res: Response) => {
  const country = await Country.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(country);
};

// City
export const createCity = async (req: Request, res: Response) => {
  const city = await City.create(req.body);
  res.json(city);
};
export const updateCity = async (req: Request, res: Response) => {
  const city = await City.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(city);
};

// Category
export const createCategory = async (req: Request, res: Response) => {
  const category = await DistributionCategory.create(req.body);
  res.json(category);
};
export const updateCategory = async (req: Request, res: Response) => {
  const category = await DistributionCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(category);
};

// Point
export const createPoint = async (req: Request, res: Response) => {
  const point = await DistributionPoint.create(req.body);
  res.json(point);
};
export const updatePoint = async (req: Request, res: Response) => {
  const point = await DistributionPoint.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(point);
};
export const deletePoint = async (req: Request, res: Response) => {
  await DistributionPoint.findByIdAndDelete(req.params.id);
  res.json({ success: true });
}; 