const Profile = require("../models/Profile");

const uploadResume = async (req, res) => {
  try {
    const { profileId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No resume uploaded.",
      });
    }

    const profile = await Profile.findById(profileId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    profile.resume = req.file.path;

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully.",
      resumeUrl: req.file.path,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Resume upload failed.",
    });
  }
};

module.exports = {
  uploadResume,
};