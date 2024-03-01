import { useEffect, useState } from "react";

import update from "immutability-helper";
import Router from "next/router";
import campaignApi from "../../../../server-api/campaign";
import toastUtils from "../../../../utils/toast";
import urlUtils from "../../../../utils/url";
import styles from "./index.module.css";

// Components
import ItemSubheader from "../../../common/items/item-subheader";
import ItemSublayout from "../../../common/layouts/item-sublayout";
import Fields from "./campaign-fields";

const CampaignDetail = () => {
  const [campaign, setCampaign] = useState(undefined);

  const [campaignNames, setCampaignNames] = useState([]);

  const [name, setName] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [owner, setOwner] = useState(undefined);
  const [tags, setTags] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    getCampaign();
    getCampaignNames();
  }, []);

  const getCampaign = async () => {
    try {
      const campaignId = urlUtils.getPathId();
      const { data } = await campaignApi.getCampaignById(campaignId);
      setCampaignData(data);
      setCampaign(data);
    } catch (err) {
      // TODO: Error handling
    }
  };

  const deleteCampaign = async () => {
    try {
      await campaignApi.deleteCampaign(campaign?.id);
      Router.replace("/main/overview");
      toastUtils.success("Campaign deleted sucesfully");
    } catch (err) {
      console.log(err);
      // TODO: Handle error
    }
  };

  const getCampaignNames = async () => {
    try {
      const { data } = await campaignApi.getCampaigns();
      setCampaignNames(data.map((campaign) => campaign.name));
    } catch (err) {
      // TODO: Error handling
    }
  };

  const saveCampaign = async () => {
    if (!endDate) {
      return toastUtils.error("You must add an End Date");
    }
    if (!name) {
      return toastUtils.error("The name cannot be empty");
    }
    if (name !== campaign.name && campaignNames.includes(name)) {
      return toastUtils.error("A campaign with that name already exists");
    }
    try {
      const saveData = {
        description,
        endDate,
        startDate,
        name,
      };
      const { data } = await campaignApi.updateCampaign(campaign.id, saveData);
      getCampaignNames();
      setCampaign(data);
      toastUtils.success("Campaign saved sucesfully");
    } catch (err) {
      // TODO: Error handling
    }
  };

  const setCampaignData = (data) => {
    setName(data.name);
    setOwner(data.users.find((user) => user.isOwner));
    setCollaborators(data.users.filter((user) => !user.isOwner));
    setDescription(data.description);
    setStartDate(data.startDate);
    setEndDate(data.endDate);
    setTags(data.tags);
    setStatus(data.status);
  };

  const addTag = async (tag, isNew = false) => {
    if (
      tags.findIndex((campaignTag) => tag.label === campaignTag.name) === -1
    ) {
      const newTag = { name: tag.label };
      if (!isNew) newTag.id = tag.value;
      try {
        const { data } = await campaignApi.addTag(campaign.id, newTag);
        if (!isNew) {
          setTags(update(tags, { $push: [newTag] }));
        } else {
          setTags(update(tags, { $push: [data] }));
        }
        return data;
      } catch (err) {
        // TODO: Error if failure for whatever reason
      }
    }
  };

  const removeTag = async (index) => {
    try {
      setTags(update(tags, { $splice: [[index, 1]] }));
      await campaignApi.removeTag(campaign.id, tags[index].id);
    } catch (err) {
      // TODO: Error if failure for whatever reason
    }
  };

  const addCollaborator = async (user) => {
    try {
      // Only add if collaborator is not on list
      if (
        owner.id === user.id ||
        collaborators.find((collaborator) => collaborator.id === user.id)
      ) {
        return await removeCollaborator(user);
      }
      setCollaborators(update(collaborators, { $push: [user] }));
      await campaignApi.addCollaborators(campaign.id, {
        collaboratorIds: [user.id],
      });
    } catch (err) {
      console.log(err);
    }
  };

  const removeCollaborator = async (user) => {
    try {
      const searchedCollaboratorIndex = collaborators.findIndex(
        (collaborator) => collaborator.id === user.id
      );
      if (searchedCollaboratorIndex === -1) return;
      setCollaborators(
        update(collaborators, { $splice: [[searchedCollaboratorIndex, 1]] })
      );
      await campaignApi.removeCollaborators(campaign.id, {
        collaboratorIds: [user.id],
      });
    } catch (err) {
      console.log(err);
    }
  };

  const changeStatus = async (newStatus) => {
    if (!endDate) {
      return toastUtils.error("You must add an End Date");
    }

    if (newStatus === "scheduled" && endDate < new Date()) {
      return toastUtils.error(
        "You cannot schedule if the End Date is in the past"
      );
    }

    try {
      setStatus(newStatus);
      await saveCampaign();
      await campaignApi.updateCampaign(campaign.id, { status: newStatus });
    } catch (err) {
      // TODO: Error if failure for whatever reason
      console.log(err);
    }
  };

  return (
    <>
      <ItemSubheader
        title={name}
        saveDraft={saveCampaign}
        status={status}
        changeStatus={changeStatus}
        changeName={(name) => setName(name)}
      />
      <main className={`${styles.container}`}>
        <ItemSublayout deleteItem={deleteCampaign} type="campaign">
          {campaign && (
            <Fields
              collaborators={collaborators}
              description={description}
              setDescription={setDescription}
              endDate={endDate}
              setEndDate={setEndDate}
              startDate={startDate}
              setStartDate={setStartDate}
              owner={owner}
              tags={tags}
              setCollaborators={setCollaborators}
              addTag={addTag}
              removeTag={removeTag}
              addCollaborator={addCollaborator}
              removeCollaborator={removeCollaborator}
            />
          )}
        </ItemSublayout>
      </main>
    </>
  );
};

export default CampaignDetail;
