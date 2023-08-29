import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import uploadLinkApi from "../../server-api/guest-upload";
import shareUploadLink from "../../server-api/share-upload-link";
import toastUtils from "../../utils/toast";
import SpinnerOverlay from "../common/spinners/spinner-overlay";
import PasswordOverlay from "../share-collections/password-overlay";

import { SocketContext } from "../../context";
import requestUtils from "../../utils/requests";

import { defaultInfo } from "../../config/data/upload-links";
import { IGuestUserInfo } from "../../types/guest-upload/guest-upload";
import { isFilesInputValid } from "../../utils/upload";
import ContactForm from "./contact-form";
import GuestDetails from "./guest-details";
import styles from "./index.module.css";
import UploadOptions from "./upload/upload-options";

interface GuestUploadMainProps {
  logo: string;
  setLogo: (val: string) => void;
  banner: string;
  setBanner: (val: string) => void;
}

const GuestUploadMain: React.FC<GuestUploadMainProps> = ({
  logo,
  setLogo,
  banner,
  setBanner,
}) => {
  const { query } = useRouter();

  const { socket, connected, connectSocket } = useContext(SocketContext);

  const [guestInfo, setGuestInfo] = useState<IGuestUserInfo>(defaultInfo);
  const [loading, setLoading] = useState<boolean>(false);
  const [activePasswordOverlay, setActivePasswordOverlay] =
    useState<boolean>(false);
  const [teamName, setTeamName] = useState<string>("");
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [showUploadSection, setShowUploadSection] = useState<boolean>(false);

  const [showUploadError, setShowUploadError] = useState<boolean>(false);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    if (query?.code) {
      getLinkInfo();
    }
  }, [query]);

  const getLinkInfo = async () => {
    try {
      setLoading(true);
      const { data } = await shareUploadLink.getLinkDetail({
        url: query.code,
      });

      if (data) {
        // update info
        setTeamName(data.team);

        if (data.bannerSrc) {
          setBanner(data.bannerSrc);
        }
        setLogo(data.logo);
        setActivePasswordOverlay(false);
      }
    } catch (err) {
      console.log("err: ", err);
      if (err.response.status === 400) {
        setLogo(err.response?.data?.teamIcon);
      } else {
        toastUtils.error("Something went wrong");
      }
      setActivePasswordOverlay(true);
    } finally {
      setLoading(false);
    }
  };

  const submitPassword = async (password: string) => {
    try {
      setLoading(true);

      const { data } = await uploadLinkApi.authenticateLink({
        password,
        url: query.code,
      });

      // Set axios headers
      requestUtils.setAuthToken(data.token, "share-upload-authorization");

      connectSocket(data.token);

      getLinkInfo();
    } catch (err) {
      toastUtils.error("Wrong password or invalid link, please try again");
    } finally {
      setLoading(false);
    }
  };

  const saveChanges = (data: IGuestUserInfo) => {
    setGuestInfo(data);
    setShowPreview(true);
    setShowUploadSection(true);
  };

  const onCancelGuestInfo = () => {
    //TODO: check if this pattern can be avoided
    setGuestInfo(defaultInfo);
    setShowPreview(false);
    setShowUploadSection(false);
    setShowUploadError(false);
    setUploading(false);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files.length > 0) {
      if (isFilesInputValid(files)) {
        setShowUploadError(false);

        const formattedFiles = Array.from(files).map((file) => {
          return {
            asset: {
              name: file.name,
              createdAt: new Date(),
              size: file.size,
              stage: "draft",
              type: "image",
              mimeType: file.type,
              fileModifiedAt: new Date(file.lastModified),
            },
            file,
            status: "queued",
            isUploading: false,
          };
        });
        setUploading(true);
        setUploadingFiles(formattedFiles);
      } else {
        setShowUploadError(true);
      }
    }
  };

  const onCancelUpload = () => {
    setUploading(false);
    setUploadingFiles([]);
    //TODO: delete assets that were already uploaded
  };

  return (
    <>
      {activePasswordOverlay && (
        <PasswordOverlay onPasswordSubmit={submitPassword} logo={logo} />
      )}

      <section className={styles.container}>
        <div className={styles.wrapper}>
          <>
            <div>
              <h1>{teamName} - Guest Upload</h1>
              <p>
                Please fill out the form below before uploading your files to us
              </p>
            </div>
            <div className={styles.form}>
              {!showPreview ? (
                <ContactForm
                  data={guestInfo}
                  onSubmit={saveChanges}
                  teamName={teamName}
                />
              ) : (
                <GuestDetails
                  userDetails={guestInfo}
                  onCancel={onCancelGuestInfo}
                />
              )}
            </div>
          </>
          {showUploadSection && (
            <>
              <UploadOptions
                onFileChange={onFileChange}
                showError={showUploadError}
                uploading={uploading}
                uploadingFiles={uploadingFiles}
                onCancel={onCancelUpload}
              />
            </>
          )}
        </div>
      </section>

      {loading && <SpinnerOverlay />}
    </>
  );
};

export default GuestUploadMain;
