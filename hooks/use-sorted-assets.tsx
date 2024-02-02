import { useEffect, useState } from "react";
import { dateCompare } from "../utils/date";

export default function useSortedAssets(
  assets,
  initialSortValue = "",
  sub_collection = false
): [any[], string, any] {
  const [sortedAssets, setSortedAssets] = useState([]);
  const [currentSortAttribute, setCurrentSortAttribute] =
    useState(initialSortValue);

  useEffect(() => {
    setSortedAssets(assets);
  }, [assets]);

  let direction = 1;
  let currentSortAttributeType = currentSortAttribute;
  if (currentSortAttribute.startsWith("-")) {
    currentSortAttributeType = currentSortAttribute.substring(1);
    direction = -1;
  }

  useEffect(() => {
    if (!currentSortAttribute) {
      setSortedAssets(assets);
      return;
    }
    const newSortedAssets = [...assets].map((item) => {
      // If this is placeholder, make it as the final items
      if (item?.asset?.name === "placeholder") {
        item.asset.name = "z";
        item.asset.type = "z";
        item.asset.extension = "z";
        item.asset.size = 0;
        item.asset.createdAt = new Date("1977-01-01");
        // item.asset.updatedAt = new Date("1977-01-01");
        item.asset.deletedAt = new Date("1977-01-01");
      }

      return item;
    });
    switch (currentSortAttributeType) {
      case "asset.name":
        newSortedAssets.sort(
          (a, b) => a.asset.name.localeCompare(b.asset.name) * direction
        );
        break;
      case "asset.type":
        newSortedAssets.sort(
          (a, b) => a.asset.type?.localeCompare(b.asset.type) * direction
        );
        break;
      case "asset.extension":
        newSortedAssets.sort(
          (a, b) =>
            a.asset.extension?.localeCompare(b.asset.extension) * direction
        );
        break;
      case "asset.size":
        newSortedAssets.sort(
          (a, b) =>
            (parseInt(a.asset.size) - parseInt(b.asset.size)) * direction
        );
        break;

      case "asset.created-at":
        newSortedAssets.sort(
          (a, b) =>
            dateCompare(a.asset.createdAt, b.asset.createdAt) * direction
        );
        break;
      // case "asset.updated-at":
      //   newSortedAssets.sort(
      //     (a, b) =>
      //       dateCompare(a.asset.updatedAt, b.asset.updatedAt) * direction
      //   );
      //   break;
      case "asset.deleted-at":
        newSortedAssets.sort(
          (a, b) =>
            dateCompare(a.asset.deletedAt, b.asset.deletedAt) * direction
        );
        break;
      case "folder.name":
        newSortedAssets.sort(
          (a, b) => b.name.trim().localeCompare(a.name.trim()) * direction
        );
        break;
      case "folder.length":
        if (sub_collection) {
          newSortedAssets.sort(
            (a, b) => (b.assets?.length - a.assets?.length) * direction
          );
        }
        else {
          newSortedAssets.sort(
            (a, b) => (b.assetsCount - a.assetsCount) * direction
          );
        }
        break;
      case "folder.created-at":
        newSortedAssets.sort(
          (a, b) => dateCompare(b.createdAt, a.createdAt) * direction
        );
        break;
    }

    setSortedAssets(newSortedAssets);
  }, [currentSortAttribute, assets]);

  return [sortedAssets, currentSortAttribute, setCurrentSortAttribute];
}
