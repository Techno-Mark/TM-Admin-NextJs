import { ReactNode, useEffect, useState } from "react";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import Sidebar from "./Sidebar";
import Loader from "@/components/common/Loader";
import Navbar from "./Navbar";

type WrapperPropsType = {
  isScrollable?: boolean;
  children: ReactNode;
};

const MainWrapper = ({ isScrollable, children }: WrapperPropsType) => {
  const [loading, setLoading] = useState<boolean>(false);

  const startLoading = () => {
    setLoading(true);
  };

  if (loading) return <Loader />;
  return (
    <>
      <div className="max-h-screen flex flex-col overflow-hidden">
        <Box
          sx={{
            display: "flex",
            overflow: isScrollable ? "scroll" : "hidden",
          }}
        >
          <CssBaseline />
          <Sidebar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width: { sm: `calc(100% - ${200}px)` },
            }}
          >
            <Navbar />
            {children}
          </Box>
        </Box>
      </div>
    </>
  );
};

export default MainWrapper;
