import { useEffect, useState, useMemo } from "react";
import Button from "../../components/Button";
import { FaPlus, FaPen } from "react-icons/fa"; // Added FaPen for edit icon
import CreateFlowModal from "../../components/chatflow/CreateFlowModal";
import axios from "../../axiosConfig";
import { toast } from "react-toastify";
import NothingHere from "../../assets/nothing_here.png";
import UpdateRecipientsModal from "../../components/chatflow/UpdateRecipientsModal";
import Loader from "../../components/utils/Loader";
import DefaultImg from "../../assets/user.png"; // Fallback image
import { Tooltip, Zoom } from "@mui/material";

const ChatFlow = ({ activeTab }) => {
  const [loading, setLoading] = useState(true);
  const [flows, setFlows] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // Store all users for lookup
  const [recipientsModal, setRecipientsModal] = useState({ open: false });
  const [createFlowModal, setCreateFlowModal] = useState({ isOpen: false });

  // Fetch all users to ensure we have names/avatars even if Flow only has IDs
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/users");
      setAllUsers(response?.data?.data || []);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  const fetchFlows = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/flows");
      const flows = response?.data?.data;
      setFlows(flows);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    if (activeTab === "setFlow") {
      fetchUsers(); // Load users for lookup
      fetchFlows();
    }
  }, [activeTab]);

  // Create a quick lookup map for users by ID (Optimization)
  const userMap = useMemo(() => {
    return allUsers.reduce((acc, user) => {
      acc[user._id] = user;
      return acc;
    }, {});
  }, [allUsers]);

  if (loading) {
    return <Loader color="black" />;
  }

  return (
    <>
      <div className={activeTab === "setFlow" ? "slideDown max-w-full" : "hidden"}>
        <div className="mt-5">
          <Button onClick={() => setCreateFlowModal({ isOpen: true })}>
            <div className="flex items-center">
              <FaPlus size={16} className="mr-1" />
              Create Flow
            </div>
          </Button>
        </div>

        {/* NEW GRID LAYOUT */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {flows?.length === 0 ? (
            <div className="col-span-full flex w-full justify-center slideDown items-center relative flex-col">
              <img src={NothingHere} width={400} alt="" />
              <h1 className="text-lg absolute bottom-4">Nothing here!</h1>
            </div>
          ) : (
            flows?.map((flow) => (
              <div
                key={flow?._id}
                className="bg-white border border-gray-200 rounded shadow-sm hover:shadow p-3 flex flex-col relative"
              >
                {/* Edit Button (Top Right) */}
                <button 
                    onClick={() => setRecipientsModal({ open: true, flow })}
                    className="absolute top-2 right-2 text-gray-400 hover:text-blue-500 transition-colors p-1 rounded-full"
                    title="Edit Members"
                >
                    <FaPen size={10} />
                </button>

                {/* Creator Info (Compact Header) */}
                <div className="flex items-center mb-2 pb-2 border-b border-gray-100">
                  <img
                    src={flow?.user?.profile_picture || DefaultImg}
                    alt={flow?.user?.displayName}
                    className="w-8 h-8 rounded-full object-cover mr-2 border border-gray-200"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-800 leading-tight">{flow?.user?.displayName}</p>
                  </div>
                </div>

                {/* Recipients List - Compact Horizontal Chips with Tooltip */}
                <div className="flex-1">
                  <div className="flex flex-wrap gap-1.5">
                    {flow?.recipients?.length > 0 ? (
                      flow?.recipients?.map((recipientItem) => {
                        // FIX: Resolve user details. If it's just an ID string, look it up in userMap.
                        let recipient = recipientItem;
                        if (typeof recipientItem === 'string') {
                            recipient = userMap[recipientItem] || {};
                        } else if (recipientItem?._id && !recipientItem.displayName) {
                            // If object exists but missing name, try looking it up by ID
                            recipient = userMap[recipientItem._id] || recipientItem;
                        }

                        return (
                          <Tooltip 
                            key={recipient?._id || Math.random()}
                            title={recipient?.displayName || "Unknown"} 
                            arrow 
                            TransitionComponent={Zoom}
                            placement="top" 
                          >
                            <div 
                                className="flex items-center bg-gray-50 rounded px-1.5 py-0.5 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                                style={{maxWidth: '100%'}}
                                title={recipient?.displayName} // Native title fallback
                            >
                              <img
                                src={recipient?.profile_picture || DefaultImg}
                                alt=""
                                className="w-3.5 h-3.5 rounded-full object-cover mr-1"
                              />
                              <span className="text-[11px] text-gray-700 truncate max-w-[120px] font-medium">
                                {recipient?.displayName || "Unknown"}
                              </span>
                            </div>
                          </Tooltip>
                        );
                      })
                    ) : (
                      <span className="text-[10px] text-gray-400 italic">Empty</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {createFlowModal?.isOpen && (
        <CreateFlowModal
          fetchFlows={fetchFlows}
          createFlowModal={createFlowModal}
          handleClose={() => setCreateFlowModal({ isOpen: false })}
        />
      )}

      {recipientsModal?.open && (
        <UpdateRecipientsModal
          recipientsModal={recipientsModal}
          fetchFlows={fetchFlows}
          flow={recipientsModal?.flow}
          handleClose={() => setRecipientsModal({ open: false })}
          selectedEmployee={recipientsModal?.flow?.user}
        />
      )}
    </>
  );
};

export default ChatFlow;