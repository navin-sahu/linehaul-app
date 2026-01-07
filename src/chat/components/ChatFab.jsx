const ChatFab = ({ onClick }) => {
  return (
    <button
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "cadetblue",
        color: "#fff",
        fontSize: 22,
        border: 0,
        cursor: "pointer",
        zIndex: 999
      }}
      onClick={onClick}
    >
      💬
    </button>
  );
};

export default ChatFab;
