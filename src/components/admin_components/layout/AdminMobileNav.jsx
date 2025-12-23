import { useState } from "react";

const AdminMobileNav = () => {
  const [activeIndex, setActiveIndex] = useState(2); 

  const items = ["🏠", "📋", "➕", "📊", "⚙️"];

  return (
    <nav className="mobile-nav">
      {items.map((icon, index) => (
        <span
          key={index}
          className={activeIndex === index ? "active" : ""}
          onClick={() => setActiveIndex(index)}
        >
          {icon}
        </span>
      ))}
    </nav>
  );
};

export default AdminMobileNav;
