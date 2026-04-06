import { StyleSheet } from "react-native";

const PURPLE       = "#6c63ff";
const PURPLE_LIGHT = "rgba(108,99,255,0.18)";
const PURPLE_BORDER= "rgba(108,99,255,0.40)";
const BG           = "rgba(10,14,30,0.97)";
const SURFACE      = "rgba(255,255,255,0.05)";
const SURFACE2     = "rgba(255,255,255,0.09)";
const BORDER       = "rgba(255,255,255,0.08)";
const WHITE_DIM    = "rgba(255,255,255,0.50)";
const WHITE_MID    = "rgba(255,255,255,0.75)";
const WHITE_BRIGHT = "#e2d9ff";
const USER_BUBBLE  = "rgba(108,99,255,0.22)";
const USER_BORDER  = "rgba(108,99,255,0.40)";
const BOT_BUBBLE   = "rgba(255,255,255,0.07)";
const BOT_BORDER   = "rgba(255,255,255,0.10)";

export default StyleSheet.create({

  /* ── Root ── */
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  /* ── Top / header ── */
  top: {
    alignItems: "center",
    paddingTop: 54,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    backgroundColor: "rgba(10,14,30,0.95)",
  },
  topAccent: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: 2,
    backgroundColor: PURPLE,
    opacity: 0.75,
  },
  topTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: WHITE_BRIGHT,
    letterSpacing: 0.2,
  },
  topSubtitle: {
    fontSize: 12,
    color: WHITE_DIM,
    marginTop: 3,
  },
  topStatusDot: {
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: "#34c7a0",
    position: "absolute",
    right: 20, top: 60,
  },

  image: {
    marginTop: 40,
  },

  textWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: WHITE_MID,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: WHITE_DIM,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 32,
  },

  /* ── Messages ── */
  message: {
    maxWidth: "78%",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginVertical: 4,
    borderWidth: 1,
  },
  userMsg: {
    backgroundColor: USER_BUBBLE,
    borderColor: USER_BORDER,
    alignSelf: "flex-end",
    borderBottomRightRadius: 3,
  },
  botMsg: {
    backgroundColor: BOT_BUBBLE,
    borderColor: BOT_BORDER,
    alignSelf: "flex-start",
    borderBottomLeftRadius: 3,
  },
  userMsgText: {
    color: WHITE_BRIGHT,
    fontSize: 14,
    lineHeight: 20,
  },
  botMsgText: {
    color: WHITE_MID,
    fontSize: 14,
    lineHeight: 20,
  },
  msgTime: {
    fontSize: 10,
    color: WHITE_DIM,
    marginTop: 4,
    alignSelf: "flex-end",
  },

  /* ── Bottom input bar ── */
  bottom: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingBottom: 22,
    backgroundColor: "rgba(10,14,30,0.96)",
    borderTopWidth: 1,
    borderTopColor: BORDER,
    gap: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 24,
    borderColor: BORDER,
    backgroundColor: SURFACE2,
    color: WHITE_BRIGHT,
    fontSize: 14,
  },

  /* Send — active */
  button: {
    width: 46, height: 46,
    borderRadius: 23,
    backgroundColor: PURPLE_LIGHT,
    borderWidth: 1,
    borderColor: PURPLE_BORDER,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: WHITE_BRIGHT,
    fontSize: 18,
    fontWeight: "700",
  },

  /* Send — disabled / loading */
  buttonResponseNotRecieved: {
    width: 46, height: 46,
    borderRadius: 23,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTextResponseNotRecieved: {
    color: WHITE_DIM,
    fontSize: 18,
    fontWeight: "700",
  },

  /* Upload icon button */
  Uploadbutton: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: SURFACE2,
    borderWidth: 1,
    borderColor: BORDER,
    justifyContent: "center",
    alignItems: "center",
  },

  /* Upload popup card */
  UploadBox: {
    position: "absolute",
    bottom: 80, left: 14,
    width: 190,
    backgroundColor: "rgba(18,22,42,0.97)",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  uploadOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  uploadOptionIcon: {
    fontSize: 16,
  },
  uploadOptionText: {
    fontSize: 13,
    color: WHITE_MID,
    fontWeight: "500",
  },
  uploadDivider: {
    height: 1,
    backgroundColor: BORDER,
    marginHorizontal: 10,
  },

  /* Typing indicator dots */
  typingWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: BOT_BUBBLE,
    borderWidth: 1,
    borderColor: BOT_BORDER,
    borderRadius: 14,
    borderBottomLeftRadius: 3,
    alignSelf: "flex-start",
    marginVertical: 4,
  },
  typingDot: {
    width: 7, height: 7,
    borderRadius: 4,
    backgroundColor: WHITE_DIM,
  },
});