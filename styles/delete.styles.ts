// styles/create.styles.ts
import { COLORS } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");


export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 8,
    width: 280,
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#fff",
    marginBottom: 10,
  },
  message: {
    color: "#ccc",
    marginBottom: 20,
    textAlign: "center",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center", 
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: "center",
  },
  cancel: {
    backgroundColor: "#555",
  },
  confirm: {
    backgroundColor: "#e53935",
  },
  cancelText: {
    color: "#fff",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "bold",
  },
});