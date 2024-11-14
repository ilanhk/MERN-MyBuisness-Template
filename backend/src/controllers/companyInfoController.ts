import { Request, Response } from 'express';
import asyncHandler from '../middlewares/asyncHandler';
import CompanyInfo, { ICompanyInfo} from '../models/companyInfoModel';

declare module 'express' {
  interface Request {
    company?: ICompanyInfo
  }
};


// @desc Create Company info
// @route POST /api/comapany-info
// @access Private/Admin
const createCompanyInfo = async (req: Request, res: Response) => {
  const companyInfo: ICompanyInfo = new CompanyInfo({
    home: {
      valueProposition: {
        proposition: 'Our value proposition goes here',
        callToAction: 'Get Started with Us'
      },
      customerSection: {
        title: 'Our Customers',
        description: 'Description about customers and how we help them.'
      }
    },
    about: {
      title: 'About Our Company',
      description: 'We are a company dedicated to providing top-notch services.',
      image: 'sample-image-url.jpg'
    },
    services: {
      title: 'Our Services',
      description: 'Description of the various services we offer.'
    },
    contactUs: {
      title: 'Contact Us',
      description: 'Reach out to us for more information.',
      email: {
        contact: 'contact@samplecompany.com',
        website: 'www.samplecompany.com'
      },
      phone: {
        countryCode: '+1',
        phone: '123-456-7890',
        fax: '123-456-7891'
      },
      address: {
        address1: '123 Sample St',
        address2: 'Suite 100',
        area: 'Business District',
        city: 'Sample City',
        country: 'Sample Country',
        postalCode: '12345',
        fullAddress: '123 Sample St, Suite 100, Business District, Sample City, Sample Country, 12345'
      },
      socialMedia: {
        linkedin: 'https://www.linkedin.com/in/ilan-lieberman-9a1043132/',
        
      }
    }
  });

  
  const createdCompanyInfo = await companyInfo.save();
  return res.status(201).json(createdCompanyInfo); //201 means something was created
};


// @desc Fetch all company infos
// @route GET /api/company-info
// @access Public
const getCompanyInfos = asyncHandler(async (req: Request, res: Response) => {
    const infos = await CompanyInfo.find({}); 
    return res.status(200).json(infos); 
});


// @desc Get company info by id
// @route GET /api/company-info/:id
// @access Private/Admin
const getCompanyInfoById = asyncHandler(async (req: Request, res: Response) => {
  const companyInfo = await CompanyInfo.findById(req.params.id);

  if (companyInfo){
      return res.status(200).json(companyInfo);
  } else {
    return res.status(404).json({ message: 'Company Info not found'});
  };
 
});


// @desc Update company info
// @route PUT /api/company-info/:id
// @access Private/Admin
const updateCompanyInfo = asyncHandler(async (req: Request, res: Response) => {
  const companyInfo = await CompanyInfo.findById(req.params.id) as ICompanyInfo;

  if (!companyInfo) {
    return res.status(404).json({ message: 'Company Info not found'});
  };

  Object.assign(companyInfo, {
    home: {
      valueProposition: {
        proposition: req.body.valueProposition?.proposition || companyInfo.home.valueProposition.proposition,
        callToAction: req.body.valueProposition?.callToAction || companyInfo.home.valueProposition.callToAction
      },
      customerSection: {
        title: req.body.customerSection?.title || companyInfo.home.customerSection.title,
        description: req.body.customerSection?.description || companyInfo.home.customerSection.description
      }
    },
    about: {
      title: req.body.about?.title || companyInfo.about.title,
      description: req.body.about?.description || companyInfo.about.description,
      image: req.body.about?.image || companyInfo.about.image
    },
    services: {
      title: req.body.services?.title || companyInfo.services.title,
      description: req.body.services?.description || companyInfo.services.description
    },
    contactUs: {
      title: req.body.contactUs?.title || companyInfo.contactUs.title,
      description: req.body.contactUs?.description || companyInfo.contactUs.description,
      email: {
        contact: req.body.contactUs?.email?.contact || companyInfo.contactUs.email.contact,
        website: req.body.contactUs?.email?.website || companyInfo.contactUs.email.website
      },
      phone: {
        countryCode: req.body.contactUs?.phone?.countryCode || companyInfo.contactUs.phone.countryCode,
        phone: req.body.contactUs?.phone?.phone || companyInfo.contactUs.phone.phone,
        fax: req.body.contactUs?.phone?.fax || companyInfo.contactUs.phone.fax
      },
      address: {
        address1: req.body.contactUs?.address?.address1 || companyInfo.contactUs.address.address1,
        address2: req.body.contactUs?.address?.address2 || companyInfo.contactUs.address.address2,
        area: req.body.contactUs?.address?.area || companyInfo.contactUs.address.area,
        city: req.body.contactUs?.address?.city || companyInfo.contactUs.address.city,
        country: req.body.contactUs?.address?.country || companyInfo.contactUs.address.country,
        postalCode: req.body.contactUs?.address?.postalCode || companyInfo.contactUs.address.postalCode,
        fullAddress: req.body.contactUs?.address?.fullAddress || companyInfo.contactUs.address.fullAddress
      },
      socialMedia: {
        linkedin: req.body.contactUs?.socialMedia?.linkedin || companyInfo.contactUs.socialMedia.linkedin,
        facebook: req.body.contactUs?.socialMedia?.facebook || companyInfo.contactUs.socialMedia.facebook,
        instagram: req.body.contactUs?.socialMedia?.instagram || companyInfo.contactUs.socialMedia.instagram,
        twitter: req.body.contactUs?.socialMedia?.twitter || companyInfo.contactUs.socialMedia.twitter,
        tiktok: req.body.contactUs?.socialMedia?.tiktok || companyInfo.contactUs.socialMedia.tiktok,
        youtube: req.body.contactUs?.socialMedia?.youtube || companyInfo.contactUs.socialMedia.youtube,
        amazon: req.body.contactUs?.socialMedia?.amazon || companyInfo.contactUs.socialMedia.amazon,
        aliexpress: req.body.contactUs?.socialMedia?.aliexpress || companyInfo.contactUs.socialMedia.aliexpress
      }
    }
  });
  
  const updatedCompanyInfo = await companyInfo.save();
  res.status(200).json(updatedCompanyInfo);
});


// @desc Delete company info
// @route DELETE /api/company-info/:id
// @access Private/Admin
const deleteCompanyInfo = asyncHandler(async (req: Request, res: Response) => {
  const companyInfo = await CompanyInfo.findById(req.params.id);

  if (companyInfo){
      await companyInfo.deleteOne({_id: companyInfo._id});
      return res.status(200).json({message: 'Company Info deleted successfuly'});
  } else {
    return res.status(404).json({ message: 'Company Info not found'});
  };
});

export {
  createCompanyInfo,
  getCompanyInfos,
  getCompanyInfoById,
  updateCompanyInfo,
  deleteCompanyInfo
};