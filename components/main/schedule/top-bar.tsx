import { capitalCase } from "change-case";
import { useContext, useEffect, useRef } from "react";
import { Utilities } from "../../../assets";
import { TeamContext, UserContext } from "../../../context";
import itemStatus from "../../../resources/data/item-status.json";
import projectTypes from "../../../resources/data/project-types.json";
import styles from "./top-bar.module.css";

import { CALENDAR_PRINT } from "../../../constants/permissions";

// Components
import Button from "../../common/buttons/button";
import IconClickable from "../../common/buttons/icon-clickable";
import FiltersSelect from "../../common/inputs/filters-select";

const typeOptions = ["campaigns", "tasks", ...projectTypes];

const TopBar = ({
  activeView,
  setActiveView,
  setCurrentDate,
  filters,
  setFilters,
  allCampaigns,
  setSearchVisible,
  sideRef,
}) => {
  const { getTeamMembers, teamMembers } = useContext(TeamContext);

  const { hasPermission, user } = useContext(UserContext);

  useEffect(() => {
    getTeamMembers();
  }, []);

  const filtersRef = useRef(null);

  const toggleHamurgerList = () => {
    const classType = `visible-flex`;
    const { current } = filtersRef;
    sideRef?.current?.classList.remove(classType);
    if (current?.classList.contains(classType))
      current.classList.remove(classType);
    else current.classList.add(classType);
  };

  const toggleCalendarView = () => {
    const classType = `visible-block`;
    const { current } = sideRef;
    filtersRef.current?.classList.remove(classType);
    if (current?.classList.contains(classType))
      current.classList.remove(classType);
    else current.classList.add(classType);
  };

  return (
    <section className={styles.container}>
      <div className={styles.options}>
        <img src={Utilities.search} onClick={() => setSearchVisible(true)} />
        {hasPermission([CALENDAR_PRINT]) && (
          <img
            src={Utilities.print}
            className={styles.print}
            onClick={() => window.print()}
          />
        )}
        <Button
          text="List"
          className={
            activeView === "list"
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setActiveView("list")}
        />
        <Button
          text="Week"
          className={
            activeView === "week"
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setActiveView("week")}
        />
        <Button
          text="Month"
          className={
            activeView === "month"
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setActiveView("month")}
        />
        <Button
          text="Today"
          type="button"
          className={`${styles["last-button"]} container secondary`}
          onClick={() => setCurrentDate(new Date())}
        />
      </div>

      {activeView !== "month" && (
        <IconClickable
          src={Utilities.calendar}
          additionalClass={styles.calendar}
          onClick={toggleCalendarView}
        />
      )}
      <IconClickable
        src={Utilities.filter}
        additionalClass={styles.filter}
        onClick={toggleHamurgerList}
      />
      <div className={styles.filters} ref={filtersRef}>
        {allCampaigns && allCampaigns.length > 0 && <div>
          <FiltersSelect
            options={allCampaigns.map((campaign) => ({
              label: campaign.name,
              value: campaign.id,
            }))}
            placeholder="Campaign"
            styleType="filter filter-schedule"
            onChange={(selected) =>
              setFilters({ ...filters, campaign: selected })
            }
            value={filters.campaign}
            isClearable={true}
          />
        </div>}
        <div>
          <FiltersSelect
            options={itemStatus.map((status) => ({
              label: capitalCase(status),
              value: status,
            }))}
            placeholder="Status"
            styleType="filter filter-schedule"
            onChange={(selected) =>
              setFilters({ ...filters, status: selected })
            }
            value={filters.status}
            isClearable={true}
          />
        </div>
        <div>
          <FiltersSelect
            options={typeOptions.map((type) => ({
              label: capitalCase(type),
              value: type,
            }))}
            placeholder="Type"
            styleType="filter filter-schedule"
            onChange={(selected) => setFilters({ ...filters, type: selected })}
            value={filters.type}
            isClearable={true}
          />
        </div>
        <div>
          <FiltersSelect
            options={teamMembers
              .filter(
                (member) => user.roleId !== "user" || member.id === user.id
              )
              .map((member) => ({ label: member.name, value: member.id }))}
            placeholder="Team"
            styleType="filter filter-schedule"
            onChange={(selected) =>
              setFilters({ ...filters, member: selected })
            }
            value={filters.member}
            isClearable={true}
          />
        </div>
      </div>
    </section>
  );
};

export default TopBar;
