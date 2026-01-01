import { useEffect, useState } from "react";
import axios from "../../axiosConfig";
import { toast } from "react-toastify";
import UserCard from "../UserCard";
import NothingHere from "../../assets/nothing_here.png";
import Loader from "../utils/Loader";
import Button from "../Button";

const Step1 = ({ selectedEmployee, setSelectedEmployee, setStep }) => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);

  const fetchEmployeesList = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/users?without-flow=1");
      const users = response?.data?.data;
      setEmployees(users);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    fetchEmployeesList();
  }, []);
  return (
    <div className="h-full flex flex-col">
      <h1 className="text-lg text-center">Step 1: Select Employee</h1>
      <div className="py-4 flex-1 flex gap-x-3 flex-wrap items-start h-[230px] overflow-y-scroll">
        {loading ? (
          <Loader color="black" />
        ) : employees?.length > 0 ? (
          employees?.map((emp) => (
            <UserCard
              width={48}
              onClick={() => setSelectedEmployee(emp)}
              className={
                selectedEmployee?._id === emp?._id
                  ? "border-2 bg-blue-100 border-primary"
                  : "mb-2"
              }
              key={emp?._id}
              data={emp}
            />
          ))
        ) : (
          <div className="flex justify-center w-full slideDown items-center relative flex-col">
            <img src={NothingHere} width={400} alt="" />
            <h1 className="text-lg absolute bottom-4">Nothing here!</h1>
          </div>
        )}
      </div>
      <div className="mt-5 flex items-center justify-center space-x-2">
        <Button
          props={{ className: "w-full", disabled: !selectedEmployee }}
          style={{
            color: "white",
          }}
          onClick={() => setStep(2)}
        >
          <span>Next</span>
        </Button>
      </div>
    </div>
  );
};

export default Step1;
