import { useEffect, useState } from "react";
import { Modal, Backdrop, IconButton } from "@mui/material";
import { IoMdClose } from "react-icons/io";
import Step1 from "./Step1";
import Step2 from "./Step2";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const CreateFlowModal = ({ createFlowModal = {}, handleClose, fetchFlows }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [step, setStep] = useState(1);

  const steps = {
    1: () => (
      <Step1
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
        setStep={setStep}
      />
    ),
    2: () => (
      <Step2 fetchFlows={fetchFlows} selectedEmployee={selectedEmployee} handleClose={handleClose}/>
    )
  };


  useEffect(() => {
    setStep(1);
    return () => {
      setStep(1);
    }
  }, []);
  return (

    <Modal
      keepMounted
      open={createFlowModal?.isOpen}
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
        className={`w-[calc(100%-20px)] md:w-[70%] h-[90%] bg-white absolute top-1/2 left-1/2 px-5 pt-12 pb-6 rounded-md`}
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

        {steps[step]()}
      </div>
    </Modal>
  );
};

export default CreateFlowModal;
