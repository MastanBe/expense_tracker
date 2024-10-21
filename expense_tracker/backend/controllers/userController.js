const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const registerUser = async (req, res) => {
  const { name, username, password, security_question, security_answer } = req.body;

  
  if (!name || !username || !password || !security_question || !security_answer) {
      return res.status(400).json({ error: "All fields are required" });
  }

  try {
    
      const hashedPassword = await bcrypt.hash(password, 10);
      const hashedSecurityAnswer = await bcrypt.hash(security_answer, 10); 
      const newUser = await User.create({
          name,
          username,
          password: hashedPassword, 
          security_question,
          security_answer:hashedSecurityAnswer
      });

      const userResponse = { ...newUser.get(), password: undefined };
      return res.status(201).json(userResponse);
  } catch (error) {
     
      if (error.name === 'SequelizeUniqueConstraintError') {
          return res.status(400).json({ error: "Username already exists" });
      }
      return res.status(500).json({ error: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body; 

 
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
  
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

   
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

   
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    return res.status(200).json({ user: { id: user.id, username: user.username }, token });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


const recoverPassword = async (req, res) => {
  const { username, securityAnswer, newPassword } = req.body;

  
  console.log(req.body);

  if (!username || !securityAnswer || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
  }

  try {
      const user = await User.findOne({ where: { username } });
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      const isSecurityAnswerValid = await bcrypt.compare(securityAnswer, user.security_answer);
      if (!isSecurityAnswerValid) {
          return res.status(400).json({ error: "Incorrect security answer" });
      }

      const isOldPassword = await bcrypt.compare(newPassword, user.password);
      if (isOldPassword) {
          return res.status(400).json({ error: "New password cannot be the same as the old password" });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      return res.status(200).json({ message: "Password has been reset successfully!" });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = { registerUser, loginUser, recoverPassword };
