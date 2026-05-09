// reusable async wrapper to avoid repetitive try/catch

const asyncHandler = (requestHandler) => {
  return async (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next))
      .catch((error) => next(error));
  };
};

export default asyncHandler;