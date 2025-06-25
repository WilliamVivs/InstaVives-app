import { COLORS } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

const {width, height} = Dimensions.get("window");

export const styles = StyleSheet.create({
  storyWrapper: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  storyRing: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 50,
    padding: 2,
  },
  seenStoryRing: {
    borderColor: "#bbb", // gris más tenue
    opacity: 0.6, // menos intensidad
  },
  noStory: {
    borderColor: "#888", // gris para cuando no hay historia
  },
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  storyUsername: {
    marginTop: 4,
    fontSize: 12,
    color: "white",
    textAlign: "center",
    maxWidth: 78
  },
  // Styles del modal de historias
  storyModalContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  storyModalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: 10,
  },
  trashButton: {
    position: "absolute",
    bottom: 40,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
  },
  progressBarContainer: {
  flexDirection: 'row',
  position: 'absolute',
  top: 20,
  left: 10,
  right: 10,
  height: 4,
  justifyContent: 'space-between',
  zIndex: 10,
  },

  progressBar: {
    flexBasis: 0,      // Para que el ancho venga del flexGrow y flexShrink
    flexGrow: 1,       // Cada barra ocupa igual parte del ancho total
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 2,
    borderRadius: 2,
    overflow: 'hidden',  // Para que el relleno no sobresalga
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
    width: '0%',         // Se actualiza dinámicamente
  },
  //create modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '85%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  actions: {
    marginTop: 10,
    gap: 10,
  },
  cancelText: {
    textAlign: 'center',
    color: 'red',
    marginTop: 8,
  },
  insideStoryAvatar: {
    borderRadius:50,
    width: 30,
    height: 30,
  },
    insideStoryHeader: {
    marginTop: 120,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // <-- Añade esto
    width: "100%",        // <-- Añade esto para ocupar todo el ancho
    paddingHorizontal: 16, // Opcional: para separar de los bordes
    gap: 12,
  },
  storyModalUsername: {
  color: "white",
  fontSize: 16,
  fontWeight: "bold",
  // Elimina position, top, left si estaban
  },
  closeButton: {
    color: COLORS.primary
  }
});