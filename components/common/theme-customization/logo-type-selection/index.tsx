import { useState } from "react";

import styles from "./index.module.css";

import { Utilities, Assets } from "../../../../assets";
import Search from "../../attributes/search-input";
import LogoGrid from "../logo-grid";
import LogoList from "../logo-list";

export default function LogoTypeSelection({ onSelect, onClose }: Props) {
  const [selectedIcon, setSelectedIcon] = useState();
  const [searchKey, setSearchKey] = useState("");
  return (
    <div className={styles["dropdown-wrapper"]}>
      <div className={styles["mobile-header"]}>
        <div>Change Logotype</div>
        <img src={Utilities.grayClose} alt={"close"} className={styles["close-btn-mobile"]} onClick={onClose} />
      </div>
      <div className={styles.header}>
        <ul className={styles.tab}>
          <li className={`${styles["nav-item"]} ${styles["nav-item-selected"]}`}>Library</li>
          <li className={styles["nav-item"]}>Upload</li>
          <li className={styles["nav-item"]}>
            <img className={styles.icon} src={Assets.dropbox} alt={"dropbox"} /> Dropbox
          </li>
          <li className={styles["nav-item"]}>
            <img className={styles.icon} src={Assets.gdrive} alt={"drive"} /> Google Drive
          </li>
        </ul>

        <img src={Utilities.grayClose} alt={"close"} className={styles["close-btn"]} onClick={onClose} />
      </div>

      <div className={styles.content}>
        <Search
          value={searchKey}
          placeholder={"Search logo via name"}
          onChange={(value) => {
            setSearchKey(value);
          }}
          onClear={() => {}}
          onlyInput={true}
          styleType={styles["search-input"]}
          inputContainerStyle={styles["search-input-container"]}
        />

        {searchKey && (
          <LogoList
            data={[
              {
                id: 1,
                url: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png",
                name: "logo_leo_graham_94820356.png",
              },
              {
                id: 2,
                url: "https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?cs=srgb&dl=pexels-pixabay-268533.jpg&fm=jpg",
                name: "logo_alexander_davis_75361982.png",
              },
              {
                id: 3,
                url: "https://imgv3.fotor.com/images/cover-photo-image/a-beautiful-girl-with-gray-hair-and-lucxy-neckless-generated-by-Fotor-AI.jpg",
                name: "logo_michael_thompson.png",
              },
              {
                id: 4,
                url: "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
                name: "logo_mae_cooper_75361982.png",
              },
              {
                id: 5,
                url: "https://cdn.pixabay.com/photo/2018/01/12/10/19/fantasy-3077928_640.jpg",
                name: "logo_anna_singh.png",
              },
            ]}
            onSelect={(item) => {
              onSelect(item);
            }}
          />
        )}

        {!searchKey && (
          <LogoGrid
            data={[
              {
                id: 1,
                url: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png",
              },
              {
                id: 2,
                url: "https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?cs=srgb&dl=pexels-pixabay-268533.jpg&fm=jpg",
              },
              {
                id: 3,
                url: "https://imgv3.fotor.com/images/cover-photo-image/a-beautiful-girl-with-gray-hair-and-lucxy-neckless-generated-by-Fotor-AI.jpg",
              },
              {
                id: 4,
                url: "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
              },
              { id: 5, url: "https://cdn.pixabay.com/photo/2018/01/12/10/19/fantasy-3077928_640.jpg" },
              { id: 6, url: "https://cdn.pixabay.com/photo/2013/07/21/13/00/rose-165819_640.jpg" },
              { id: 7, url: "https://images.panda.org/assets/images/pages/welcome/orangutan_1600x1000_279157.jpg" },
              {
                id: 8,
                url: "https://static.vecteezy.com/system/resources/thumbnails/022/448/292/small/save-earth-day-poster-environment-day-nature-green-ai-generative-glossy-background-images-tree-and-water-free-photo.jpg",
              },
            ]}
            selectedItem={selectedIcon}
            onSelect={(item) => {
              setSelectedIcon(item);
            }}
          />
        )}
        <button
          className={styles["save-btn"]}
          onClick={() => {
            onSelect(selectedIcon);
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
}

interface Props {
  onSelect: (value: string) => void;
  onClose: () => void;
}
