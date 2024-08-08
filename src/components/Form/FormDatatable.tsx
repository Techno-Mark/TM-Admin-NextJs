import { callAPI } from "@/utils/API/callAPI";
import {
  generateCommonBodyRender,
  generateCustomColumn,
  generateCustomHeaderName,
} from "@/utils/CommonTableFunction";
import React, { useEffect, useState } from "react";
import Loader from "../common/Loader";
import { TablePagination, ThemeProvider, Tooltip } from "@mui/material";
import { getMuiTheme } from "@/utils/CommonStyle";
import MUIDataTable from "mui-datatables";
import { Delete } from "@mui/icons-material";
import DeleteDialog from "../common/DeleteDialog";
import { toast } from "react-toastify";

const pageNo = 1;
const pageSize = 10;

const initialFilter = {
  page: pageNo,
  limit: pageSize,
  search: "",
  formType: "",
};

interface Interface {
  page: number;
  limit: number;
  search: string;
  formType: string | null;
}

interface List {
  id: number;
  formType: string;
  fullName: string;
  email: string;
  phone: number | string;
  organizationName: string;
  projectDescription: string | null;
  date: string;
}

const FormDatatable = ({
  searchValue,
  currentFilterData,
}: {
  searchValue: string;
  currentFilterData: any;
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>([]);
  const [filteredObject, setFilteredOject] = useState<Interface>(initialFilter);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [tableDataCount, setTableDataCount] = useState(0);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  useEffect(() => {
    setFilteredOject({
      ...filteredObject,
      ...currentFilterData,
    });
  }, [currentFilterData]);

  useEffect(() => {
    if (searchValue.trim().length >= 0) {
      setFilteredOject({
        ...filteredObject,
        ...currentFilterData,
        search: searchValue,
        page: pageNo,
        limit: pageSize,
      });
      setPage(0);
      setRowsPerPage(10);
    }
  }, [searchValue]);

  const getFormList = async () => {
    setLoaded(false);
    const params = filteredObject;
    const url = `${process.env.baseURL}/form/getFormList`;
    const successCallback = (
      ResponseData: {
        list: List[];
        totalCount: number;
        totalPages: number;
        currentPage: number;
      },
      error: boolean,
      ResponseStatus: string
    ) => {
      if (ResponseStatus === "success" && error === false) {
        setLoaded(true);
        setFormData(ResponseData.list);
        setTableDataCount(ResponseData.totalCount);
      } else {
        setLoaded(true);
      }
    };
    callAPI(url, params, successCallback, "POST");
  };

  useEffect(() => {
    const fetchData = async () => {
      await getFormList();
    };
    const timer = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(timer);
  }, [filteredObject]);

  const columnConfig = [
    {
      name: "id",
      label: "ID",
      bodyRenderer: generateCommonBodyRender,
    },
    {
      name: "formType",
      label: "Type",
      bodyRenderer: generateCommonBodyRender,
    },
    {
      name: "fullName",
      label: "Full Name",
      bodyRenderer: generateCommonBodyRender,
    },
    {
      name: "email",
      label: "Email",
      bodyRenderer: generateCommonBodyRender,
    },
    {
      name: "phone",
      label: "Mobile Number",
      bodyRenderer: generateCommonBodyRender,
    },
    {
      name: "organizationName",
      label: "Organization Name",
      bodyRenderer: generateCommonBodyRender,
    },
    {
      name: "projectDescription",
      label: "Project Description",
      bodyRenderer: generateCommonBodyRender,
    },
    {
      name: "date",
      label: "Date of Creation",
      bodyRenderer: generateCommonBodyRender,
    },
    {
      name: "id",
      label: "Action",
      bodyRenderer: generateCommonBodyRender,
    },
  ];

  const generateConditionalColumn = (column: {
    name: string;
    label: string;
    bodyRenderer: (arg0: any) => any;
  }) => {
    if (column.label === "Action") {
      return {
        name: "id",
        options: {
          filter: true,
          sort: true,
          customHeadLabelRender: () => generateCustomHeaderName("Action"),
          customBodyRender: (value: number) => {
            return (
              <div
                onClick={() => {
                  setDeleteOpen(true);
                  setDeleteId(value);
                }}
              >
                <Tooltip title={"Delete"} placement="top" arrow>
                  <Delete />
                </Tooltip>
              </div>
            );
          },
        },
      };
    } else {
      return generateCustomColumn(
        column.name,
        column.label,
        column.bodyRenderer
      );
    }
  };

  const formCols = columnConfig.map((col: any) => {
    return generateConditionalColumn(col);
  });

  // const formCols = columnConfig.map((col: any) =>
  //   generateCustomColumn(col.name, col.label, col.bodyRenderer)
  // );

  const handlePageChangeWithFilter = (
    newPage: number,
    setPage: React.Dispatch<React.SetStateAction<number>>,
    setFilteredObject: React.Dispatch<React.SetStateAction<any>>
  ) => {
    setPage(newPage);
    setFilteredObject((prevState: any) => ({
      ...prevState,
      page: newPage + 1,
    }));
  };

  const handleChangeRowsPerPageWithFilter = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setRowsPerPage: React.Dispatch<React.SetStateAction<number>>,
    setPage: React.Dispatch<React.SetStateAction<number>>,
    setFilteredObject: React.Dispatch<React.SetStateAction<any>>
  ) => {
    const pageSize = parseInt(event.target.value);

    setRowsPerPage(pageSize);
    setPage(0);
    setFilteredObject((prevState: any) => ({
      ...prevState,
      page: 1,
      limit: pageSize,
    }));
  };

  const closeDeleteModal = () => {
    setDeleteOpen(false);
  };

  const deleteFilter = async () => {
    const params = {
      id: deleteId,
    };
    const url = `${process.env.baseURL}/form/delete`;
    const successCallback = (
      ResponseData: null,
      error: boolean,
      ResponseStatus: string
    ) => {
      if (ResponseStatus === "Success" && error === false) {
        toast.success("Record has been deleted successfully.");
        getFormList();
        setDeleteOpen(false);
      } else {
        setDeleteOpen(false);
        getFormList();
        toast.success("Please try again later.");
      }
    };
    callAPI(url, params, successCallback, "POST");
  };

  return (
    <>
      {loaded ? (
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            data={formData}
            columns={formCols}
            title={undefined}
            options={{
              filterType: "checkbox",
              responsive: "standard",
              tableBodyHeight: "75vh",
              viewColumns: false,
              filter: false,
              print: false,
              download: false,
              search: false,
              pagination: false,
              selectToolbarPlacement: "none",
              draggableColumns: {
                enabled: true,
                transitionTime: 300,
              },
              elevation: 0,
              selectableRows: "none",
              textLabels: {
                body: {
                  noMatch: (
                    <div className="flex items-start">
                      <span>Currently there is no record found.</span>
                    </div>
                  ),
                  toolTip: "",
                },
              },
            }}
            data-tableid="unassignee_Datatable"
          />
          <TablePagination
            component="div"
            count={tableDataCount}
            page={page}
            onPageChange={(
              event: React.MouseEvent<HTMLButtonElement> | null,
              newPage: number
            ) => {
              handlePageChangeWithFilter(newPage, setPage, setFilteredOject);
            }}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(
              event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
              handleChangeRowsPerPageWithFilter(
                event,
                setRowsPerPage,
                setPage,
                setFilteredOject
              );
            }}
          />
        </ThemeProvider>
      ) : (
        <Loader />
      )}
      <DeleteDialog
        isOpen={deleteOpen}
        onClose={closeDeleteModal}
        onActionClick={() => {
          deleteFilter();
        }}
        Title={"Delete Data"}
        firstContent={"Are you sure you want to delete this record?"}
        secondContent={""}
      />
    </>
  );
};

export default FormDatatable;
