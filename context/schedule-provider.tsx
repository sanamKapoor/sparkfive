import { useState } from "react";
import { ScheduleContext } from "../context";

export default ({ children }) => {
  const [newItem, setNewItem] = useState(undefined);
  const [needItemsReset, setNeedItemReset] = useState(false);

  const scheduleValue = {
    newItem,
    setNewItem,
    needItemsReset,
    setNeedItemReset,
  };

  return (
    <ScheduleContext.Provider value={scheduleValue}>
      {children}
    </ScheduleContext.Provider>
  );
};
