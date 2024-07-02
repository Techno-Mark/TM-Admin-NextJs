import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles({
  imageCenter: {
    justifyContent: "center",
    width: "100%",
  },
  avatarStyle: {
    height: "24px",
    width: "24px",
    fontSize: "12px",
  },
  textSize: {
    fontSize: "14px",
  },
  drawer: {
    background: "#FFFFFF",
    height: "100%",
  },
  sidebarDrawer: {
    background: "#023963 !important",
    height: "100%",
  },
  underlineWithPlaceholderColor: {
    "&:after": {
      borderBottom: "0.5px solid #023963",
    },
    "& .MuiInputBase-input": {
      borderColor: "#023963",
    },
    "& .MuiInputBase-input::placeholder": {
      "--tw-placeholder-opacity": 1,
      color: "#6E7487",
    },
  },
  underline: {
    "&:after": {
      borderBottom: "0.5px solid #023963",
    },
    "& .MuiInputBase-input": {
      borderColor: "#023963",
    },
  },
  underlineDropdown: {
    "& div::before": {
      borderBottom: "none !important",
    },
  },
});
