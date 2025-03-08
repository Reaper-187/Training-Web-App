import { useState } from "react";
import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import './Login.css'

export const passwordVisiblity = () => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => setShowPassword((prev) => !prev);

  const Icon = (
    <IconButton onClick={toggleVisibility} edge="end" className="password-icon">
      {showPassword ? <VisibilityOff /> : <Visibility />}
    </IconButton>
  );

  return { inputType: showPassword ? "text" : "password", Icon };
};
