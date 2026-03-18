const service = require("./profile.service");

exports.getMyProfile = async (req, res, next) => {
  try {
    const profile = await service.getMyProfile(req.user.id);
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const updated = await service.updateProfile(
      req.user.id,
      req.body
    );

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.getPublicProfile = async (req, res, next) => {
  try {
    const profile = await service.getPublicDesignerProfile(
      req.params.id
    );

    if (!profile)
      return res.status(404).json({ message: "Designer not found" });

    res.json(profile);
  } catch (err) {
    next(err);
  }
};
