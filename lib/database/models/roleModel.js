import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
  roleType: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Role || mongoose.model("Role", RoleSchema);
