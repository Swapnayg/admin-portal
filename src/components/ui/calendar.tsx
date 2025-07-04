'use client';

import * as React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { Dayjs } from "dayjs";

export function Calendar() {
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={selectedDate}
        onChange={(newValue) => setSelectedDate(newValue)}
        slots={{
          leftArrowIcon: ChevronLeft,
          rightArrowIcon: ChevronRight,
          textField: (props) => (
            <TextField
              {...props}
              variant="outlined"
              size="small"
              fullWidth
              sx={{
                backgroundColor: "#f9fafb",
                borderRadius: 1,
                '& .MuiInputBase-root': {
                  fontSize: "0.875rem",
                },
              }}
            />
          ),
        }}
        slotProps={{
          popper: {
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 8],
                },
              },
            ],
          },
        }}
      />
    </LocalizationProvider>
  );
}
