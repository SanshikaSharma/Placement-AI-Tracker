import { motion } from "framer-motion";

function Card({ children, className = "" }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`
        bg-white
        rounded-2xl
        shadow-md
        hover:shadow-xl
        p-6
        transition-all
        duration-300
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

export default Card;