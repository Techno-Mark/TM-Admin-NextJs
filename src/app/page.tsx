"use client";
/* eslint-disable react-hooks/rules-of-hooks */
import Loader from "@/components/common/Loader";
import MainWrapper from "@/components/common/MainWrapper";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const page = () => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      router.push("contact-form");
    }
  }, []);
  return (
    <MainWrapper>
      <Loader />
    </MainWrapper>
  );
};

export default page;
