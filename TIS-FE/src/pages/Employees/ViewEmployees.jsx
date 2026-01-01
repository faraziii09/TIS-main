import UserAvatar from "../../assets/user.png";
import axios from "../../axiosConfig";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Tooltip } from "@mui/material";
import { FiEdit2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import NothingHere from "../../assets/nothing_here.png";
import DeleteUserModal from "../../components/employees/DeleteUserModal";
import UpdateUserModal from "../../components/employees/UpdateUserModal";
import Loader from "../../components/utils/Loader";

const ViewEmployees = ({ activeTab }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteUserModal, setDeleteUserModal] = useState({
    isOpen: false,
    userID: null,
  });
  const [updateUserModal, setUpdateUserModal] = useState({
    isOpen: false,
    data: null,
  });

  const selectionModelRef = useRef();

  const columns = [
    {
      field: "id",
      headerName: "#",
      width: 70,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <span className="text-gray-400 font-medium text-sm">{params.value}</span>
      ),
    },
    {
      field: "profile_picture",
      headerName: "Member",
      minWidth: 80,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-center h-full">
            <img
              className="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-sm"
              src={params.value || UserAvatar}
              alt="avatar"
            />
          </div>
        );
      },
    },
    {
      field: "displayName",
      headerName: "Name",
      minWidth: 180,
      flex: 1,
      renderCell: (params) => (
        <div className="flex flex-col justify-center h-full">
            <span className="font-semibold text-gray-700 text-sm">{params.value}</span>
        </div>
      ),
    },
    {
      field: "username",
      headerName: "User ID",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center h-full">
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-mono">
                @{params.value}
            </span>
        </div>
      ),
    },
    {
      field: "password",
      headerName: "Password",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center h-full">
            <span className="text-gray-400 text-sm tracking-wider font-mono">
                {params.value}
            </span>
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-center gap-2 h-full">
            <Tooltip title="Edit Details" arrow>
                <button 
                    onClick={() => setUpdateUserModal({ isOpen: true, data: params.row })}
                    className="p-2 rounded-full text-blue-500 hover:bg-blue-50 transition-colors"
                >
                    <FiEdit2 size={16} />
                </button>
            </Tooltip>
            <Tooltip title="Delete Member" arrow>
                <button 
                    onClick={() => setDeleteUserModal({ isOpen: true, userID: params.row._id })}
                    className="p-2 rounded-full text-red-400 hover:bg-red-50 transition-colors"
                >
                    <FaTrash size={14} />
                </button>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/users");
      const users = response?.data?.data;

      const usersFormatted = users?.map((user, index) => {
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
        theme: "light",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if(activeTab === "viewEmployee"){
      fetchUsers();
    }
  }, [activeTab]);

  return (
    <>
      <div className={activeTab === "viewEmployee" ? "slideDown mt-8 max-w-6xl mx-auto" : "hidden"}>
        {!loading ? (
          users?.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 p-12">
              <img src={NothingHere} width={300} alt="No users" className="opacity-80" />
              <h1 className="text-xl font-medium text-gray-500 mt-6">No team members found</h1>
              <p className="text-gray-400 text-sm mt-2">Add a new member to get started.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800">Team Members</h2>
                    <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
                        {users.length} Total
                    </span>
                </div>
                <div style={{ width: '100%' }}>
                    <DataGrid
                        rows={users}
                        columns={columns}
                        loading={loading}
                        autoHeight
                        disableRowSelectionOnClick
                        checkboxSelection
                        rowSelectionModel={selectionModelRef.current}
                        onRowSelectionModelChange={(ids) => {
                            selectionModelRef.current = ids;
                        }}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        pageSizeOptions={[5, 10, 25]}
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#f9fafb',
                                borderBottom: '1px solid #f3f4f6',
                                color: '#374151',
                                fontSize: '0.875rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            },
                            '& .MuiDataGrid-cell': {
                                borderBottom: '1px solid #f3f4f6',
                            },
                            '& .MuiDataGrid-row:hover': {
                                backgroundColor: '#f9fafb',
                            },
                            '& .MuiCheckbox-root': {
                                color: '#d1d5db',
                            },
                            '& .Mui-checked': {
                                color: '#2563eb',
                            },
                        }}
                    />
                </div>
            </div>
          )
        ) : (
            <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-sm">
                <Loader color="#2563eb" />
            </div>
        )}
      </div>

      <DeleteUserModal
        fetchUsers={fetchUsers}
        deleteUserModal={deleteUserModal}
        handleClose={() => setDeleteUserModal({ isOpen: false })}
      />
      <UpdateUserModal
        fetchUsers={fetchUsers}
        updateUserModal={updateUserModal}
        handleClose={() => setUpdateUserModal({ isOpen: false })}
      />
    </>
  );
};

export default ViewEmployees;