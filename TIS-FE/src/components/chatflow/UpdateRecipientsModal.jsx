import { Modal, Backdrop, IconButton } from "@mui/material";
import { IoMdClose } from "react-icons/io";
import Step2 from "./Step2";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const UpdateRecipientsModal = ({ recipientsModal = {}, flow, handleClose, fetchFlows, selectedEmployee }) => {

  return (

    <Modal
      keepMounted
      open={recipientsModal?.open}
      onClose={handleClose}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <div
        style={style}
        className={`w-[calc(100%-20px)] md:w-[70%] h-[90vh] bg-white absolute top-1/2 left-1/2 px-5 pt-12 pb-6 rounded-md`}
      >
        <IconButton
          sx={{
            position: "absolute",
            right: 7,
            top: 10,
            color: "black",
          }}
          onClick={handleClose}
        >
          <IoMdClose size={18} />
        </IconButton>

        <div className="h-[98%] overflow-y-scroll">
          <Step2 flow={flow} updateRecipients fetchFlows={fetchFlows} handleClose={handleClose} selectedEmployee={selectedEmployee}/>
        </div>

      </div>
    </Modal>
  );
};

export default UpdateRecipientsModal;
