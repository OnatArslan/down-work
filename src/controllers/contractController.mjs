export const getAllContracts = async (req, res, next) => {
  try {
    res.status(200).json({
      status: `success`,
    });
  } catch (error) {
    next(error);
  }
};
