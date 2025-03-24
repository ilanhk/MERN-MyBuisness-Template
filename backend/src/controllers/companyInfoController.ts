import { Request, Response } from 'express';
import asyncHandler from '../middlewares/asyncHandler';
import CompanyInfo, { ICompanyInfo} from '../models/companyInfoModel';
import redisClient from '../redis';
import { getRedisWithId } from '../utils/redisFunctions';

const redis_expiry = 86400 //24hours in seconds

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
    company: {
      name: 'MyBusiness',
      logoImage: '',
      companyType: {
        isEcommerce: false,
        hasProducts: false,
      },
    },
    home: {
      valueProposition: {
        proposition: 'Our value proposition goes here',
        callToAction: 'Get Started with Us',
        image: 'https://paulcollege.unh.edu/sites/default/files/styles/landscape_480x260/public/landing-page/header-image/2018/marketing-dept-tom-gruen-paul-college1920x475.jpg?h=2a536532&itok=HXpy1_Cd'
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
        
      },
    }
  });
  
  const createdCompanyInfo = await companyInfo.save();
  return res.status(201).json(createdCompanyInfo); //201 means something was created
};


// @desc Update company info
// @route PUT /api/company-info/:id
// @access Private/Admin
const updateCompanyInfo = asyncHandler(async (req: Request, res: Response) => {
  const companyInfoId = req.params.id;
  const companyInfo = await CompanyInfo.findById(companyInfoId);

  if (!companyInfo) {
    return res.status(404).json({ message: 'Company Info not found' });
  }

  const updateField = (field: any, value: any) => (value !== undefined ? value : field);
  //this is the allow null as a value

  Object.assign(companyInfo, {
    company: {
      name: updateField(companyInfo.company.name, req.body.company?.name),
      logoImage: updateField(companyInfo.company.logoImage, req.body.company?.logoImage),
      companyType: {
        isEcommerce: updateField(companyInfo.company.companyType.isEcommerce, req.body.company.companyType?.isEcommerce),
        hasProducts: updateField(companyInfo.company.companyType.hasProducts, req.body.company.companyType?.hasProducts),
      },
    },
    home: {
      valueProposition: {
        proposition: updateField(
          companyInfo.home.valueProposition.proposition,
          req.body.home?.valueProposition?.proposition
        ),
        callToAction: updateField(
          companyInfo.home.valueProposition.callToAction,
          req.body.home?.valueProposition?.callToAction
        ),
        image: updateField(
          companyInfo.home.valueProposition.image,
          req.body.home?.valueProposition?.image
        )
      },
      customerSection: {
        title: updateField(companyInfo.home.customerSection.title, req.body.home?.customerSection?.title),
        description: updateField(companyInfo.home.customerSection.description, req.body.home?.customerSection?.description),
      },
    },
    about: {
      title: updateField(companyInfo.about.title, req.body.about?.title),
      description: updateField(companyInfo.about.description, req.body.about?.description),
      image: updateField(companyInfo.about.image, req.body.about?.image),
    },
    services: {
      title: updateField(companyInfo.services.title, req.body.services?.title),
      description: updateField(companyInfo.services.description, req.body.services?.description),
    },
    contactUs: {
      title: updateField(companyInfo.contactUs.title, req.body.contactUs?.title),
      description: updateField(companyInfo.contactUs.description, req.body.contactUs?.description),
      image: updateField(companyInfo.contactUs.image, req.body.contactUs?.image),
      email: {
        contact: updateField(companyInfo.contactUs.email.contact, req.body.contactUs?.email?.contact),
        website: updateField(companyInfo.contactUs.email.website, req.body.contactUs?.email?.website),
      },
      phone: {
        countryCode: updateField(companyInfo.contactUs.phone.countryCode, req.body.contactUs?.phone?.countryCode),
        phone: updateField(companyInfo.contactUs.phone.phone, req.body.contactUs?.phone?.phone),
        fax: updateField(companyInfo.contactUs.phone.fax, req.body.contactUs?.phone?.fax),
      },
      address: {
        address1: updateField(companyInfo.contactUs.address.address1, req.body.contactUs?.address?.address1),
        address2: updateField(companyInfo.contactUs.address.address2, req.body.contactUs?.address?.address2),
        area: updateField(companyInfo.contactUs.address.area, req.body.contactUs?.address?.area),
        city: updateField(companyInfo.contactUs.address.city, req.body.contactUs?.address?.city),
        country: updateField(companyInfo.contactUs.address.country, req.body.contactUs?.address?.country),
        postalCode: updateField(companyInfo.contactUs.address.postalCode, req.body.contactUs?.address?.postalCode),
        fullAddress: updateField(companyInfo.contactUs.address.fullAddress, req.body.contactUs?.address?.fullAddress),
      },
      socialMedia: {
        linkedin: updateField(companyInfo.contactUs.socialMedia.linkedin, req.body.contactUs?.socialMedia?.linkedin),
        facebook: updateField(companyInfo.contactUs.socialMedia.facebook, req.body.contactUs?.socialMedia?.facebook),
        instagram: updateField(companyInfo.contactUs.socialMedia.instagram, req.body.contactUs?.socialMedia?.instagram),
        twitter: updateField(companyInfo.contactUs.socialMedia.twitter, req.body.contactUs?.socialMedia?.twitter),
        tiktok: updateField(companyInfo.contactUs.socialMedia.tiktok, req.body.contactUs?.socialMedia?.tiktok),
        youtube: updateField(companyInfo.contactUs.socialMedia.youtube, req.body.contactUs?.socialMedia?.youtube),
        amazon: updateField(companyInfo.contactUs.socialMedia.amazon, req.body.contactUs?.socialMedia?.amazon),
        aliexpress: updateField(companyInfo.contactUs.socialMedia.aliexpress, req.body.contactUs?.socialMedia?.aliexpress),
      },
    },
  });

  const updatedCompanyInfo = await companyInfo.save();
  await redisClient.set(`companyInfo:${companyInfoId}`, JSON.stringify(updatedCompanyInfo), { EX: redis_expiry });
  res.status(200).json(updatedCompanyInfo);
});


// @desc Get users
// @route GET /api/users
// @access Private/Admin
const getCompanyInfo = asyncHandler(async (req: Request, res: Response) => {
  const info = await CompanyInfo.find({});
  return res.status(200).json(info);
});


// @desc Get company info by Id
// @route GET /api/company-info/:id
// @access Private/public
const getCompanyInfoById = async (req: Request, res: Response) => {
  const companyInfoId = req.params.id;
  const companyInfo = await getRedisWithId('companyInfo', companyInfoId, CompanyInfo, redis_expiry);

  if (companyInfo){
      return res.status(200).json(companyInfo);
  } else {
    return res.status(404).json({ message: 'Company Info not found'});
  };
};


// @desc Delete company info
// @route DELETE /api/company-info/:id
// @access Private/Admin
const deleteCompanyInfo = asyncHandler(async (req: Request, res: Response) => {
  const companyInfo = await CompanyInfo.findById(req.params.id);

  if (companyInfo){
      const companyInfoId = companyInfo._id;
      await companyInfo.deleteOne({_id: companyInfoId});
      await redisClient.del(`companyInfo:${companyInfoId}`);
      return res.status(200).json({message: 'Company Info deleted successfuly'});
  } else {
    return res.status(404).json({ message: 'Company Info not found'});
  };
});

export {
  createCompanyInfo,
  updateCompanyInfo,
  getCompanyInfo,
  getCompanyInfoById,
  deleteCompanyInfo,
  
};