"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
// MUI imports
import {
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import { callAPIwithoutHeaders } from "@/utils/commonAPIFunction";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AuthWapper from "@/components/common/AuthWapper";
import { useStyles } from "@/utils/useStyles";

interface StringFieldType {
  value: string;
  error: boolean;
  errorText: string;
}

const Page = () => {
  const classes = useStyles();
  const router = useRouter();
  const initialFieldStringValues = {
    value: "",
    error: false,
    errorText: "",
  };

  const [email, setEmail] = useState<StringFieldType>(initialFieldStringValues);
  const [password, setPassword] = useState<StringFieldType>(
    initialFieldStringValues
  );
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleEmailChange = (e: { target: { value: string } }) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (e.target.value.trim().length === 0) {
      setEmail({
        value: e.target.value,
        error: true,
        errorText: "Email is required",
      });
    } else if (!emailRegex.test(e.target.value.trim())) {
      setEmail({
        value: e.target.value,
        error: true,
        errorText: "Please provide a valid email address!",
      });
    } else {
      setEmail({
        ...initialFieldStringValues,
        value: e.target.value,
      });
    }
  };

  const handlePasswordChange = (e: { target: { value: string } }) => {
    let password = e.target.value.trim();
    let error = false;
    let errorText = "";

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+}{":;?/>,.<]).{8,}$/;

    if (password.length === 0) {
      error = true;
      errorText = "Password is required";
    } else if (!passwordRegex.test(password)) {
      error = true;
      errorText = "Entered password does not match the required conditions.";
    }

    setPassword({
      value: password,
      error: error,
      errorText: errorText,
    });
  };

  const validateAndSetField = (
    field: React.Dispatch<React.SetStateAction<StringFieldType>>,
    value: string,
    message: string
  ) => {
    if (value.trim().length === 0) {
      field({
        ...initialFieldStringValues,
        error: true,
        errorText: `${message} is required`,
      });
      return true;
    }
    return false;
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);

    const usernameError = validateAndSetField(setEmail, email.value, "Email");
    const passwordError = validateAndSetField(
      setPassword,
      password.value,
      "Password"
    );

    const callback = (
      ResponseStatus: string,
      Message: string,
      ResponseData: any
    ) => {
      switch (ResponseStatus) {
        case "failure":
          toast.error(Message);
          setLoading(false);
          return;
        case "success":
          toast.success(Message);
          router.push("/");
          setLoading(false);
          localStorage.setItem("token", ResponseData?.Token);
          localStorage.setItem("username", ResponseData?.Username);
          return;
      }
    };

    if (usernameError || passwordError || password.error || email.error) {
      setLoading(false);
      return;
    } else {
      await callAPIwithoutHeaders("/auth/signin", "post", callback, {
        email: email.value,
        password: password.value,
      });
    }
  };

  return (
    <AuthWapper>
      <span className="text-[32px] !font-light pt-20">Welcome</span>
      <form onSubmit={handleSubmit}>
        <div
          className={`text-[12px] flex flex-col ${
            email.error ? "pt-8" : "pt-14"
          }`}
        >
          <label className="text-[#6E6D7A] text-[14px]">
            Email<span className="text-[#DC3545]">*</span>
          </label>
          <TextField
            id="outlined-basic"
            variant="standard"
            size="small"
            placeholder="Please Enter Email Address"
            value={email.value}
            error={email.error}
            helperText={email.errorText}
            onChange={handleEmailChange}
            InputProps={{
              classes: {
                underline: classes.underlineWithPlaceholderColor,
              },
            }}
          />
        </div>
        <div
          className={`text-[12px] flex flex-col ${
            email.error ? "pt-4" : "pt-8"
          }`}
        >
          <label className="text-[#6E6D7A] text-[14px]">
            Password<span className="text-[#DC3545]">*</span>
          </label>
          <FormControl variant="standard">
            <Input
              classes={{ underline: classes.underlineWithPlaceholderColor }}
              id="outlined-adornment-password"
              placeholder="Please Enter Password"
              type={showPassword ? "text" : "password"}
              onChange={handlePasswordChange}
              error={password.error}
              value={password.value}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    tabIndex={-1}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <span className="text-[#d32f2f]">{password.errorText}</span>
          </FormControl>
        </div>
        <Button
          type="submit"
          className="!bg-[#023963] !mt-12 text-white !h-[38px] !rounded-md w-full"
          variant="contained"
          disabled={isLoading ? true : false}
        >
          {isLoading ? (
            <CircularProgress size={20} sx={{ color: "white !important" }} />
          ) : (
            <span className="normal-case font-semibold text-[16px]">
              Log In
            </span>
          )}
        </Button>
      </form>

      <div className="flex items-center justify-end !pb-20">
        <span
          className="pt-4 text-[#023963] w-fit text-[14px] flex justify-end items-end cursor-pointer"
          onClick={() => router.push("/auth/forgotpassword")}
        >
          Forgot Password?
        </span>
      </div>
    </AuthWapper>
  );
};
export default Page;
