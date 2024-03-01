import { useEffect, useState } from "react";

import update from "immutability-helper";
import Router from "next/router";
import taskApi from "../../../../server-api/task";
import toastUtils from "../../../../utils/toast";
import urlUtils from "../../../../utils/url";
import styles from "./index.module.css";

// Components
import ItemSubheader from "../../../common/items/item-subheader";
import ItemSublayout from "../../../common/layouts/item-sublayout";
import Fields from "./task-fields";

const TaskDetail = () => {
  const [task, setTask] = useState();

  const [taskNames, setTaskNames] = useState([]);

  const [status, setStatus] = useState("");

  const [editableFields, setEditableFields] = useState({
    name: "",
    description: "",
    project: null,
    endDate: null,
    tags: [],
    users: [],
    userId: "",
  });

  useEffect(() => {
    getTask();
    getTaskNames();
  }, []);

  const getTask = async () => {
    try {
      const taskId = urlUtils.getPathId();
      const { data } = await taskApi.getTaskById(taskId);

      setTaskData(data);
      setTask(data);
    } catch (err) {
      console.log(err);
      // TODO: Error handling
    }
  };

  const deleteTask = async () => {
    try {
      await taskApi.deleteTask(task?.id);
      Router.replace("/main/overview");
      toastUtils.success("Task deleted sucesfully");
    } catch (err) {
      console.log(err);
      // TODO: Handle error
    }
  };

  const getTaskNames = async () => {
    try {
      const { data } = await taskApi.getTasks();
      setTaskNames(data.map((task) => task.name));
    } catch (err) {
      // TODO: Error handling
    }
  };

  const saveTask = async () => {
    if (!editableFields.endDate) {
      return toastUtils.error("You must add a Deadline Date");
    }
    if (!editableFields.name) {
      return toastUtils.error("The name cannot be empty");
    }
    if (
      editableFields.name !== task?.name &&
      taskNames.includes(editableFields.name)
    ) {
      return toastUtils.error("A task with that name already exists");
    }
    try {
      const saveData = {
        name: editableFields.name,
        description: editableFields.description,
        endDate: editableFields.endDate,
        projectId: editableFields.project?.id,
      };
      const { data } = await taskApi.updateTask(task?.id, saveData);
      getTaskNames();
      setTask(data);
      toastUtils.success("Task saved sucesfully");
    } catch (err) {
      // TODO: Error handling
    }
  };

  const replaceTaskAssigned = async (user) => {
    try {
      if (!user)
        setEditableFields(update(editableFields, { users: { $set: [] } }));
      else
        setEditableFields(update(editableFields, { users: { $set: [user] } }));
      await taskApi.replaceAssigned(task?.id, { collaboratorId: user?.id });
    } catch (err) {
      console.log(err);
      // TODO: Error if failure for whatever reason
    }
  };

  const setTaskData = (data) => {
    // TODO: get the correct owner
    setEditableFields({
      ...editableFields,
      ...data,
    });
    setStatus(data.status);
  };

  const addTag = async (tag, isNew = false) => {
    if (
      editableFields.tags.findIndex(
        (projectTag) => tag.label === projectTag.name
      ) === -1
    ) {
      const newTag = { name: tag.label };
      if (!isNew) newTag.id = tag.value;
      try {
        const { data } = await taskApi.addTag(task?.id, newTag);
        if (!isNew) {
          editFields("tags", update(editableFields.tags, { $push: [newTag] }));
        } else {
          editFields("tags", update(editableFields.tags, { $push: [data] }));
        }
        return data;
      } catch (err) {
        // TODO: Error if failure for whatever reason
      }
    }
  };

  const removeTag = async (index) => {
    try {
      editFields(
        "tags",
        update(editableFields.tags, { $splice: [[index, 1]] })
      );
      await taskApi.removeTag(task?.id, editableFields.tags[index].id);
    } catch (err) {
      // TODO: Error if failure for whatever reason
    }
  };

  const editFields = (field, value) => {
    setEditableFields({
      ...editableFields,
      [field]: value,
    });
  };

  const changeStatus = async (newStatus) => {
    if (!editableFields.endDate) {
      return toastUtils.error("You must add an Deadline Date");
    }

    if (newStatus === "scheduled" && editableFields.endDate < new Date()) {
      return toastUtils.error(
        "You cannot schedule if the End Date is in the past"
      );
    }

    try {
      setStatus(newStatus);
      await saveTask();
      await taskApi.updateTask(task.id, { status: newStatus });
    } catch (err) {
      // TODO: Error if failure for whatever reason
      console.log(err);
    }
  };

  return (
    <>
      <ItemSubheader
        title={editableFields.name}
        saveDraft={saveTask}
        changeName={(name) => editFields("name", name)}
        status={status}
        changeStatus={changeStatus}
        hasAssets={true}
        type="task"
        itemId={task?.id}
      />
      <main className={`${styles.container}`}>
        <ItemSublayout
          deleteItem={deleteTask}
          type="task"
          layout="single"
          itemId={task?.id}
          hasAssets={true}
        >
          {task && (
            <Fields
              editableFields={editableFields}
              editFields={editFields}
              addTag={addTag}
              removeTag={removeTag}
              replaceTaskAssigned={replaceTaskAssigned}
            />
          )}
        </ItemSublayout>
      </main>
    </>
  );
};

export default TaskDetail;
