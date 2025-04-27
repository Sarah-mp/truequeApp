import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  ImageStyle,
} from "react-native";

type LogoProps = {
  source?: ImageSourcePropType;
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
};

const Logo: React.FC<LogoProps> = ({
  source = require("@/assets/iconos/google.png"),
  width = 120,
  height = 120,
  style,
}) => {
  return (
    <Image
      source={source}
      style={[{ width, height, resizeMode: "contain" }, style]}
    />
  );
};

export default Logo;
