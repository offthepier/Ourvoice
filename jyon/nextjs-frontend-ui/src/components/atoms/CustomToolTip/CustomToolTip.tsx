import COLORS from "@/themes/colors";
import { Typography } from "@mui/material";
import { TooltipProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <div>
          {payload.map((pld) => (
            <div key={pld.value + label}>
              <Typography
                sx={{
                  backgroundColor: COLORS.secondary,
                  padding: "3px",
                  fontSize: "13px",
                  borderRadius: "5px",
                }}
              >{`${payload[0].payload.name}`}</Typography>
              {/* <div>{pld.dataKey}</div> */}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export { CustomTooltip };
