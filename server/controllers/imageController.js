import userModel from "../models/userModel.js";
import axios from "axios";
import FormData from "form-data";

export const generateImage = async (req, res) => {
  try {
    const { userId, prompt } = req.body;

    // Validate input
    if (!userId || !prompt) {
      return res.status(400).json({ success: false, message: "Missing Details" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check user credit balance
    if (!user.creditBalance || user.creditBalance <= 0) {
      return res.status(400).json({ success: false, message: "No Credit Balance", creditBalance: user.creditBalance || 0 });
    }

    // Prepare API request with FormData
    const formData = new FormData();
    formData.append("prompt", prompt);

    console.log("📢 Sending request to ClipDrop API...");

    const { data } = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
      headers: {
        "x-api-key": process.env.CLIPDROP_API,
        ...formData.getHeaders()
      },
      responseType: "arraybuffer",
    });

    // Validate API response
    if (!data) {
      throw new Error("Empty response from ClipDrop API");
    }

    // Convert response to Base64
    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    // Update credit balance
    const newCreditBalance = user.creditBalance - 1;
    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      { creditBalance: newCreditBalance },
      { new: true }  // Ensure you get the updated user
    );

    if (!updatedUser) {
      throw new Error("Failed to update user credits");
    }

    console.log(`✅ Image generated. New credit balance: ${updatedUser.creditBalance}`);

    // Send response
    return res.json({
      success: true,
      message: "Image Generated",
      creditBalance: updatedUser.creditBalance,  // Use the updated balance
      resultImage,
    });

  } catch (error) {
    console.error("❌ Error:", error.message);
    return res.status(500).json({ success: false, message: "Image generation failed", error: error.message });
  }
};
