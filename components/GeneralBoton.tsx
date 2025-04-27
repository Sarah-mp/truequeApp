import React from "react";
import { Button } from "react-native-paper";
import { LinkProps, useRouter } from "expo-router";

type PropsGeneralBoton = {
  texto: string;
  colorFondo?: string;
  colorTexto?: string;
  ruta?: LinkProps["href"];
};

const GeneralBoton: React.FC<PropsGeneralBoton> = ({
  texto,
  colorFondo = "#999999",
  colorTexto = "#000000",
  ruta,
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (ruta) {
      router.push(ruta);
    } else {
      console.log("Botón presionado sin ruta");
    }
  };

  return (
    <Button
      icon="arrow-right"
      mode="text"
      buttonColor={colorFondo}
      textColor={colorTexto}
      onPress={handlePress}
    >
      {texto}
    </Button>
  );
};

export default GeneralBoton;
