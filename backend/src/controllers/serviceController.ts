import { Request, Response } from 'express';
import Service, { IService } from '../models/servicesModel';

declare module 'express' {
  interface Request {
    service?: IService
  }
};


// @desc Create a service
// @route POST /api/services
// @access Private/Admin
const createService = async (req: Request, res: Response) => {
  const { name, image, description } = req.body;

  if(!name || !image || !description){
    return res.status(400).json({message: 'Please add name, image and description of the service'});
  }

  const service = await Service.create({
      name,
      image,
      description
  });

  if(service){
    const serviceId = service._id + ''
    return res.status(201).json({
        _id: serviceId,
        name,
        image,
        description
    });
} else {
    return res.status(400).json({ message: 'Invalid service data'});
};
};


// @desc Fetch all Services
// @route GET /api/services
// @access Public
const getServices = async (req: Request, res: Response) => {
    const services = await Service.find({}); 
    return res.status(200).json(services); 
};


// @desc Get service by id
// @route GET /api/services/:id
// @access Private/Admin
const getServiceById = (async (req: Request, res: Response) => {
  const service = await Service.findById(req.params.id);

  if (service){
      return res.status(200).json(service);
  } else {
    return res.status(404).json({ message: 'Service not found'});
  };
 
});


// @desc Update job
// @route PUT /api/services/:id
// @access Private/Admin
const updateService = async (req: Request, res: Response) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({ message: 'Service not found'});
  }

  service.name = req.body.name || service.name;
  service.image = req.body.image || service.image;
  service.description = req.body.description || service.description;
  service.isChosen = req.body.isChosen || service.isChosen; 
  
  const updatedService = await service.save();
  res.status(200).json(updatedService);
};


// @desc Delete service
// @route DELETE /api/services/:id
// @access Private/Admin
const deleteService = async (req: Request, res: Response) => {
  const service = await Service.findById(req.params.id);

  if (service){
      await service.deleteOne({_id: service._id});
      return res.status(200).json({message: 'Service deleted successfuly'});
  } else {
    return res.status(404).json({ message: 'Service not found'});
  };
};

export {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
};