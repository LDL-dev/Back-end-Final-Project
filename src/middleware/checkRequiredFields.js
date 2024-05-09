import MissingFieldsError from '../errors/MissingFieldsError.js';

const checkRequiredFields = requiredFields => {
  return function (req, res, next) {
    const missingFields = requiredFields.filter(
      field => !Object.keys(req.body).includes(field)
    );

    if (missingFields.length > 0) {
      throw new MissingFieldsError(missingFields);
    }

    next();
  };
};

export default checkRequiredFields;
