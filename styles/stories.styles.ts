import { Dimensions, StyleSheet } from "react-native";

const {width, height} = Dimensions.get("window");

export const styles = StyleSheet.create({
  storyWrapper: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  storyRing: {
    borderWidth: 2,
    borderColor: "#FF4E4E",
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
  },
  // Styles del modal de historias
  storyModalContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  storyModalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  storyModalUsername: {
    position: "absolute",
    top: 50,
    left: 20,
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 40,
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
});