import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Autocomplete, FormControl, Slide, TextField } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

const initialFilter = {
  formType: null,
};

interface FilterProps {
  formType: string | null;
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

  const [anyFieldSelected, setAnyFieldSelected] = useState<boolean>(false);
  const [currSelectedFields, setCurrSelectedFileds] =
    useState<FilterProps>(initialFilter);

  const sendFilterToPage = () => {
    currentFilterData?.(currSelectedFields);
    onClose();
  };

  const handleResetAll = () => {
    setFormType(null);
    setAnyFieldSelected(false);
    currentFilterData?.(initialFilter);
  };

  useEffect(() => {
    const isAnyFieldSelected: boolean = formType !== null;

    setAnyFieldSelected(isAnyFieldSelected);
  }, [formType]);

  useEffect(() => {
    const selectedFields = {
      formType: formType !== null ? formType.value : null,
    };
    setCurrSelectedFileds(selectedFields);
  }, [formType]);

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
