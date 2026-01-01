import { Box } from "@mui/material";
import PropTypes from "prop-types";

const Loader = ({ size = 20, color = "white" }) => {
  return (
    <Box
      sx={{
        transform: "translate(-50%, -50%)",
        "& .loader, & .loader:before, & .loader:after": {
          width: size + "px",
          height: size + "px" 
        },
      }}
      className="absolute top-[50%] flex justify-center items-center left-[50%]"
    >
      <span className="loader" style={{ color }}></span>
    </Box>
  );
};

Loader.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
export default Loader;
