import { ThemeConfig } from "antd";
import { COLORS } from "../styles/colors";

export const antTheme: ThemeConfig = {
  token: {
    colorPrimary: COLORS.primaryColor,
    colorSuccess: COLORS.greenIdentifier,
    colorTextBase: COLORS.textColorDark,
    controlHeight: 50,
  },
  components: {
    Input: {
      fontSize: 18,
      paddingBlock: 12,
      paddingInline: 14,
      borderRadius: 12,
      colorBorder: COLORS.borderColorDark,
      colorTextLabel: COLORS.textColorLight,
    },
    Select: {
      borderRadius: 16,
    },
  },
};
