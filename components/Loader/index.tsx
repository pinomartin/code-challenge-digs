import React from "react";
import { ActivityIndicator, View } from "react-native";
import { getStyles } from "./styles";

const Loader = () => {
  const styles = getStyles();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default Loader;
