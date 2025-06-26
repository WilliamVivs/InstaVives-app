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
    paddingTop: 40,
    flex: 1,
    zIndex: 10,
  },
  storyModalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: 10,
  },
  trashButton: {
    position: "absolute",
    bottom: 50,
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
  display:"flex",
  top: 20,
  width: "90%",
  alignItems: "center",
  justifyContent: 'center',
  marginHorizontal: 16,
  marginBottom: 20,
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: COLORS.background,
    borderRadius: 25,
    padding: 30,
    width: '85%',
    display: "flex",
    gap: 3,

  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: COLORS.primary
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 10,
  },
  actions: {
    marginTop: 12,
    gap: 10,
  },
  cancelText: {
    textAlign: 'center',
    color: 'red',
    marginTop: 8,
    fontSize: 15,
  },
  insideStoryAvatar: {
    borderRadius:50,
    width: 30,
    height: 30,
  },
    insideStoryHeader: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // <-- Añade esto
    width: "100%",        // <-- Añade esto para ocupar todo el ancho
    paddingHorizontal: 16,
    marginBottom: -10,
  },
  storyModalUsername: {
  color: "white",
  fontSize: 16,
  fontWeight: "bold",
  // Elimina position, top, left si estaban
  },
  closeButton: {
    color: COLORS.primary
  },
  buttons: {
    padding: 10,
    width: "100%",
    backgroundColor: COLORS.primary,
    color: COLORS.background,
    borderRadius: 10,
    alignItems: "center",
  },
  textButton: {
    fontSize: 14,
    fontWeight: 600,
    alignItems: "center",
    color: COLORS.white,
  },
  storyImageContainer: {
  width: "100%",
  height: "100%",
},
imageNavLeft: {
  position: "absolute",
  left: 0,
  top: 0,
  width: "49%",
  height: "100%",
  zIndex: 2,
},
imageNavRight: {
  position: "absolute",
  right: 0,
  top: 0,
  width: "49%",
  height: "100%",
  zIndex: 2,
},
});