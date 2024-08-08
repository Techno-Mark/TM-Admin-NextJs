import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Autocomplete, FormControl, Slide, TextField } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const initialFilter = {
  formType: null,
  date: null,
};

interface FilterProps {
  formType: string | null;
  date: string | null;
}

interface FilterModalProps {
  onOpen: boolean;
  onClose: () => void;
  currentFilterData?: (data: FilterProps) => void;
}

interface LabelValue {
  label: string;
  value: string;
}

const formDropdownData = [
  {
    label: "FormWithProjectDescription",
    value: "FormWithProjectDescription",
  },
  {
    label: "FormWithoutProjectDescription",
    value: "FormWithoutProjectDescription",
  },
];

const DialogTransition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const FilterDialog = ({
  onOpen,
  onClose,
  currentFilterData,
}: FilterModalProps) => {
  const [formType, setFormType] = useState<LabelValue | null>(null);
  const [date, setDate] = useState<string | null>(null);

  const [anyFieldSelected, setAnyFieldSelected] = useState<boolean>(false);
  const [currSelectedFields, setCurrSelectedFileds] =
    useState<FilterProps>(initialFilter);

  const sendFilterToPage = () => {
    currentFilterData?.(currSelectedFields);
    onClose();
  };

  const handleResetAll = () => {
    setFormType(null);
    setDate(null);
    setAnyFieldSelected(false);
    currentFilterData?.(initialFilter);
  };

  useEffect(() => {
    const isAnyFieldSelected: boolean = formType !== null || date !== null;

    setAnyFieldSelected(isAnyFieldSelected);
  }, [formType, date]);

  useEffect(() => {
    const selectedFields = {
      formType: formType !== null ? formType.value : null,
      date: date !== null ? dayjs(date).format("MM-DD-YYYY") : null,
    };
    setCurrSelectedFileds(selectedFields);
  }, [formType, date]);

  return (
    <div>
      <Dialog
        open={onOpen}
        TransitionComponent={DialogTransition}
        keepMounted
        maxWidth="md"
        onClose={() => onClose()}
      >
        <DialogTitle className="h-[64px] p-[20px] flex items-center justify-between border-b border-b-lightSilver">
          <span className="text-lg font-medium">Filter</span>
          <Button color="error" onClick={handleResetAll}>
            Reset all
          </Button>
        </DialogTitle>

        <DialogContent>
          <div className="flex flex-col gap-[20px] pt-[15px]">
            <div className="flex gap-[20px]">
              <FormControl
                variant="standard"
                sx={{ mx: 0.75, mt: 0.5, minWidth: 300 }}
              >
                <Autocomplete
                  id="tags-standard"
                  options={formDropdownData}
                  getOptionLabel={(option: LabelValue) => option.label}
                  onChange={(
                    e: React.ChangeEvent<{}>,
                    data: LabelValue | null
                  ) => {
                    setFormType(data);
                  }}
                  value={formType}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Form type"
                    />
                  )}
                />
              </FormControl>
              <div
                className={`inline-flex mt-[2.88px] mx-[6px] muiDatepickerCustomizer w-[300px] max-w-[300px]`}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date of Creation"
                    value={date === null ? null : dayjs(date)}
                    onChange={(newDate: any) => setDate(newDate.$d)}
                    maxDate={dayjs(Date.now())}
                    slotProps={{
                      textField: {
                        readOnly: true,
                      } as Record<string, any>,
                    }}
                  />
                </LocalizationProvider>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="border-t border-t-lightSilver p-[20px] gap-[10px] h-[64px]">
          <Button
            variant="contained"
            color="info"
            className={`${anyFieldSelected && "!bg-secondary"}`}
            disabled={!anyFieldSelected}
            onClick={sendFilterToPage}
          >
            Apply Filter
          </Button>

          <Button variant="outlined" color="info" onClick={() => onClose()}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FilterDialog;
