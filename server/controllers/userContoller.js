import userModel from "../models/usermodel.js";

// export const getUserData = async (req, res) => {
//     try {
//         const user = await userModel.findById(req.userId); // userId from token
//         if (!user) {
//             return res.json({ success: false, message: "User not found" });
//         }

//         res.json({
//             success: true,
//             userData: {
//                 name: user.name,
//                 email: user.email,
//                 userId: user.userId,
//                 isAccountVerified: user.isAccountVerified ?? false
//             }
//         });
//     } catch (error) {
//         return res.json({ success: false, message: "ERROR usercontroller " + error.message });
//     }
// };


export const getUserData = async (req, res) => {
    try {
      const { email } = req.params;
      const user = await userModel.findById(req.email);
      
  
      if (!user) {
        return res.json({ success: false, message: "User not found" });
      }
  
      // this only runs if user is NOT null
      res.json({
        success: true,
        userData: {
          name: user.name,
          email: user.email,
          userId: user.userId,
          isAccountVerified: user.isAccountVerified ?? false,
        }
      });
    } catch (error) {
      return res.json({ success: false, message: "ERROR usercontroller " + error.message });
    }
  };
  