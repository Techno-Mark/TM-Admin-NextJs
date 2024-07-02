/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import FilterIcon from "@/assets/icons/FilterIcon";
import SearchIcon from "@/assets/icons/SearchIcon";
import FilterDialog from "@/components/Form/FilterDialog";
import FormDatatable from "@/components/Form/FormDatatable";
import Loader from "@/components/common/Loader";
import MainWrapper from "@/components/common/MainWrapper";
import { ColorToolTip } from "@/utils/CommonStyle";
import { InputBase } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface FilterProps {
  formType: string | null;
}

const page = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [globalSearchValue, setGlobalSearchValue] = useState("");
  const [currentFilterData, setCurrentFilterData] = useState<any>([]);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, []);

  const handleCloseFilter = () => {
    setIsFilterOpen(false);
  };

  const getIdFromFilterDialog = (data: FilterProps) => {
    setCurrentFilterData(data);
  };

  const handleSearchChange = (e: string) => {
    setSearch(e);
    const timer = setTimeout(() => {
      setGlobalSearchValue(e.trim());
    }, 500);
    return () => clearTimeout(timer);
  };

  return (
    <MainWrapper>
      <div className="flex items-center justify-end my-2 pr-10 gap-5">
        <div className="relative">
          <InputBase
            className="pl-1 pr-7 border-b border-b-lightSilver w-48"
            placeholder="Search"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <span className="absolute top-2 right-2 text-slatyGrey">
            <SearchIcon />
          </span>
        </div>
        <ColorToolTip title="Filter" placement="top" arrow>
          <span
            className="cursor-pointer"
            onClick={() => setIsFilterOpen(true)}
          >
            <FilterIcon />
          </span>
        </ColorToolTip>
      </div>
      <FormDatatable
        searchValue={globalSearchValue}
        currentFilterData={currentFilterData}
      />
      <FilterDialog
        onOpen={isFilterOpen}
        onClose={handleCloseFilter}
        currentFilterData={getIdFromFilterDialog}
      />
    </MainWrapper>
  );
};

export default page;
