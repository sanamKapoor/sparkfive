import { capitalCase } from "change-case";
import { format } from "date-fns";
import update from "immutability-helper";
import { useEffect, useState } from "react";
import DayPicker from "react-day-picker";
import CreatableSelect from "react-select/creatable";
import {
  ItemFields,
  ProjectTypeChannel,
  ProjectTypes,
  Utilities,
} from "../../../../assets";
import campaignApi from "../../../../server-api/campaign";
import tagApi from "../../../../server-api/tag";
import styles from "./project-fields.module.css";

import channelAdsOptions from "../../../../resources/data/channels-ads.json";
import channelSocialOptions from "../../../../resources/data/channels-social.json";

// Components
import Dropdown from "../../../common/inputs/dropdown";
import Select from "../../../common/inputs/select";
import CollaboratorItem from "../../../common/items/collaborator-item";
import ItemFieldWrapper from "../../../common/items/item-field-wrapper";
import Tag from "../../../common/misc/tag";
import ToggleableAbsoluteWrapper from "../../../common/misc/toggleable-absolute-wrapper";
import SearchableUserList from "../../../common/user/searchable-user-list";
import UserPhoto from "../../../common/user/user-photo";

const ProjectFields = ({
  editableFields: {
    owner,
    startDate,
    publishDate,
    campaign,
    collaborators,
    description,
    subject,
    tags,
    channel,
    headline,
    preheader,
  },
  addTag,
  removeTag,
  editFields,
  project,
  addCollaborator,
  addToCampaign,
  removeCollaborator,
}) => {
  const [activeInput, setActiveInput] = useState("");

  const [inputTags, setInputTags] = useState([]);
  const [inputCampaigns, setInputCampaigns] = useState([]);

  const times = [
    { regular: "12:00 AM", military: "0:00" },
    { regular: "12:30 AM", military: "0:30" },
    { regular: "1:00 AM", military: "1:00" },
    { regular: "1:30 AM", military: "1:30" },
    { regular: "2:00 AM", military: "2:00" },
    { regular: "2:30 AM", military: "2:30" },
    { regular: "3:00 AM", military: "3:00" },
    { regular: "3:30 AM", military: "3:30" },
    { regular: "4:00 AM", military: "4:00" },
    { regular: "4:30 AM", military: "4:30" },
    { regular: "5:00 AM", military: "5:00" },
    { regular: "5:30 AM", military: "5:30" },
    { regular: "6:00 AM", military: "6:00" },
    { regular: "6:30 AM", military: "6:30" },
    { regular: "7:00 AM", military: "7:00" },
    { regular: "7:30 AM", military: "7:30" },
    { regular: "8:00 AM", military: "8:00" },
    { regular: "8:30 AM", military: "8:30" },
    { regular: "9:00 AM", military: "9:00" },
    { regular: "9:30 AM", military: "9:30" },
    { regular: "10:00 AM", military: "10:00" },
    { regular: "10:30 AM", military: "10:30" },
    { regular: "11:00 AM", military: "11:00" },
    { regular: "11:30 AM", military: "11:30" },
    { regular: "12:00 PM", military: "12:00" },
    { regular: "12:30 PM", military: "12:30" },
    { regular: "1:00 PM", military: "13:00" },
    { regular: "1:30 PM", military: "13:30" },
    { regular: "2:00 PM", military: "14:00" },
    { regular: "2:30 PM", military: "14:30" },
    { regular: "3:00 PM", military: "15:00" },
    { regular: "3:30 PM", military: "15:30" },
    { regular: "4:00 PM", military: "16:00" },
    { regular: "4:30 PM", military: "16:30" },
    { regular: "5:00 PM", military: "17:00" },
    { regular: "5:30 PM", military: "17:30" },
    { regular: "6:00 PM", military: "18:00" },
    { regular: "6:30 PM", military: "18:30" },
    { regular: "7:00 PM", military: "19:00" },
    { regular: "7:30 PM", military: "19:30" },
    { regular: "8:00 PM", military: "20:00" },
    { regular: "8:30 PM", military: "20:30" },
    { regular: "9:00 PM", military: "21:00" },
    { regular: "9:30 PM", military: "21:30" },
    { regular: "10:00 PM", military: "22:00" },
    { regular: "10:30 PM", military: "22:30" },
    { regular: "11:00 PM", military: "23:00" },
    { regular: "11:30 PM", military: "23:30" },
  ];

  useEffect(() => {
    getTags();
    getCampaigns();
  }, []);

  const getTags = async () => {
    try {
      const { data } = await tagApi.getTags();
      setInputTags(data);
    } catch (err) {
      // TODO: Maybe show error?
    }
  };

  const getCampaigns = async () => {
    try {
      const { data } = await campaignApi.getCampaigns();
      setInputCampaigns(data);
    } catch (err) {
      // TODO: Maybe show error?
    }
  };

  const toggleActiveInput = (input) => {
    if (input === activeInput) setActiveInput("");
    else setActiveInput(input);
  };
  const handleStartDayClick = (day, { selected }) => {
    editFields("startDate", selected ? undefined : day);
    setActiveInput("");
  };

  const handlePublishDayClick = (day, { selected }) => {
    editFields("publishDate", selected ? undefined : day);
    setActiveInput("");
  };

  const handleTagChange = async (selected, actionMeta) => {
    const newTag = await addTag(
      selected,
      actionMeta.action === "create-option"
    );
    if (actionMeta.action === "create-option") {
      setInputTags(update(inputTags, { $push: [newTag] }));
    }
    toggleActiveInput("tags");
  };

  const handleCampaignChange = async (selected, actionMeta) => {
    const newCampaign = await addToCampaign(
      selected,
      actionMeta.action === "create-option"
    );
    if (actionMeta.action === "create-option") {
      setInputTags(update(inputCampaigns, { $push: [newCampaign] }));
    }
    toggleActiveInput("campaigns");
  };

  const handleChannelChange = (value) => {
    editFields("channel", value);
    toggleActiveInput("channel");
  };

  const handleTimeChange = (selected) => {
    const splitInput = selected.value.split(":");
    let currentDate = new Date(publishDate);
    currentDate = new Date(currentDate.setHours(splitInput[0], splitInput[1]));
    editFields("publishDate", currentDate);
  };

  return (
    <div className="item-detail-cont">
      <div className={"field"}>
        <ItemFieldWrapper
          title="Owner"
          overrideIcon={true}
          OverrideIconComp={() => (
            <UserPhoto photoUrl={owner?.profilePhoto} sizePx={45} />
          )}
        >
          <span>{owner?.name}</span>
        </ItemFieldWrapper>
      </div>
      {(project.type === "ads" || project.type === "banners") && (
        <div className={`field`}>
          <ItemFieldWrapper
            title="Start Date"
            image={ItemFields.date}
            hasOption={true}
            optionOnClick={() => toggleActiveInput("startDate")}
          >
            <span>
              {startDate
                ? format(new Date(startDate), "MMM d, yyyy")
                : "No Start Date"}
            </span>
          </ItemFieldWrapper>
          {activeInput === "startDate" && (
            <div className={"day-picker"}>
              <DayPicker
                selectedDays={new Date(startDate)}
                disabledDays={{
                  after: publishDate && new Date(publishDate),
                }}
                onDayClick={handleStartDayClick}
              />
            </div>
          )}
        </div>
      )}
      <div className={`field`}>
        <ItemFieldWrapper
          title="Deadline Date"
          image={ItemFields.date}
          hasOption={true}
          optionOnClick={() => toggleActiveInput("publishDate")}
        >
          <span>
            {publishDate
              ? format(new Date(publishDate), "MMM d, yyyy")
              : "No Deadline Date"}
          </span>
        </ItemFieldWrapper>
        {activeInput === "publishDate" && (
          <div className={"day-picker"}>
            <DayPicker
              selectedDays={publishDate}
              disabledDays={{
                before: startDate && new Date(startDate),
              }}
              onDayClick={handlePublishDayClick}
            />
          </div>
        )}
      </div>

      {project.type !== "ads" && project.type !== "banners" && (
        <div className={`field`}>
          <ItemFieldWrapper
            title="Time"
            image={Utilities.time}
            optionOnClick={() => toggleActiveInput("time")}
          >
            {publishDate ? (
              <div>
                <Select
                  options={times.map((time) => ({
                    label: time.regular,
                    value: time.military,
                  }))}
                  placeholder={"Select a time"}
                  value={{
                    value: format(new Date(publishDate), "HH:mm"),
                    label: format(new Date(publishDate), "hh:mm a"),
                  }}
                  onChange={handleTimeChange}
                  styleType="filter"
                />
              </div>
            ) : (
              <span>No Deadline Date</span>
            )}
          </ItemFieldWrapper>
        </div>
      )}
      {project.type === "email" && (
        <>
          <div className={`field`}>
            <ItemFieldWrapper title="Subject" image={ItemFields.description}>
              <textarea
                rows={subject?.length > 0 ? Math.ceil(subject.length / 25) : 1}
                value={subject}
                onChange={(e) => editFields("subject", e.target.value)}
                placeholder="Enter Subject"
                onClick={() => toggleActiveInput("subject")}
                onBlur={() => toggleActiveInput("subject")}
              />
            </ItemFieldWrapper>
          </div>
          <div className={`field`}>
            <ItemFieldWrapper title="Preheader" image={ItemFields.description}>
              <textarea
                rows={
                  preheader?.length > 0 ? Math.ceil(preheader.length / 25) : 1
                }
                value={preheader}
                onChange={(e) => editFields("preheader", e.target.value)}
                placeholder="Enter Preheader"
                onClick={() => toggleActiveInput("preheader")}
                onBlur={() => toggleActiveInput("preheader")}
              />
            </ItemFieldWrapper>
          </div>
        </>
      )}
      {project.type === "articles" && (
        <div className={`field`}>
          <ItemFieldWrapper title="Headline" image={ItemFields.description}>
            <textarea
              rows={headline?.length > 0 ? Math.ceil(headline.length / 25) : 1}
              value={headline}
              onChange={(e) => editFields("headline", e.target.value)}
              placeholder="Enter Headline"
              onClick={() => toggleActiveInput("headline")}
              onBlur={() => toggleActiveInput("headline")}
            />
          </ItemFieldWrapper>
        </div>
      )}
      {project.type !== "email" &&
        project.type !== "articles" &&
        project.type !== "banners" && (
          <ToggleableAbsoluteWrapper
            wrapperClass="field"
            contentClass="dropdown"
            Wrapper={({ children }) => (
              <>
                <ItemFieldWrapper
                  title="Social Channel"
                  image={
                    channel && ProjectTypeChannel[channel]
                      ? ProjectTypeChannel[channel]
                      : ProjectTypeChannel.social
                  }
                  hasOption={true}
                  optionOnClick={() => toggleActiveInput("channel")}
                >
                  <span>{channel && capitalCase(channel)}</span>
                  {children}
                </ItemFieldWrapper>
              </>
            )}
            Content={() => (
              <Dropdown
                options={
                  project.type === "social"
                    ? channelSocialOptions.map((option) => ({
                        label: capitalCase(option),
                        onClick: () => handleChannelChange(option),
                      }))
                    : channelAdsOptions.map((option) => ({
                        label: capitalCase(option),
                        onClick: () => handleChannelChange(option),
                      }))
                }
              />
            )}
          />
        )}
      <div className="field">
        <ItemFieldWrapper title="Campaign" image={ProjectTypes.campaign}>
          <span>{campaign?.name}</span>
          {activeInput === "campaign" ? (
            <div className={"tag-select"}>
              <CreatableSelect
                options={inputCampaigns.map((campaign) => ({
                  ...campaign,
                  label: campaign.name,
                  value: campaign.id,
                }))}
                placeholder={"Enter a new campaign or select an existing one"}
                value={
                  campaign ? { label: campaign.name, value: campaign.id } : null
                }
                onChange={handleCampaignChange}
                styleType={"regular item"}
              />
            </div>
          ) : (
            <div
              className={"add"}
              onClick={() => toggleActiveInput("campaign")}
            >
              <img src={Utilities.add} />
              <span>Add to a Campaign</span>
            </div>
          )}
        </ItemFieldWrapper>
      </div>
      <div className={`field`}>
        <ItemFieldWrapper title="Tags" image={ItemFields.tag}>
          <ul className={"tags-list"}>
            {tags.map((tag, index) => (
              <li key={index}>
                <Tag
                  data={tag}
                  tag={tag.name}
                  canRemove={true}
                  removeFunction={() => removeTag(index)}
                />
              </li>
            ))}
          </ul>

          {activeInput === "tags" ? (
            <div className={"campaign-select"}>
              <CreatableSelect
                placeholder={"Enter a new tag or select an existing one"}
                options={inputTags.map((tag) => ({
                  label: tag.name,
                  value: tag.id,
                }))}
                className={`regular item`}
                onChange={handleTagChange}
                classNamePrefix="select-prefix"
              />
            </div>
          ) : (
            <div className={"add"} onClick={() => toggleActiveInput("tags")}>
              <img src={Utilities.add} />
              <span>Add Tag</span>
            </div>
          )}
        </ItemFieldWrapper>
      </div>
      <div className={`field`}>
        <ItemFieldWrapper
          title="Collaborators"
          image={ItemFields.member}
          optionOnClick={() => toggleActiveInput("collaborators")}
        >
          <ul className={styles["collaborator-list"]}>
            {collaborators.map((collaborator) => (
              <li key={collaborator.id}>
                <CollaboratorItem
                  photoUrl={collaborator.profilePhoto}
                  onRemove={() => removeCollaborator(collaborator)}
                />
              </li>
            ))}
          </ul>
          <ToggleableAbsoluteWrapper
            closeOnAction={false}
            Wrapper={({ children }) => (
              <>
                <div className={"add"}>
                  <img src={Utilities.add} />
                  <span>Add Collaborator</span>
                </div>
                {children}
              </>
            )}
            Content={() => (
              <SearchableUserList
                onUserSelected={addCollaborator}
                filterOut={[owner.id]}
                selectedList={collaborators.map((colab) => colab.id)}
              />
            )}
            wrapperClass={styles["image-wrapper"]}
            contentClass={styles["user-list-wrapper"]}
          />
        </ItemFieldWrapper>
      </div>
      <div className={`field pad-div`}></div>
      <div className={`field field-wide`}>
        <ItemFieldWrapper title="Description" image={ItemFields.description}>
          <textarea
            rows={
              description?.length > 0 ? Math.ceil(description.length / 50) : 1
            }
            value={description}
            onChange={(e) => editFields("description", e.target.value)}
            placeholder="Enter Description"
            onClick={() => toggleActiveInput("description")}
            onBlur={() => toggleActiveInput("description")}
          />
        </ItemFieldWrapper>
      </div>
    </div>
  );
};

export default ProjectFields;
