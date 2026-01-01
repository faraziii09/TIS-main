import UserAvatar from "../../assets/user.png";
import axios from "../../axiosConfig";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import NothingHere from "../../assets/nothing_here.png";
import Loader from "../../components/utils/Loader";
import Button from "../Button";
import { CircularProgress } from "@mui/material";

const Step2 = ({
  selectedEmployee,
  handleClose,
  flow,
  fetchFlows,
  updateRecipients = false,
}) => {
  const [users, setUsers] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const selectionModelRef = useRef();

  const columns = [
    {
      field: "id",
      headerName: "#",
      minWidth: 40,
      headerAlign: "center",
      flex: 1,
      renderCell: (cellValues) => {
        return <strong>{cellValues?.formattedValue}</strong>;
      },
    },
    {
      field: "profile_picture",
      headerName: "Picture",
      minWidth: 100,
      headerAlign: "center",
      flex: 1,
      renderCell: (cellValues) => {
        return (
            <img
              src={cellValues?.formattedValue || UserAvatar}
              style={{ width: '15%', maxHeight: '100%' }}
              alt="pic"
            />
        );
      },
    },

    {
      field: "displayName",
      headerName: "Display Name",
      minWidth: 100,
      headerAlign: "center",
      flex: 1,
      renderCell: (cellValues) => {
        return <p>{cellValues?.formattedValue}</p>;
      },
    },

    {
      field: "username",
      headerName: "User ID",
      minWidth: 100,
      headerAlign: "center",
      flex: 1,
      renderCell: (cellValues) => {
        return <p>{cellValues?.formattedValue}</p>;
      },
    },
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/users");
      const users = response?.data?.data;

      const usersFormatted = users
        ?.filter((user) => user?._id !== selectedEmployee?._id)
        ?.map((user, index) => {
          return {
            id: index + 1,
            ...user,
          };
        });
      setUsers(usersFormatted);

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

  const createFlow = async () => {
    try {
      setBtnLoading(true);
      const response = await axios.post(
        "/flows",
        JSON.stringify({
          user: selectedEmployee?._id,
          recipients: selectedRows?.map((row) => row?._id),
        })
      );

      toast.success("A new Chat Flow is created!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      fetchFlows();
      handleClose();
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
    setBtnLoading(false);
  };
  const updateFlow = async () => {
    try {
      setBtnLoading(true);
      const response = await axios.post(
        "/flows/" + flow?._id,
        JSON.stringify({
          recipients: selectedRows?.map((row) => row?._id),
        })
      );

      toast.success(response?.data?.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      fetchFlows();
      handleClose();
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
    setBtnLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedEmployee]);

  useEffect(() => {
    if (updateRecipients) {
      if (users.length > 0) {
        let indexes = [];
        users?.forEach((user, index) => {
          if (flow?.recipients?.includes(user?._id)) {
            indexes.push(index + 1);
          }
        });
        setSelectedRows(indexes?.map((index) => users[index - 1]));
        selectionModelRef.current = indexes;
      }
    }
  }, [users, selectedEmployee]);
  return (
    <>
      <div className="overflow-y-scroll h-[98%]">
        {!loading ? (
          <div>
            <h1 className="text-lg mb-4 text-center">
              {updateRecipients ? (
                <span>Update recipients</span>
              ) : (
                <span>Step 2: Select Recipients</span>
              )}{" "}
              for <strong>{selectedEmployee?.displayName}</strong>
            </h1>
            {selectedRows?.length > 0 && (
              <div className="flex items-center justify-center">
                <Button
                  onClick={updateRecipients ? updateFlow : createFlow}
                >
                  {btnLoading ? (
                    <CircularProgress
                      size={18}
                      style={{ color: "white" }}
                    />
                  ) : (
                    <span>Assign the selected participants</span>
                  )}
                </Button>
              </div>
            )}

            {users?.length === 0 ? <div className="flex slideDown items-center relative flex-col">
              <img src={NothingHere} width={400} alt="" />
              <h1 className="text-lg absolute bottom-4">Nothing here!</h1>
            </div> :

              <DataGrid
                className="slideDown mt-8"
                disableRowSelectionOnClick
                rows={users}
                loading={loading}
                width="auto"
                checkboxSelection
                rowSelectionModel={selectionModelRef.current}
                onRowSelectionModelChange={(ids) => {
                  selectionModelRef.current = ids;
                  setSelectedRows(ids?.map((id) => users[id - 1]));
                }}
                columns={columns}
                rowHeight={26}
                sx={{
                  boxShadow: 2,
                  "& .MuiDataGrid-virtualScrollerContent .MuiSvgIcon-root": {
                    color: "black",
                  },
                  "& .MuiDataGrid-cell": {
                    display: "flex",
                    justifyContent: "center",
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: "bold",
                  },
                }}
                columnWidths={{
                  checkbox: "30px",
                }}
              />
            }
          </div>
        )
          : (
            <Loader color="black" />
          )}
      </div>
    </>
  );
};

export default Step2;
