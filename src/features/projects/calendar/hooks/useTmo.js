import { useDispatch, useSelector } from "react-redux";
import { createTmo, getTmos, updateTmo, deleteTmo } from "../../store/tmo.thunks"; 
import { clearTmoMessages } from "../../store/tmo.slice";

function useTmo() {
  const dispatch = useDispatch();
  const tmo = useSelector((state) => state.tmo);

  return {
    tmos: tmo.list,
    isLoading: tmo.isLoading,
    isCreating: tmo.isCreating,
    isUpdating: tmo.isUpdating, 
    isDeleting: tmo.isDeleting, 
    error: tmo.error,
    successMessage: tmo.successMessage,

    getTmos: (projectId) => dispatch(getTmos(projectId)),
    createTmo: (formData) => dispatch(createTmo(formData)),
    updateTmo: (tmoId, formData) => dispatch(updateTmo({ tmoId, formData })),
    deleteTmo: (tmoId) => dispatch(deleteTmo(tmoId)), 
    clearMessages: () => dispatch(clearTmoMessages()),
  };
}

export default useTmo;