function Button({
  children,
  type = "button",
  onClick,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        bg-blue-600
        hover:bg-blue-700
        text-white
        px-5
        py-2.5
        rounded-xl
        transition
        duration-300
        font-medium
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default Button;