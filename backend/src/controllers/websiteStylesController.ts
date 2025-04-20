import { Request, Response } from 'express';
import WebsiteStyles, { IWebsiteStyles } from '../models/websiteStylesModel';
import redisClient from '../redis';
import { getRedisWithId, getRedisAll } from '../utils/redisFunctions';
import { updateCSSFile } from '../utils/updateCSSFunctions';

const redis_expiry = 86400; //24hours in seconds

declare module 'express' {
  interface Request {
    websiteStyles?: IWebsiteStyles;
  }
}

// @desc Create a websiteStyles
// @route POST /api/websiteStyless
// @access Private/Admin
const createWebsiteStyles = async (req: Request, res: Response) => {
  const websiteStyles = new WebsiteStyles({
    general: {
      backgroundColor: '#ffffff',
      font: "'Serif', sans-serif",
      wordColor: '#0f0f75',
      wordSize: '16px',
      titleSize: '48px',
    },
    headerAndFooter: {
      backgroundColor: '#d4d1d1',
      fontSize: '16px',
      wordColor: '#000000',
      dropdown: {
        backgroundColor: '#dddcdc',
        wordColor: '#000000',
        hoverColor: '#aaa7a7',
      },
    },
    admin: {
      backgroundColor: '#ffffff',
      wordColor: '#0f0f75',
      sideBar: {
        backgroundColor: '#0AB7DA',
        wordColor: '#000000',
      },
    },
    saves: {
      colors: [
        '#ffffff',
        '#0f0f75',
        '#d4d1d1',
        '#000000',
        '#dddcdc',
        '#aaa7a7',
        '#0AB7DA'
      ],
      fonts: [
        "'Serif', sans-serif"
      ],
    },
  }
  );

  const createdwebsiteStyles = await websiteStyles.save();
  updateCSSFile(createdwebsiteStyles);
  return res.status(201).json(createdwebsiteStyles); //201 means something was created
};

// @desc Fetch all websiteStyless
// @route GET /api/websiteStyless
// @access Public
const getWebsiteStyles = async (req: Request, res: Response) => {
  const websiteStyless = await getRedisAll(
    'websiteStyless',
    WebsiteStyles,
    redis_expiry
  );
  return res.status(200).json(websiteStyless);
};

// @desc Get websiteStyles by id
// @route GET /api/websiteStyless/:id
// @access Private/Admin
const getWebsiteStylesById = async (req: Request, res: Response) => {
  const websiteStylesId = req.params.id;
  const websiteStyles = await getRedisWithId(
    'websiteStyles',
    websiteStylesId,
    WebsiteStyles,
    redis_expiry
  );

  if (websiteStyles) {
    return res.status(200).json(websiteStyles);
  } else {
    return res.status(404).json({ message: 'websiteStyles not found' });
  }
};

// @desc Update websiteStyles
// @route PUT /api/websiteStyless/:id
// @access Private/Admin
const updateWebsiteStyles = async (req: Request, res: Response) => {
  const websiteStylesId = req.params.id;
  const websiteStyles = (await WebsiteStyles.findById(
    websiteStylesId
  )) as IWebsiteStyles;

  if (!websiteStyles) {
    return res.status(404).json({ message: 'websiteStyles not found' });
  }

  // Update websiteStyles fields in a concise manner
  Object.assign(websiteStyles, {
    general: {
      backgroundColor:
        req.body.general?.backgroundColor ||
        websiteStyles.general.backgroundColor,
      font: req.body.general?.font || websiteStyles.general.font,
      wordColor: req.body.general?.wordColor || websiteStyles.general.wordColor,
      wordSize: req.body.general?.wordSize || websiteStyles.general.wordSize,
      titleSize: req.body.general?.titleSize || websiteStyles.general.titleSize,
    },
    headerAndFooter: {
      backgroundColor:
        req.body.headerAndFooter?.backgroundColor ||
        websiteStyles.headerAndFooter.backgroundColor,
      fontSize:
        req.body.headerAndFooter?.fontSize ||
        websiteStyles.headerAndFooter.fontSize,
      wordColor:
        req.body.headerAndFooter?.wordColor ||
        websiteStyles.headerAndFooter.wordColor,
      dropdown: {
        backgroundColor:
          req.body.headerAndFooter?.dropdown?.backgroundColor ||
          websiteStyles.headerAndFooter.dropdown.backgroundColor,
        wordColor:
          req.body.headerAndFooter?.dropdown?.wordColor ||
          websiteStyles.headerAndFooter.dropdown.wordColor,
        hoverColor:
          req.body.headerAndFooter?.dropdown?.hoverColor ||
          websiteStyles.headerAndFooter.dropdown.hoverColor,
      },
    },
    admin: {
      backgroundColor:
        req.body.admin?.backgroundColor || websiteStyles.admin.backgroundColor,
      wordColor: req.body.admin?.wordColor || websiteStyles.admin.wordColor,
      sideBar: {
        backgroundColor:
          req.body.admin?.sideBar?.backgroundColor ||
          websiteStyles.admin.sideBar.backgroundColor,
        wordColor:
          req.body.admin?.sideBar?.wordColor ||
          websiteStyles.admin.sideBar.wordColor,
      },
    },
    saves: {
      colors: req.body.saves?.colors || websiteStyles.saves.colors,
      fonts: req.body.saves?.fonts || websiteStyles.saves.fonts,
    },
  });

  const updatedWebsiteStyles = await websiteStyles.save();
  await redisClient.set(
    `websiteStyles:${websiteStylesId}`,
    JSON.stringify(updatedWebsiteStyles),
    { EX: redis_expiry }
  );
  updateCSSFile(updatedWebsiteStyles);
  return res.status(200).json(updatedWebsiteStyles);
};

// @desc Delete websiteStyles
// @route DELETE /api/websiteStyless/:id
// @access Private/Admin
const deleteWebsiteStyles = async (req: Request, res: Response) => {
  const websiteStyles = await WebsiteStyles.findById(req.params.id);

  if (websiteStyles) {
    const websiteStylesId = websiteStyles._id;
    await websiteStyles.deleteOne({ _id: websiteStylesId });
    const keysToDelete: string[] = [
      `websiteStyles:${websiteStylesId}`,
      'websiteStyless',
    ];
    await redisClient.del(keysToDelete);
    return res
      .status(200)
      .json({ message: 'websiteStyles deleted successfuly' });
  } else {
    return res.status(404).json({ message: 'websiteStyles not found' });
  }
};

export {
  createWebsiteStyles,
  getWebsiteStyles,
  getWebsiteStylesById,
  updateWebsiteStyles,
  deleteWebsiteStyles,
};
