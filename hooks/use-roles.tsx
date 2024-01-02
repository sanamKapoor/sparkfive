import { useEffect, useState } from "react";

import { capitalCase } from "change-case";
import roleApi from "../server-api/role";

const useRoles = () => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    getRoles();
  }, []);

  const getRoles = async () => {
    try {
      const { data } = await roleApi.getroles();
      setRoles(data);
    } catch (err) {
    }
  };

  const mappedRoles = roles.map((role) => ({
    ...role,
    label: capitalCase(role.name),
    value: role.id,
  }));
  return { mappedRoles };
};

export default useRoles;
