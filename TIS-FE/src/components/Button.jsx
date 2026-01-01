import { Button as Btn } from "@mui/material";

// eslint-disable-next-line react/prop-types
const Button = ({ children, props, type="primary", style, onClick }) => {
  if (type === "primary") {
    return (
      <Btn
        type="button"
        style={{ background: "black", fontSize: "15px", color: "white", ...style }}
        className={`rounded shadow text-white font-bold flex justify-center items-center`}
        onClick={onClick}
        {...props}
      >
      {children}
      </Btn>
    );
  } else {
    return (
      <Btn
        type="button"
        style={{ background: "grey", color: "black" }}
        className="rounded shadow text-white font-bold flex justify-center items-center"
        {...props}
      >
        {children}
      </Btn>
    );
  }
};

export default Button;
