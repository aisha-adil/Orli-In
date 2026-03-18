const User = require("../../../models/User");

exports.getMyProfile = async (userId) => {
  return await User.findById(userId).select("-password");
};

exports.updateProfile = async (userId, data) => {
  const updateData = {};

  if (data.fullName) updateData.fullName = data.fullName;
  if (data.phone) updateData.phone = data.phone;
  if (data.address) updateData.address = data.address;

  if (data.designerInfo) {
    updateData.designerInfo = data.designerInfo;
  }

  return await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");
};

exports.getPublicDesignerProfile = async (designerId) => {
  return await User.findOne({
    _id: designerId,
    role: "designer",
  }).select("fullName designerInfo createdAt");
};
