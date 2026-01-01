import { Link } from "react-router-dom";

const SidebarItem = ({
  link,
  Icon,
  ActiveIcon,
  sidebarShrunk,
  children,
  active,
}) => {
  return (
    <Link to={link} className={`cursor-pointer ${sidebarShrunk && 'justify-center'} px-4 py-1.5 flex items-center`}>
      {active ? <ActiveIcon size={sidebarShrunk ? 24 : 16}/>: <Icon size={sidebarShrunk ? 24 : 16}/>}{" "}
      {!sidebarShrunk &&
      <span className={`pl-2 ${active && "font-bold text-primary"}`}>
        {children}
      </span>
      }
    </Link>
  );
};

export default SidebarItem;
