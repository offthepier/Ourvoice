import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";

function CustomSvgIcon(props: SvgIconProps) {
  return (
    <SvgIcon data-testid="custom-svg-icon" {...props}>
      <path d={props.d} fill={props.fill} />
    </SvgIcon>
  );
}

export { CustomSvgIcon };
